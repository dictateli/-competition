package com.heliu.ai.meeting.api;

import com.heliu.ai.common.ApiResponse;
import com.heliu.ai.meeting.service.MeetingService;
import com.heliu.ai.project.api.ProjectDtos;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/meetings")
public class MeetingController {
    private final MeetingService meetingService;

    public MeetingController(MeetingService meetingService) {
        this.meetingService = meetingService;
    }

    @GetMapping
    public ApiResponse<List<MeetingDtos.MeetingResponse>> list() {
        return ApiResponse.ok(meetingService.list());
    }

    @PostMapping
    public ApiResponse<MeetingDtos.MeetingResponse> create(@Valid @RequestBody MeetingDtos.CreateMeetingRequest request) {
        return ApiResponse.ok(meetingService.create(request.title()));
    }

    @PostMapping("/{meetingId}/segments")
    public ApiResponse<MeetingDtos.TranscriptResponse> append(
            @PathVariable String meetingId,
            @Valid @RequestBody MeetingDtos.AppendSegmentRequest request
    ) {
        return ApiResponse.ok(meetingService.appendSegment(
                meetingId, request.speaker(), request.content(), request.startMs(), request.endMs(), request.confidence()
        ));
    }

    @PostMapping("/{meetingId}/finish")
    public ApiResponse<MeetingDtos.MeetingMinutesResponse> finish(@PathVariable String meetingId) {
        return ApiResponse.ok(meetingService.finish(meetingId));
    }

    @GetMapping("/{meetingId}/minutes")
    public ApiResponse<MeetingDtos.MeetingMinutesResponse> minutes(@PathVariable String meetingId) {
        return ApiResponse.ok(meetingService.minutes(meetingId));
    }

    @PostMapping("/{meetingId}/actions/{actionId}/convert")
    public ApiResponse<ProjectDtos.TaskResponse> convertAction(
            @PathVariable String meetingId,
            @PathVariable String actionId,
            @RequestBody(required = false) MeetingDtos.ConvertActionsRequest request
    ) {
        return ApiResponse.ok(meetingService.convertAction(meetingId, actionId, request == null ? null : request.projectId()));
    }

    @PostMapping("/{meetingId}/actions/convert")
    public ApiResponse<List<ProjectDtos.TaskResponse>> convertActions(
            @PathVariable String meetingId,
            @RequestBody(required = false) MeetingDtos.ConvertActionsRequest request
    ) {
        return ApiResponse.ok(meetingService.convertActions(meetingId, request == null ? null : request.projectId()));
    }
}
