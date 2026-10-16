package com.heliu.ai.meeting.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ActionTaskLinkRepository extends JpaRepository<ActionTaskLinkEntity, String> {
    Optional<ActionTaskLinkEntity> findByActionIdAndWorkspaceId(String actionId, String workspaceId);
    List<ActionTaskLinkEntity> findAllByMeetingIdAndWorkspaceId(String meetingId, String workspaceId);
}
