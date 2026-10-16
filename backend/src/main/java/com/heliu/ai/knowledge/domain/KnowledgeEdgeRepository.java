package com.heliu.ai.knowledge.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface KnowledgeEdgeRepository extends JpaRepository<KnowledgeEdgeEntity, String> {
    List<KnowledgeEdgeEntity> findAllByWorkspaceId(String workspaceId);
    Optional<KnowledgeEdgeEntity> findByWorkspaceIdAndEdgeKey(String workspaceId, String edgeKey);
}
