package com.heliu.ai.meeting.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "transcript_segments", indexes = @Index(name = "idx_segment_meeting", columnList = "meetingId"))
public class TranscriptSegmentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 64)
    private String meetingId;

    @Column(nullable = false, length = 80)
    private String speaker;

    @Column(nullable = false)
    private long startMs;

    @Column(nullable = false)
    private long endMs;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private double confidence;

    protected TranscriptSegmentEntity() {}

    public TranscriptSegmentEntity(String meetingId, String speaker, long startMs, long endMs, String content, double confidence) {
        this.meetingId = meetingId;
        this.speaker = speaker;
        this.startMs = startMs;
        this.endMs = endMs;
        this.content = content;
        this.confidence = confidence;
    }

    public Long getId() { return id; }
    public String getMeetingId() { return meetingId; }
    public String getSpeaker() { return speaker; }
    public long getStartMs() { return startMs; }
    public long getEndMs() { return endMs; }
    public String getContent() { return content; }
    public double getConfidence() { return confidence; }
}
