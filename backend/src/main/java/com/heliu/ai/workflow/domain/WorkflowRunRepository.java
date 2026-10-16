package com.heliu.ai.workflow.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WorkflowRunRepository extends JpaRepository<WorkflowRunEntity, String> {
    List<WorkflowRunEntity> findTop20ByWorkflowIdOrderByStartedAtDesc(String workflowId);
    List<WorkflowRunEntity> findTop20ByWorkspaceIdOrderByStartedAtDesc(String workspaceId);
    Optional<WorkflowRunEntity> findByIdAndWorkspaceId(String id, String workspaceId);
}
