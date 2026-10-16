package com.heliu.ai.meeting.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MeetingRepository extends JpaRepository<MeetingEntity, String> {
    List<MeetingEntity> findAllByWorkspaceIdOrderByCreatedAtDesc(String workspaceId);
    Optional<MeetingEntity> findByIdAndWorkspaceId(String id, String workspaceId);
}
