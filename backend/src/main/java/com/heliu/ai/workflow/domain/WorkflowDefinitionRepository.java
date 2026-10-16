package com.heliu.ai.workflow.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WorkflowDefinitionRepository extends JpaRepository<WorkflowDefinitionEntity, String> {
    List<WorkflowDefinitionEntity> findAllByWorkspaceIdOrderByCreatedAtDesc(String workspaceId);
    Optional<WorkflowDefinitionEntity> findByIdAndWorkspaceId(String id, String workspaceId);
}
