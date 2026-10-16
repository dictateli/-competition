package com.heliu.ai.meeting.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TranscriptSegmentRepository extends JpaRepository<TranscriptSegmentEntity, Long> {
    List<TranscriptSegmentEntity> findAllByMeetingIdOrderByStartMsAsc(String meetingId);
}
