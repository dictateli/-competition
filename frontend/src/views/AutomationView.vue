<template>
<main class="page">
      <div class="page-head">
        <div>
          <div class="eyebrow">AI 自动化 · 工作流编排</div>
          <h1 class="page-title">让重复工作，<br />自己找到下一步。</h1>
          <p class="page-subtitle">用自然语言描述目标，AI 自动连接业务服务、模型能力和外部系统，形成可观测的自动化工作流。</p>
        </div>
        <div class="head-actions">
          <button class="btn" @click="$emit('toast', '已打开 14 个可接入应用')"><app-icon name="link"></app-icon>接入应用</button>
          <button class="btn primary" @click="$refs.prompt.focus()"><app-icon name="plus"></app-icon>新建工作流</button>
        </div>
      </div>

      <section class="card">
        <div class="card-head">
          <div><h2 class="card-title"><app-icon name="wand"></app-icon>用一句话创建工作流</h2><p class="card-note">描述触发条件和期望结果，AI 会拆成可执行节点</p></div>
        </div>
        <div class="command-input-wrap">
          <app-icon name="spark"></app-icon>
          <input ref="prompt" v-model="prompt" @keydown.enter="createFromPrompt" aria-label="用自然语言创建工作流" placeholder="例如：每周五汇总项目风险，生成周报并通知负责人" />
          <button class="command-submit" :disabled="busy" @click="createFromPrompt">生成工作流</button>
        </div>
      </section>

      <section class="card mt-16">
        <div class="card-head">
          <div><h2 class="card-title"><app-icon name="workflow"></app-icon>客户续约预警工作流</h2><p class="card-note">由自然语言创建 · 已稳定运行 28 天</p></div>
          <span class="badge lime">运行中</span>
        </div>
        <div class="flow-canvas">
          <div class="flow-node trigger"><div class="flow-node-label">TRIGGER · 触发</div><div class="flow-node-title">监测客户活跃度</div><div class="flow-node-meta">每日 09:00 · 数据服务</div></div>
          <div class="flow-arrow"></div>
          <div class="flow-node ai"><div class="flow-node-label">AI · 分析</div><div class="flow-node-title">判断续约风险</div><div class="flow-node-meta">LLM + RAG · 6 个信号</div></div>
          <div class="flow-arrow"></div>
          <div class="flow-node action"><div class="flow-node-label">ACTION · 执行</div><div class="flow-node-title">创建跟进任务</div><div class="flow-node-meta">项目管理 · 通知负责人</div></div>
        </div>
      </section>

      <section class="card mt-16">
        <div class="card-head"><div><h2 class="card-title"><app-icon name="automation"></app-icon>自动化工作流</h2><p class="card-note">{{ workflows.length }} 个流程 · 其中 {{ runningCount }} 个运行中</p></div><button class="card-link" @click="$emit('toast', '已展示全部工作流')">全部工作流 →</button></div>
        <div>
          <div v-for="(workflow, index) in workflows" :key="workflow.id || index" class="workflow-item">
            <div class="workflow-icon"><app-icon :name="workflow.icon"></app-icon></div>
            <div class="workflow-body"><div class="workflow-name">{{ workflow.name }}</div><div class="workflow-desc">{{ workflow.desc }}</div></div>
            <button class="btn subtle sm" :disabled="busy" @click="run(workflow)">立即执行</button>
            <span class="badge" :class="workflow.on ? 'lime' : 'gray'">{{ workflow.on ? '运行中' : '已暂停' }}</span>
            <button class="switch" :class="{ on: workflow.on }" :aria-label="(workflow.on ? '暂停' : '启用') + workflow.name" :aria-pressed="String(workflow.on)" @click="toggle(workflow)"></button>
          </div>
        </div>
      </section>
    </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data: function () {
    return {
      prompt: '',
      busy: false,
      workflows: [
        { name: '会议结束自动生成纪要与任务', desc: '会议录音 → 转写 → 决策提取 → 写入项目', on: true, icon: 'video' },
        { name: '文档上传后自动摘要与风险识别', desc: '文件解析 → RAG 索引 → 风险扫描', on: true, icon: 'file' },
        { name: '项目风险每日主动播报', desc: '项目数据 → 风险检测 → 企业微信通知', on: false, icon: 'alert' },
        { name: '周报自动汇总与发送', desc: '项目更新 → 生成周报 → 管理者审批', on: true, icon: 'trending' }
      ]
    };
  },
  computed: {
    runningCount: function () {
      return this.workflows.filter(function (item) { return item.on; }).length;
    }
  },
  methods: {
    apiEnabled: function () { return !!(window.HeliuApi && window.HeliuApi.enabled()); },
    iconFor: function (workflow) {
      var text = (workflow.name || '') + (workflow.prompt || '') + (workflow.triggerType || '');
      if (text.indexOf('会议') > -1 || text.indexOf('MEETING') > -1) return 'video';
      if (text.indexOf('文档') > -1 || text.indexOf('DOCUMENT') > -1) return 'file';
      if (text.indexOf('风险') > -1 || text.indexOf('RISK') > -1) return 'alert';
      if (text.indexOf('周报') > -1 || text.indexOf('SCHEDULE') > -1) return 'trending';
      return 'automation';
    },
    load: function () {
      if (!this.apiEnabled()) return;
      var self = this;
      window.HeliuApi.get('/workflows').then(function (list) {
        if (!list || !list.length) return;
        self.workflows = list.map(function (item) { return self.mapWorkflow(item); });
      }).catch(function () { });
    },
    mapWorkflow: function (item) {
      return {
        id: item.id,
        name: item.name,
        desc: item.prompt || (item.triggerType + ' · 由 AI 编排并持续执行'),
        on: item.enabled,
        icon: this.iconFor(item)
      };
    },
    toggle: function (workflow) {
      if (!this.apiEnabled() || !workflow.id) {
        workflow.on = !workflow.on;
        this.$emit('toast', workflow.name + (workflow.on ? ' 已启用' : ' 已暂停'));
        return;
      }
      var self = this;
      window.HeliuApi.patch('/workflows/' + encodeURIComponent(workflow.id) + '/toggle', {})
        .then(function (updated) {
          workflow.on = updated ? updated.enabled : !workflow.on;
          self.$emit('toast', workflow.name + (workflow.on ? ' 已启用' : ' 已暂停'));
        })
        .catch(function (error) {
          self.$emit('toast', '切换失败：' + (error && error.message ? error.message : '请检查后端服务'));
        });
    },
    run: function (workflow) {
      if (!this.apiEnabled() || !workflow.id) {
        this.$emit('toast', '已触发「' + workflow.name + '」，预计 1 分钟内完成');
        return;
      }
      var self = this;
      this.busy = true;
      window.HeliuApi.post('/workflows/' + encodeURIComponent(workflow.id) + '/run', {})
        .then(function (run) {
          var status = run && run.status ? run.status : 'COMPLETED';
          self.$emit('toast', '已执行「' + workflow.name + '」：' + status);
        })
        .catch(function (error) {
          self.$emit('toast', '执行失败：' + (error && error.message ? error.message : '请检查后端服务'));
        })
        .then(function () { self.busy = false; });
    },
    createFromPrompt: function () {
      var text = this.prompt.trim();
      if (!text) return this.$emit('toast', '请描述你希望自动化的目标');
      if (!this.apiEnabled()) {
        this.workflows.unshift({ name: text.slice(0, 18), desc: '触发条件 → AI 分析 → 业务动作', on: true, icon: 'automation' });
        this.prompt = '';
        this.$emit('toast', '工作流已生成（离线演示）');
        return;
      }
      var self = this;
      this.busy = true;
      window.HeliuApi.post('/workflows/from-prompt', { prompt: text })
        .then(function (created) {
          self.workflows.unshift(self.mapWorkflow(created));
          self.prompt = '';
          self.$emit('toast', '已根据自然语言生成工作流');
        })
        .catch(function (error) {
          self.$emit('toast', '生成失败：' + (error && error.message ? error.message : '请检查后端服务'));
        })
        .then(function () { self.busy = false; });
    }
  },
  mounted: function () { this.load(); },
  template: `
    <main class="page">
      <div class="page-head">
        <div>
          <div class="eyebrow">AI 自动化 · 工作流编排</div>
          <h1 class="page-title">让重复工作，<br />自己找到下一步。</h1>
          <p class="page-subtitle">用自然语言描述目标，AI 自动连接业务服务、模型能力和外部系统，形成可观测的自动化工作流。</p>
        </div>
        <div class="head-actions">
          <button class="btn" @click="$emit('toast', '已打开 14 个可接入应用')"><app-icon name="link"></app-icon>接入应用</button>
          <button class="btn primary" @click="$refs.prompt.focus()"><app-icon name="plus"></app-icon>新建工作流</button>
        </div>
      </div>

      <section class="card">
        <div class="card-head">
          <div><h2 class="card-title"><app-icon name="wand"></app-icon>用一句话创建工作流</h2><p class="card-note">描述触发条件和期望结果，AI 会拆成可执行节点</p></div>
        </div>
        <div class="command-input-wrap">
          <app-icon name="spark"></app-icon>
          <input ref="prompt" v-model="prompt" @keydown.enter="createFromPrompt" aria-label="用自然语言创建工作流" placeholder="例如：每周五汇总项目风险，生成周报并通知负责人" />
          <button class="command-submit" :disabled="busy" @click="createFromPrompt">生成工作流</button>
        </div>
      </section>

      <section class="card mt-16">
        <div class="card-head">
          <div><h2 class="card-title"><app-icon name="workflow"></app-icon>客户续约预警工作流</h2><p class="card-note">由自然语言创建 · 已稳定运行 28 天</p></div>
          <span class="badge lime">运行中</span>
        </div>
        <div class="flow-canvas">
          <div class="flow-node trigger"><div class="flow-node-label">TRIGGER · 触发</div><div class="flow-node-title">监测客户活跃度</div><div class="flow-node-meta">每日 09:00 · 数据服务</div></div>
          <div class="flow-arrow"></div>
          <div class="flow-node ai"><div class="flow-node-label">AI · 分析</div><div class="flow-node-title">判断续约风险</div><div class="flow-node-meta">LLM + RAG · 6 个信号</div></div>
          <div class="flow-arrow"></div>
          <div class="flow-node action"><div class="flow-node-label">ACTION · 执行</div><div class="flow-node-title">创建跟进任务</div><div class="flow-node-meta">项目管理 · 通知负责人</div></div>
        </div>
      </section>

      <section class="card mt-16">
        <div class="card-head"><div><h2 class="card-title"><app-icon name="automation"></app-icon>自动化工作流</h2><p class="card-note">{{ workflows.length }} 个流程 · 其中 {{ runningCount }} 个运行中</p></div><button class="card-link" @click="$emit('toast', '已展示全部工作流')">全部工作流 →</button></div>
        <div>
          <div v-for="(workflow, index) in workflows" :key="workflow.id || index" class="workflow-item">
            <div class="workflow-icon"><app-icon :name="workflow.icon"></app-icon></div>
            <div class="workflow-body"><div class="workflow-name">{{ workflow.name }}</div><div class="workflow-desc">{{ workflow.desc }}</div></div>
            <button class="btn subtle sm" :disabled="busy" @click="run(workflow)">立即执行</button>
            <span class="badge" :class="workflow.on ? 'lime' : 'gray'">{{ workflow.on ? '运行中' : '已暂停' }}</span>
            <button class="switch" :class="{ on: workflow.on }" :aria-label="(workflow.on ? '暂停' : '启用') + workflow.name" :aria-pressed="String(workflow.on)" @click="toggle(workflow)"></button>
          </div>
        </div>
      </section>
    </main>
  `
});
</script>
