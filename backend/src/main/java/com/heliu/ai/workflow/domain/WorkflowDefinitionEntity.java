package com.heliu.ai.workflow.domain;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "workflow_definitions", indexes = @Index(name = "idx_workflow_workspace", columnList = "workspaceId"))
public class WorkflowDefinitionEntity {
    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String workspaceId;

    @Column(nullable = false, length = 200)
    private String name;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String prompt;

    @Column(nullable = false, length = 80)
    private String triggerType;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String actionsJson;

    @Column(nullable = false)
    private boolean enabled;

    @Column(nullable = false)
    private Instant createdAt;

    private Instant lastRunAt;

    protected WorkflowDefinitionEntity() {}

    public WorkflowDefinitionEntity(String id, String workspaceId, String name, String triggerType, String actionsJson) {
        this(id, workspaceId, name, triggerType, actionsJson, null, null);
    }

    public WorkflowDefinitionEntity(
            String id,
            String workspaceId,
            String name,
            String triggerType,
            String actionsJson,
            String description,
            String prompt
    ) {
        this.id = id;
        this.workspaceId = workspaceId;
        this.name = name;
        this.triggerType = triggerType;
        this.actionsJson = actionsJson;
        this.description = description;
        this.prompt = prompt;
        this.enabled = true;
        this.createdAt = Instant.now();
    }

    public void toggle() { this.enabled = !this.enabled; }
    public void markRun() { this.lastRunAt = Instant.now(); }

    public String getId() { return id; }
    public String getWorkspaceId() { return workspaceId; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getPrompt() { return prompt; }
    public String getTriggerType() { return triggerType; }
    public String getActionsJson() { return actionsJson; }
    public boolean isEnabled() { return enabled; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getLastRunAt() { return lastRunAt; }
}
