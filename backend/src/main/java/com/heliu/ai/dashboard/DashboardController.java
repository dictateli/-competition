package com.heliu.ai.dashboard;

import com.heliu.ai.common.ApiResponse;
import com.heliu.ai.common.WorkspaceContext;
import com.heliu.ai.document.domain.DocumentEntity;
import com.heliu.ai.document.domain.DocumentRepository;
import com.heliu.ai.meeting.domain.MeetingEntity;
import com.heliu.ai.meeting.domain.MeetingRepository;
import com.heliu.ai.notification.service.NotificationService;
import com.heliu.ai.project.domain.ProjectEntity;
import com.heliu.ai.project.domain.ProjectRepository;
import com.heliu.ai.project.domain.TaskEntity;
import com.heliu.ai.project.domain.TaskRepository;
import com.heliu.ai.project.domain.TaskStatus;
import com.heliu.ai.workflow.domain.WorkflowDefinitionRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {
    private final MeetingRepository meetingRepository;
    private final DocumentRepository documentRepository;
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final WorkflowDefinitionRepository workflowRepository;
    private final NotificationService notificationService;

    public DashboardController(
            MeetingRepository meetingRepository,
            DocumentRepository documentRepository,
            TaskRepository taskRepository,
            ProjectRepository projectRepository,
            WorkflowDefinitionRepository workflowRepository,
            NotificationService notificationService
    ) {
        this.meetingRepository = meetingRepository;
        this.documentRepository = documentRepository;
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.workflowRepository = workflowRepository;
        this.notificationService = notificationService;
    }

    @GetMapping
    public ApiResponse<DashboardResponse> dashboard() {
        String workspaceId = WorkspaceContext.current();
        List<TaskEntity> tasks = taskRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(workspaceId);
        List<MeetingEntity> meetings = meetingRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(workspaceId);
        List<DocumentEntity> documents = documentRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(workspaceId);
        List<ProjectEntity> projects = projectRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(workspaceId);
        int workflows = workflowRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(workspaceId).size();
        int automated = tasks.size() + meetings.size() * 3 + documents.size() * 2 + workflows * 4;
        int riskCount = (int) tasks.stream().filter(task -> task.getStatus() != TaskStatus.DONE && task.getRiskScore() >= 40).count();
        int onTimeRate = Math.max(52, Math.min(99, 96 - riskCount * 6));
        return ApiResponse.ok(new DashboardResponse(
                "早上好，林然。",
                focusItems(tasks),
                new Metrics(
                        automated,
                        String.format("%.1fh", automated * 0.17),
                        onTimeRate,
                        tasks.size(), meetings.size(), documents.size(), workflows
                ),
                projectHealth(projects, tasks),
                signals(tasks, documents),
                schedule(meetings),
                notificationService.unreadCount()
        ));
    }

    @GetMapping("/focus")
    public ApiResponse<List<FocusItem>> focus() {
        return ApiResponse.ok(focusItems(taskRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(WorkspaceContext.current())));
    }

    @GetMapping("/signals")
    public ApiResponse<List<Signal>> signals() {
        return ApiResponse.ok(signals(
                taskRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(WorkspaceContext.current()),
                documentRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(WorkspaceContext.current())
        ));
    }

    private List<FocusItem> focusItems(List<TaskEntity> tasks) {
        List<FocusItem> items = tasks.stream()
                .filter(task -> task.getStatus() != TaskStatus.DONE)
                .sorted(Comparator.comparingInt(TaskEntity::getRiskScore).reversed())
                .limit(3)
                .map(task -> new FocusItem(
                        String.format("%02d", tasks.indexOf(task) + 1),
                        task.getTitle(),
                        (task.getDescription() == null || task.getDescription().isBlank() ? "等待补充执行上下文" : task.getDescription())
                                + " · 负责人 " + task.getOwner(),
                        task.getDueDate() == null ? "尽快" : task.getDueDate().toString()
                ))
                .toList();
        if (!items.isEmpty()) return items;
        return List.of(
                new FocusItem("01", "确认星海计划第二阶段范围变更", "产品评审会 · 会直接影响本周开发排期", "10:30"),
                new FocusItem("02", "补齐客户续约方案的 ROI 测算", "缺少 2 项关键数据 · AI 已标出引用位置", "今天"),
                new FocusItem("03", "审批设计资源增补申请", "已阻塞 3 个下游任务", "尽快")
        );
    }

    private ProjectHealth projectHealth(List<ProjectEntity> projects, List<TaskEntity> tasks) {
        if (!projects.isEmpty()) {
            ProjectEntity project = projects.get(0);
            List<TaskEntity> projectTasks = tasks.stream().filter(task -> task.getProjectId().equals(project.getId())).toList();
            int score = Math.max(35, project.getProgress() + (projectTasks.isEmpty() ? 20 : 25));
            return new ProjectHealth(
                    Math.min(98, score), project.getName(),
                    project.getDescription() == null ? "AI 持续监测关键路径与资源冲突" : project.getDescription(),
                    (int) projectTasks.stream().filter(task -> task.isMilestone() && task.getStatus() == TaskStatus.DONE).count(),
                    (int) projectTasks.stream().filter(TaskEntity::isMilestone).count()
            );
        }
        return new ProjectHealth(78, "星海计划", "设计资源是当前主要风险", 0, 0);
    }

    private List<Signal> signals(List<TaskEntity> tasks, List<DocumentEntity> documents) {
        List<Signal> signals = tasks.stream()
                .filter(task -> task.getStatus() != TaskStatus.DONE && task.getRiskScore() >= 40)
                .sorted(Comparator.comparingInt(TaskEntity::getRiskScore).reversed())
                .limit(2)
                .map(task -> new Signal("RISK", task.getTitle(), "风险评分 " + task.getRiskScore() + "，建议优先处理并同步负责人。", "HIGH"))
                .collect(java.util.stream.Collectors.toCollection(java.util.ArrayList::new));
        if (!documents.isEmpty()) {
            signals.add(new Signal("DOCUMENT", "知识库新增 " + documents.size() + " 份可检索资料", "AI 已建立摘要、风险与引用索引，可直接发起跨文档问答。", "INFO"));
        }
        if (signals.isEmpty()) {
            signals.add(new Signal("INFO", "工作流运行正常", "未发现高风险任务，AI 会继续监测会议、文档和项目变化。", "INFO"));
        }
        return signals;
    }

    private List<ScheduleItem> schedule(List<MeetingEntity> meetings) {
        if (meetings.isEmpty()) {
            return List.of(
                    new ScheduleItem("10:30", "星海计划产品评审", "腾讯会议 · 6 人参与", "AI 已生成会前简报"),
                    new ScheduleItem("14:00", "客户续约策略沟通", "线上会议 · 4 人参与", "缺少 2 项材料"),
                    new ScheduleItem("16:30", "增长实验复盘", "会议室 A · 5 人参与", "自动录制已开启")
            );
        }
        return meetings.stream().limit(4)
                .map(meeting -> new ScheduleItem(
                        "已同步", meeting.getTitle(),
                        meeting.getStatus().name() + " · 会议工作台",
                        meeting.getSummary() == null ? "等待生成纪要" : "AI 纪要已生成"
                ))
                .toList();
    }

    public record DashboardResponse(
            String greeting,
            List<FocusItem> focus,
            Metrics metrics,
            ProjectHealth projectHealth,
            List<Signal> signals,
            List<ScheduleItem> schedule,
            long unreadNotifications
    ) {}
    public record FocusItem(String index, String title, String reason, String time) {}
    public record Metrics(int automatedItems, String savedHours, int onTimeRate, int tasks, int meetings, int documents, int workflows) {}
    public record ProjectHealth(int score, String projectName, String note, int completedMilestones, int totalMilestones) {}
    public record Signal(String type, String title, String text, String level) {}
    public record ScheduleItem(String time, String title, String meta, String tag) {}
}
