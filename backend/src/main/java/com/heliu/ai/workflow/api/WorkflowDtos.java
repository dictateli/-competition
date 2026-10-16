package com.heliu.ai.workflow.api;

import com.heliu.ai.workflow.domain.WorkflowDefinitionEntity;
import com.heliu.ai.workflow.domain.WorkflowRunEntity;
import jakarta.validation.constraints.NotBlank;

import java.time.Instant;
import java.util.List;

public final class WorkflowDtos {
    private WorkflowDtos() {}

    public record CreateWorkflowRequest(@NotBlank String name, @NotBlank String triggerType, @NotBlank String actionsJson) {}

    public record CreateFromPromptRequest(@NotBlank String prompt, String triggerType, String name) {}

    public record RunWorkflowRequest(String inputJson) {}

    public record WorkflowResponse(
            String id,
            String name,
            String description,
            String prompt,
            String triggerType,
            String actionsJson,
            boolean enabled,
            Instant createdAt,
            Instant lastRunAt
    ) {
        public static WorkflowResponse from(WorkflowDefinitionEntity entity) {
            return new WorkflowResponse(
                    entity.getId(), entity.getName(), entity.getDescription(), entity.getPrompt(),
                    entity.getTriggerType(), entity.getActionsJson(), entity.isEnabled(),
                    entity.getCreatedAt(), entity.getLastRunAt()
            );
        }
    }

    public record WorkflowRunResponse(
            String id,
            String workflowId,
            String status,
            String outputJson,
            String errorMessage,
            Long durationMs,
            Instant startedAt,
            Instant finishedAt
    ) {
        public static WorkflowRunResponse from(WorkflowRunEntity entity) {
            return new WorkflowRunResponse(
                    entity.getId(), entity.getWorkflowId(), entity.getStatus(), entity.getOutputJson(),
                    entity.getErrorMessage(), entity.getDurationMs(), entity.getStartedAt(), entity.getFinishedAt()
            );
        }
    }

    public record RunHistoryResponse(List<WorkflowRunResponse> runs) {}
}
