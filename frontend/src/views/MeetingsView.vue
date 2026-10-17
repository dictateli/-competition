<template>
<main class="page">
      <div class="page-head">
        <div>
          <div class="eyebrow">AI 会议 · 实时协作</div>
          <h1 class="page-title">会议不只是记录，<br />而是行动的起点。</h1>
          <p class="page-subtitle">语音识别、说话人分离、决策提取与任务分配在同一工作流中完成。每个结论都能回听原始片段。</p>
        </div>
        <div class="head-actions">
          <button class="btn" @click="$emit('navigate', 'knowledge')"><app-icon name="book"></app-icon>关联知识库</button>
          <button class="btn coral" @click="$emit('open-modal', 'meeting')"><app-icon name="video"></app-icon>开始新会议</button>
        </div>
      </div>

      <section class="meeting-hero">
        <div>
          <span class="badge lime">AI 纪要已生成 · 准确率 96%</span>
          <h2>星海计划 · 第二阶段需求评审</h2>
          <p>2026年9月16日 10:30–11:12 · 6 人参与 · 42 分钟 · 自动关联 8 份项目资料</p>
          <div class="head-actions mt-16">
            <button class="btn lime" @click="togglePlay"><app-icon :name="playing ? 'clock' : 'play'"></app-icon>{{ replayLabel }}</button>
            <button class="btn subtle" @click="copyMinutes"><app-icon name="file"></app-icon>复制纪要</button>
            <button class="btn" :class="{ coral: liveRecording }" @click="toggleLiveTranscription"><app-icon name="mic"></app-icon>{{ liveLabel }}</button>
          </div>
          <div v-if="playing || playbackIndex >= 0" class="replay-status">
            <div class="replay-status-head">
              <span class="replay-live-dot"></span>
              <span>{{ playing ? '正在回听' : '已暂停' }}<template v-if="currentTranscript"> · {{ currentTranscript.name }} {{ currentTranscript.time }}</template></span>
            </div>
            <div class="replay-progress"><span :style="{ width: replayProgress + '%' }"></span></div>
            <div class="replay-tip">点击任意发言可从此处回听</div>
          </div>
        </div>
        <div class="meeting-stats">
          <div class="meeting-stat"><strong>6</strong><span>参与人</span></div>
          <div class="meeting-stat"><strong>4</strong><span>关键决策</span></div>
          <div class="meeting-stat"><strong>7</strong><span>待办事项</span></div>
          <div class="meeting-stat"><strong>3</strong><span>争议点</span></div>
        </div>
      </section>

      <div class="split-layout mt-16">
        <section class="card">
          <div class="card-head">
            <div><h2 class="card-title"><app-icon name="mic"></app-icon>会议内容与证据链</h2><p class="card-note">点击 AI 结论可定位到原始发言</p></div>
            <span class="badge" :class="liveRecording ? 'coral' : 'gray'">{{ liveRecording ? ('实时转写 · ' + liveStatus) : '静态演示记录' }}</span>
          </div>
          <div class="transcript">
            <div v-for="(row, index) in transcript" :key="index" class="transcript-row" :class="{ playing: playbackIndex === index }" @click="jumpToSegment(index)">
              <div class="transcript-avatar">{{ row.name.slice(0,1) }}</div>
              <div><div class="transcript-name">{{ row.name }} <span class="transcript-time">{{ row.time }}</span><span class="transcript-play">{{ playbackIndex === index ? '播放中' : '点击回听' }}</span></div><div class="transcript-text">{{ row.text }}</div></div>
            </div>
          </div>
          <div class="empty-line"></div>
          <div class="generated-note">
            <h4><app-icon name="spark" :size="14"></app-icon> AI 提取的关键决策</h4>
            <p>数据导出能力进入第二阶段候选范围；周一前完成技术方案与资源影响评估后最终确认。</p>
          </div>
        </section>

        <div class="stack">
          <section class="card tint-lime">
            <div class="insight-header"><h3>会后行动</h3><span>已分配 7 项</span></div>
            <div class="insight-row"><div class="insight-check done"></div><div><div class="insight-text">整理数据导出需求清单</div><div class="insight-owner">周可 · 明天 18:00</div></div></div>
            <div class="insight-row"><div class="insight-check"></div><div><div class="insight-text">评估设计与研发资源影响</div><div class="insight-owner">陈默 · 9月18日</div></div></div>
            <div class="insight-row"><div class="insight-check"></div><div><div class="insight-text">补充 5 家客户需求证据</div><div class="insight-owner">李慧 · 9月18日</div></div></div>
            <div class="insight-row"><div class="insight-check"></div><div><div class="insight-text">周一会议前同步决策摘要</div><div class="insight-owner">林然 · 9月21日</div></div></div>
            <button class="btn lime sm mt-10" @click="$emit('convert-actions', transcript)"><app-icon name="kanban"></app-icon>全部写入项目</button>
          </section>

          <section class="card">
            <div class="card-head"><div><h2 class="card-title"><app-icon name="message"></app-icon>AI 会中追问</h2><p class="card-note">基于当前发言与历史资料</p></div></div>
            <div class="qa-card"><div class="qa-q">这个需求为什么被提升优先级？</div><div class="qa-a">近 30 天客户访谈中 5/7 家明确提及，且与续约意愿呈正相关。</div><div class="qa-source">来源：客户访谈记录 · 09/12</div></div>
            <div class="qa-card"><div class="qa-q">如进入本迭代，最大风险是什么？</div><div class="qa-a">设计资源冲突。影响 3 个下游任务，关键路径可能延迟 3 天。</div><div class="qa-source">来源：项目排期 · 实时计算</div></div>
          </section>
        </div>
      </div>
    </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: { meetingId: { type: String, default: '' } },
  data: function () {
    return {
      activeTab: 'summary',
      playing: false,
      playbackIndex: -1,
      speechSupported: !!window.speechSynthesis,
      zhVoice: null,
      playbackTimer: null,
      segmentTimer: null,
      liveRecording: false,
      liveMeetingId: '',
      liveSocket: null,
      recognition: null,
      liveStartedAt: null,
      liveElapsed: 0,
      liveStatus: '未开始',
      transcript: [
        { name: '周可', time: '00:12', text: '第二阶段的核心目标仍然是提升客户留存。我们希望把数据导出能力放进这次迭代。' },
        { name: '陈默', time: '00:41', text: '如果数据导出必须进入本迭代，设计资源会成为关键路径，现有排期预计增加 3 天。' },
        { name: '林然', time: '01:18', text: '先确认这是高优先级客户的共性需求还是单点需求。周一前给出影响范围和替代方案。' },
        { name: '李慧', time: '02:05', text: '客户访谈中 7 家里有 5 家提到了数据导出，可以认为是高优先级普遍需求。' }
      ]
    };
  },
  computed: {
    replayProgress: function () {
      if (!this.transcript.length || this.playbackIndex < 0) return 0;
      return Math.round(((this.playbackIndex + 1) / this.transcript.length) * 100);
    },
    currentTranscript: function () {
      return this.playbackIndex >= 0 ? this.transcript[this.playbackIndex] : null;
    },
    replayLabel: function () {
      return this.playing ? '暂停回听' : (this.playbackIndex >= 0 ? '继续回听' : '回听原声');
    },
    liveLabel: function () {
      if (this.liveRecording) return '停止实时转写 · ' + this.liveElapsed + 's';
      return '开始实时转写';
    }
  },
  methods: {
    loadVoices: function () {
      if (!this.speechSupported) return;
      var voices = window.speechSynthesis.getVoices() || [];
      this.zhVoice = voices.filter(function (voice) {
        return voice.lang && voice.lang.toLowerCase().indexOf('zh') === 0;
      })[0] || null;
    },
    togglePlay: function () {
      if (this.playing) this.pauseReplay();
      else this.startReplay(this.playbackIndex >= 0 ? this.playbackIndex : 0);
    },
    startReplay: function (index) {
      if (!this.transcript.length) return;
      var startIndex = Math.max(0, Math.min(index || 0, this.transcript.length - 1));
      this.clearTimers();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      this.playing = true;
      this.playbackIndex = startIndex;
      this.$emit('toast', '开始回听：' + this.transcript[startIndex].name + ' ' + this.transcript[startIndex].time);
      var self = this;
      this.segmentTimer = window.setTimeout(function () {
        self.speakSegment(startIndex);
      }, 120);
    },
    speakSegment: function (index) {
      if (!this.playing) return;
      if (index >= this.transcript.length) {
        this.finishReplay();
        return;
      }
      var row = this.transcript[index];
      this.playbackIndex = index;
      this.scrollToRow(index);
      if (!this.speechSupported) {
        this.fallbackSegment(index);
        return;
      }
      var utterance = new SpeechSynthesisUtterance(row.text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.96;
      utterance.pitch = row.name === '李慧' ? 1.12 : row.name === '陈默' ? 0.92 : 1.0;
      if (this.zhVoice) utterance.voice = this.zhVoice;
      var self = this;
      utterance.onend = function () {
        if (!self.playing) return;
        self.speakSegment(index + 1);
      };
      utterance.onerror = function () {
        self.$emit('toast', '浏览器语音回听失败，已切换为时间轴回放');
        self.fallbackSegment(index);
      };
      window.speechSynthesis.speak(utterance);
    },
    fallbackSegment: function (index) {
      var self = this;
      this.playbackTimer = window.setTimeout(function () {
        if (!self.playing) return;
        self.speakSegment(index + 1);
      }, 2600);
    },
    pauseReplay: function () {
      this.playing = false;
      this.clearTimers();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      this.$emit('toast', '已暂停回听，点击继续从当前发言播放');
    },
    finishReplay: function () {
      this.playing = false;
      this.playbackIndex = -1;
      this.clearTimers();
      this.$emit('toast', '会议原声回听完成');
    },
    jumpToSegment: function (index) {
      if (this.playing) {
        this.playing = false;
        this.clearTimers();
        if (window.speechSynthesis) window.speechSynthesis.cancel();
      }
      this.startReplay(index);
    },
    clearTimers: function () {
      if (this.playbackTimer) {
        window.clearTimeout(this.playbackTimer);
        this.playbackTimer = null;
      }
      if (this.segmentTimer) {
        window.clearTimeout(this.segmentTimer);
        this.segmentTimer = null;
      }
    },
    scrollToRow: function (index) {
      var self = this;
      this.$nextTick(function () {
        var rows = self.$el.querySelectorAll('.transcript-row');
        if (rows[index] && rows[index].scrollIntoView) {
          rows[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    },
    apiEnabled: function () { return !!(window.HeliuApi && window.HeliuApi.enabled()); },
    wsBase: function () {
      var base = window.HELIU_API_BASE || '';
      if (!base) return '';
      return base.replace(/^http/, 'ws').replace(/\/api\/v1\/?$/, '');
    },
    startLiveTranscription: function () {
      if (!this.apiEnabled()) {
        this.$emit('toast', '实时转写需要连接后端服务');
        return;
      }
      var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        this.$emit('toast', '当前浏览器不支持实时语音识别，请使用 Chrome 或 Edge');
        return;
      }
      var self = this;
      if (this.liveMeetingId || this.meetingId) {
        this.liveMeetingId = this.liveMeetingId || this.meetingId;
        this.beginLiveTranscription(SpeechRecognition);
        return;
      }
      window.HeliuApi.post('/meetings', { title: '实时转写会议' }).then(function (meeting) {
        self.liveMeetingId = meeting.id;
        self.$emit('meeting-created', meeting.id);
        self.beginLiveTranscription(SpeechRecognition);
      }).catch(function (error) {
        self.$emit('toast', '创建会议失败：' + (error && error.message ? error.message : '请检查后端服务'));
      });
    },
    beginLiveTranscription: function (SpeechRecognition) {
      this.liveRecording = true;
      this.liveStartedAt = Date.now();
      this.liveElapsed = 0;
      this.liveStatus = '连接中';
      this.connectTranscriptionSocket();
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'zh-CN';
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      var self = this;
      this.recognition.onresult = function (event) {
        for (var i = event.resultIndex; i < event.results.length; i += 1) {
          if (event.results[i].isFinal) self.appendLiveSegment(event.results[i][0].transcript);
        }
      };
      this.recognition.onerror = function (event) {
        self.$emit('toast', '语音识别异常：' + (event.error || '请检查麦克风权限'));
      };
      this.recognition.onend = function () {
        if (self.liveRecording) {
          setTimeout(function () { if (self.liveRecording) { try { self.recognition.start(); } catch (error) { } } }, 300);
        }
      };
      this.recognition.start();
      this.liveStatus = '转写中';
      this.$emit('toast', '实时转写已开始，请允许浏览器访问麦克风');
    },
    connectTranscriptionSocket: function () {
      var self = this;
      var base = this.wsBase();
      if (!base) return;
      var url = base + '/ws/meetings/' + encodeURIComponent(this.liveMeetingId) + '?workspaceId=' + encodeURIComponent(window.HELIU_WORKSPACE_ID || 'ws-demo');
      this.liveSocket = new WebSocket(url);
      this.liveSocket.onopen = function () { self.liveStatus = '已连接'; };
      this.liveSocket.onerror = function () { self.liveStatus = '连接异常'; self.$emit('toast', '转写通道连接失败，但本地文字仍保留在当前页面'); };
      this.liveSocket.onclose = function () { if (self.liveRecording) self.liveStatus = '重连中'; };
    },
    appendLiveSegment: function (text) {
      var value = (text || '').trim();
      if (!value) return;
      var elapsed = Math.round((Date.now() - (this.liveStartedAt || Date.now())) / 1000);
      this.liveElapsed = elapsed;
      var mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
      var ss = String(elapsed % 60).padStart(2, '0');
      this.transcript.push({ name: '我', time: mm + ':' + ss, text: value });
      if (this.liveSocket && this.liveSocket.readyState === WebSocket.OPEN) {
        this.liveSocket.send(JSON.stringify({ speaker: '我', content: value, startMs: elapsed * 1000, endMs: elapsed * 1000 + 1800, confidence: 0.92 }));
      }
    },
    stopLiveTranscription: function () {
      this.liveRecording = false;
      if (this.recognition) {
        try { this.recognition.stop(); } catch (error) { }
      }
      if (this.liveSocket) {
        try { this.liveSocket.close(); } catch (error) { }
      }
      this.liveStatus = '已停止';
      this.$emit('toast', '实时转写已停止，会议记录已保存');
    },
    toggleLiveTranscription: function () {
      if (this.liveRecording) this.stopLiveTranscription();
      else this.startLiveTranscription();
    },    copyMinutes: function () {
      var lines = this.transcript.map(function (row) {
        return row.name + '（' + row.time + '）：' + row.text;
      });
      var text = '星海计划 · 第二阶段需求评审\n\n' + lines.join('\n');
      var self = this;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          self.$emit('toast', '会议纪要已复制到剪贴板');
        }).catch(function () {
          self.$emit('toast', '复制失败，请检查浏览器权限');
        });
      } else {
        this.$emit('toast', '当前浏览器不支持自动复制');
      }
    }
  },
  mounted: function () {
    this.loadVoices();
    if (this.speechSupported && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = this.loadVoices;
    }
  },
  beforeUnmount: function () {
    this.clearTimers();
    if (this.liveRecording) this.stopLiveTranscription();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  },
  template: `
    <main class="page">
      <div class="page-head">
        <div>
          <div class="eyebrow">AI 会议 · 实时协作</div>
          <h1 class="page-title">会议不只是记录，<br />而是行动的起点。</h1>
          <p class="page-subtitle">语音识别、说话人分离、决策提取与任务分配在同一工作流中完成。每个结论都能回听原始片段。</p>
        </div>
        <div class="head-actions">
          <button class="btn" @click="$emit('navigate', 'knowledge')"><app-icon name="book"></app-icon>关联知识库</button>
          <button class="btn coral" @click="$emit('open-modal', 'meeting')"><app-icon name="video"></app-icon>开始新会议</button>
        </div>
      </div>

      <section class="meeting-hero">
        <div>
          <span class="badge lime">AI 纪要已生成 · 准确率 96%</span>
          <h2>星海计划 · 第二阶段需求评审</h2>
          <p>2026年9月16日 10:30–11:12 · 6 人参与 · 42 分钟 · 自动关联 8 份项目资料</p>
          <div class="head-actions mt-16">
            <button class="btn lime" @click="togglePlay"><app-icon :name="playing ? 'clock' : 'play'"></app-icon>{{ replayLabel }}</button>
            <button class="btn subtle" @click="copyMinutes"><app-icon name="file"></app-icon>复制纪要</button>
            <button class="btn" :class="{ coral: liveRecording }" @click="toggleLiveTranscription"><app-icon name="mic"></app-icon>{{ liveLabel }}</button>
          </div>
          <div v-if="playing || playbackIndex >= 0" class="replay-status">
            <div class="replay-status-head">
              <span class="replay-live-dot"></span>
              <span>{{ playing ? '正在回听' : '已暂停' }}<template v-if="currentTranscript"> · {{ currentTranscript.name }} {{ currentTranscript.time }}</template></span>
            </div>
            <div class="replay-progress"><span :style="{ width: replayProgress + '%' }"></span></div>
            <div class="replay-tip">点击任意发言可从此处回听</div>
          </div>
        </div>
        <div class="meeting-stats">
          <div class="meeting-stat"><strong>6</strong><span>参与人</span></div>
          <div class="meeting-stat"><strong>4</strong><span>关键决策</span></div>
          <div class="meeting-stat"><strong>7</strong><span>待办事项</span></div>
          <div class="meeting-stat"><strong>3</strong><span>争议点</span></div>
        </div>
      </section>

      <div class="split-layout mt-16">
        <section class="card">
          <div class="card-head">
            <div><h2 class="card-title"><app-icon name="mic"></app-icon>会议内容与证据链</h2><p class="card-note">点击 AI 结论可定位到原始发言</p></div>
            <span class="badge" :class="liveRecording ? 'coral' : 'gray'">{{ liveRecording ? ('实时转写 · ' + liveStatus) : '静态演示记录' }}</span>
          </div>
          <div class="transcript">
            <div v-for="(row, index) in transcript" :key="index" class="transcript-row" :class="{ playing: playbackIndex === index }" @click="jumpToSegment(index)">
              <div class="transcript-avatar">{{ row.name.slice(0,1) }}</div>
              <div><div class="transcript-name">{{ row.name }} <span class="transcript-time">{{ row.time }}</span><span class="transcript-play">{{ playbackIndex === index ? '播放中' : '点击回听' }}</span></div><div class="transcript-text">{{ row.text }}</div></div>
            </div>
          </div>
          <div class="empty-line"></div>
          <div class="generated-note">
            <h4><app-icon name="spark" :size="14"></app-icon> AI 提取的关键决策</h4>
            <p>数据导出能力进入第二阶段候选范围；周一前完成技术方案与资源影响评估后最终确认。</p>
          </div>
        </section>

        <div class="stack">
          <section class="card tint-lime">
            <div class="insight-header"><h3>会后行动</h3><span>已分配 7 项</span></div>
            <div class="insight-row"><div class="insight-check done"></div><div><div class="insight-text">整理数据导出需求清单</div><div class="insight-owner">周可 · 明天 18:00</div></div></div>
            <div class="insight-row"><div class="insight-check"></div><div><div class="insight-text">评估设计与研发资源影响</div><div class="insight-owner">陈默 · 9月18日</div></div></div>
            <div class="insight-row"><div class="insight-check"></div><div><div class="insight-text">补充 5 家客户需求证据</div><div class="insight-owner">李慧 · 9月18日</div></div></div>
            <div class="insight-row"><div class="insight-check"></div><div><div class="insight-text">周一会议前同步决策摘要</div><div class="insight-owner">林然 · 9月21日</div></div></div>
            <button class="btn lime sm mt-10" @click="$emit('convert-actions', transcript)"><app-icon name="kanban"></app-icon>全部写入项目</button>
          </section>

          <section class="card">
            <div class="card-head"><div><h2 class="card-title"><app-icon name="message"></app-icon>AI 会中追问</h2><p class="card-note">基于当前发言与历史资料</p></div></div>
            <div class="qa-card"><div class="qa-q">这个需求为什么被提升优先级？</div><div class="qa-a">近 30 天客户访谈中 5/7 家明确提及，且与续约意愿呈正相关。</div><div class="qa-source">来源：客户访谈记录 · 09/12</div></div>
            <div class="qa-card"><div class="qa-q">如进入本迭代，最大风险是什么？</div><div class="qa-a">设计资源冲突。影响 3 个下游任务，关键路径可能延迟 3 天。</div><div class="qa-source">来源：项目排期 · 实时计算</div></div>
          </section>
        </div>
      </div>
    </main>
  `
});
</script>
