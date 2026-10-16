package com.heliu.ai.knowledge.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface KnowledgeNodeRepository extends JpaRepository<KnowledgeNodeEntity, String> {
    List<KnowledgeNodeEntity> findAllByWorkspaceId(String workspaceId);
    Optional<KnowledgeNodeEntity> findByWorkspaceIdAndNodeKey(String workspaceId, String nodeKey);
}
