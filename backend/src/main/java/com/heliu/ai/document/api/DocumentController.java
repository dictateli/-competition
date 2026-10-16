package com.heliu.ai.document.api;

import com.heliu.ai.common.ApiResponse;
import com.heliu.ai.document.service.DocumentService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/v1/documents")
public class DocumentController {
    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping
    public ApiResponse<List<DocumentDtos.DocumentResponse>> list() {
        return ApiResponse.ok(documentService.list());
    }

    @GetMapping("/{documentId}")
    public ApiResponse<DocumentDtos.DocumentDetailResponse> detail(@PathVariable String documentId) {
        return ApiResponse.ok(documentService.detail(documentId));
    }

    @GetMapping("/{documentId}/analysis")
    public ApiResponse<DocumentDtos.DocumentAnalysisResponse> analysis(@PathVariable String documentId) {
        return ApiResponse.ok(documentService.analysis(documentId));
    }

    @GetMapping("/compare")
    public ApiResponse<DocumentDtos.DocumentCompareResponse> compare(@RequestParam List<String> ids) {
        return ApiResponse.ok(documentService.compare(ids));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<DocumentDtos.DocumentResponse> upload(@RequestPart("file") MultipartFile file) {
        return ApiResponse.ok(documentService.upload(file));
    }

    @DeleteMapping("/{documentId}")
    public ApiResponse<Void> delete(@PathVariable String documentId) {
        documentService.delete(documentId);
        return ApiResponse.ok(null);
    }

    @PostMapping(value = "/{documentId}/ask", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter ask(@PathVariable String documentId, @RequestBody DocumentDtos.AskRequest request) {
        DocumentDtos.AskResponse response = documentService.ask(documentId, request.question());
        SseEmitter emitter = new SseEmitter(30_000L);
        CompletableFuture.runAsync(() -> stream(emitter, response));
        return emitter;
    }

    private void stream(SseEmitter emitter, DocumentDtos.AskResponse response) {
        try {
            emitter.send(SseEmitter.event().name("meta").data(new StreamMeta(response.model(), response.citations())));
            String[] chunks = response.answer().split("(?<=[。！？\\n])");
            for (String chunk : chunks) {
                if (!chunk.isBlank()) emitter.send(SseEmitter.event().name("token").data(chunk));
                Thread.sleep(80);
            }
            emitter.send(SseEmitter.event().name("done").data("[DONE]"));
            emitter.complete();
        } catch (Exception exception) {
            emitter.completeWithError(exception);
        }
    }

    public record StreamMeta(String model, List<DocumentDtos.CitationResponse> citations) {}
}

