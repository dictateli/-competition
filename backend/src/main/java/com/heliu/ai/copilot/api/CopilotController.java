package com.heliu.ai.copilot.api;

import com.heliu.ai.common.ApiResponse;
import com.heliu.ai.copilot.service.CopilotService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/copilot")
public class CopilotController {
    private final CopilotService service;

    public CopilotController(CopilotService service) {
        this.service = service;
    }

    @PostMapping("/chat")
    public ApiResponse<CopilotDtos.ChatResponse> chat(@RequestBody CopilotDtos.ChatRequest request) {
        return ApiResponse.ok(service.chat(request));
    }

    @GetMapping("/conversations/{conversationId}")
    public ApiResponse<List<CopilotDtos.MessageResponse>> history(@PathVariable String conversationId) {
        return ApiResponse.ok(service.history(conversationId));
    }
}
