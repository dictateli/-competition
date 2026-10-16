package com.heliu.ai.document.domain;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "documents", indexes = @Index(name = "idx_document_workspace", columnList = "workspaceId"))
public class DocumentEntity {
    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String workspaceId;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(length = 120)
    private String contentType;

    @Column(nullable = false)
    private long sizeBytes;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String extractedText;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String summary;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String riskJson;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private DocumentStatus status;

    @Column(nullable = false)
    private Instant createdAt;

    protected DocumentEntity() {}

    public DocumentEntity(String id, String workspaceId, String name, String contentType, long sizeBytes, String extractedText) {
        this.id = id;
        this.workspaceId = workspaceId;
        this.name = name;
        this.contentType = contentType;
        this.sizeBytes = sizeBytes;
        this.extractedText = extractedText;
        this.status = DocumentStatus.PROCESSING;
        this.createdAt = Instant.now();
    }

    public void ready(String summary, String riskJson) {
        this.summary = summary;
        this.riskJson = riskJson;
        this.status = DocumentStatus.READY;
    }

    public String getId() { return id; }
    public String getWorkspaceId() { return workspaceId; }
    public String getName() { return name; }
    public String getContentType() { return contentType; }
    public long getSizeBytes() { return sizeBytes; }
    public String getExtractedText() { return extractedText; }
    public String getSummary() { return summary; }
    public String getRiskJson() { return riskJson; }
    public DocumentStatus getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
}
