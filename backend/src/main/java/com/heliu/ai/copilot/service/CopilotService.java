package com.heliu.ai.copilot.service;

import com.heliu.ai.ai.api.AiAnswer;
import com.heliu.ai.ai.api.AiRequest;
import com.heliu.ai.ai.api.LargeLanguageModel;
import com.heliu.ai.copilot.api.CopilotDtos;
import com.heliu.ai.copilot.domain.CopilotMessageEntity;
import com.heliu.ai.copilot.domain.CopilotMessageRepository;
import com.heliu.ai.common.BusinessException;
import com.heliu.ai.common.WorkspaceContext;
import com.heliu.ai.knowledge.api.KnowledgeDtos;
import com.heliu.ai.knowledge.service.KnowledgeService;
import com.heliu.ai.project.api.ProjectDtos;
import com.heliu.ai.project.domain.ProjectEntity;
import com.heliu.ai.project.domain.TaskPriority;
import com.heliu.ai.project.service.ProjectService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CopilotService {
    private final KnowledgeService knowledgeService;
    private final LargeLanguageModel languageModel;
    private final ProjectService projectService;
    private final CopilotMessageRepository messageRepository;

    public CopilotService(
            KnowledgeService knowledgeService,
            LargeLanguageModel languageModel,
            ProjectService projectService,
            CopilotMessageRepository messageRepository
    ) {
        this.knowledgeService = knowledgeService;
        this.languageModel = languageModel;
        this.projectService = projectService;
        this.messageRepository = messageRepository;
    }

    @Transactional
    public CopilotDtos.ChatResponse chat(CopilotDtos.ChatRequest request) {
        if (request == null || request.message() == null || request.message().isBlank()) {
            throw new BusinessException("请输入 Copilot 指令");
        }
        String message = request.message().trim();
        String conversationId = request.conversationId() == null || request.conversationId().isBlank()
                ? WorkspaceContext.newId("conv")
                : request.conversationId().trim();
        messageRepository.save(new CopilotMessageEntity(WorkspaceContext.current(), conversationId, "user", message));

        KnowledgeDtos.SearchResponse search = knowledgeService.search(message, 5);
        List<KnowledgeDtos.Citation> citations = search.items().stream()
                .map(item -> new KnowledgeDtos.Citation(item.id(), item.title(), item.location(), Math.max(0.5, item.score())))
                .toList();

        CopilotDtos.Action action = maybeCreateTask(message, request.projectId());
        String answer;
        String model;
        if (action != null) {
            answer = "已根据你的指令创建任务，并完成项目看板和风险评分同步。";
            model = "copilot-tool";
        } else {
            String context = search.items().stream()
                    .map(item -> "[" + item.type() + "] " + item.title() + " - " + item.snippet())
                    .collect(Collectors.joining("\n"));
            String prompt = "你是合流 AI Copilot。请基于工作区上下文回答，保持简洁并明确下一步。\n"
                    + "用户问题：" + message + "\n"
                    + "可用上下文：\n" + (context.isBlank() ? "暂无检索结果" : context);
            AiAnswer aiAnswer = languageModel.generate(new AiRequest(
                    prompt,
                    WorkspaceContext.current(),
                    search.items().stream().map(KnowledgeDtos.KnowledgeItem::id).toList()
            ));
            answer = aiAnswer.content();
            model = aiAnswer.model();
        }
        messageRepository.save(new CopilotMessageEntity(WorkspaceContext.current(), conversationId, "assistant", answer));
        return new CopilotDtos.ChatResponse(conversationId, answer, model, citations, action);
    }

    @Transactional(readOnly = true)
    public List<CopilotDtos.MessageResponse> history(String conversationId) {
        return messageRepository.findTop30ByWorkspaceIdAndConversationIdOrderByCreatedAtAsc(
                WorkspaceContext.current(), conversationId
        ).stream().map(CopilotDtos.MessageResponse::from).toList();
    }

    private CopilotDtos.Action maybeCreateTask(String message, String requestedProjectId) {
        if (!(message.contains("创建任务") || message.contains("新建任务") || message.startsWith("/task"))) {
            return null;
        }
        String title = message
                .replaceFirst("^/task\\s*", "")
                .replaceFirst("^.*?(创建|新建)(一个|新的)?任务[：:]?", "")
                .trim();
        if (title.isBlank()) title = "Copilot 创建的任务";
        if (title.length() > 120) title = title.substring(0, 120);

        String projectId = requestedProjectId;
        if (projectId == null || projectId.isBlank()) {
            List<ProjectDtos.ProjectResponse> projects = projectService.listProjects();
            if (projects.isEmpty()) {
                ProjectEntity project = projectService.ensureProject("project-copilot", "Copilot 收件箱");
                projectId = project.getId();
            } else {
                projectId = projects.get(0).id();
            }
        }
        ProjectDtos.TaskResponse task = projectService.createTask(projectId, new ProjectDtos.CreateTaskRequest(
                title,
                "由 Copilot 根据自然语言指令创建",
                "林然",
                TaskPriority.MEDIUM,
                LocalDate.now().plusDays(3),
                List.of(),
                false
        ));
        return new CopilotDtos.Action(
                "task_created",
                "已创建任务",
                List.of(task.title() + " · " + task.owner() + " · " + task.dueDate()),
                task.id()
        );
    }
}
