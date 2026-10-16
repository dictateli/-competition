package com.heliu.ai.ai.demo;

import com.heliu.ai.ai.api.SpeechRecognitionService;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
public class DemoSpeechRecognitionService implements SpeechRecognitionService {
    @Override
    public RecognitionResult recognize(byte[] audioChunk, String language) {
        String text = audioChunk == null ? "" : new String(audioChunk, StandardCharsets.UTF_8).trim();
        if (text.isBlank()) text = "这是一段演示转写内容。";
        long start = System.currentTimeMillis();
        return new RecognitionResult(text, "说话人 1", start, start + 1800, 0.94);
    }
}
