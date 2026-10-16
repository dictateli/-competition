package com.heliu.ai.meeting.api;

import com.heliu.ai.common.ApiResponse;
import com.heliu.ai.meeting.domain.ActionStatus;
import com.heliu.ai.meeting.service.MeetingService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/actions")
public class ActionItemController {
    private final MeetingService meetingService;

    public ActionItemController(MeetingService meetingService) {
        this.meetingService = meetingService;
    }

    @PatchMapping("/{actionId}/status")
    public ApiResponse<MeetingDtos.ActionItemResponse> changeStatus(
            @PathVariable String actionId,
            @RequestBody StatusRequest request
    ) {
        return ApiResponse.ok(meetingService.changeActionStatus(actionId, request.status()));
    }

    public record StatusRequest(ActionStatus status) {}
}
