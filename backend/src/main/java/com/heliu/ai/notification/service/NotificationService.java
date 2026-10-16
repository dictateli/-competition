package com.heliu.ai.notification.service;

import com.heliu.ai.common.BusinessException;
import com.heliu.ai.common.WorkspaceContext;
import com.heliu.ai.notification.api.NotificationDtos;
import com.heliu.ai.notification.domain.NotificationEntity;
import com.heliu.ai.notification.domain.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public NotificationDtos.NotificationResponse create(
            String workspaceId,
            String title,
            String message,
            String type,
            String level,
            String sourceType,
            String sourceId
    ) {
        NotificationEntity entity = new NotificationEntity(
                WorkspaceContext.newId("ntf"),
                workspaceId,
                title,
                message,
                type,
                level,
                sourceType,
                sourceId
        );
        return NotificationDtos.NotificationResponse.from(notificationRepository.save(entity));
    }

    @Transactional
    public NotificationDtos.NotificationResponse notifyCurrent(
            String title,
            String message,
            String type,
            String level,
            String sourceType,
            String sourceId
    ) {
        return create(WorkspaceContext.current(), title, message, type, level, sourceType, sourceId);
    }

    @Transactional(readOnly = true)
    public List<NotificationDtos.NotificationResponse> list(boolean unreadOnly) {
        var entities = unreadOnly
                ? notificationRepository.findAllByWorkspaceIdAndReadFalseOrderByCreatedAtDesc(WorkspaceContext.current())
                : notificationRepository.findAllByWorkspaceIdOrderByCreatedAtDesc(WorkspaceContext.current());
        return entities.stream().map(NotificationDtos.NotificationResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public long unreadCount() {
        return notificationRepository.countByWorkspaceIdAndReadFalse(WorkspaceContext.current());
    }

    @Transactional
    public NotificationDtos.NotificationResponse markRead(String notificationId) {
        NotificationEntity entity = notificationRepository.findByIdAndWorkspaceId(notificationId, WorkspaceContext.current())
                .orElseThrow(() -> new BusinessException("通知不存在或无权访问", 404));
        entity.markRead();
        return NotificationDtos.NotificationResponse.from(notificationRepository.save(entity));
    }

    @Transactional
    public void markAllRead() {
        notificationRepository.findAllByWorkspaceIdAndReadFalseOrderByCreatedAtDesc(WorkspaceContext.current())
                .forEach(notification -> {
                    notification.markRead();
                    notificationRepository.save(notification);
                });
    }
}
