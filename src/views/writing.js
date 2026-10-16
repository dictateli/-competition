window.FlowViews.writing = {
  props: { initialPrompt: { type: String, default: '' } },
  data: function () {
    return {
      draftId: null,
      drafts: [],
      title: '星海计划第二阶段复盘',
      content: '星海计划第二阶段复盘：增长的关键不在功能数量\n\n过去六周，团队围绕客户留存完成了 12 次产品迭代。真正影响续约意愿的是能否在关键工作流中节省时间，而不是功能数量本身。\n\n01 发生了什么\n第二阶段共触达 34 家企业客户，其中 7 家进入深度访谈。首次配置流程的流失率达到 31%。\n\n02 关键判断\n下一阶段应把资源从增加功能入口转向减少首次价值达成时间。数据导出、模板预置和跨团队协作是三个最高优先级的验证方向。\n\n03 接下来的行动\n团队将在本周完成技术方案与资源评估，下周进入 14 天灰度验证。',
      style: '专业',
      aiPrompt: '',
      generatedText: '',
      generating: false,
      saving: false,
      savedAt: '',
      showSuggestions: true
    };
  },
  computed: {
    wordCount: function () {
      return (this.content || '').replace(/\s+/g, '').length;
    }
  },
  watch: {
    initialPrompt: function (value) {
      if (value) {
        this.aiPrompt = value;
        this.generateFromPrompt();
      }
    }
  },
  methods: {
    apiEnabled: function () { return !!(window.HeliuApi && window.HeliuApi.enabled()); },
    onInput: function () { this.savedAt = ''; },
    loadDrafts: function () {
      if (!this.apiEnabled()) return;
      var self = this;
      window.HeliuApi.get('/writing/drafts').then(function (drafts) {
        self.drafts = drafts || [];
        if (self.drafts.length) self.openDraft(self.drafts[0]);
      }).catch(function () { });
    },
    refreshDrafts: function () {
      if (!this.apiEnabled()) return;
      var self = this;
      window.HeliuApi.get('/writing/drafts').then(function (drafts) {
        self.drafts = drafts || [];
      }).catch(function () { });
    },
    openDraft: function (draft) {
      this.draftId = draft.id;
      this.title = draft.title || '未命名文档';
      this.content = draft.content || '';
      this.style = draft.style || '专业';
      this.generatedText = '';
      this.savedAt = '已加载草稿';
    },
    newDraft: function () {
      this.draftId = null;
      this.title = '未命名文档';
      this.content = '';
      this.generatedText = '';
      this.savedAt = '';
      this.$emit('toast', '已新建草稿，保存后写入后端');
    },
    saveDraft: function () {
      if (!this.apiEnabled()) {
        this.savedAt = '离线演示：未保存到后端';
        this.$emit('toast', '离线模式未持久化，连接后端后会保存');
        return;
      }
      var self = this;
      this.saving = true;
      var body = { title: this.title, content: this.content, style: this.style };
      var request = this.draftId
        ? window.HeliuApi.patch('/writing/drafts/' + encodeURIComponent(this.draftId), body)
        : window.HeliuApi.post('/writing/drafts', body);
      request.then(function (draft) {
        self.draftId = draft.id;
        self.savedAt = '已保存 · ' + new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        self.refreshDrafts();
        self.$emit('toast', '文档已保存并写入版本记录');
      }).catch(function (error) {
        self.$emit('toast', '保存失败：' + (error && error.message ? error.message : '请检查后端服务'));
      }).then(function () { self.saving = false; });
    },
    generate: function (kind, prompt) {
      if (!this.apiEnabled()) {
        this.$emit('toast', '离线模式：请配置后端后使用真实 AI 写作');
        return;
      }
      var text = (prompt || this.aiPrompt || '').trim();
      if (!text) {
        this.$emit('toast', '请输入写作任务说明');
        return;
      }
      var self = this;
      this.generating = true;
      this.generatedText = '';
      var fullPrompt = kind + '：' + text + '\n\n已有正文：\n' + this.content;
      window.HeliuApi.stream('/ai/writing/stream', {
        prompt: fullPrompt,
        style: this.style,
        contextIds: []
      }, {
        onEvent: function (event, data) {
          if (event === 'token') self.generatedText += data;
        }
      }).then(function () {
        self.generating = false;
        if (!self.generatedText) self.generatedText = '模型没有返回内容，请稍后重试。';
      }).catch(function (error) {
        self.generating = false;
        self.$emit('toast', '生成失败：' + (error && error.message ? error.message : '请检查后端服务'));
      });
    },
    generateFromPrompt: function () { this.generate('请根据任务说明生成初稿', this.aiPrompt); this.$emit('prompt-consumed'); },
    continueDraft: function () { this.generate('请延续已有正文，补充下一部分', '基于当前内容继续写作，保持结构一致'); },
    optimize: function () { this.generate('请优化表达并保持事实不变', this.aiPrompt || '提升逻辑、压缩重复内容并保留关键数据'); },
    review: function () { this.generate('请检查事实、数据和引用风险', '全文检查数据风险、逻辑漏洞和不可追溯结论'); },
    rewrite: function (name) {
      this.generate('请按指定风格重写正文', '风格要求：' + name);
    },
    applyGenerated: function (mode) {
      if (!this.generatedText) return;
      this.content = mode === 'replace' ? this.generatedText : (this.content.trim() + '\n\n' + this.generatedText.trim());
      this.generatedText = '';
      this.savedAt = '';
      this.$emit('toast', mode === 'replace' ? 'AI 结果已替换正文' : 'AI 结果已追加到正文');
      this.saveDraft();
    },
    discardGenerated: function () { this.generatedText = ''; },
    wrapSelection: function (before, after, placeholder) {
      var editor = this.$refs.editor;
      if (!editor) return;
      var start = editor.selectionStart || 0;
      var end = editor.selectionEnd || 0;
      var selected = this.content.slice(start, end) || placeholder || '';
      this.content = this.content.slice(0, start) + before + selected + after + this.content.slice(end);
      this.$nextTick(function () { editor.focus(); editor.selectionStart = start + before.length; editor.selectionEnd = start + before.length + selected.length; });
    },
    format: function (type) {
      if (type === 'bold') this.wrapSelection('**', '**', '重点内容');
      else if (type === 'italic') this.wrapSelection('*', '*', '强调内容');
      else if (type === 'link') this.wrapSelection('[', '](https://)', '链接文字');
      else if (type === 'bullet') this.wrapSelection('\n• ', '', '列表项');
      else if (type === 'quote') this.wrapSelection('\n> ', '', '引用内容');
      else this.$emit('toast', '正文样式已启用');
    }
  },
  mounted: function () { this.loadDrafts(); if (this.initialPrompt) this.$nextTick(this.generateFromPrompt); },
  template: `
    <main class="page">
      <div class="page-head">
        <div>
          <div class="eyebrow">AI 写作 · 项目复盘</div>
          <h1 class="page-title">把业务上下文，<br />直接变成高质量表达。</h1>
          <p class="page-subtitle">文字、草稿和后端持久化已经连接；AI 结果可预览、追加、替换和保存。</p>
        </div>
        <div class="head-actions">
          <button class="btn" :disabled="generating" @click="review"><app-icon name="shield"></app-icon>全文检查</button>
          <button class="btn primary" :disabled="saving" @click="saveDraft"><app-icon name="check"></app-icon>{{ saving ? '保存中…' : '保存并同步' }}</button>
        </div>
      </div>

      <div class="writer-shell">
        <section class="editor-pane">
          <div class="editor-toolbar">
            <button class="tool-btn active" title="正文" @click="format('text')">Aa</button>
            <button class="tool-btn" title="加粗" @click="format('bold')"><b>B</b></button>
            <button class="tool-btn" title="斜体" @click="format('italic')"><i>I</i></button>
            <button class="tool-btn" title="链接" aria-label="插入链接" @click="format('link')"><app-icon name="link" :size="14"></app-icon></button>
            <span class="tool-divider"></span>
            <button class="tool-btn" title="列表" @click="format('bullet')">•</button>
            <button class="tool-btn" title="引用" @click="format('quote')">”</button>
            <span class="tool-divider"></span>
            <button class="btn lime sm" :disabled="generating" @click="continueDraft"><app-icon name="spark" :size="14"></app-icon>{{ generating ? '生成中…' : 'AI 续写' }}</button>
            <button class="btn subtle sm" :disabled="generating" @click="optimize"><app-icon name="wand" :size="14"></app-icon>优化表达</button>
          </div>
          <div class="writing-ai-quick">
            <input v-model="aiPrompt" class="form-input" placeholder="描述写作任务，例如：生成 5 条管理层摘要" @keydown.enter="generateFromPrompt" />
            <button class="btn primary sm" :disabled="generating" @click="generateFromPrompt">生成初稿</button>
          </div>
          <input v-model="title" class="draft-title-input" aria-label="文档标题" />
          <textarea ref="editor" v-model="content" class="draft-editor" aria-label="写作正文" @input="onInput"></textarea>
          <div v-if="generatedText" class="generated-draft">
            <div class="generated-draft-head"><strong>AI 生成结果</strong><span>{{ generating ? '正在生成…' : '可应用或丢弃' }}</span></div>
            <pre>{{ generatedText }}</pre>
            <div class="head-actions">
              <button class="btn subtle sm" @click="discardGenerated">丢弃</button>
              <button class="btn subtle sm" @click="applyGenerated('append')">追加到正文</button>
              <button class="btn primary sm" @click="applyGenerated('replace')">替换正文</button>
            </div>
          </div>
          <div class="doc-meta">{{ wordCount }} 字 · AI 引用可追溯 · {{ savedAt || '有未同步修改' }}</div>
        </section>
        <aside class="writer-tools">
          <h3>草稿</h3>
          <div class="draft-list">
            <button v-for="draft in drafts" :key="draft.id" class="draft-item" :class="{ active: draftId === draft.id }" @click="openDraft(draft)">
              <strong>{{ draft.title || '未命名文档' }}</strong>
              <small>{{ draft.style || '专业' }}</small>
            </button>
            <div v-if="!drafts.length" class="muted tiny">暂无已保存草稿</div>
          </div>
          <button class="btn subtle sm mt-10" @click="newDraft"><app-icon name="plus" :size="14"></app-icon>新建草稿</button>
          <div class="empty-line"></div>
          <h3>AI 写作助手</h3>
          <div class="tool-list">
            <div class="tool-card" @click="rewrite('更简洁')"><strong>变得更简洁</strong><span>去除重复表达，保留关键数据</span></div>
            <div class="tool-card" @click="rewrite('更有说服力')"><strong>增强说服力</strong><span>补充证据链与逻辑连接</span></div>
            <div class="tool-card" @click="rewrite('管理层摘要')"><strong>生成管理层摘要</strong><span>压缩为 5 个关键结论</span></div>
            <div class="tool-card" @click="review"><strong>核验数据引用</strong><span>检查来源、日期和口径一致性</span></div>
          </div>
          <div class="empty-line"></div>
          <h3>语气风格</h3>
          <div class="insight-tabs">
            <button v-for="item in ['专业','克制','有温度']" :key="item" class="insight-tab" :class="{ active: style === item }" @click="style = item">{{ item }}</button>
          </div>
          <div class="generated-note">
            <h4><app-icon name="spark" :size="14"></app-icon> 上下文已连接</h4>
            <p>项目周报 · 实时<br />客户访谈 · 已索引<br />会议纪要 · 可引用</p>
          </div>
        </aside>
      </div>
    </main>
  `
};


