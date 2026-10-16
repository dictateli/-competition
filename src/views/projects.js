window.FlowViews.projects = {
  props: { tasks: { type: Array, default: function () { return []; } } },
  data: function () { return { viewMode: 'board', selectedTask: null }; },
  computed: {
    todo: function () { return this.tasks.filter(function (t) { return t.status === 'todo'; }); },
    doing: function () { return this.tasks.filter(function (t) { return t.status === 'doing'; }); },
    done: function () { return this.tasks.filter(function (t) { return t.status === 'done'; }); }
  },
  methods: {
    move: function (task) {
      this.$emit('task-move', task);
    }
  },
  template: `
    <main class="page">
      <div class="page-head">
        <div>
          <div class="eyebrow">AI 项目 · 星海计划</div>
          <h1 class="page-title">项目推进，<br />不等周会才开始。</h1>
          <p class="page-subtitle">AI 持续跟踪任务、依赖关系和会议结论，在风险真正阻塞交付之前主动提醒。</p>
        </div>
        <div class="head-actions">
          <button class="btn" @click="$emit('toast', '已生成 18 页项目进展报告')"><app-icon name="file"></app-icon>生成进展报告</button>
          <button class="btn primary" @click="$emit('open-modal', 'new-task')"><app-icon name="plus"></app-icon>新建任务</button>
        </div>
      </div>

      <div class="metrics-row mb-0">
        <div class="metric"><div class="metric-label">总体进度</div><div class="metric-value">68%</div><div class="progress lime"><span style="width:68%"></span></div></div>
        <div class="metric"><div class="metric-label">关键路径剩余</div><div class="metric-value">18天</div><div class="metric-trend">原计划 21 天</div></div>
        <div class="metric"><div class="metric-label">AI 识别风险</div><div class="metric-value">2</div><div class="metric-trend warn">1 项需要今天处理</div></div>
      </div>

      <div class="split-layout mt-16">
        <section class="card">
          <div class="card-head">
            <div><h2 class="card-title"><app-icon name="kanban"></app-icon>交付看板</h2><p class="card-note">点击任务卡可推进到下一状态</p></div>
            <div class="insight-tabs mb-0"><button class="insight-tab active">看板</button><button class="insight-tab" @click="$emit('toast', '时间线视图将在正式版开放')">时间线</button></div>
          </div>
          <div class="project-board">
            <div class="board-column">
              <div class="board-head"><span>待处理</span><span class="board-count">{{ todo.length }}</span></div>
              <article v-for="task in todo" :key="task.id" class="task-card" :class="task.tone" @click="move(task)">
                <div class="task-type">{{ task.type }}</div>
                <div class="task-title">{{ task.title }}</div>
                <div class="task-desc">{{ task.desc }}</div>
                <div v-if="task.ai" class="ai-chip"><app-icon name="spark" :size="11"></app-icon>{{ task.ai }}</div>
                <div class="task-foot"><div class="mini-avatars"><span class="mini-avatar">{{ task.owner.slice(0,1) }}</span><span class="mini-avatar">周</span></div><span class="task-due">{{ task.due }}</span></div>
              </article>
            </div>
            <div class="board-column">
              <div class="board-head"><span>进行中</span><span class="board-count">{{ doing.length }}</span></div>
              <article v-for="task in doing" :key="task.id" class="task-card" :class="task.tone" @click="move(task)">
                <div class="task-type">{{ task.type }}</div>
                <div class="task-title">{{ task.title }}</div>
                <div class="task-desc">{{ task.desc }}</div>
                <div v-if="task.ai" class="ai-chip"><app-icon name="spark" :size="11"></app-icon>{{ task.ai }}</div>
                <div class="task-foot"><div class="mini-avatars"><span class="mini-avatar">{{ task.owner.slice(0,1) }}</span><span class="mini-avatar">李</span></div><span class="task-due">{{ task.due }}</span></div>
              </article>
            </div>
            <div class="board-column">
              <div class="board-head"><span>已完成</span><span class="board-count">{{ done.length }}</span></div>
              <article v-for="task in done" :key="task.id" class="task-card" :class="task.tone" @click="$emit('toast', '已完成任务暂不支持回退')">
                <div class="task-type">{{ task.type }}</div>
                <div class="task-title">{{ task.title }}</div>
                <div class="task-desc">{{ task.desc }}</div>
                <div class="task-foot"><div class="mini-avatars"><span class="mini-avatar">{{ task.owner.slice(0,1) }}</span></div><span class="task-due">{{ task.due }}</span></div>
              </article>
            </div>
          </div>
        </section>

        <div class="stack">
          <section class="card tint-coral">
            <div class="card-head"><div><h2 class="card-title"><app-icon name="alert"></app-icon>风险雷达</h2><p class="card-note">AI 自动关联任务依赖与会议变化</p></div><span class="badge coral">2 项</span></div>
            <div class="signal-list">
              <div class="signal"><div class="signal-icon"><app-icon name="alert"></app-icon></div><div class="signal-body"><div class="signal-title">设计资源可能阻塞关键路径</div><div class="signal-text">影响 3 个下游任务，最早可能延期 3 天。</div><button class="btn sm mt-10" @click="$emit('toast', '已打开资源协调工作流')">处理风险</button></div></div>
              <div class="signal"><div class="signal-icon"><app-icon name="clock"></app-icon></div><div class="signal-body"><div class="signal-title">客户续约材料缺少 ROI 数据</div><div class="signal-text">会议将于 14:00 开始，建议会前补齐。</div></div></div>
            </div>
          </section>
          <section class="card">
            <div class="card-head"><div><h2 class="card-title"><app-icon name="users"></app-icon>团队负载</h2><p class="card-note">未来 7 天</p></div></div>
            <div class="qa-card"><div class="qa-q">陈默 · 研发负责人 <span class="badge coral">112%</span></div><div class="progress coral"><span style="width:88%"></span></div><div class="qa-source">建议将 1 项低优先级任务转交给周可</div></div>
            <div class="qa-card"><div class="qa-q">周可 · 产品经理 <span class="badge lime">76%</span></div><div class="progress lime"><span style="width:76%"></span></div><div class="qa-source">负荷健康，可承接额外协调工作</div></div>
            <div class="qa-card"><div class="qa-q">李慧 · 客户成功 <span class="badge blue">83%</span></div><div class="progress"><span style="width:83%"></span></div><div class="qa-source">2 项客户任务集中在周四</div></div>
          </section>
        </div>
      </div>
    </main>
  `
};
