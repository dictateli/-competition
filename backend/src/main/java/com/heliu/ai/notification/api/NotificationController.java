package com.heliu.ai.notification.api;

import com.heliu.ai.common.ApiResponse;
import com.heliu.ai.notification.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {
    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ApiResponse<List<NotificationDtos.NotificationResponse>> list(
            @RequestParam(defaultValue = "false") boolean unreadOnly
    ) {
        return ApiResponse.ok(notificationService.list(unreadOnly));
    }

    @GetMapping("/unread-count")
    public ApiResponse<NotificationDtos.UnreadCountResponse> unreadCount() {
        return ApiResponse.ok(new NotificationDtos.UnreadCountResponse(notificationService.unreadCount()));
    }

    @PostMapping("/{notificationId}/read")
    public ApiResponse<NotificationDtos.NotificationResponse> markRead(@PathVariable String notificationId) {
        return ApiResponse.ok(notificationService.markRead(notificationId));
    }

    @PostMapping("/read-all")
    public ApiResponse<NotificationDtos.UnreadCountResponse> markAllRead() {
        notificationService.markAllRead();
        return ApiResponse.ok(new NotificationDtos.UnreadCountResponse(0));
    }
}
