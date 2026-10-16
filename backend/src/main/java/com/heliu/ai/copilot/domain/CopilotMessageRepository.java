package com.heliu.ai.copilot.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CopilotMessageRepository extends JpaRepository<CopilotMessageEntity, Long> {
    List<CopilotMessageEntity> findTop30ByWorkspaceIdAndConversationIdOrderByCreatedAtAsc(String workspaceId, String conversationId);
}
