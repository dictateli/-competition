window.FlowViews.documents = {
  data: function () {
    return {
      activeFile: 0,
      activeInsight: 'summary',
      detail: null,
      analysis: null,
      question: '',
      qaAnswer: '',
      asking: false,
      metaModel: '',
      files: [
        { name: 'Q3 客户反馈分析.pdf', meta: '32 页 · 刚刚解析', type: 'PDF' },
        { name: '星海计划阶段复盘.docx', meta: '18 页 · 09/15', type: 'DOC' },
        { name: '2026 行业趋势报告.pdf', meta: '64 页 · 09/12', type: 'PDF' },
        { name: '增长实验数据.xlsx', meta: '6 个工作表 · 09/10', type: 'XLS' }
      ]
    };
  },
  computed: {
    current: function () { return this.files[this.activeFile] || null; },
    previewParagraphs: function () {
      if (!this.detail || !this.detail.extractedText) return [];
      return this.detail.extractedText.split(/\n+/).filter(function (line) { return line.trim(); }).slice(0, 14);
    }
  },
  methods: {
    apiEnabled: function () { return !!(window.HeliuApi && window.HeliuApi.enabled()); },
    loadFiles: function () {
      if (!this.apiEnabled()) return;
      var self = this;
      window.HeliuApi.get('/documents').then(function (documents) {
        if (!documents || !documents.length) return;
        self.files = documents.map(function (doc) {
          return {
            id: doc.id,
            name: doc.name,
            type: self.typeOf(doc.name),
            meta: self.sizeOf(doc.sizeBytes) + ' · ' + self.statusLabel(doc.status),
            summary: doc.summary
          };
        });
        self.activeFile = 0;
        self.loadDocument();
      }).catch(function () { });
    },
    typeOf: function (name) {
      var ext = String(name || '').split('.').pop().toUpperCase();
      if (ext === 'MARKDOWN') return 'MD';
      return ext.length > 4 ? 'DOC' : ext;
    },
    sizeOf: function (bytes) {
      if (!bytes) return '—';
      if (bytes < 1024) return bytes + ' B';
      return Math.round(bytes / 1024) + ' KB';
    },
    statusLabel: function (status) {
      if (status === 'READY') return '已解析';
      if (status === 'FAILED') return '解析失败';
      return '处理中';
    },
    selectFile: function (index) {
      this.activeFile = index;
      this.$emit('toast', '已切换文档，AI 正在重新建立上下文');
      this.loadDocument();
    },
    loadDocument: function () {
      var file = this.current;
      this.detail = null;
      this.analysis = null;
      this.qaAnswer = '';
      if (!this.apiEnabled() || !file || !file.id) return;
      var self = this;
      window.HeliuApi.get('/documents/' + encodeURIComponent(file.id))
        .then(function (detail) { self.detail = detail; })
        .catch(function () { });
      window.HeliuApi.get('/documents/' + encodeURIComponent(file.id) + '/analysis')
        .then(function (analysis) { self.analysis = analysis; })
        .catch(function () { });
    },
    ask: function () {
      var file = this.current;
      if (!this.apiEnabled() || !file || !file.id) {
        this.$emit('toast', '正在基于原文生成可追溯答案');
        return;
      }
      if (!this.question.trim()) {
        this.$emit('toast', '请输入要追问的问题');
        return;
      }
      var self = this;
      this.asking = true;
      this.qaAnswer = '';
      window.HeliuApi.stream('/documents/' + encodeURIComponent(file.id) + '/ask', { question: this.question }, {
        onEvent: function (event, data) {
          if (event === 'token') self.qaAnswer += data;
          else if (event === 'meta') self.metaModel = 'AI 回答 · 引用可追溯';
        }
      }).then(function () {
        self.asking = false;
      }).catch(function (error) {
        self.asking = false;
        self.$emit('toast', '追问失败：' + (error && error.message ? error.message : '请检查后端服务'));
      });
    }
  },
  mounted: function () { this.loadFiles(); },
  template: `
    <main class="page">
      <div class="page-head">
        <div>
          <div class="eyebrow">智能文档 · RAG 知识分析</div>
          <h1 class="page-title">不是读得更快，<br />而是问到真正重要的事。</h1>
          <p class="page-subtitle">理解论文、合同、报告和数据表，生成摘要、风险提示，并用原始证据回答复杂问题。</p>
        </div>
        <div class="head-actions">
          <button class="btn" aria-label="多文档对比" @click="$emit('toast', '已开始对比文档的核心结论与差异')"><app-icon name="filter"></app-icon>多文档对比</button>
          <button class="btn primary" @click="$emit('open-modal', 'upload')"><app-icon name="upload"></app-icon>上传文档</button>
        </div>
      </div>

      <div class="docs-layout">
        <section class="card">
          <div class="card-head"><div><h2 class="card-title"><app-icon name="folder"></app-icon>文件</h2><p class="card-note">已索引 {{ files.length }} 份资料</p></div></div>
          <div class="file-list" role="listbox" aria-label="文档列表">
            <div v-for="(file, index) in files" :key="file.id || index" class="file-item" :class="{ active: activeFile === index }" role="option" :aria-selected="String(activeFile === index)" tabindex="0" @click="selectFile(index)" @keydown.enter="selectFile(index)" @keydown.space.prevent="selectFile(index)">
              <div class="file-icon">{{ file.type }}</div>
              <div class="file-copy"><div class="file-name">{{ file.name }}</div><div class="file-meta">{{ file.meta }}</div></div>
            </div>
          </div>
          <div class="empty-line"></div>
          <div class="generated-note"><h4>知识库同步中</h4><p>已完成 OCR、分段、向量化与权限标签写入。</p></div>
        </section>

        <section class="doc-preview">
          <div class="doc-preview-head"><div class="doc-preview-title">{{ current ? current.name : '' }}</div><span class="badge lime">AI 已完成分析</span></div>
          <div class="doc-preview-pages">
            <article v-if="previewParagraphs.length" class="doc-page">
              <h2>原文摘录</h2>
              <div class="doc-page-meta">来自后端解析结果 · 已建立可追溯引用</div>
              <p v-for="(line, index) in previewParagraphs" :key="index">{{ line }}</p>
            </article>
            <article v-else class="doc-page">
              <h2>Q3 客户反馈与留存分析</h2>
              <div class="doc-page-meta">客户成功部 · 2026 年 9 月 · 内部资料</div>
              <h3>核心发现</h3>
              <p>本季度共收集有效客户反馈 1,284 条，较上季度增长 23%。高活跃客户更关注<span class="marked">跨团队协作效率与数据沉淀能力</span>，而对单项功能的敏感度持续下降。</p>
              <h3>流失信号</h3>
              <p>首次配置超过 30 分钟的客户，前两周流失概率为 28%，较平均水平高 <span class="risk-mark">11 个百分点</span>。主要阻塞点集中在权限设置、模板选择和第三方系统接入。</p>
              <h3>续约影响因素</h3>
              <p>数据表明，当客户在关键工作流中形成固定使用习惯后，续约概率可提升至 84%。因此，下一阶段产品策略应从功能覆盖转向<span class="marked">工作流价值达成</span>。</p>
              <h3>建议</h3>
              <p>优先优化首次配置体验，建立行业模板库，并将 AI 摘要嵌入日常会议与项目流程，驱动更多高频协作场景。</p>
            </article>
          </div>
        </section>

        <div class="stack">
          <section class="card">
            <div class="insight-tabs">
              <button class="insight-tab" :class="{ active: activeInsight === 'summary' }" @click="activeInsight = 'summary'">摘要</button>
              <button class="insight-tab" :class="{ active: activeInsight === 'risk' }" @click="activeInsight = 'risk'">风险</button>
              <button class="insight-tab" :class="{ active: activeInsight === 'qa' }" @click="activeInsight = 'qa'">问答</button>
            </div>
            <template v-if="activeInsight === 'summary'">
              <div class="qa-card"><div class="qa-q">一句话摘要</div><div class="qa-a">{{ (analysis && analysis.summary) || (current && current.summary) || '客户价值判断正在从“功能是否齐全”转向“工作流能否真正提效”。' }}</div></div>
              <div class="qa-card"><div class="qa-q">关键数据</div><div class="qa-a">
                <template v-if="analysis && analysis.keyData && analysis.keyData.length">
                  <span v-for="(item, index) in analysis.keyData" :key="index">{{ item }}<br /></span>
                </template>
                <template v-else>反馈量 +23%；首次配置流失率 28%；习惯形成后续约率 84%。</template>
              </div></div>
            </template>
            <template v-else-if="activeInsight === 'risk'">
              <template v-if="analysis && analysis.risks && analysis.risks.length">
                <div v-for="(risk, index) in analysis.risks" :key="index" class="qa-card">
                  <div class="qa-q"><span class="badge coral">{{ risk.level }}</span> {{ risk.title }}</div>
                  <div class="qa-a">{{ risk.evidence }}</div>
                  <div class="qa-source">置信度 {{ Math.round((risk.confidence || 0) * 100) }}%</div>
                </div>
              </template>
              <template v-else>
                <div class="qa-card"><div class="qa-q"><span class="badge coral">高</span> 首次配置流失</div><div class="qa-a">超过 30 分钟的客户流失概率高出均值 11 个百分点。</div><div class="qa-source">原文第 12 页 · 样本 486</div></div>
                <div class="qa-card"><div class="qa-q"><span class="badge yellow">中</span> 数据导出需求增长</div><div class="qa-a">近 30 天提及率增长 180%，可能影响续约决策。</div><div class="qa-source">原文第 21 页 · 样本 93</div></div>
              </template>
            </template>
            <template v-else>
              <div class="qa-card" v-if="qaAnswer">
                <div class="qa-q">回答</div>
                <div class="qa-a">{{ qaAnswer }}</div>
                <div class="qa-source">{{ metaModel || '基于原文生成' }}</div>
              </div>
              <div class="qa-card" v-else>
                <div class="qa-q">哪些因素最影响续约？</div>
                <div class="qa-a">关键工作流形成固定使用习惯后，续约概率提升至 84%。</div>
                <div class="qa-source">引用：第 18 页 · 置信度 93%</div>
              </div>
              <input v-model="question" class="form-input" aria-label="向文档提问" placeholder="就当前文档继续追问…" @keydown.enter="ask" />
              <button class="btn lime sm mt-10" :disabled="asking" @click="ask"><app-icon name="spark" :size="14"></app-icon>{{ asking ? '生成中…' : '继续追问' }}</button>
            </template>
          </section>
        </div>
      </div>
    </main>
  `
};
