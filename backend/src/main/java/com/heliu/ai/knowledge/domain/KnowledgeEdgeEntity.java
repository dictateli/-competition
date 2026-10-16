package com.heliu.ai.knowledge.domain;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "knowledge_edges", indexes = {
        @Index(name = "idx_knowledge_edge_workspace", columnList = "workspaceId"),
        @Index(name = "idx_knowledge_edge_key", columnList = "workspaceId,edgeKey", unique = true)
})
public class KnowledgeEdgeEntity {
    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String workspaceId;

    @Column(nullable = false, length = 64)
    private String edgeKey;

    @Column(nullable = false, length = 64)
    private String fromNodeId;

    @Column(nullable = false, length = 64)
    private String toNodeId;

    @Column(nullable = false, length = 48)
    private String relation;

    @Column(nullable = false)
    private double confidence;

    @Column(length = 128)
    private String evidenceId;

    @Column(nullable = false)
    private Instant createdAt;

    protected KnowledgeEdgeEntity() {}

    public KnowledgeEdgeEntity(String id, String workspaceId, String edgeKey, String fromNodeId, String toNodeId, String relation, double confidence, String evidenceId) {
        this.id = id;
        this.workspaceId = workspaceId;
        this.edgeKey = edgeKey;
        this.fromNodeId = fromNodeId;
        this.toNodeId = toNodeId;
        this.relation = relation;
        this.confidence = confidence;
        this.evidenceId = evidenceId;
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public String getWorkspaceId() { return workspaceId; }
    public String getEdgeKey() { return edgeKey; }
    public String getFromNodeId() { return fromNodeId; }
    public String getToNodeId() { return toNodeId; }
    public String getRelation() { return relation; }
    public double getConfidence() { return confidence; }
    public String getEvidenceId() { return evidenceId; }
    public Instant getCreatedAt() { return createdAt; }
}

