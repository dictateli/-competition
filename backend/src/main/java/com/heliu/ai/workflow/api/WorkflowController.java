package com.heliu.ai.workflow.api;

import com.heliu.ai.common.ApiResponse;
import com.heliu.ai.workflow.service.WorkflowService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/workflows")
public class WorkflowController {
    private final WorkflowService workflowService;

    public WorkflowController(WorkflowService workflowService) {
        this.workflowService = workflowService;
    }

    @GetMapping
    public ApiResponse<List<WorkflowDtos.WorkflowResponse>> list() {
        return ApiResponse.ok(workflowService.list());
    }

    @PostMapping
    public ApiResponse<WorkflowDtos.WorkflowResponse> create(@Valid @RequestBody WorkflowDtos.CreateWorkflowRequest request) {
        return ApiResponse.ok(workflowService.create(request));
    }

    @PostMapping("/from-prompt")
    public ApiResponse<WorkflowDtos.WorkflowResponse> createFromPrompt(
            @Valid @RequestBody WorkflowDtos.CreateFromPromptRequest request
    ) {
        return ApiResponse.ok(workflowService.createFromPrompt(request));
    }

    @GetMapping("/{workflowId}")
    public ApiResponse<WorkflowDtos.WorkflowResponse> detail(@PathVariable String workflowId) {
        return ApiResponse.ok(workflowService.detail(workflowId));
    }

    @PatchMapping("/{workflowId}/toggle")
    public ApiResponse<WorkflowDtos.WorkflowResponse> toggle(@PathVariable String workflowId) {
        return ApiResponse.ok(workflowService.toggle(workflowId));
    }

    @PostMapping("/{workflowId}/run")
    public ApiResponse<WorkflowDtos.WorkflowRunResponse> run(@PathVariable String workflowId, @RequestBody(required = false) WorkflowDtos.RunWorkflowRequest request) {
        return ApiResponse.ok(workflowService.run(workflowId, request));
    }

    @GetMapping("/{workflowId}/runs")
    public ApiResponse<WorkflowDtos.RunHistoryResponse> history(@PathVariable String workflowId) {
        return ApiResponse.ok(workflowService.history(workflowId));
    }

    @PostMapping("/runs/{runId}/retry")
    public ApiResponse<WorkflowDtos.WorkflowRunResponse> retry(@PathVariable String runId) {
        return ApiResponse.ok(workflowService.retryRun(runId));
    }

    @GetMapping("/runs/recent")
    public ApiResponse<WorkflowDtos.RunHistoryResponse> recentRuns() {
        return ApiResponse.ok(workflowService.recentRuns());
    }
}
