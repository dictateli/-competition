package com.heliu.ai.ai.api;

import java.util.List;

public interface SpeechRecognitionService {
    RecognitionResult recognize(byte[] audioChunk, String language);
    record RecognitionResult(String text, String speaker, long startMs, long endMs, double confidence) {}
}
