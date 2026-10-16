package com.heliu.ai.meeting.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ActionItemRepository extends JpaRepository<ActionItemEntity, String> {
    List<ActionItemEntity> findAllByMeetingIdOrderByCreatedAtAsc(String meetingId);
    List<ActionItemEntity> findAllByMeetingIdInOrderByCreatedAtAsc(List<String> meetingIds);
    java.util.Optional<ActionItemEntity> findByIdAndMeetingId(String id, String meetingId);
}
