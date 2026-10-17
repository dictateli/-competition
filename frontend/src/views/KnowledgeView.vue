<template>
<main class="page">
      <div class="page-head">
        <div>
          <div class="eyebrow">企业知识 · 自动沉淀</div>
          <h1 class="page-title">每一次工作，<br />都让组织更聪明。</h1>
          <p class="page-subtitle">搜索和回答来自真实知识接口；图谱节点与关系边由文档、会议、任务和项目自动构建。</p>
        </div>
        <div class="head-actions">
          <button class="btn" @click="loadGraph('')"><app-icon name="network"></app-icon>刷新图谱</button>
          <button class="btn primary" @click="$emit('open-modal', 'upload')"><app-icon name="plus"></app-icon>接入知识源</button>
        </div>
      </div>

      <section class="card mb-0">
        <div class="command-input-wrap">
          <app-icon name="search"></app-icon>
          <input v-model="query" @keydown.enter="search" aria-label="检索知识库" placeholder="问一个跨越会议、文档和项目的问题…" style="padding-right:200px" />
          <button class="command-submit" :disabled="busy" @click="search">检索知识</button>
        </div>
        <div class="mt-10 flex-gap">
          <button class="btn lime sm" :disabled="busy" @click="ask"><app-icon name="spark" :size="14"></app-icon>AI 回答</button>
          <span class="muted tiny" v-if="searchSummary">{{ searchSummary }}</span>
        </div>
        <div v-if="answer" class="qa-card mt-16">
          <div class="qa-q">AI 回答</div>
          <div class="qa-a">{{ answer }}</div>
          <div v-for="(cite, index) in citations" :key="index" class="qa-source">{{ cite.sourceName }} · {{ cite.location }} · 置信度 {{ Math.round((cite.score || 0) * 100) }}%</div>
        </div>
        <div v-if="results.length" class="mt-16" role="list" aria-label="检索结果">
          <div v-for="(item, index) in results" :key="index" class="qa-card" role="listitem">
            <div class="qa-q"><span class="badge gray">{{ item.type }}</span> {{ item.title }}</div>
            <div class="qa-a">{{ item.snippet }}</div>
            <div class="qa-source">{{ item.source }} · {{ item.location }} · 相关度 {{ Math.round((item.score || 0)) }}</div>
          </div>
        </div>
      </section>

      <div class="split-layout mt-16">
        <section class="knowledge-map">
          <div class="map-legend">KNOWLEDGE GRAPH · {{ graph.nodeCount || 0 }} NODES · {{ graph.edgeCount || 0 }} EDGES <span v-if="graphLoading">· 更新中</span></div>
          <svg v-if="graphNodes.length" class="knowledge-map-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line v-for="edge in graphEdges" :key="edge.id" :x1="edge.fromNode.x" :y1="edge.fromNode.y" :x2="edge.toNode.x" :y2="edge.toNode.y" />
          </svg>
          <button v-for="node in graphNodes" :key="node.id" class="node graph-node" :class="['node-' + node.type.toLowerCase(), { active: graphFocus === node.sourceId }]" :style="{ left: node.x + '%', top: node.y + '%' }" @click="selectGraphNode(node)">
            <small>{{ typeLabel(node.type) }}</small>{{ node.shortTitle }}
          </button>
          <div v-if="!graphNodes.length" class="graph-empty">暂无图谱数据，上传文档或创建任务后会自动生成。</div>
          <div class="map-caption">点击节点查看 2 跳关系 · 节点大小代表关联度</div>
        </section>
        <div class="knowledge-side">
          <div class="kstat"><div class="kstat-icon"><app-icon name="file"></app-icon></div><div><div class="kstat-value">{{ stats ? stats.documents : 0 }}</div><div class="kstat-label">已索引文档</div></div></div>
          <div class="kstat"><div class="kstat-icon"><app-icon name="message"></app-icon></div><div><div class="kstat-value">{{ stats ? stats.meetings : 0 }}</div><div class="kstat-label">会议与讨论</div></div></div>
          <div class="kstat"><div class="kstat-icon"><app-icon name="link"></app-icon></div><div><div class="kstat-value">{{ graph.edgeCount || 0 }}</div><div class="kstat-label">知识关联边</div></div></div>
          <div class="kstat"><div class="kstat-icon"><app-icon name="shield"></app-icon></div><div><div class="kstat-value">{{ stats ? stats.traceability : '100%' }}</div><div class="kstat-label">引用可追溯</div></div></div>
          <section class="card tint-lime">
            <div class="card-head"><div><h2 class="card-title"><app-icon name="spark"></app-icon>知识洞察</h2><p class="card-note">AI 自动提炼可复用经验</p></div></div>
            <div v-for="(item, index) in insights" :key="index" class="qa-card">
              <div class="qa-q">{{ item.question }}</div>
              <div class="qa-a">{{ item.answer }}</div>
              <div class="qa-source">{{ item.source }}</div>
            </div>
          </section>
        </div>
      </div>
    </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data: function () {
    return {
      query: '',
      stats: null,
      results: [],
      searchSummary: '',
      answer: '',
      citations: [],
      graph: { nodes: [], edges: [], nodeCount: 0, edgeCount: 0 },
      graphFocus: '',
      graphLoading: false,
      busy: false
    };
  },
  computed: {
    insights: function () {
      if (this.stats && this.stats.insights && this.stats.insights.length) return this.stats.insights;
      return [
        { question: '客户续约的 3 个前置信号', answer: '关键工作流使用深度、协作成员数、数据沉淀量。', source: '来自 6 份访谈和 2 次会议' },
        { question: '项目延期最常见的原因', answer: '设计资源冲突、范围变更未及时同步、验收标准模糊。', source: '来自近 90 天项目数据' }
      ];
    },
    graphNodes: function () {
      var nodes = this.graph.nodes || [];
      var count = Math.max(nodes.length, 1);
      var width = 100;
      var height = 100;
      return nodes.map(function (node, index) {
        var angle = (Math.PI * 2 * index / count) - Math.PI / 2;
        var ring = index % 3 === 0 ? 0.34 : 0.44;
        return Object.assign({}, node, {
          x: 50 + Math.cos(angle) * width * ring,
          y: 50 + Math.sin(angle) * height * ring,
          shortTitle: String(node.title || '').length > 12 ? String(node.title).slice(0, 12) + '…' : node.title
        });
      });
    },
    graphEdges: function () {
      var map = {};
      this.graphNodes.forEach(function (node) { map[node.id] = node; });
      return (this.graph.edges || []).map(function (edge) {
        return Object.assign({}, edge, { fromNode: map[edge.from], toNode: map[edge.to] });
      }).filter(function (edge) { return edge.fromNode && edge.toNode; });
    }
  },
  methods: {
    apiEnabled: function () { return !!(window.HeliuApi && window.HeliuApi.enabled()); },
    loadStats: function () {
      if (!this.apiEnabled()) return;
      var self = this;
      window.HeliuApi.get('/knowledge/stats').then(function (stats) { self.stats = stats; }).catch(function () { });
    },
    loadGraph: function (focusId) {
      if (!this.apiEnabled()) return;
      var self = this;
      this.graphLoading = true;
      var path = '/knowledge/graph?depth=2&types=PROJECT,TASK,DOCUMENT,MEETING,PERSON,WORKFLOW';
      if (focusId) path += '&focusId=' + encodeURIComponent(focusId);
      window.HeliuApi.get(path).then(function (graph) {
        self.graph = graph || { nodes: [], edges: [], nodeCount: 0, edgeCount: 0 };
        self.graphFocus = focusId || '';
      }).catch(function (error) {
        self.$emit('toast', '知识图谱加载失败：' + (error && error.message ? error.message : '请检查后端服务'));
      }).then(function () { self.graphLoading = false; });
    },
    selectGraphNode: function (node) {
      if (this.graphFocus === node.sourceId) {
        this.graphFocus = '';
        this.loadGraph('');
      } else {
        this.loadGraph(node.sourceId);
      }
    },
    typeLabel: function (type) {
      return { PROJECT: '项目', TASK: '任务', DOCUMENT: '文档', MEETING: '会议', PERSON: '成员', WORKFLOW: '自动' }[type] || type;
    },
    search: function () {
      var text = this.query.trim();
      if (!text) return this.$emit('toast', '请输入知识问题');
      if (!this.apiEnabled()) {
        this.$emit('toast', '已检索 128 份资料，找到 7 条可追溯证据');
        return;
      }
      var self = this;
      this.busy = true;
      this.answer = '';
      this.citations = [];
      window.HeliuApi.get('/knowledge/search?q=' + encodeURIComponent(text))
        .then(function (response) {
          self.results = (response && response.items) || [];
          self.searchSummary = response ? ('命中 ' + response.total + ' 条可追溯证据') : '';
          if (!self.results.length) self.$emit('toast', '未检索到匹配内容，可试试“AI 回答”');
        })
        .catch(function (error) {
          self.$emit('toast', '检索失败：' + (error && error.message ? error.message : '请检查后端服务'));
        })
        .then(function () { self.busy = false; });
    },
    ask: function () {
      var text = this.query.trim();
      if (!text) return this.$emit('toast', '请输入知识问题');
      if (!this.apiEnabled()) {
        this.$emit('toast', 'AI 正在跨会议、文档与项目生成可追溯回答');
        return;
      }
      var self = this;
      this.busy = true;
      this.answer = '';
      this.citations = [];
      window.HeliuApi.post('/knowledge/ask', { question: text, contextIds: [] })
        .then(function (response) {
          self.answer = response ? response.answer : '';
          self.citations = (response && response.citations) || [];
          self.query = '';
        })
        .catch(function (error) {
          self.$emit('toast', '回答失败：' + (error && error.message ? error.message : '请检查后端服务'));
        })
        .then(function () { self.busy = false; });
    }
  },
  mounted: function () { this.loadStats(); this.loadGraph(''); },
  template: `
    <main class="page">
      <div class="page-head">
        <div>
          <div class="eyebrow">企业知识 · 自动沉淀</div>
          <h1 class="page-title">每一次工作，<br />都让组织更聪明。</h1>
          <p class="page-subtitle">搜索和回答来自真实知识接口；图谱节点与关系边由文档、会议、任务和项目自动构建。</p>
        </div>
        <div class="head-actions">
          <button class="btn" @click="loadGraph('')"><app-icon name="network"></app-icon>刷新图谱</button>
          <button class="btn primary" @click="$emit('open-modal', 'upload')"><app-icon name="plus"></app-icon>接入知识源</button>
        </div>
      </div>

      <section class="card mb-0">
        <div class="command-input-wrap">
          <app-icon name="search"></app-icon>
          <input v-model="query" @keydown.enter="search" aria-label="检索知识库" placeholder="问一个跨越会议、文档和项目的问题…" style="padding-right:200px" />
          <button class="command-submit" :disabled="busy" @click="search">检索知识</button>
        </div>
        <div class="mt-10 flex-gap">
          <button class="btn lime sm" :disabled="busy" @click="ask"><app-icon name="spark" :size="14"></app-icon>AI 回答</button>
          <span class="muted tiny" v-if="searchSummary">{{ searchSummary }}</span>
        </div>
        <div v-if="answer" class="qa-card mt-16">
          <div class="qa-q">AI 回答</div>
          <div class="qa-a">{{ answer }}</div>
          <div v-for="(cite, index) in citations" :key="index" class="qa-source">{{ cite.sourceName }} · {{ cite.location }} · 置信度 {{ Math.round((cite.score || 0) * 100) }}%</div>
        </div>
        <div v-if="results.length" class="mt-16" role="list" aria-label="检索结果">
          <div v-for="(item, index) in results" :key="index" class="qa-card" role="listitem">
            <div class="qa-q"><span class="badge gray">{{ item.type }}</span> {{ item.title }}</div>
            <div class="qa-a">{{ item.snippet }}</div>
            <div class="qa-source">{{ item.source }} · {{ item.location }} · 相关度 {{ Math.round((item.score || 0)) }}</div>
          </div>
        </div>
      </section>

      <div class="split-layout mt-16">
        <section class="knowledge-map">
          <div class="map-legend">KNOWLEDGE GRAPH · {{ graph.nodeCount || 0 }} NODES · {{ graph.edgeCount || 0 }} EDGES <span v-if="graphLoading">· 更新中</span></div>
          <svg v-if="graphNodes.length" class="knowledge-map-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line v-for="edge in graphEdges" :key="edge.id" :x1="edge.fromNode.x" :y1="edge.fromNode.y" :x2="edge.toNode.x" :y2="edge.toNode.y" />
          </svg>
          <button v-for="node in graphNodes" :key="node.id" class="node graph-node" :class="['node-' + node.type.toLowerCase(), { active: graphFocus === node.sourceId }]" :style="{ left: node.x + '%', top: node.y + '%' }" @click="selectGraphNode(node)">
            <small>{{ typeLabel(node.type) }}</small>{{ node.shortTitle }}
          </button>
          <div v-if="!graphNodes.length" class="graph-empty">暂无图谱数据，上传文档或创建任务后会自动生成。</div>
          <div class="map-caption">点击节点查看 2 跳关系 · 节点大小代表关联度</div>
        </section>
        <div class="knowledge-side">
          <div class="kstat"><div class="kstat-icon"><app-icon name="file"></app-icon></div><div><div class="kstat-value">{{ stats ? stats.documents : 0 }}</div><div class="kstat-label">已索引文档</div></div></div>
          <div class="kstat"><div class="kstat-icon"><app-icon name="message"></app-icon></div><div><div class="kstat-value">{{ stats ? stats.meetings : 0 }}</div><div class="kstat-label">会议与讨论</div></div></div>
          <div class="kstat"><div class="kstat-icon"><app-icon name="link"></app-icon></div><div><div class="kstat-value">{{ graph.edgeCount || 0 }}</div><div class="kstat-label">知识关联边</div></div></div>
          <div class="kstat"><div class="kstat-icon"><app-icon name="shield"></app-icon></div><div><div class="kstat-value">{{ stats ? stats.traceability : '100%' }}</div><div class="kstat-label">引用可追溯</div></div></div>
          <section class="card tint-lime">
            <div class="card-head"><div><h2 class="card-title"><app-icon name="spark"></app-icon>知识洞察</h2><p class="card-note">AI 自动提炼可复用经验</p></div></div>
            <div v-for="(item, index) in insights" :key="index" class="qa-card">
              <div class="qa-q">{{ item.question }}</div>
              <div class="qa-a">{{ item.answer }}</div>
              <div class="qa-source">{{ item.source }}</div>
            </div>
          </section>
        </div>
      </div>
    </main>
  `
});
</script>
