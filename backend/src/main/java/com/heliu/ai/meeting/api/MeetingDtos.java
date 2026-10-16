package com.heliu.ai.meeting.api;

import com.heliu.ai.meeting.domain.ActionItemEntity;
import com.heliu.ai.meeting.domain.MeetingEntity;
import com.heliu.ai.meeting.domain.TranscriptSegmentEntity;
import jakarta.validation.constraints.NotBlank;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public final class MeetingDtos {
    private MeetingDtos() {}

    public record CreateMeetingRequest(@NotBlank String title) {}

    public record AppendSegmentRequest(@NotBlank String speaker, @NotBlank String content, long startMs, long endMs, double confidence) {}

    public record ConvertActionsRequest(String projectId) {}

    public record MeetingResponse(String id, String title, String status, Instant createdAt, Instant startedAt, Instant endedAt) {
        public static MeetingResponse from(MeetingEntity entity) {
            return new MeetingResponse(entity.getId(), entity.getTitle(), entity.getStatus().name(), entity.getCreatedAt(), entity.getStartedAt(), entity.getEndedAt());
        }
    }

    public record TranscriptResponse(String speaker, long startMs, long endMs, String content, double confidence) {
        public static TranscriptResponse from(TranscriptSegmentEntity entity) {
            return new TranscriptResponse(entity.getSpeaker(), entity.getStartMs(), entity.getEndMs(), entity.getContent(), entity.getConfidence());
        }
    }

    public record ActionItemResponse(
            String id,
            String title,
            String owner,
            LocalDate dueDate,
            String status,
            boolean converted,
            String projectTaskId
    ) {
        public static ActionItemResponse from(ActionItemEntity entity) {
            return new ActionItemResponse(entity.getId(), entity.getTitle(), entity.getOwner(), entity.getDueDate(), entity.getStatus().name(), false, null);
        }

        public static ActionItemResponse from(ActionItemEntity entity, String projectTaskId) {
            return new ActionItemResponse(
                    entity.getId(), entity.getTitle(), entity.getOwner(), entity.getDueDate(), entity.getStatus().name(),
                    projectTaskId != null, projectTaskId
            );
        }
    }

    public record MeetingMinutesResponse(String meetingId, String title, String status, String summary, List<TranscriptResponse> transcript, List<ActionItemResponse> actionItems) {}
}
