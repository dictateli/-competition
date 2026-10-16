package com.heliu.ai.document.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface DocumentRepository extends JpaRepository<DocumentEntity, String> {
    List<DocumentEntity> findAllByWorkspaceIdOrderByCreatedAtDesc(String workspaceId);
    List<DocumentEntity> findTop20ByWorkspaceIdOrderByCreatedAtDesc(String workspaceId);
    List<DocumentEntity> findAllByWorkspaceIdAndIdIn(String workspaceId, Collection<String> ids);
    Optional<DocumentEntity> findByIdAndWorkspaceId(String id, String workspaceId);
}
