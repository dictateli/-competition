package com.heliu.ai.knowledge.domain;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "knowledge_nodes", indexes = {
        @Index(name = "idx_knowledge_node_workspace", columnList = "workspaceId"),
        @Index(name = "idx_knowledge_node_key", columnList = "workspaceId,nodeKey", unique = true)
})
public class KnowledgeNodeEntity {
    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String workspaceId;

    @Column(nullable = false, length = 64)
    private String nodeKey;

    @Column(nullable = false, length = 32)
    private String type;

    @Column(nullable = false, length = 240)
    private String title;

    @Column(length = 500)
    private String subtitle;

    @Column(length = 64)
    private String sourceId;

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    protected KnowledgeNodeEntity() {}

    public KnowledgeNodeEntity(String id, String workspaceId, String nodeKey, String type, String title, String subtitle, String sourceId) {
        this.id = id;
        this.workspaceId = workspaceId;
        this.nodeKey = nodeKey;
        this.type = type;
        this.title = title;
        this.subtitle = subtitle;
        this.sourceId = sourceId;
        this.createdAt = Instant.now();
        this.updatedAt = this.createdAt;
    }

    public void update(String title, String subtitle) {
        if (title != null && !title.isBlank()) this.title = title;
        this.subtitle = subtitle;
        this.updatedAt = Instant.now();
    }

    public String getId() { return id; }
    public String getWorkspaceId() { return workspaceId; }
    public String getNodeKey() { return nodeKey; }
    public String getType() { return type; }
    public String getTitle() { return title; }
    public String getSubtitle() { return subtitle; }
    public String getSourceId() { return sourceId; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}

