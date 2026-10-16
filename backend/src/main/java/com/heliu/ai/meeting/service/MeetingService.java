package com.heliu.ai.meeting.service;

import com.heliu.ai.ai.api.AiAnswer;
import com.heliu.ai.ai.api.AiRequest;
import com.heliu.ai.ai.api.LargeLanguageModel;
import com.heliu.ai.common.BusinessException;
import com.heliu.ai.common.WorkspaceContext;
import com.heliu.ai.meeting.api.MeetingDtos;
import com.heliu.ai.meeting.domain.*;
import com.heliu.ai.notification.service.NotificationService;
import com.heliu.ai.project.api.ProjectDtos;
import com.heliu.ai.project.domain.TaskPriority;
import com.heliu.ai.project.service.ProjectService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MeetingService {
    private final MeetingRepository meetingRepository;
    private final TranscriptSegmentRepository segmentRepository;
    private final ActionItemRepository actionItemRepository;
    private final ActionTaskLinkRepository actionTaskLinkRepository;
    private final LargeLanguageModel languageModel;
    private final ProjectService projectService;
    private final NotificationService notificationService;

    public MeetingService(
            MeetingRepository meetingRepository,
            TranscriptSegmentRepository segmentRepository,
            ActionItemRepository actionItemRepository,
            ActionTaskLinkRepository actionTaskLinkRepository,
            LargeLanguageModel languageModel,
            ProjectService projectService,
            NotificationService notificationService
    ) {
        this.meetingRepository = meetingRepository;
        this.segmentRepository = segmentRepository;
        this.actionItemRepository = actionItemRepository;
        this.actionTaskLinkRepository = actionTaskLinkRepository;
        this.languageModel = languageModel;
        this.projectService = projectService;
        this.notificationService = notificationService;
    }

    @Transactional
    public MeetingDtos.MeetingResponse create(String title) {
        MeetingEntity entity = new MeetingEntity(WorkspaceContext.newId("mtg"), WorkspaceContext.current(), title.trim());
        return MeetingDtos.MeetingResponse.from(meetingRepository.save(entity));
    }

    @Transactional(readOnly = true)
    public List<MeetingDtos.MeetingResponse> list() {
        return meetingRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(WorkspaceContext.current()).stream()
                .map(MeetingDtos.MeetingResponse::from)
                .toList();
    }

    @Transactional
    public MeetingDtos.TranscriptResponse appendSegment(String meetingId, String speaker, String content, long startMs, long endMs, double confidence) {
        MeetingEntity meeting = requireMeeting(meetingId);
        TranscriptSegmentEntity segment = segmentRepository.save(new TranscriptSegmentEntity(meetingId, speaker.trim(), startMs, endMs, content.trim(), confidence));
        meeting.appendTranscript(speaker.trim() + ": " + content.trim());
        meetingRepository.save(meeting);
        return MeetingDtos.TranscriptResponse.from(segment);
    }

    @Transactional
    public MeetingDtos.MeetingMinutesResponse finish(String meetingId) {
        MeetingEntity meeting = requireMeeting(meetingId);
        String transcript = meeting.getTranscriptText() == null ? "" : meeting.getTranscriptText();
        if (transcript.isBlank()) throw new BusinessException("会议还没有转写内容");
        AiAnswer answer = languageModel.generate(new AiRequest(
                "请总结会议并提取决策与风险。会议标题：" + meeting.getTitle() + "\n会议内容：\n" + transcript,
                WorkspaceContext.current(),
                List.of(meetingId)
        ));
        meeting.complete(answer.content());
        meetingRepository.save(meeting);
        ensureActionItems(meetingId, transcript);
        notificationService.notifyCurrent(
                "会议纪要已生成",
                "《" + meeting.getTitle() + "》已生成摘要、决策与行动项，可一键写入项目看板。",
                "MEETING",
                "INFO",
                "MEETING",
                meetingId
        );
        return minutes(meetingId);
    }

    @Transactional(readOnly = true)
    public MeetingDtos.MeetingMinutesResponse minutes(String meetingId) {
        MeetingEntity meeting = requireMeeting(meetingId);
        List<MeetingDtos.TranscriptResponse> transcript = segmentRepository.findAllByMeetingIdOrderByStartMsAsc(meetingId).stream()
                .map(MeetingDtos.TranscriptResponse::from)
                .toList();
        Map<String, String> links = actionTaskLinkRepository.findAllByMeetingIdAndWorkspaceId(meetingId, WorkspaceContext.current()).stream()
                .collect(Collectors.toMap(ActionTaskLinkEntity::getActionId, ActionTaskLinkEntity::getTaskId, (left, right) -> left));
        List<MeetingDtos.ActionItemResponse> actions = actionItemRepository.findAllByMeetingIdOrderByCreatedAtAsc(meetingId).stream()
                .map(action -> MeetingDtos.ActionItemResponse.from(action, links.get(action.getId())))
                .toList();
        return new MeetingDtos.MeetingMinutesResponse(meeting.getId(), meeting.getTitle(), meeting.getStatus().name(), meeting.getSummary(), transcript, actions);
    }

    @Transactional
    public List<ProjectDtos.TaskResponse> convertActions(String meetingId, String projectId) {
        MeetingEntity meeting = requireMeeting(meetingId);
        String targetProjectId = normalizeProjectId(projectId);
        projectService.ensureProject(targetProjectId, "星海计划");
        Map<String, String> links = actionTaskLinkRepository.findAllByMeetingIdAndWorkspaceId(meetingId, WorkspaceContext.current()).stream()
                .collect(Collectors.toMap(ActionTaskLinkEntity::getActionId, ActionTaskLinkEntity::getTaskId, (left, right) -> left));
        List<ProjectDtos.TaskResponse> tasks = new ArrayList<>();
        for (ActionItemEntity action : actionItemRepository.findAllByMeetingIdOrderByCreatedAtAsc(meetingId)) {
            String existingTaskId = links.get(action.getId());
            tasks.add(existingTaskId == null
                    ? createTaskForAction(meeting, action, targetProjectId)
                    : projectService.getTask(existingTaskId));
        }
        if (!tasks.isEmpty()) {
            notificationService.notifyCurrent(
                    "会议行动项已写入项目",
                    "《" + meeting.getTitle() + "》的 " + tasks.size() + " 项行动已同步到项目看板。",
                    "PROJECT",
                    "SUCCESS",
                    "MEETING",
                    meetingId
            );
        }
        return tasks;
    }

    @Transactional
    public ProjectDtos.TaskResponse convertAction(String meetingId, String actionId, String projectId) {
        MeetingEntity meeting = requireMeeting(meetingId);
        ActionItemEntity action = actionItemRepository.findByIdAndMeetingId(actionId, meetingId)
                .orElseThrow(() -> new BusinessException("会议行动项不存在或无权访问", 404));
        String targetProjectId = normalizeProjectId(projectId);
        projectService.ensureProject(targetProjectId, "星海计划");
        return actionTaskLinkRepository.findByActionIdAndWorkspaceId(actionId, WorkspaceContext.current())
                .map(link -> projectService.getTask(link.getTaskId()))
                .orElseGet(() -> createTaskForAction(meeting, action, targetProjectId));
    }

    @Transactional
    public MeetingDtos.ActionItemResponse changeActionStatus(String actionId, ActionStatus status) {
        if (status == null) throw new BusinessException("行动项状态不能为空");
        ActionItemEntity action = requireActionItem(actionId);
        action.changeStatus(status);
        ActionItemEntity saved = actionItemRepository.save(action);
        String taskId = actionTaskLinkRepository.findByActionIdAndWorkspaceId(actionId, WorkspaceContext.current())
                .map(ActionTaskLinkEntity::getTaskId)
                .orElse(null);
        return MeetingDtos.ActionItemResponse.from(saved, taskId);
    }

    private ProjectDtos.TaskResponse createTaskForAction(MeetingEntity meeting, ActionItemEntity action, String projectId) {
        ProjectDtos.TaskResponse task = projectService.createTask(projectId, new ProjectDtos.CreateTaskRequest(
                action.getTitle(),
                "由会议《" + meeting.getTitle() + "》行动项自动创建，等待确认执行细节。",
                action.getOwner(),
                priorityFor(action.getDueDate()),
                action.getDueDate(),
                List.of(),
                false
        ));
        actionTaskLinkRepository.save(new ActionTaskLinkEntity(
                WorkspaceContext.newId("link"),
                WorkspaceContext.current(),
                meeting.getId(),
                action.getId(),
                projectId,
                task.id()
        ));
        return task;
    }

    private TaskPriority priorityFor(LocalDate dueDate) {
        if (dueDate == null) return TaskPriority.MEDIUM;
        long days = java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), dueDate);
        if (days <= 0) return TaskPriority.URGENT;
        if (days <= 3) return TaskPriority.HIGH;
        return TaskPriority.MEDIUM;
    }

    private String normalizeProjectId(String projectId) {
        return projectId == null || projectId.isBlank() ? "project-xinghai" : projectId.trim();
    }

    private MeetingEntity requireMeeting(String meetingId) {
        return meetingRepository.findByIdAndWorkspaceId(meetingId, WorkspaceContext.current())
                .orElseThrow(() -> new BusinessException("会议不存在或无权访问", 404));
    }

    private ActionItemEntity requireActionItem(String actionId) {
        List<String> meetingIds = meetingRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(WorkspaceContext.current()).stream()
                .map(MeetingEntity::getId)
                .toList();
        if (meetingIds.isEmpty()) throw new BusinessException("行动项不存在或无权访问", 404);
        return actionItemRepository.findAllByMeetingIdInOrderByCreatedAtAsc(meetingIds).stream()
                .filter(action -> action.getId().equals(actionId))
                .findFirst()
                .orElseThrow(() -> new BusinessException("行动项不存在或无权访问", 404));
    }

    private void ensureActionItems(String meetingId, String transcript) {
        if (!actionItemRepository.findAllByMeetingIdOrderByCreatedAtAsc(meetingId).isEmpty()) return;
        List<ActionCandidate> candidates = new ArrayList<>();
        if (transcript.contains("数据导出")) candidates.add(new ActionCandidate("整理数据导出需求清单", "周可", LocalDate.now().plusDays(1)));
        if (transcript.contains("资源") || transcript.contains("排期")) candidates.add(new ActionCandidate("评估设计与研发资源影响", "陈默", LocalDate.now().plusDays(2)));
        if (transcript.contains("客户") || transcript.contains("续约")) candidates.add(new ActionCandidate("补充客户续约所需 ROI 数据", "李慧", LocalDate.now()));
        if (candidates.isEmpty()) candidates.add(new ActionCandidate("同步会议结论并确认下一步", "林然", LocalDate.now().plusDays(1)));
        candidates.forEach(item -> actionItemRepository.save(new ActionItemEntity(
                WorkspaceContext.newId("act"), meetingId, item.title, item.owner, item.dueDate
        )));
    }

    private record ActionCandidate(String title, String owner, LocalDate dueDate) {}
}
