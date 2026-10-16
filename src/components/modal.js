Vue.component('global-modal', {
  props: { modal: { type: Object, default: null } },
  data: function () {
    return {
      taskTitle: '',
      taskOwner: '林然',
      taskDate: (function () {
        var now = new Date();
        return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
      })(),
      file: null,
      selectedFile: 'Q3 客户反馈分析.md',
      meetingTitle: '产品增长复盘会',
      writingBrief: '面向管理层，输出一份有数据支撑的项目复盘'
    };
  },
  watch: {
    modal: function (value) {
      if (value) {
        if (value.type === 'upload') { this.file = null; this.selectedFile = '未选择文件'; }
        this.$nextTick(this.focusFirst);
      } else {
        this.restoreFocus();
      }
    }
  },
  mounted: function () {
    this.lastFocused = null;
  },
  methods: {
    focusables: function () {
      if (!this.$el || !this.$el.querySelectorAll) return [];
      return Array.prototype.slice.call(this.$el.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ));
    },
    focusFirst: function () {
      if (!this.modal) return;
      this.lastFocused = document.activeElement;
      var items = this.focusables();
      if (items.length) items[0].focus();
    },
    restoreFocus: function () {
      if (this.lastFocused && typeof this.lastFocused.focus === 'function') this.lastFocused.focus();
      this.lastFocused = null;
    },
    onKeydown: function (event) {
      if (!this.modal) return;
      if (event.key === 'Escape') { event.preventDefault(); this.close(); return; }
      if (event.key !== 'Tab') return;
      var items = this.focusables();
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    },
    onFileChange: function (event) {
      var file = event.target.files && event.target.files[0];
      if (!file) return;
      this.file = file;
      this.selectedFile = file.name;
    },
    close: function () { this.$emit('close'); },
    submit: function () {
      if (!this.modal) return;
      if (this.modal.type === 'new-task') this.$emit('submit', { type: 'task', title: this.taskTitle || '未命名任务', owner: this.taskOwner, date: this.taskDate });
      else if (this.modal.type === 'meeting') this.$emit('submit', { type: 'meeting', title: this.meetingTitle });
      else if (this.modal.type === 'upload') this.$emit('submit', { type: 'upload', file: this.file, name: this.selectedFile });
      else if (this.modal.type === 'writing') this.$emit('submit', { type: 'writing', prompt: this.writingBrief, title: this.modal.title });
      else this.$emit('submit', { type: 'generate', title: this.modal.title });
    }
  },
  template: `
    <div v-if="modal" class="modal-backdrop" @click.self="close" @keydown="onKeydown">
      <section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" ref="dialog" tabindex="-1">
        <header class="modal-head">
          <div><h2 class="modal-title" id="modal-title">{{ modal.title }}</h2><div class="modal-sub">{{ modal.sub }}</div></div>
          <button class="icon-button ghost" aria-label="关闭弹窗" @click="close"><app-icon name="x"></app-icon></button>
        </header>
        <div class="modal-body">
          <template v-if="modal.type === 'new-task'">
            <label class="form-label">任务名称</label>
            <input v-model="taskTitle" class="form-input" placeholder="例如：完成客户续约方案" autofocus />
            <div class="form-row mt-16">
              <div><label class="form-label">负责人</label><select v-model="taskOwner" class="form-select"><option>林然</option><option>周可</option><option>陈默</option></select></div>
              <div><label class="form-label">截止日期</label><input v-model="taskDate" type="date" class="form-input" /></div>
            </div>
            <div class="generated-note mt-16"><h4><app-icon name="spark" :size="14"></app-icon> AI 建议已生成</h4><p>建议关联「星海计划 / 客户成功」知识库，并在完成前自动检查遗漏项。</p></div>
          </template>
          <template v-else-if="modal.type === 'meeting'">
            <label class="form-label">会议主题</label>
            <input v-model="meetingTitle" class="form-input" />
            <div class="generated-note mt-16"><h4><app-icon name="video" :size="14"></app-icon> Jitsi Meet 视频会议</h4><p>确认后将在当前页面直接创建并进入 Jitsi 会议室，不会跳转到 Jitsi 官网。会议结束后回到工作台即可回听原声。</p></div>
            <div class="empty-line"></div>
            <p class="muted tiny mb-0">进入会议室时，请允许浏览器访问摄像头和麦克风。</p>
          </template>
          <template v-else-if="modal.type === 'upload'">
            <div class="file-drop">
              <app-icon name="upload" :size="28"></app-icon>
              <strong>选择 1 份业务文档</strong>
              <span>支持 TXT / MD / CSV / JSON 正文解析，其它格式按元数据入库</span>
              <input ref="fileInput" type="file" class="mt-10" aria-label="选择要上传的文档" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.md,.csv,.json" @change="onFileChange" />
            </div>
            <div class="generated-note mt-16"><h4>当前选择：{{ selectedFile }}</h4><p>完成后将自动提取摘要、关键数据、风险条款，并写入可检索的知识库。</p></div>
          </template>
          <template v-else-if="modal.type === 'writing'">
            <label class="form-label">写作任务说明</label>
            <textarea v-model="writingBrief" class="form-textarea"></textarea>
            <div class="generated-note mt-16"><h4>AI 将结合的上下文</h4><p>近 90 天项目进展、三次会议纪要、相关产品指标，以及你以往的输出风格。</p></div>
          </template>
          <template v-else>
            <div class="generated-note"><h4><app-icon name="spark" :size="14"></app-icon> {{ modal.generatedTitle || 'AI 分析已完成' }}</h4><p>{{ modal.generatedText || '已结合当前权限范围内的业务上下文完成分析，结论均可追溯至原始来源。' }}</p></div>
          </template>
          <div class="modal-actions">
            <button class="btn subtle" @click="close">取消</button>
            <button class="btn primary" @click="submit">{{ modal.confirmText || '确认创建' }}</button>
          </div>
        </div>
      </section>
    </div>
  `
});

