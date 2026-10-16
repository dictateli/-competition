package com.heliu.ai.project.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<ProjectEntity, String> {
    List<ProjectEntity> findAllByWorkspaceIdOrderByCreatedAtDesc(String workspaceId);
    Optional<ProjectEntity> findByIdAndWorkspaceId(String id, String workspaceId);
    long countByWorkspaceId(String workspaceId);
}
