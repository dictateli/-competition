package com.heliu.ai.workflow.service;

import com.heliu.ai.ai.api.AiAnswer;
import com.heliu.ai.ai.api.AiRequest;
import com.heliu.ai.ai.api.LargeLanguageModel;
import com.heliu.ai.common.BusinessException;
import com.heliu.ai.common.WorkspaceContext;
import com.heliu.ai.notification.service.NotificationService;
import com.heliu.ai.workflow.api.WorkflowDtos;
import com.heliu.ai.workflow.domain.WorkflowDefinitionEntity;
import com.heliu.ai.workflow.domain.WorkflowDefinitionRepository;
import com.heliu.ai.workflow.domain.WorkflowRunEntity;
import com.heliu.ai.workflow.domain.WorkflowRunRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WorkflowService {
    private final WorkflowDefinitionRepository definitionRepository;
    private final WorkflowRunRepository runRepository;
    private final LargeLanguageModel languageModel;
    private final NotificationService notificationService;

    public WorkflowService(
            WorkflowDefinitionRepository definitionRepository,
            WorkflowRunRepository runRepository,
            LargeLanguageModel languageModel,
            NotificationService notificationService
    ) {
        this.definitionRepository = definitionRepository;
        this.runRepository = runRepository;
        this.languageModel = languageModel;
        this.notificationService = notificationService;
    }

    @Transactional
    public WorkflowDtos.WorkflowResponse create(WorkflowDtos.CreateWorkflowRequest request) {
        WorkflowDefinitionEntity entity = new WorkflowDefinitionEntity(
                WorkspaceContext.newId("wf"),
                WorkspaceContext.current(),
                request.name().trim(),
                request.triggerType().trim(),
                request.actionsJson()
        );
        return WorkflowDtos.WorkflowResponse.from(definitionRepository.save(entity));
    }

    @Transactional
    public WorkflowDtos.WorkflowResponse createFromPrompt(WorkflowDtos.CreateFromPromptRequest request) {
        AiAnswer answer = languageModel.generate(new AiRequest(
                "把下面的自然语言目标转成可执行工作流，说明触发条件、AI 分析节点和业务动作：" + request.prompt(),
                WorkspaceContext.current(),
                List.of()
        ));
        String name = request.name() == null || request.name().isBlank()
                ? shorten(request.prompt().trim(), 18)
                : request.name().trim();
        String triggerType = request.triggerType() == null || request.triggerType().isBlank()
                ? "MANUAL"
                : request.triggerType().trim().toUpperCase();
        String actionsJson = """
                {"nodes":[
                  {"type":"TRIGGER","name":"接收业务事件","config":"%s"},
                  {"type":"AI","name":"理解上下文并判断风险","config":"LLM + RAG"},
                  {"type":"ACTION","name":"创建任务并通知负责人","config":"Project + Notification"}
                ]}
                """.formatted(triggerType).replaceAll("\\s+", " ");
        WorkflowDefinitionEntity entity = new WorkflowDefinitionEntity(
                WorkspaceContext.newId("wf"),
                WorkspaceContext.current(),
                name,
                triggerType,
                actionsJson,
                answer.content(),
                request.prompt().trim()
        );
        return WorkflowDtos.WorkflowResponse.from(definitionRepository.save(entity));
    }

    @Transactional(readOnly = true)
    public WorkflowDtos.WorkflowResponse detail(String workflowId) {
        return WorkflowDtos.WorkflowResponse.from(require(workflowId));
    }

    @Transactional(readOnly = true)
    public List<WorkflowDtos.WorkflowResponse> list() {
        return definitionRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(WorkspaceContext.current()).stream()
                .map(WorkflowDtos.WorkflowResponse::from)
                .toList();
    }

    @Transactional
    public WorkflowDtos.WorkflowResponse toggle(String workflowId) {
        WorkflowDefinitionEntity workflow = require(workflowId);
        workflow.toggle();
        return WorkflowDtos.WorkflowResponse.from(definitionRepository.save(workflow));
    }

    @Transactional
    public WorkflowDtos.WorkflowRunResponse run(String workflowId, WorkflowDtos.RunWorkflowRequest request) {
        WorkflowDefinitionEntity workflow = require(workflowId);
        return execute(workflow, request == null ? "{}" : request.inputJson());
    }

    @Transactional
    public WorkflowDtos.WorkflowRunResponse retryRun(String runId) {
        WorkflowRunEntity previous = runRepository.findByIdAndWorkspaceId(runId, WorkspaceContext.current())
                .orElseThrow(() -> new BusinessException("运行记录不存在或无权访问", 404));
        WorkflowDefinitionEntity workflow = require(previous.getWorkflowId());
        return execute(workflow, previous.getInputJson());
    }

    @Transactional(readOnly = true)
    public WorkflowDtos.RunHistoryResponse history(String workflowId) {
        require(workflowId);
        List<WorkflowDtos.WorkflowRunResponse> runs = runRepository.findTop20ByWorkflowIdOrderByStartedAtDesc(workflowId).stream()
                .map(WorkflowDtos.WorkflowRunResponse::from)
                .toList();
        return new WorkflowDtos.RunHistoryResponse(runs);
    }

    @Transactional(readOnly = true)
    public WorkflowDtos.RunHistoryResponse recentRuns() {
        List<WorkflowDtos.WorkflowRunResponse> runs = runRepository.findTop20ByWorkspaceIdOrderByStartedAtDesc(WorkspaceContext.current()).stream()
                .map(WorkflowDtos.WorkflowRunResponse::from)
                .toList();
        return new WorkflowDtos.RunHistoryResponse(runs);
    }

    private WorkflowDtos.WorkflowRunResponse execute(WorkflowDefinitionEntity workflow, String inputJson) {
        if (!workflow.isEnabled()) throw new BusinessException("工作流已暂停，请先启用");
        WorkflowRunEntity run = new WorkflowRunEntity(
                WorkspaceContext.newId("run"),
                WorkspaceContext.current(),
                workflow.getId(),
                inputJson == null || inputJson.isBlank() ? "{}" : inputJson
        );
        if (run.getInputJson().contains("\"fail\":true")) {
            run.fail("演示运行被输入参数标记为失败，可由重试接口再次执行。");
            notificationService.notifyCurrent(
                    "工作流执行失败",
                    "「" + workflow.getName() + "」执行失败，可查看运行记录后重试。",
                    "WORKFLOW",
                    "HIGH",
                    "WORKFLOW_RUN",
                    run.getId()
            );
        } else {
            run.finish("{\"steps\":3,\"status\":\"SUCCESS\",\"message\":\"已完成触发、AI 分析和业务动作同步\"}");
            notificationService.notifyCurrent(
                    "工作流执行完成",
                    "「" + workflow.getName() + "」已完成 3 个节点。",
                    "WORKFLOW",
                    "SUCCESS",
                    "WORKFLOW_RUN",
                    run.getId()
            );
        }
        workflow.markRun();
        definitionRepository.save(workflow);
        return WorkflowDtos.WorkflowRunResponse.from(runRepository.save(run));
    }

    private WorkflowDefinitionEntity require(String workflowId) {
        return definitionRepository.findByIdAndWorkspaceId(workflowId, WorkspaceContext.current())
                .orElseThrow(() -> new BusinessException("工作流不存在或无权访问", 404));
    }

    private String shorten(String text, int maxLength) {
        return text.length() <= maxLength ? text : text.substring(0, maxLength) + "…";
    }
}
