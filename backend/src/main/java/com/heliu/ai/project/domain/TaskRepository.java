package com.heliu.ai.project.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<TaskEntity, String> {
    List<TaskEntity> findAllByWorkspaceIdAndProjectIdOrderByCreatedAtDesc(String workspaceId, String projectId);
    List<TaskEntity> findAllByWorkspaceIdOrderByCreatedAtDesc(String workspaceId);
    List<TaskEntity> findAllByWorkspaceIdAndIdIn(String workspaceId, Collection<String> ids);
    Optional<TaskEntity> findByIdAndWorkspaceId(String id, String workspaceId);
}
