package com.heliu.ai.identity.domain;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "users", indexes = @Index(name = "idx_user_workspace", columnList = "workspaceId"))
public class UserEntity {
    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String workspaceId;

    @Column(nullable = false, unique = true, length = 64)
    private String username;

    @Column(nullable = false, length = 120)
    private String passwordHash;

    @Column(nullable = false, length = 64)
    private String name;

    @Column(nullable = false, length = 40)
    private String role;

    @Column(length = 120)
    private String email;

    @Column(nullable = false)
    private Instant createdAt;

    protected UserEntity() {}

    public UserEntity(String id, String workspaceId, String username, String passwordHash, String name, String role, String email) {
        this.id = id;
        this.workspaceId = workspaceId;
        this.username = username;
        this.passwordHash = passwordHash;
        this.name = name;
        this.role = role;
        this.email = email;
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public String getWorkspaceId() { return workspaceId; }
    public String getUsername() { return username; }
    public String getPasswordHash() { return passwordHash; }
    public String getName() { return name; }
    public String getRole() { return role; }
    public String getEmail() { return email; }
    public Instant getCreatedAt() { return createdAt; }
}
