package com.heliu.ai.writing.api;

import com.heliu.ai.common.ApiResponse;
import com.heliu.ai.writing.service.WritingDraftService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/writing/drafts")
public class WritingDraftController {
    private final WritingDraftService service;

    public WritingDraftController(WritingDraftService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<List<WritingDtos.DraftResponse>> list() {
        return ApiResponse.ok(service.list());
    }

    @GetMapping("/{id}")
    public ApiResponse<WritingDtos.DraftResponse> get(@PathVariable String id) {
        return ApiResponse.ok(service.get(id));
    }

    @PostMapping
    public ApiResponse<WritingDtos.DraftResponse> create(@RequestBody WritingDtos.SaveDraftRequest request) {
        return ApiResponse.ok(service.create(request));
    }

    @PatchMapping("/{id}")
    public ApiResponse<WritingDtos.DraftResponse> update(
            @PathVariable String id,
            @RequestBody WritingDtos.SaveDraftRequest request
    ) {
        return ApiResponse.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ApiResponse.ok(null);
    }
}
