<template>
<aside class="copilot" aria-label="AI 协同助手">
      <div class="copilot-head">
        <div class="copilot-avatar"><app-icon name="spark" :size="18"></app-icon></div>
        <div class="copilot-title"><strong>合流 Copilot</strong><span>已连接项目上下文 · 在线</span></div>
        <button class="icon-button ghost" title="收起助手" aria-label="收起助手" @click="$emit('close')"><app-icon name="x"></app-icon></button>
      </div>
      <div class="copilot-body">
        <div class="context-card">
          <div class="context-card-head"><span>ACTIVE CONTEXT</span><span>自动同步</span></div>
          <div class="context-title">星海计划 · 第二阶段</div>
          <div class="context-meta">12 份文档 · 3 次会议 · 47 个任务</div>
          <div class="context-sources">
            <span class="source-pill">PRD</span><span class="source-pill">周会</span><span class="source-pill">任务</span>
            <span>RAG 已索引</span>
          </div>
        </div>
        <div v-for="(message, index) in messages" :key="index" class="message" :class="message.role">
          <div v-if="message.role === 'assistant'" class="message-avatar"><app-icon name="spark" :size="15"></app-icon></div>
          <div class="message-content">
            <div v-html="message.text"></div>
            <div v-if="message.action" class="ai-action-card">
              <div class="ai-action-title">{{ message.action.title }}</div>
              <div v-for="(item, ai) in message.action.items" :key="ai" class="ai-action-row">
                <input type="checkbox" :id="'ai-'+index+'-'+ai" checked />
                <label :for="'ai-'+index+'-'+ai"><span>{{ item }}</span></label>
              </div>
              <button class="btn lime sm mt-10" :disabled="message.action.type === 'task_created'" @click="$emit('execute', message.action)">{{ message.action.type === 'task_created' ? '已创建' : '一键创建' }}</button>
            </div>
            <div v-if="message.citations && message.citations.length" class="message-citations">
              <button v-for="(cite, ci) in message.citations.slice(0, 4)" :key="ci" class="citation-chip" @click="$emit('open-source', cite)">
                {{ cite.sourceName }} · {{ cite.location }}
              </button>
            </div>
            <div class="message-time">{{ message.time }}</div>
          </div>
        </div>
      </div>
      <div class="copilot-form">
        <div class="copilot-prompts">
          <button class="prompt-chip" @click="prompt('总结本周项目风险，并给出处理建议')">总结风险</button>
          <button class="prompt-chip" @click="prompt('把周会结论转成可执行任务')">生成任务</button>
          <button class="prompt-chip" @click="prompt('检索知识库，回答客户续约的关键问题')">检索知识</button>
        </div>
        <div class="copilot-input-wrap mt-10">
          <textarea ref="input" v-model="draft" class="copilot-input" placeholder="向 Copilot 提问，或输入 / 调用工作流…" @keydown.enter.exact.prevent="send"></textarea>
          <button class="copilot-send" title="发送" aria-label="发送消息" @click="send"><app-icon name="send" :size="15"></app-icon></button>
        </div>
        <div class="copilot-footnote">AI 可能出错，请核验关键结论 · 引用可追溯</div>
      </div>
    </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: { messages: { type: Array, default: function () { return []; } } },
  data: function () { return { draft: '' }; },
  methods: {
    send: function () {
      var value = this.draft.trim();
      if (!value) return;
      this.$emit('send', value);
      this.draft = '';
    },
    prompt: function (text) { this.draft = text; this.$nextTick(function () { this.$refs.input.focus(); }); }
  },
  template: `
    <aside class="copilot" aria-label="AI 协同助手">
      <div class="copilot-head">
        <div class="copilot-avatar"><app-icon name="spark" :size="18"></app-icon></div>
        <div class="copilot-title"><strong>合流 Copilot</strong><span>已连接项目上下文 · 在线</span></div>
        <button class="icon-button ghost" title="收起助手" aria-label="收起助手" @click="$emit('close')"><app-icon name="x"></app-icon></button>
      </div>
      <div class="copilot-body">
        <div class="context-card">
          <div class="context-card-head"><span>ACTIVE CONTEXT</span><span>自动同步</span></div>
          <div class="context-title">星海计划 · 第二阶段</div>
          <div class="context-meta">12 份文档 · 3 次会议 · 47 个任务</div>
          <div class="context-sources">
            <span class="source-pill">PRD</span><span class="source-pill">周会</span><span class="source-pill">任务</span>
            <span>RAG 已索引</span>
          </div>
        </div>
        <div v-for="(message, index) in messages" :key="index" class="message" :class="message.role">
          <div v-if="message.role === 'assistant'" class="message-avatar"><app-icon name="spark" :size="15"></app-icon></div>
          <div class="message-content">
            <div v-html="message.text"></div>
            <div v-if="message.action" class="ai-action-card">
              <div class="ai-action-title">{{ message.action.title }}</div>
              <div v-for="(item, ai) in message.action.items" :key="ai" class="ai-action-row">
                <input type="checkbox" :id="'ai-'+index+'-'+ai" checked />
                <label :for="'ai-'+index+'-'+ai"><span>{{ item }}</span></label>
              </div>
              <button class="btn lime sm mt-10" :disabled="message.action.type === 'task_created'" @click="$emit('execute', message.action)">{{ message.action.type === 'task_created' ? '已创建' : '一键创建' }}</button>
            </div>
            <div v-if="message.citations && message.citations.length" class="message-citations">
              <button v-for="(cite, ci) in message.citations.slice(0, 4)" :key="ci" class="citation-chip" @click="$emit('open-source', cite)">
                {{ cite.sourceName }} · {{ cite.location }}
              </button>
            </div>
            <div class="message-time">{{ message.time }}</div>
          </div>
        </div>
      </div>
      <div class="copilot-form">
        <div class="copilot-prompts">
          <button class="prompt-chip" @click="prompt('总结本周项目风险，并给出处理建议')">总结风险</button>
          <button class="prompt-chip" @click="prompt('把周会结论转成可执行任务')">生成任务</button>
          <button class="prompt-chip" @click="prompt('检索知识库，回答客户续约的关键问题')">检索知识</button>
        </div>
        <div class="copilot-input-wrap mt-10">
          <textarea ref="input" v-model="draft" class="copilot-input" placeholder="向 Copilot 提问，或输入 / 调用工作流…" @keydown.enter.exact.prevent="send"></textarea>
          <button class="copilot-send" title="发送" aria-label="发送消息" @click="send"><app-icon name="send" :size="15"></app-icon></button>
        </div>
        <div class="copilot-footnote">AI 可能出错，请核验关键结论 · 引用可追溯</div>
      </div>
    </aside>
  `
});
</script>
