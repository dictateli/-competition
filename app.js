Vue.config.productionTip = false;

var views = window.FlowViews || {};
Object.keys(views).forEach(function (name) { Vue.component('view-' + name, views[name]); });

new Vue({
  el: '#app',
  data: function () {
    return {
     currentView: 'dashboard',
      sidebarCollapsed: true,
     mobileSidebar: false,
      copilotOpen: false,
      copilotConversationId: null,
      generationPrompt: '',
     modal: null,
      search: '',
      searchOpen: false,
      searchBusy: false,
      searchResults: [],
      searchError: '',
      searchTimer: null,
      toastMessage: '',
      toastTimer: null,
      jitsiMeeting: null,
      jitsiDomain: window.HELIU_JITSI_DOMAIN || 'meet.jit.si',
      workspaceId: window.HELIU_WORKSPACE_ID || 'ws-demo',
      projectId: null,
      activeMeetingId: null,
      apiReady: false,
      viewKey: 0,
      notificationOpen: false,
      notifications: [],
      unreadCount: 0,
      notificationsBusy: false,
      notificationsError: '',
      notificationTimer: null,
      navGroups: [
        { label: '工作空间', items: [
          { id: 'dashboard', label: 'AI 工作台', icon: 'home' },
          { id: 'meetings', label: 'AI 会议', icon: 'video', badge: '3' },
          { id: 'writing', label: '智能写作', icon: 'pen' },
          { id: 'projects', label: '项目管理', icon: 'kanban', badge: '2' },
          { id: 'documents', label: '文档分析', icon: 'file' }
        ] },
        { label: '组织智能', items: [
          { id: 'knowledge', label: '知识中枢', icon: 'network' },
          { id: 'automation', label: '自动化', icon: 'workflow', badge: 'NEW' }
        ] }
      ],
      messages: [
        { role: 'assistant', text: '<p>早上好，林然。我已同步今天的会议和项目变化。</p><p>最值得关注的是：<strong>星海计划新增的数据导出需求可能影响 3 天排期</strong>，建议在今天 10:30 的评审会上先确认范围和优先级。</p>', time: '08:52' },
        { role: 'user', text: '帮我看看还有哪些关键阻塞？', time: '08:54' },
        { role: 'assistant', text: '<p>目前有 2 项：</p><p>1. 设计资源冲突，可能阻塞 3 个下游任务；<br />2. 客户续约方案缺少 ROI 测算。</p><p>我可以把上面的处理建议直接转成任务：</p>', time: '08:54', action: { title: '建议创建的行动', items: ['周一前完成范围与资源评估', '补齐客户续约 ROI 数据'] } }
      ],
      tasks: [
        { id: 1, title: '确认第二阶段范围变更', desc: '补充技术方案和资源影响评估', type: '产品决策', project: '星海计划', owner: '林然', due: '今天', status: 'todo', tone: 'coral', color: '#ff7657', ai: 'AI 建议优先处理' },
        { id: 2, title: '整理数据导出需求清单', desc: '汇总客户访谈中的场景与优先级', type: '客户研究', project: '客户成功', owner: '周可', due: '明天', status: 'todo', tone: '', color: '#667dff' },
        { id: 3, title: '补齐续约方案 ROI 测算', desc: '需要关联增长数据与合同金额', type: '文档任务', project: '客户续约', owner: '李慧', due: '今天 14:00', status: 'doing', tone: 'blue', color: '#667dff', ai: '缺少 2 项关键数据' },
        { id: 4, title: '设计高保真交互稿', desc: '第二阶段核心工作流', type: '设计交付', project: '星海计划', owner: '陈默', due: '9月19日', status: 'doing', tone: '', color: '#a9dc3e' },
        { id: 5, title: '完成客户访谈记录结构化', desc: '7 家重点客户访谈已完成', type: '客户研究', project: '客户成功', owner: '李慧', due: '已完成', status: 'done', tone: '' },
        { id: 6, title: '发布增长实验复盘', desc: '已同步至项目知识库', type: '项目复盘', project: '增长实验', owner: '周可', due: '已完成', status: 'done', tone: '' }
      ]
    };
  },
  computed: {
    currentComponent: function () { return 'view-' + this.currentView; },
    currentLabel: function () {
      var found = 'AI 工作台';
      this.navGroups.forEach(function (group) {
        group.items.forEach(function (item) { if (item.id === this.currentView) found = item.label; }, this);
      }, this);
      return found;
    }
  },
  methods: {
    navigate: function (view) {
      this.currentView = view;
      this.mobileSidebar = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.title = this.currentLabel + ' · 合流 AI';
    },
    openModal: function (value) {
      var presets = {
        'new-task': { type: 'new-task', title: '创建新任务', sub: 'AI 会自动推荐负责人、截止时间与关联上下文', confirmText: '创建任务' },
        'meeting': { type: 'meeting', title: '开始 AI 会议', sub: 'Jitsi Meet 视频会议 · 实时转写 · 智能纪要', confirmText: '创建 Jitsi 会议' },
        'upload': { type: 'upload', title: '上传并分析文档', sub: '自动提取摘要、数据、风险与可执行行动', confirmText: '开始分析' },
        'writing': { type: 'writing', title: '创建 AI 文档', sub: '描述任务，AI 将结合业务上下文生成初稿', confirmText: '生成初稿' }
      };
      this.modal = typeof value === 'string' ? presets[value] : value;
    },
    closeModal: function () { this.modal = null; },
    handleModalSubmit: function (payload) {
      if (payload.type === 'task') {
        this.createTaskRecord(payload);
        this.currentView = 'projects';
      }
      if (payload.type === 'meeting') {
        this.openJitsiMeeting(payload);
        this.modal = null;
        return;
      }
      if (payload.type === 'upload') this.uploadDocument(payload);
      if (payload.type === 'generate' || payload.type === 'writing') {
        this.generationPrompt = payload.prompt || payload.title || '生成一份有数据支撑的项目复盘';
        this.currentView = 'writing';
      }
      this.modal = null;
      this.showToast('已完成 · AI 正在同步关联工作流');
    },
    generateJitsiRoom: function (title) {
      var slug = (title || 'meeting').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 18) || 'meeting';
      return 'heliu-' + slug + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
    },
    openJitsiMeeting: function (payload) {
      var data = typeof payload === 'string' ? { title: payload } : (payload || {});
      var meetingTitle = (data.title && data.title.trim()) ? data.title.trim() : '合流 AI 协作会议';
      var meeting = {
        room: this.generateJitsiRoom(meetingTitle),
        title: meetingTitle,
        userName: '林然',
        meetingId: ''
      };
      this.jitsiMeeting = meeting;
      this.currentView = 'meetings';
      this.createMeetingRecord(meeting);
      this.showToast('Jitsi 会议室已创建，正在连接');
    },
    createMeetingRecord: function (meeting) {
      var base = window.HELIU_API_BASE;
      if (!base || !window.fetch) return;
      var self = this;
      fetch(base.replace(/\/$/, '') + '/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Workspace-Id': this.workspaceId },
        body: JSON.stringify({ title: meeting.title })
      }).then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      }).then(function (payload) {
        if (payload && payload.success && payload.data && payload.data.id && self.jitsiMeeting) {
          self.$set(self.jitsiMeeting, 'meetingId', payload.data.id);
          self.activeMeetingId = payload.data.id;
        }
      }).catch(function () {
        // 后端未启动时，Jitsi 会议室仍可独立演示。
      });
    },
    closeJitsiMeeting: function () {
      this.jitsiMeeting = null;
      this.showToast('已退出 Jitsi 会议室');
    },
    sendCommand: function (text) {
      var value = (text || '').trim();
      if (!value) return;
      this.copilotOpen = true;
      this.messages.push({ role: 'user', text: this.escapeHtml(value), time: this.now() });
      var self = this;
      var scroll = function () {
        self.$nextTick(function () {
          var body = document.querySelector('.copilot-body');
          if (body) body.scrollTop = body.scrollHeight;
        });
      };
      if (!this.apiEnabled()) {
        setTimeout(function () { self.messages.push(self.createResponse(value)); scroll(); }, 320);
        return;
      }
      window.HeliuApi.post('/copilot/chat', {
        message: value,
        conversationId: this.copilotConversationId,
        projectId: this.projectId
      }).then(function (response) {
        self.copilotConversationId = response.conversationId || self.copilotConversationId;
        self.messages.push({
          role: 'assistant',
          text: self.escapeHtml(response.answer || ''),
          time: self.now(),
          citations: response.citations || [],
          action: response.action ? {
            type: response.action.type,
            title: response.action.title,
            items: response.action.items || [],
            taskId: response.action.taskId
          } : null
        });
        if (response.action && response.action.type === 'task_created') self.hydrateTasks();
        scroll();
      }).catch(function (error) {
        self.messages.push(self.createResponse(value));
        self.showToast('Copilot 后端调用失败，已切换演示回答：' + (error && error.message ? error.message : ''));
        scroll();
      });
    },
    sendChat: function (text) { this.sendCommand(text); },
    createResponse: function (text) {
      if (text.indexOf('风险') > -1 || text.indexOf('延期') > -1) {
        return { role: 'assistant', text: '<p>我检查了项目计划、最近 3 次会议和 12 条任务更新，识别出 <strong>2 个关键风险</strong>：设计资源冲突和 ROI 数据缺失。</p><p>前者可能影响关键路径 3 天，建议今天完成范围确认；后者会阻塞 14:00 的客户会。</p>', time: this.now(), action: { title: 'AI 建议创建的行动', items: ['发起设计资源协调', '补齐 ROI 数据并加入会议简报'] } };
      }
      if (text.indexOf('周报') > -1 || text.indexOf('汇报') > -1) {
        return { role: 'assistant', text: '<p>周报初稿已生成，包含 14 项进展、2 个风险、3 项下周计划。</p><p>我已将结论追溯到对应的任务和会议原声，可直接进入智能写作继续调整。</p>', time: this.now() };
      }
      return { role: 'assistant', text: '<p>我已理解目标，并调用了 <strong>3 个数据源</strong>：星海计划、客户反馈分析、最近会议纪要。</p><p>建议拆成“分析 → 生成 → 分发”三个步骤执行。你可以先确认范围和输出对象，我再生成可操作方案。</p>', time: this.now(), action: { title: '建议执行步骤', items: ['汇总相关上下文并生成结论', '创建任务并同步负责人', '在完成后自动通知相关成员'] } };
    },
    executeAction: function (action) {
      if (action && action.type === 'task_created') {
        this.hydrateTasks();
        this.showToast('任务已同步到项目看板');
        return;
      }
      this.tasks.unshift({ id: Date.now(), title: '完成范围与资源评估', desc: '由 AI Copilot 创建', type: 'AI 生成', project: '星海计划', owner: '陈默', due: '9月18日', status: 'todo', tone: 'coral', color: '#ff7657' });
      this.showToast('2 项行动已创建，并同步至项目看板');
      this.hydrateTasks();
    },
    apiEnabled: function () {
      return !!(window.HeliuApi && window.HeliuApi.enabled());
    },
    hydrateFromBackend: function () {
      if (!this.apiEnabled()) return;
      var self = this;
      window.HeliuApi.get('/projects').then(function (projects) {
        if (!projects || !projects.length) return null;
        self.projectId = projects[0].id;
        return self.hydrateTasks();
      }).then(function () {
        self.apiReady = true;
      }).catch(function () {
        self.apiReady = false;
        self.showToast('后端未连接，当前展示离线演示数据');
      });
    },
    hydrateTasks: function () {
      var self = this;
      if (!this.apiEnabled() || !this.projectId) return Promise.resolve();
      var projectId = this.projectId;
      return window.HeliuApi.get('/projects/' + encodeURIComponent(projectId) + '/tasks').then(function (tasks) {
        if (tasks && tasks.length) self.tasks = tasks.map(function (task) { return self.mapTask(task); });
      });
    },
    mapTask: function (task) {
      var tone = task.priority === 'URGENT' ? 'coral' : task.priority === 'HIGH' ? 'blue' : '';
      return {
        id: task.id,
        apiId: task.id,
        title: task.title,
        desc: task.description || '暂无补充说明',
        type: task.milestone ? '里程碑' : this.priorityLabel(task.priority),
        project: '星海计划',
        owner: task.owner,
        due: this.formatDue(task.dueDate),
        status: this.mapStatus(task.status),
        tone: tone,
        color: tone === 'coral' ? '#ff7657' : '#667dff',
        riskScore: task.riskScore,
        ai: task.riskScore >= 60 ? 'AI 识别高风险（评分 ' + task.riskScore + '）' : null
      };
    },
    mapStatus: function (status) {
      if (status === 'DONE') return 'done';
      if (status === 'DOING' || status === 'BLOCKED') return 'doing';
      return 'todo';
    },
    priorityLabel: function (priority) {
      return { URGENT: '紧急', HIGH: '高优先级', MEDIUM: '常规', LOW: '低优先级' }[priority] || '常规';
    },
    formatDue: function (dateText) {
      if (!dateText) return '待定';
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      var due = new Date(dateText + 'T00:00:00');
      var diff = Math.round((due - today) / 86400000);
      if (diff === 0) return '今天';
      if (diff === 1) return '明天';
      if (diff < 0) return '已逾期 ' + Math.abs(diff) + ' 天';
      return (due.getMonth() + 1) + '月' + due.getDate() + '日';
    },
    createTaskRecord: function (payload) {
      var tempId = 'local-' + Date.now();
      this.tasks.unshift({
        id: tempId, title: payload.title, desc: '由 AI 工作流创建，等待补充上下文', type: '新建任务',
        project: '星海计划', owner: payload.owner, due: payload.date.slice(5).replace('-', '/'),
        status: 'todo', tone: 'blue', color: '#667dff'
      });
      if (!this.apiEnabled() || !this.projectId) return;
      var self = this;
      window.HeliuApi.post('/projects/' + encodeURIComponent(this.projectId) + '/tasks', {
        title: payload.title,
        description: '由 AI 工作流创建，等待补充上下文',
        owner: payload.owner,
        priority: 'MEDIUM',
        dueDate: payload.date,
        dependencyIds: [],
        milestone: false
      }).then(function (task) {
        var index = self.tasks.findIndex(function (item) { return item.id === tempId; });
        if (index >= 0) self.$set(self.tasks, index, self.mapTask(task));
      }).catch(function () {
        self.showToast('后端同步失败，已保留本地任务');
      });
    },
    uploadDocument: function (payload) {
      this.currentView = 'documents';
      if (!payload || !payload.file || !this.apiEnabled()) return;
      var form = new FormData();
      form.append('file', payload.file);
      var self = this;
      window.HeliuApi.upload('/documents', form).then(function (doc) {
        self.showToast('《' + (doc && doc.name ? doc.name : payload.name) + '》已上传并完成分析');
        self.loadUnreadCount();
        self.viewKey += 1;
      }).catch(function (error) {
        self.showToast('上传失败：' + (error && error.message ? error.message : '请检查后端服务'));
      });
    },
    moveTask: function (task) {
      var next = task.status === 'todo' ? 'doing' : task.status === 'doing' ? 'done' : null;
      if (!next) { this.showToast('已完成任务暂不支持回退'); return; }
      if (this.apiEnabled() && task.apiId) {
        var self = this;
        var apiStatus = next === 'doing' ? 'DOING' : 'DONE';
        window.HeliuApi.patch('/tasks/' + encodeURIComponent(task.apiId) + '/status', { status: apiStatus })
          .then(function () {
            task.status = next;
            self.showToast('任务状态已同步，AI 已重新计算项目风险');
          })
          .catch(function () { self.showToast('后端同步失败，请稍后重试'); });
      } else {
        task.status = next;
        this.showToast('任务状态已更新，AI 已重新计算项目风险');
      }
    },
    convertActions: function (transcriptRows) {
      if (!this.apiEnabled()) {
        this.showToast('7 项行动已写入项目看板（离线演示）');
        return;
      }
      var self = this;
      this.ensureMeetingSynced(transcriptRows).then(function (meetingId) {
        return window.HeliuApi.post('/meetings/' + encodeURIComponent(meetingId) + '/actions/convert', {
          projectId: self.projectId || 'project-xinghai'
        });
      }).then(function (tasks) {
        var count = tasks ? tasks.length : 0;
        self.showToast(count > 0 ? ('已写入项目看板：' + count + ' 项会议行动') : '该会议暂无行动项');
        self.loadUnreadCount();
        return self.hydrateTasks();
      }).catch(function (error) {
        self.showToast('写入失败：' + (error && error.message ? error.message : '请检查后端服务'));
      });
    },
    ensureMeetingSynced: function (transcriptRows) {
      var self = this;
      return window.HeliuApi.get('/meetings').then(function (meetings) {
        var finishedList = (meetings || []).filter(function (item) { return item.status === 'FINISHED'; });
        var finished = finishedList.filter(function (item) { return item.id === self.activeMeetingId; })[0] || finishedList[0];
        if (finished) {
          self.activeMeetingId = finished.id;
          return finished.id;
        }
        return window.HeliuApi.post('/meetings', { title: '星海计划 · 第二阶段需求评审' }).then(function (meeting) {
          self.activeMeetingId = meeting.id;
          var chain = Promise.resolve();
          (transcriptRows || []).forEach(function (row, index) {
            chain = chain.then(function () {
              return window.HeliuApi.post('/meetings/' + encodeURIComponent(meeting.id) + '/segments', {
                speaker: row.name,
                content: row.text,
                startMs: index * 60000,
                endMs: index * 60000 + 3000,
                confidence: 0.95
              });
            });
          });
          return chain.then(function () {
            return window.HeliuApi.post('/meetings/' + encodeURIComponent(meeting.id) + '/finish', {});
          }).then(function () {
            return meeting.id;
          });
        });
      });
    },    showToast: function (message) {
      this.toastMessage = message;
      var el = document.getElementById('toast');
      if (!el) return;
      el.textContent = message;
      el.classList.add('show');
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2200);
    },
    loadUnreadCount: function () {
      if (!this.apiEnabled()) return;
      var self = this;
      window.HeliuApi.get('/notifications/unread-count')
        .then(function (response) {
          self.unreadCount = response && typeof response.count === 'number' ? response.count : 0;
        })
        .catch(function () { });
    },
    toggleNotifications: function () {
      this.notificationOpen = !this.notificationOpen;
      if (this.notificationOpen) this.loadNotifications();
    },
    loadNotifications: function () {
      if (!this.apiEnabled()) {
        this.notificationsError = '离线模式：连接后端后可查看通知';
        this.notifications = [];
        return;
      }
      var self = this;
      this.notificationsBusy = true;
      this.notificationsError = '';
      window.HeliuApi.get('/notifications')
        .then(function (list) {
          self.notifications = list || [];
          if (!self.notifications.length) self.notificationsError = '暂无通知';
        })
        .catch(function (error) {
          self.notificationsError = error && error.message ? error.message : '通知加载失败';
          self.notifications = [];
        })
        .then(function () { self.notificationsBusy = false; });
    },
    openNotification: function (item) {
      var self = this;
      var go = function () {
        self.notificationOpen = false;
        var view = 'knowledge';
        if (item.sourceType === 'DOCUMENT') view = 'documents';
        else if (item.sourceType === 'MEETING') view = 'meetings';
        else if (item.sourceType === 'TASK' || item.sourceType === 'PROJECT') view = 'projects';
        else if (item.sourceType === 'WORKFLOW_RUN' || item.sourceType === 'WORKFLOW') view = 'automation';
        self.navigate(view);
        self.showToast(item.title);
      };
      if (!this.apiEnabled() || item.read) { go(); return; }
      window.HeliuApi.post('/notifications/' + encodeURIComponent(item.id) + '/read', {})
        .then(function () {
          item.read = true;
          self.unreadCount = Math.max(0, self.unreadCount - 1);
        })
        .catch(function () { })
        .then(go);
    },
    markAllNotificationsRead: function () {
      if (!this.apiEnabled()) { this.showToast('离线模式：连接后端后可用'); return; }
      var self = this;
      window.HeliuApi.post('/notifications/read-all', {})
        .then(function () {
          self.notifications.forEach(function (item) { item.read = true; });
          self.unreadCount = 0;
          self.showToast('已全部标记为已读');
        })
        .catch(function (error) {
          self.showToast('操作失败：' + (error && error.message ? error.message : '请检查后端服务'));
        });
    },
    notificationTime: function (value) {
      if (!value) return '';
      var then = new Date(value);
      var diff = Date.now() - then.getTime();
      if (diff < 60000) return '刚刚';
      if (diff < 3600000) return Math.floor(diff / 60000) + ' 分钟前';
      if (diff < 86400000) return Math.floor(diff / 3600000) + ' 小时前';
      return (then.getMonth() + 1) + '月' + then.getDate() + '日';
    },
    notificationTone: function (level) {
      if (level === 'HIGH') return 'coral';
      if (level === 'SUCCESS') return 'lime';
      if (level === 'MEDIUM') return 'yellow';
      return 'gray';
    },
    now: function () { return new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }); },
    escapeHtml: function (text) { return text.replace(/[&<>"']/g, function (char) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]; }); },
    scheduleSearch: function () {
      var self = this;
      clearTimeout(this.searchTimer);
      var text = this.search.trim();
      if (!text) {
        this.searchOpen = false;
        this.searchResults = [];
        return;
      }
      this.searchOpen = true;
      this.searchTimer = setTimeout(function () { self.runSearch(); }, 260);
    },
    runSearch: function () {
      var text = this.search.trim();
      if (!text) return;
      this.searchOpen = true;
      if (!this.apiEnabled()) {
        this.searchError = '离线模式仅展示命令入口';
        this.searchResults = [];
        return;
      }
      var self = this;
      this.searchBusy = true;
      this.searchError = '';
      window.HeliuApi.get('/search?q=' + encodeURIComponent(text) + '&limit=12')
        .then(function (response) {
          self.searchResults = (response && response.items) || [];
          if (!self.searchResults.length) self.searchError = '没有找到匹配内容';
        })
        .catch(function (error) {
          self.searchError = error && error.message ? error.message : '搜索失败';
          self.searchResults = [];
        })
        .then(function () { self.searchBusy = false; });
    },
    openSearchResult: function (item) {
      this.searchOpen = false;
      var view = 'knowledge';
      if (item.type === 'DOCUMENT') view = 'documents';
      else if (item.type === 'MEETING') view = 'meetings';
      else if (item.type === 'TASK' || item.type === 'PROJECT') view = 'projects';
      else if (item.type === 'WORKFLOW') view = 'automation';
      this.navigate(view);
      this.showToast('已定位到：' + item.title + ' · ' + (item.location || item.source || ''));
    },
    askSearch: function () {
      var text = this.search.trim();
      if (!text) return;
      this.searchOpen = false;
      this.sendCommand('请结合知识库回答：' + text);
    }
  },
  mounted: function () {
    document.title = '合流 AI · 协同办公工作流中枢';
    this.hydrateFromBackend();
    this.loadUnreadCount();
    var self = this;
    this.notificationTimer = window.setInterval(function () { self.loadUnreadCount(); }, 30000);
    this.closeNotificationsOnOutsideClick = function (event) {
      if (!self.notificationOpen) return;
      var wrap = self.$el ? self.$el.querySelector('.notification-wrap') : null;
      if (wrap && !wrap.contains(event.target)) self.notificationOpen = false;
    };
    document.addEventListener('click', this.closeNotificationsOnOutsideClick);
    window.addEventListener('keydown', function (event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        var input = document.querySelector('.global-search input');
        if (input) input.focus();
      }
      if (event.key === 'Escape') { self.modal = null; self.mobileSidebar = false; self.searchOpen = false; self.notificationOpen = false; }
    });
  },
  beforeDestroy: function () {
    if (this.notificationTimer) window.clearInterval(this.notificationTimer);
    if (this.closeNotificationsOnOutsideClick) document.removeEventListener('click', this.closeNotificationsOnOutsideClick);
    if (this.toastTimer) clearTimeout(this.toastTimer);
  },
  template: `
    <div class="app-shell" :class="{ 'sidebar-collapsed': sidebarCollapsed, 'copilot-closed': !copilotOpen }">
      <aside class="sidebar" :class="{ 'mobile-open': mobileSidebar }">
        <div class="brand">
          <div class="brand-mark"><app-icon name="network" :size="22"></app-icon></div>
          <div class="brand-copy"><div class="brand-name">合流<em> AI</em></div><div class="brand-sub">Workflow OS</div></div>
        </div>
        <button class="workspace-switcher" @click="showToast('当前团队：星海产品中心')">
          <div class="workspace-avatar">星</div>
          <div class="workspace-copy"><div class="workspace-name">星海产品中心</div><div class="workspace-meta">企业空间 · 24 位成员</div></div>
          <app-icon name="chevronDown" :size="15"></app-icon>
        </button>
        <nav>
          <div v-for="group in navGroups" :key="group.label" class="nav-group">
            <div class="nav-label">{{ group.label }}</div>
            <button v-for="item in group.items" :key="item.id" class="nav-item" :class="{ active: currentView === item.id }" @click="navigate(item.id)">
              <app-icon :name="item.icon"></app-icon><span class="nav-label-text">{{ item.label }}</span><span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
            </button>
          </div>
        </nav>
        <div class="sidebar-spacer"></div>
        <div class="sidebar-insight">
          <div class="sidebar-insight-head"><app-icon name="spark" :size="12"></app-icon> AI INSIGHT</div>
          <div class="sidebar-insight-title">减少 14.5h 协同时间</div>
          <div class="sidebar-insight-copy">本周自动完成 86 项重复工作，任务准时率提升 12%。</div>
          <button @click="navigate('automation')">查看详情</button>
        </div>
        <div class="sidebar-footer">
          <div class="user-avatar">林</div>
          <div class="sidebar-footer-copy"><div class="sidebar-footer-name">林然</div><div class="sidebar-footer-role">产品负责人</div></div>
          <app-icon name="more" :size="16"></app-icon>
        </div>
      </aside>

      <div v-if="mobileSidebar" class="mobile-overlay show" @click="mobileSidebar = false"></div>

      <section class="main-column">
        <header class="topbar">
          <button class="icon-button mobile-menu" title="打开导航" aria-label="打开导航" @click="mobileSidebar = true"><app-icon name="menu"></app-icon></button>
          <button class="icon-button" :title="sidebarCollapsed ? '展开侧栏' : '收窄侧栏'" :aria-label="sidebarCollapsed ? '展开侧栏' : '收窄侧栏'" :aria-expanded="String(!sidebarCollapsed)" @click="sidebarCollapsed = !sidebarCollapsed"><app-icon name="panel"></app-icon></button>
                    <div class="global-search" :class="{ 'has-results': searchOpen }">
            <app-icon name="search"></app-icon>
            <input v-model="search" @input="scheduleSearch" @focus="search && scheduleSearch()" @keydown.enter="runSearch" aria-label="全局搜索" placeholder="搜索任务、文档、会议或向 AI 提问…" />
            <span class="search-kbd">Ctrl K</span>
            <div v-if="searchOpen" class="global-search-panel">
              <div class="search-panel-head">
                <span>{{ searchBusy ? '正在检索…' : (searchResults.length + ' 条结果') }}</span>
                <button class="search-ask" @click="askSearch">问 AI</button>
              </div>
              <div v-if="searchError" class="search-empty">{{ searchError }}</div>
              <button v-for="item in searchResults" :key="item.type + item.id" class="search-result" @click="openSearchResult(item)">
                <span class="search-type">{{ item.type }}</span>
                <span class="search-result-main"><strong>{{ item.title }}</strong><small>{{ item.snippet }}</small></span>
                <span class="search-score">{{ Math.round((item.score || 0) * 100) }}%</span>
              </button>
            </div>
          </div><div class="topbar-spacer"></div>
          <div class="topbar-status" :class="{ offline: !apiReady }"><span class="status-dot"></span>{{ apiReady ? '后端已连接 · 实时数据' : '离线演示数据' }}</div>
          <div class="notification-wrap">
            <button
              class="icon-button"
              :title="unreadCount ? ('通知 · ' + unreadCount + ' 条未读') : '通知'"
              :aria-label="unreadCount ? ('通知，' + unreadCount + ' 条未读') : '通知'"
              :aria-expanded="String(notificationOpen)"
              @click.stop="toggleNotifications"
            >
              <app-icon name="bell"></app-icon>
              <span v-if="unreadCount" class="notification-badge">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
            </button>
            <div v-if="notificationOpen" class="notification-panel" role="dialog" aria-label="通知中心" @click.stop>
              <div class="notification-head">
                <span>{{ unreadCount ? unreadCount + ' 条未读' : '全部已读' }}</span>
                <button class="card-link" :disabled="!unreadCount" @click="markAllNotificationsRead">全部已读</button>
              </div>
              <div v-if="notificationsBusy" class="search-empty">正在加载…</div>
              <div v-else-if="notificationsError" class="search-empty">{{ notificationsError }}</div>
              <button v-for="item in notifications" :key="item.id" class="notification-item" :class="{ unread: !item.read }" @click="openNotification(item)">
                <span class="notification-dot" :class="notificationTone(item.level)"></span>
                <span class="notification-main">
                  <strong>{{ item.title }}</strong>
                  <small>{{ item.message }}</small>
                  <em>{{ notificationTime(item.createdAt) }}</em>
                </span>
              </button>
            </div>
          </div>
          <button class="icon-button copilot-toggle" @click="copilotOpen = !copilotOpen"><app-icon name="spark"></app-icon><span>{{ copilotOpen ? '收起 Copilot' : '唤起 Copilot' }}</span></button>
        </header>
        <component :is="currentComponent" :key="viewKey" :tasks="tasks" :meeting-id="activeMeetingId" :initial-prompt="generationPrompt" @navigate="navigate" @open-modal="openModal" @toast="showToast" @send-command="sendCommand" @task-move="moveTask" @convert-actions="convertActions" @meeting-created="activeMeetingId = $event" @prompt-consumed="generationPrompt = ''"></component>
      </section>

      <copilot-panel v-if="copilotOpen" :messages="messages" @close="copilotOpen = false" @send="sendChat" @execute="executeAction" @open-source="openSearchResult"></copilot-panel>
      <jitsi-meeting
        v-if="jitsiMeeting"
        :room="jitsiMeeting.room"
        :title="jitsiMeeting.title"
        :user-name="jitsiMeeting.userName"
        :meeting-id="jitsiMeeting.meetingId"
        :domain="jitsiDomain"
        @close="closeJitsiMeeting"
        @toast="showToast"
      ></jitsi-meeting>
      <global-modal :modal="modal" @close="closeModal" @submit="handleModalSubmit"></global-modal>
    </div>
  `
});





