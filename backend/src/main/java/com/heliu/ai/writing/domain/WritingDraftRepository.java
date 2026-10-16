package com.heliu.ai.writing.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WritingDraftRepository extends JpaRepository<WritingDraftEntity, String> {
    List<WritingDraftEntity> findAllByWorkspaceIdOrderByUpdatedAtDesc(String workspaceId);
    Optional<WritingDraftEntity> findByIdAndWorkspaceId(String id, String workspaceId);
}
