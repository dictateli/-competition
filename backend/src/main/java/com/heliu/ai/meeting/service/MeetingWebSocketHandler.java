package com.heliu.ai.meeting.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.heliu.ai.ai.api.SpeechRecognitionService;
import com.heliu.ai.common.WorkspaceContext;
import com.heliu.ai.meeting.api.MeetingDtos;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class MeetingWebSocketHandler extends TextWebSocketHandler {
    private final MeetingService meetingService;
    private final SpeechRecognitionService speechRecognitionService;
    private final ObjectMapper objectMapper;
    private final Map<String, Set<WebSocketSession>> sessions = new ConcurrentHashMap<>();
    private final Map<String, String> sessionWorkspaces = new ConcurrentHashMap<>();

    public MeetingWebSocketHandler(MeetingService meetingService, SpeechRecognitionService speechRecognitionService, ObjectMapper objectMapper) {
        this.meetingService = meetingService;
        this.speechRecognitionService = speechRecognitionService;
        this.objectMapper = objectMapper;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.computeIfAbsent(meetingId(session), key -> ConcurrentHashMap.newKeySet()).add(session);
        sessionWorkspaces.put(session.getId(), workspaceId(session));
        send(session, Map.of("type", "connected", "meetingId", meetingId(session)));
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String workspace = sessionWorkspaces.getOrDefault(session.getId(), WorkspaceContext.DEFAULT_WORKSPACE);
        WorkspaceContext.set(workspace);
        try {
            IncomingSegment incoming = objectMapper.readValue(message.getPayload(), IncomingSegment.class);
            MeetingDtos.TranscriptResponse saved = meetingService.appendSegment(
                    meetingId(session), incoming.speaker(), incoming.content(), incoming.startMs(), incoming.endMs(), incoming.confidence()
            );
            broadcast(meetingId(session), Map.of("type", "transcript", "data", saved));
        } finally {
            WorkspaceContext.clear();
        }
    }

    @Override
    protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message) {
        String workspace = sessionWorkspaces.getOrDefault(session.getId(), WorkspaceContext.DEFAULT_WORKSPACE);
        WorkspaceContext.set(workspace);
        try {
            ByteBuffer payload = message.getPayload();
            byte[] bytes = new byte[payload.remaining()];
            payload.get(bytes);
            SpeechRecognitionService.RecognitionResult result = speechRecognitionService.recognize(bytes, "zh-CN");
            MeetingDtos.TranscriptResponse saved = meetingService.appendSegment(
                    meetingId(session), result.speaker(), result.text(), result.startMs(), result.endMs(), result.confidence()
            );
            broadcast(meetingId(session), Map.of("type", "transcript", "data", saved));
        } finally {
            WorkspaceContext.clear();
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        Set<WebSocketSession> group = sessions.get(meetingId(session));
        if (group != null) {
            group.remove(session);
            if (group.isEmpty()) sessions.remove(meetingId(session));
        }
        sessionWorkspaces.remove(session.getId());
    }

    private void broadcast(String meetingId, Object payload) {
        Set<WebSocketSession> group = sessions.getOrDefault(meetingId, Set.of());
        group.forEach(session -> {
            try { send(session, payload); } catch (IOException ignored) { }
        });
    }

    private void send(WebSocketSession session, Object payload) throws IOException {
        if (!session.isOpen()) return;
        synchronized (session) {
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(payload)));
        }
    }

    private String workspaceId(WebSocketSession session) {
        String query = session.getUri() == null ? null : session.getUri().getQuery();
        if (query == null || query.isBlank()) return WorkspaceContext.DEFAULT_WORKSPACE;
        for (String part : query.split("&")) {
            if (part.startsWith("workspaceId=")) {
                String value = part.substring("workspaceId=".length());
                return value.isBlank() ? WorkspaceContext.DEFAULT_WORKSPACE : value;
            }
        }
        return WorkspaceContext.DEFAULT_WORKSPACE;
    }

    private String meetingId(WebSocketSession session) {
        String path = session.getUri() == null ? "" : session.getUri().getPath();
        return path.substring(path.lastIndexOf('/') + 1);
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record IncomingSegment(String speaker, String content, long startMs, long endMs, double confidence) {
        private IncomingSegment {
            if (speaker == null || speaker.isBlank()) speaker = "说话人 1";
            if (content == null) content = "";
            if (confidence <= 0) confidence = 0.9;
        }
    }
}




