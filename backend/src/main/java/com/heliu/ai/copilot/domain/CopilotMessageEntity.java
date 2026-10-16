package com.heliu.ai.copilot.domain;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "copilot_messages", indexes = {
        @Index(name = "idx_copilot_conversation", columnList = "workspaceId,conversationId,createdAt")
})
public class CopilotMessageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 64)
    private String workspaceId;

    @Column(nullable = false, length = 64)
    private String conversationId;

    @Column(nullable = false, length = 24)
    private String role;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private Instant createdAt;

    protected CopilotMessageEntity() {}

    public CopilotMessageEntity(String workspaceId, String conversationId, String role, String content) {
        this.workspaceId = workspaceId;
        this.conversationId = conversationId;
        this.role = role;
        this.content = content;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getWorkspaceId() { return workspaceId; }
    public String getConversationId() { return conversationId; }
    public String getRole() { return role; }
    public String getContent() { return content; }
    public Instant getCreatedAt() { return createdAt; }
}
