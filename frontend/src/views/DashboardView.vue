<template>
<main class="page">
      <div class="page-head">
        <div>
          <div class="eyebrow">工作台 · {{ todayLabel }}</div>
          <h1 class="page-title">早上好，林然。</h1>
          <p class="page-subtitle">AI 已阅读你今天的 3 场会议、12 条项目更新和 28 份相关文档，并整理出最值得关注的 3 件事。</p>
        </div>
        <div class="head-actions">
          <button class="btn" @click="$emit('open-modal', 'upload')"><app-icon name="upload"></app-icon>导入文档</button>
          <button class="btn lime" @click="$emit('open-modal', 'new-task')"><app-icon name="plus"></app-icon>新建任务</button>
        </div>
      </div>

      <section class="command-bar">
        <div class="command-label"><app-icon name="spark" :size="15"></app-icon>AI WORK COMMAND</div>
        <h2>告诉合流你希望完成什么，它会自动调用文档、会议与项目上下文。</h2>
        <div class="command-input-wrap">
          <app-icon name="wand"></app-icon>
          <input v-model="command" @keydown.enter="submitCommand" placeholder="例如：准备明天客户会的材料，并整理需要确认的 5 个问题" />
          <button class="command-submit" @click="submitCommand">开始执行</button>
        </div>
        <div class="command-suggestions">
          <button class="suggestion" @click="command='总结本周项目风险并生成周报'; submitCommand()">✦ 生成项目周报</button>
          <button class="suggestion" @click="command='找出今天会议中所有待办并分配负责人'; submitCommand()">✦ 整理会议待办</button>
          <button class="suggestion" @click="command='检查星海计划里程碑是否存在延期风险'; submitCommand()">✦ 检查项目风险</button>
        </div>
      </section>

      <div class="dashboard-grid">
        <div class="column">
          <section class="card tint-lime">
            <div class="card-head">
              <div>
                <h2 class="card-title"><app-icon name="target"></app-icon>今日 AI 聚焦</h2>
                <p class="card-note">根据影响力和紧迫度自动排序</p>
              </div>
              <span class="badge lime">3 项关键</span>
            </div>
            <div class="focus-list">
              <div class="focus-item">
                <div class="focus-index">01</div>
                <div class="focus-main"><div class="focus-title">确认星海计划第二阶段范围变更</div><div class="focus-meta">产品评审会 · 会直接影响本周开发排期</div></div>
                <div class="focus-time">10:30</div>
              </div>
              <div class="focus-item">
                <div class="focus-index">02</div>
                <div class="focus-main"><div class="focus-title">补齐客户续约方案的 ROI 测算</div><div class="focus-meta">缺少 2 项关键数据 · AI 已标出引用位置</div></div>
                <div class="focus-time">今天</div>
              </div>
              <div class="focus-item">
                <div class="focus-index">03</div>
                <div class="focus-main"><div class="focus-title">审批设计资源增补申请</div><div class="focus-meta">等待 1 天 · 已阻塞 3 个下游任务</div></div>
                <div class="focus-time">尽快</div>
              </div>
            </div>
          </section>

          <section class="card">
            <div class="card-head">
              <div><h2 class="card-title"><app-icon name="trending"></app-icon>工作流概览</h2><p class="card-note">本周团队协同状态</p></div>
              <button class="card-link" @click="$emit('navigate', 'projects')">查看项目 →</button>
            </div>
            <div class="metrics-row">
              <div class="metric"><div class="metric-label">自动处理事项</div><div class="metric-value">86</div><div class="metric-trend">↑ 24% 较上周</div></div>
              <div class="metric"><div class="metric-label">节省协同时间</div><div class="metric-value">14.5h</div><div class="metric-trend">≈ 1.8 个工作日</div></div>
              <div class="metric"><div class="metric-label">任务准时率</div><div class="metric-value">92%</div><div class="metric-trend warn">2 项存在风险</div></div>
            </div>
          </section>

          <section class="card">
            <div class="card-head">
              <div><h2 class="card-title"><app-icon name="list"></app-icon>下一步行动</h2><p class="card-note">跨会议、聊天和文档自动同步</p></div>
              <span class="badge gray">{{ tasks.length }} 个进行中</span>
            </div>
            <div class="focus-list">
              <div v-for="(task, index) in tasks.slice(0, 4)" :key="index" class="focus-item">
                <div class="focus-index" :style="{ background: task.color || '#132019' }">{{ index + 1 }}</div>
                <div class="focus-main"><div class="focus-title">{{ task.title }}</div><div class="focus-meta">{{ task.project }} · {{ task.owner }}</div></div>
                <div class="focus-time">{{ task.due }}</div>
              </div>
            </div>
          </section>
        </div>

        <div class="column">
          <section class="card tint-blue">
            <div class="card-head">
              <div><h2 class="card-title"><app-icon name="calendar"></app-icon>今天</h2><p class="card-note">3 场会议 · 2 个专注时段</p></div>
              <span class="badge blue">已同步</span>
            </div>
            <div class="schedule-list">
              <div class="schedule-item"><div class="schedule-time">10:30</div><div class="schedule-rail"></div><div><div class="schedule-title">星海计划产品评审</div><div class="schedule-meta">腾讯会议 · 6 人参与</div><div class="schedule-tag"><span class="badge blue">AI 已生成会前简报</span></div></div></div>
              <div class="schedule-item"><div class="schedule-time">14:00</div><div class="schedule-rail"></div><div><div class="schedule-title">客户续约策略沟通</div><div class="schedule-meta">线上会议 · 4 人参与</div><div class="schedule-tag"><span class="badge coral">缺少 2 项材料</span></div></div></div>
              <div class="schedule-item"><div class="schedule-time">16:30</div><div class="schedule-rail"></div><div><div class="schedule-title">增长实验复盘</div><div class="schedule-meta">会议室 A · 5 人参与</div><div class="schedule-tag"><span class="badge lime">自动录制已开启</span></div></div></div>
            </div>
            <button class="btn subtle sm mt-10" @click="$emit('open-modal', 'meeting')"><app-icon name="video"></app-icon>开始 AI 会议</button>
          </section>

          <section class="card">
            <div class="card-head"><div><h2 class="card-title"><app-icon name="shield"></app-icon>项目健康度</h2><p class="card-note">星海计划 · 第二阶段</p></div><span class="badge lime">健康</span></div>
            <div class="project-health">
              <div class="health-ring"><div class="health-ring-value">78<span>综合分</span></div></div>
              <div class="health-copy">
                <h3>进度符合预期</h3>
                <p>关键路径还剩 18 天，设计资源是当前主要风险。</p>
                <div class="progress lime"><span style="width:78%"></span></div>
                <div class="tiny muted">已完成 31 / 40 个里程碑</div>
              </div>
            </div>
          </section>

          <section class="card tint-coral">
            <div class="card-head"><div><h2 class="card-title"><app-icon name="alert"></app-icon>AI 信号雷达</h2><p class="card-note">值得立即关注的变化</p></div></div>
            <div class="signal-list">
              <div class="signal"><div class="signal-icon"><app-icon name="alert"></app-icon></div><div class="signal-body"><div class="signal-title">需求范围在会议中新增 2 项</div><div class="signal-text">当前排期可能延期 3 天，建议今天评审确认。</div></div></div>
              <div class="signal"><div class="signal-icon"><app-icon name="file"></app-icon></div><div class="signal-body"><div class="signal-title">客户反馈文档出现高频关键词</div><div class="signal-text">“数据导出”在近 7 天反馈中增长 180%。</div></div></div>
              <div class="signal"><div class="signal-icon"><app-icon name="check"></app-icon></div><div class="signal-body"><div class="signal-title">周报初稿已自动生成</div><div class="signal-text">已汇总 14 项进展，可直接审阅和补充。</div></div></div>
            </div>
          </section>
        </div>
      </div>
    </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: { tasks: { type: Array, default: function () { return []; } } },
  data: function () { return { command: '' }; },
  computed: {
    todayLabel: function () {
      var now = new Date();
      var weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      return now.getFullYear() + '年' + (now.getMonth() + 1) + '月' + now.getDate() + '日 ' + weekdays[now.getDay()];
    }
  },
  methods: {
    submitCommand: function () {
      var text = this.command.trim();
      if (!text) return this.$emit('toast', '请输入你想完成的工作');
      this.$emit('send-command', text);
      this.command = '';
    }
  },
  template: `
    <main class="page">
      <div class="page-head">
        <div>
          <div class="eyebrow">工作台 · {{ todayLabel }}</div>
          <h1 class="page-title">早上好，林然。</h1>
          <p class="page-subtitle">AI 已阅读你今天的 3 场会议、12 条项目更新和 28 份相关文档，并整理出最值得关注的 3 件事。</p>
        </div>
        <div class="head-actions">
          <button class="btn" @click="$emit('open-modal', 'upload')"><app-icon name="upload"></app-icon>导入文档</button>
          <button class="btn lime" @click="$emit('open-modal', 'new-task')"><app-icon name="plus"></app-icon>新建任务</button>
        </div>
      </div>

      <section class="command-bar">
        <div class="command-label"><app-icon name="spark" :size="15"></app-icon>AI WORK COMMAND</div>
        <h2>告诉合流你希望完成什么，它会自动调用文档、会议与项目上下文。</h2>
        <div class="command-input-wrap">
          <app-icon name="wand"></app-icon>
          <input v-model="command" @keydown.enter="submitCommand" placeholder="例如：准备明天客户会的材料，并整理需要确认的 5 个问题" />
          <button class="command-submit" @click="submitCommand">开始执行</button>
        </div>
        <div class="command-suggestions">
          <button class="suggestion" @click="command='总结本周项目风险并生成周报'; submitCommand()">✦ 生成项目周报</button>
          <button class="suggestion" @click="command='找出今天会议中所有待办并分配负责人'; submitCommand()">✦ 整理会议待办</button>
          <button class="suggestion" @click="command='检查星海计划里程碑是否存在延期风险'; submitCommand()">✦ 检查项目风险</button>
        </div>
      </section>

      <div class="dashboard-grid">
        <div class="column">
          <section class="card tint-lime">
            <div class="card-head">
              <div>
                <h2 class="card-title"><app-icon name="target"></app-icon>今日 AI 聚焦</h2>
                <p class="card-note">根据影响力和紧迫度自动排序</p>
              </div>
              <span class="badge lime">3 项关键</span>
            </div>
            <div class="focus-list">
              <div class="focus-item">
                <div class="focus-index">01</div>
                <div class="focus-main"><div class="focus-title">确认星海计划第二阶段范围变更</div><div class="focus-meta">产品评审会 · 会直接影响本周开发排期</div></div>
                <div class="focus-time">10:30</div>
              </div>
              <div class="focus-item">
                <div class="focus-index">02</div>
                <div class="focus-main"><div class="focus-title">补齐客户续约方案的 ROI 测算</div><div class="focus-meta">缺少 2 项关键数据 · AI 已标出引用位置</div></div>
                <div class="focus-time">今天</div>
              </div>
              <div class="focus-item">
                <div class="focus-index">03</div>
                <div class="focus-main"><div class="focus-title">审批设计资源增补申请</div><div class="focus-meta">等待 1 天 · 已阻塞 3 个下游任务</div></div>
                <div class="focus-time">尽快</div>
              </div>
            </div>
          </section>

          <section class="card">
            <div class="card-head">
              <div><h2 class="card-title"><app-icon name="trending"></app-icon>工作流概览</h2><p class="card-note">本周团队协同状态</p></div>
              <button class="card-link" @click="$emit('navigate', 'projects')">查看项目 →</button>
            </div>
            <div class="metrics-row">
              <div class="metric"><div class="metric-label">自动处理事项</div><div class="metric-value">86</div><div class="metric-trend">↑ 24% 较上周</div></div>
              <div class="metric"><div class="metric-label">节省协同时间</div><div class="metric-value">14.5h</div><div class="metric-trend">≈ 1.8 个工作日</div></div>
              <div class="metric"><div class="metric-label">任务准时率</div><div class="metric-value">92%</div><div class="metric-trend warn">2 项存在风险</div></div>
            </div>
          </section>

          <section class="card">
            <div class="card-head">
              <div><h2 class="card-title"><app-icon name="list"></app-icon>下一步行动</h2><p class="card-note">跨会议、聊天和文档自动同步</p></div>
              <span class="badge gray">{{ tasks.length }} 个进行中</span>
            </div>
            <div class="focus-list">
              <div v-for="(task, index) in tasks.slice(0, 4)" :key="index" class="focus-item">
                <div class="focus-index" :style="{ background: task.color || '#132019' }">{{ index + 1 }}</div>
                <div class="focus-main"><div class="focus-title">{{ task.title }}</div><div class="focus-meta">{{ task.project }} · {{ task.owner }}</div></div>
                <div class="focus-time">{{ task.due }}</div>
              </div>
            </div>
          </section>
        </div>

        <div class="column">
          <section class="card tint-blue">
            <div class="card-head">
              <div><h2 class="card-title"><app-icon name="calendar"></app-icon>今天</h2><p class="card-note">3 场会议 · 2 个专注时段</p></div>
              <span class="badge blue">已同步</span>
            </div>
            <div class="schedule-list">
              <div class="schedule-item"><div class="schedule-time">10:30</div><div class="schedule-rail"></div><div><div class="schedule-title">星海计划产品评审</div><div class="schedule-meta">腾讯会议 · 6 人参与</div><div class="schedule-tag"><span class="badge blue">AI 已生成会前简报</span></div></div></div>
              <div class="schedule-item"><div class="schedule-time">14:00</div><div class="schedule-rail"></div><div><div class="schedule-title">客户续约策略沟通</div><div class="schedule-meta">线上会议 · 4 人参与</div><div class="schedule-tag"><span class="badge coral">缺少 2 项材料</span></div></div></div>
              <div class="schedule-item"><div class="schedule-time">16:30</div><div class="schedule-rail"></div><div><div class="schedule-title">增长实验复盘</div><div class="schedule-meta">会议室 A · 5 人参与</div><div class="schedule-tag"><span class="badge lime">自动录制已开启</span></div></div></div>
            </div>
            <button class="btn subtle sm mt-10" @click="$emit('open-modal', 'meeting')"><app-icon name="video"></app-icon>开始 AI 会议</button>
          </section>

          <section class="card">
            <div class="card-head"><div><h2 class="card-title"><app-icon name="shield"></app-icon>项目健康度</h2><p class="card-note">星海计划 · 第二阶段</p></div><span class="badge lime">健康</span></div>
            <div class="project-health">
              <div class="health-ring"><div class="health-ring-value">78<span>综合分</span></div></div>
              <div class="health-copy">
                <h3>进度符合预期</h3>
                <p>关键路径还剩 18 天，设计资源是当前主要风险。</p>
                <div class="progress lime"><span style="width:78%"></span></div>
                <div class="tiny muted">已完成 31 / 40 个里程碑</div>
              </div>
            </div>
          </section>

          <section class="card tint-coral">
            <div class="card-head"><div><h2 class="card-title"><app-icon name="alert"></app-icon>AI 信号雷达</h2><p class="card-note">值得立即关注的变化</p></div></div>
            <div class="signal-list">
              <div class="signal"><div class="signal-icon"><app-icon name="alert"></app-icon></div><div class="signal-body"><div class="signal-title">需求范围在会议中新增 2 项</div><div class="signal-text">当前排期可能延期 3 天，建议今天评审确认。</div></div></div>
              <div class="signal"><div class="signal-icon"><app-icon name="file"></app-icon></div><div class="signal-body"><div class="signal-title">客户反馈文档出现高频关键词</div><div class="signal-text">“数据导出”在近 7 天反馈中增长 180%。</div></div></div>
              <div class="signal"><div class="signal-icon"><app-icon name="check"></app-icon></div><div class="signal-body"><div class="signal-title">周报初稿已自动生成</div><div class="signal-text">已汇总 14 项进展，可直接审阅和补充。</div></div></div>
            </div>
          </section>
        </div>
      </div>
    </main>
  `
});
</script>
