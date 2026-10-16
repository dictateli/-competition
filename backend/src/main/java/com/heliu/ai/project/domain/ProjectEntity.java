package com.heliu.ai.project.domain;

import jakarta.persistence.*;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "projects", indexes = @Index(name = "idx_project_workspace", columnList = "workspaceId"))
public class ProjectEntity {
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

    @Column(nullable = false, length = 64)
    private String owner;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private ProjectStatus status;

    @Column(nullable = false)
    private int progress;

    private LocalDate startDate;
    private LocalDate dueDate;

    @Column(nullable = false)
    private Instant createdAt;

    private Instant updatedAt;

    protected ProjectEntity() {}

    public ProjectEntity(String id, String workspaceId, String name, String description, String owner, LocalDate startDate, LocalDate dueDate) {
        this.id = id;
        this.workspaceId = workspaceId;
        this.name = name;
        this.description = description;
        this.owner = owner;
        this.status = ProjectStatus.ACTIVE;
        this.progress = 0;
        this.startDate = startDate;
        this.dueDate = dueDate;
        this.createdAt = Instant.now();
        this.updatedAt = this.createdAt;
    }

    public void update(String name, String description, String owner, ProjectStatus status, LocalDate startDate, LocalDate dueDate) {
        if (name != null && !name.isBlank()) this.name = name.trim();
        if (description != null) this.description = description;
        if (owner != null && !owner.isBlank()) this.owner = owner.trim();
        if (status != null) this.status = status;
        if (startDate != null) this.startDate = startDate;
        if (dueDate != null) this.dueDate = dueDate;
        this.updatedAt = Instant.now();
    }

    public void updateMetrics(int progress, ProjectStatus status) {
        this.progress = Math.max(0, Math.min(100, progress));
        this.status = status;
        this.updatedAt = Instant.now();
    }

    public String getId() { return id; }
    public String getWorkspaceId() { return workspaceId; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getOwner() { return owner; }
    public ProjectStatus getStatus() { return status; }
    public int getProgress() { return progress; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getDueDate() { return dueDate; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
