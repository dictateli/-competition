package com.heliu.ai.ai.demo;

import com.heliu.ai.ai.api.AiAnswer;
import com.heliu.ai.ai.api.AiCitation;
import com.heliu.ai.ai.api.AiRequest;
import com.heliu.ai.ai.api.LargeLanguageModel;
import java.util.List;

public class DemoLargeLanguageModel implements LargeLanguageModel {
    @Override
    public AiAnswer generate(AiRequest request) {
        String prompt = request.prompt() == null ? "" : request.prompt();
        String content;
        if (prompt.contains("风险") || prompt.contains("延期")) {
            content = "识别到 2 个关键风险：设计资源冲突可能影响关键路径 3 天；客户续约材料缺少 ROI 数据。建议今天完成范围确认，并在 14:00 会议前补齐数据。";
        } else if (prompt.contains("周报") || prompt.contains("复盘")) {
            content = "本周完成 14 项关键进展，整体进度 68%。新增需求可能影响 3 天排期，建议优先确认范围与资源。三个下周重点是：范围冻结、性能优化、客户续约材料准备。";
        } else {
            content = "已结合项目状态、近期会议和历史文档生成建议。建议先明确目标与输出对象，再按“分析、生成、确认、执行”四个步骤推进。";
        }
        return new AiAnswer(content, "demo-llm-v1", List.of(new AiCitation("demo-context", "星海计划上下文", "工作台聚合", 0.91)));
    }
}


