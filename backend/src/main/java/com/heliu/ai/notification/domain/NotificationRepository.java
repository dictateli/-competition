package com.heliu.ai.notification.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<NotificationEntity, String> {
    List<NotificationEntity> findAllByWorkspaceIdOrderByCreatedAtDesc(String workspaceId);
    List<NotificationEntity> findAllByWorkspaceIdAndReadFalseOrderByCreatedAtDesc(String workspaceId);
    Optional<NotificationEntity> findByIdAndWorkspaceId(String id, String workspaceId);
    long countByWorkspaceIdAndReadFalse(String workspaceId);
    long countByWorkspaceId(String workspaceId);
}
