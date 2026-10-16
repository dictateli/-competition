package com.heliu.ai.ai.api;

import com.heliu.ai.common.WorkspaceContext;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/v1/ai/writing")
public class WritingController {
    private final LargeLanguageModel languageModel;

    public WritingController(LargeLanguageModel languageModel) {
        this.languageModel = languageModel;
    }

    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream(@Valid @RequestBody WritingRequest request) {
        AiAnswer answer = languageModel.generate(new AiRequest(
                "请以" + request.style() + "风格完成写作任务：" + request.prompt(),
                WorkspaceContext.current(),
                request.contextIds()
        ));
        SseEmitter emitter = new SseEmitter(30_000L);
        CompletableFuture.runAsync(() -> {
            try {
                emitter.send(SseEmitter.event().name("meta").data(answer.model()));
                for (String chunk : answer.content().split("(?<=[。！？\\n])")) {
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
