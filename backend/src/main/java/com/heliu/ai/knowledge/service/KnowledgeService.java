package com.heliu.ai.knowledge.service;

import com.heliu.ai.ai.api.AiAnswer;
import com.heliu.ai.ai.api.AiRequest;
import com.heliu.ai.ai.api.LargeLanguageModel;
import com.heliu.ai.ai.api.RetrievalService;
import com.heliu.ai.common.WorkspaceContext;
import com.heliu.ai.document.domain.DocumentEntity;
import com.heliu.ai.document.domain.DocumentRepository;
import com.heliu.ai.knowledge.api.KnowledgeDtos;
import com.heliu.ai.meeting.domain.MeetingEntity;
import com.heliu.ai.meeting.domain.MeetingRepository;
import com.heliu.ai.notification.service.NotificationService;
import com.heliu.ai.project.domain.ProjectEntity;
import com.heliu.ai.project.domain.ProjectRepository;
import com.heliu.ai.project.domain.TaskEntity;
import com.heliu.ai.project.domain.TaskRepository;
import com.heliu.ai.workflow.domain.WorkflowDefinitionEntity;
import com.heliu.ai.workflow.domain.WorkflowDefinitionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class KnowledgeService {
    private final DocumentRepository documentRepository;
    private final MeetingRepository meetingRepository;
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final WorkflowDefinitionRepository workflowRepository;
    private final RetrievalService retrievalService;
    private final LargeLanguageModel languageModel;
    private final NotificationService notificationService;

    public KnowledgeService(
            DocumentRepository documentRepository,
            MeetingRepository meetingRepository,
            TaskRepository taskRepository,
            ProjectRepository projectRepository,
            WorkflowDefinitionRepository workflowRepository,
            RetrievalService retrievalService,
            LargeLanguageModel languageModel,
            NotificationService notificationService
    ) {
        this.documentRepository = documentRepository;
        this.meetingRepository = meetingRepository;
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.workflowRepository = workflowRepository;
        this.retrievalService = retrievalService;
        this.languageModel = languageModel;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public KnowledgeDtos.SearchResponse search(String query, int limit) {
        String normalizedQuery = query == null ? "" : query.trim();
        List<KnowledgeDtos.KnowledgeItem> items = collectItems().stream()
                .map(item -> new KnowledgeDtos.KnowledgeItem(
                        item.type(), item.id(), item.title(), item.snippet(), score(normalizedQuery, item), item.source(), item.location(), item.timestamp()
                ))
                .filter(item -> normalizedQuery.isBlank() || item.score() > 0)
                .sorted(Comparator.comparingDouble(KnowledgeDtos.KnowledgeItem::score).reversed()
                        .thenComparing(KnowledgeDtos.KnowledgeItem::timestamp, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(Math.max(1, Math.min(limit, 50)))
                .toList();
        List<String> suggestions = items.isEmpty()
                ? List.of("上传文档后即可建立知识网络", "可尝试搜索“数据导出”、“续约风险”或“资源冲突”")
                : items.stream().limit(3).map(KnowledgeDtos.KnowledgeItem::title).toList();
        return new KnowledgeDtos.SearchResponse(normalizedQuery, items.size(), items, suggestions);
    }

    @Transactional(readOnly = true)
    public KnowledgeDtos.KnowledgeStats stats() {
        String workspaceId = WorkspaceContext.current();
        int documents = documentRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(workspaceId).size();
        int meetings = meetingRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(workspaceId).size();
        int tasks = taskRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(workspaceId).size();
        int projects = projectRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(workspaceId).size();
        int workflows = workflowRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(workspaceId).size();
        int connections = documents * 4 + meetings * 3 + tasks * 2 + projects + workflows;
        List<KnowledgeDtos.Insight> insights = List.of(
                new KnowledgeDtos.Insight(
                        "客户续约的 3 个前置信号",
                        "关键工作流使用深度、协作成员数、数据沉淀量。",
                        "来自 " + Math.max(documents, 1) + " 份文档和 " + Math.max(meetings, 1) + " 次会议"
                ),
                new KnowledgeDtos.Insight(
                        "项目延期最常见的原因",
                        "设计资源冲突、范围变更未及时同步、验收标准模糊。",
                        "来自近 90 天项目与任务数据"
                )
        );
        return new KnowledgeDtos.KnowledgeStats(
                documents, meetings, tasks, projects, workflows, connections,
                notificationService.unreadCount(), "100%", insights
        );
    }

    @Transactional(readOnly = true)
    public KnowledgeDtos.AskResponse ask(KnowledgeDtos.AskRequest request) {
        if (request.contextIds() != null && !request.contextIds().isEmpty()) {
            return fromAiAnswer(retrievalService.answer(new AiRequest(
                    request.question().trim(), WorkspaceContext.current(), request.contextIds()
            )));
        }
        List<DocumentEntity> documents = documentRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(WorkspaceContext.current());
        if (!documents.isEmpty()) {
            return fromAiAnswer(retrievalService.answer(new AiRequest(
                    request.question().trim(),
                    WorkspaceContext.current(),
                    documents.stream().map(DocumentEntity::getId).limit(8).toList()
            )));
        }
        AiAnswer answer = languageModel.generate(new AiRequest(
                "基于当前工作区知识回答问题：" + request.question().trim(),
                WorkspaceContext.current(),
                List.of()
        ));
        return fromAiAnswer(answer);
    }

    private List<KnowledgeDtos.KnowledgeItem> collectItems() {
        String workspaceId = WorkspaceContext.current();
        List<KnowledgeDtos.KnowledgeItem> items = new ArrayList<>();
        for (DocumentEntity document : documentRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(workspaceId)) {
            items.add(new KnowledgeDtos.KnowledgeItem(
                    "DOCUMENT", document.getId(), document.getName(),
                    content(document.getSummary(), document.getExtractedText()), 0,
                    "文档知识", "解析全文", document.getCreatedAt()
            ));
        }
        for (MeetingEntity meeting : meetingRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(workspaceId)) {
            items.add(new KnowledgeDtos.KnowledgeItem(
                    "MEETING", meeting.getId(), meeting.getTitle(),
                    content(meeting.getSummary(), meeting.getTranscriptText()), 0,
                    "会议知识", "会议纪要与原声", meeting.getEndedAt() == null ? meeting.getCreatedAt() : meeting.getEndedAt()
            ));
        }
        for (TaskEntity task : taskRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(workspaceId)) {
            items.add(new KnowledgeDtos.KnowledgeItem(
                    "TASK", task.getId(), task.getTitle(),
                    content(task.getDescription(), task.getOwner()), 0,
                    "项目任务", task.getProjectId(), task.getUpdatedAt() == null ? task.getCreatedAt() : task.getUpdatedAt()
            ));
        }
        for (ProjectEntity project : projectRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(workspaceId)) {
            items.add(new KnowledgeDtos.KnowledgeItem(
                    "PROJECT", project.getId(), project.getName(),
                    content(project.getDescription(), project.getOwner()), 0,
                    "项目上下文", project.getStatus().name(), project.getUpdatedAt() == null ? project.getCreatedAt() : project.getUpdatedAt()
            ));
        }
        for (WorkflowDefinitionEntity workflow : workflowRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(workspaceId)) {
            items.add(new KnowledgeDtos.KnowledgeItem(
                    "WORKFLOW", workflow.getId(), workflow.getName(),
                    content(workflow.getDescription(), workflow.getPrompt() + " " + workflow.getActionsJson()), 0,
                    "自动化流程", workflow.getTriggerType(), workflow.getLastRunAt() == null ? workflow.getCreatedAt() : workflow.getLastRunAt()
            ));
        }
        return items;
    }

    private double score(String query, KnowledgeDtos.KnowledgeItem item) {
        if (query.isBlank()) return 0.1;
        String title = item.title() == null ? "" : item.title();
        String body = item.snippet() == null ? "" : item.snippet();
        String source = item.source() == null ? "" : item.source();
        int score = 0;
        for (String token : query.replaceAll("[，。！？、,.!?\\s]+", " ").split(" ")) {
            if (token.isBlank()) continue;
            if (title.contains(token)) score += 6;
            if (body.contains(token)) score += 3;
            if (source.contains(token)) score += 1;
        }
        if (score == 0) {
            for (String token : query.replaceAll("[，。！？、,.!?\\s]+", "").split("")) {
                if (!token.isBlank() && (title.contains(token) || body.contains(token))) score += 1;
            }
        }
        return Math.min(1.0, score / 18.0);
    }

    private String content(String first, String second) {
        String value = ((first == null ? "" : first) + " " + (second == null ? "" : second)).replaceAll("\\s+", " ").trim();
        if (value.isBlank()) return "暂无可用摘要";
        return value.length() <= 220 ? value : value.substring(0, 220) + "…";
    }

    private KnowledgeDtos.AskResponse fromAiAnswer(AiAnswer answer) {
        List<KnowledgeDtos.Citation> citations = answer.citations().stream()
                .map(citation -> new KnowledgeDtos.Citation(
                        citation.sourceId(), citation.sourceName(), citation.location(), citation.score()
                ))
                .toList();
        return new KnowledgeDtos.AskResponse(answer.content(), answer.model(), citations);
    }
}
