package com.heliu.ai.knowledge.api;

import com.heliu.ai.common.ApiResponse;
import com.heliu.ai.knowledge.service.KnowledgeService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/v1/knowledge")
public class KnowledgeController {
    private final KnowledgeService knowledgeService;

    public KnowledgeController(KnowledgeService knowledgeService) {
        this.knowledgeService = knowledgeService;
    }

    @GetMapping("/search")
    public ApiResponse<KnowledgeDtos.SearchResponse> search(
            @RequestParam(name = "q", defaultValue = "") String query,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ApiResponse.ok(knowledgeService.search(query, limit));
    }

    @GetMapping("/stats")
    public ApiResponse<KnowledgeDtos.KnowledgeStats> stats() {
        return ApiResponse.ok(knowledgeService.stats());
    }

    @PostMapping("/ask")
    public ApiResponse<KnowledgeDtos.AskResponse> ask(@Valid @RequestBody KnowledgeDtos.AskRequest request) {
        return ApiResponse.ok(knowledgeService.ask(request));
    }

    @PostMapping(value = "/ask/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter askStream(@Valid @RequestBody KnowledgeDtos.AskRequest request) {
        KnowledgeDtos.AskResponse response = knowledgeService.ask(request);
        SseEmitter emitter = new SseEmitter(30_000L);
        CompletableFuture.runAsync(() -> {
            try {
                emitter.send(SseEmitter.event().name("meta").data(response.model()));
                for (String chunk : response.answer().split("(?<=[。！？\\n])")) {
                    if (!chunk.isBlank()) emitter.send(SseEmitter.event().name("token").data(chunk));
                    Thread.sleep(70);
                }
                emitter.send(SseEmitter.event().name("done").data("[DONE]"));
                emitter.complete();
            } catch (Exception exception) {
                emitter.completeWithError(exception);
            }
        });
        return emitter;
    }
}
