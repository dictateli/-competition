package com.heliu.ai.workflow.domain;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "workflow_runs", indexes = @Index(name = "idx_run_workflow", columnList = "workflowId"))
public class WorkflowRunEntity {
    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String workflowId;

    @Column(length = 64)
    private String workspaceId;

    @Column(nullable = false, length = 24)
    private String status;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String inputJson;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String outputJson;

    @Column(nullable = false)
    private Instant startedAt;

    private Instant finishedAt;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String errorMessage;

    private Long durationMs;

    protected WorkflowRunEntity() {}

    public WorkflowRunEntity(String id, String workflowId, String inputJson) {
        this(id, null, workflowId, inputJson);
    }

    public WorkflowRunEntity(String id, String workspaceId, String workflowId, String inputJson) {
        this.id = id;
        this.workspaceId = workspaceId;
        this.workflowId = workflowId;
        this.inputJson = inputJson;
        this.status = "RUNNING";
        this.startedAt = Instant.now();
    }

    public void finish(String outputJson) {
        this.outputJson = outputJson;
        this.status = "SUCCESS";
        this.finishedAt = Instant.now();
        this.durationMs = Math.max(1, finishedAt.toEpochMilli() - startedAt.toEpochMilli());
    }

    public void fail(String message) {
        this.errorMessage = message;
        this.status = "FAILED";
        this.finishedAt = Instant.now();
        this.durationMs = Math.max(1, finishedAt.toEpochMilli() - startedAt.toEpochMilli());
    }

    public String getId() { return id; }
    public String getWorkspaceId() { return workspaceId; }
    public String getWorkflowId() { return workflowId; }
    public String getStatus() { return status; }
    public String getInputJson() { return inputJson; }
    public String getOutputJson() { return outputJson; }
    public Instant getStartedAt() { return startedAt; }
    public Instant getFinishedAt() { return finishedAt; }
    public String getErrorMessage() { return errorMessage; }
    public Long getDurationMs() { return durationMs; }
}
