var V=Object.defineProperty;var W=(i,s,n)=>s in i?V(i,s,{enumerable:!0,configurable:!0,writable:!0,value:n}):i[s]=n;var U=(i,s,n)=>W(i,typeof s!="symbol"?s+"":s,n);import{d as T,_ as S,c as r,a as t,b as c,e as p,t as a,w as O,F as f,r as b,f as g,n as k,g as y,v as C,h as E,i as L,j as K,k as $,o as d,l as A,m as B,p as X,q as H,s as Q}from"./_plugin-vue_export-helper-DePLTgHQ.js";const Y=T({data:function(){return{currentView:"dashboard",sidebarCollapsed:!0,mobileSidebar:!1,copilotOpen:!1,copilotConversationId:null,generationPrompt:"",modal:null,search:"",searchOpen:!1,searchBusy:!1,searchResults:[],searchError:"",searchTimer:null,toastMessage:"",toastTimer:null,jitsiMeeting:null,jitsiDomain:window.HELIU_JITSI_DOMAIN||"meet.jit.si",workspaceId:window.HELIU_WORKSPACE_ID||"ws-demo",workspaceMenuOpen:!1,workspaces:[{id:"ws-demo",name:"星海产品中心",meta:"企业空间 · 24 位成员",current:!0},{id:"ws-growth",name:"增长实验室",meta:"企业空间 · 9 位成员",current:!1}],projectId:null,activeMeetingId:null,apiReady:!1,viewKey:0,notificationOpen:!1,notifications:[],unreadCount:0,notificationsBusy:!1,notificationsError:"",notificationTimer:null,navGroups:[{label:"工作空间",items:[{id:"dashboard",label:"AI 工作台",icon:"home"},{id:"meetings",label:"AI 会议",icon:"video",badge:"3"},{id:"writing",label:"智能写作",icon:"pen"},{id:"projects",label:"项目管理",icon:"kanban",badge:"2"},{id:"documents",label:"文档分析",icon:"file"}]},{label:"组织智能",items:[{id:"knowledge",label:"知识中枢",icon:"network"},{id:"automation",label:"自动化",icon:"workflow",badge:"NEW"}]}],messages:[{role:"assistant",text:"<p>早上好，林然。我已同步今天的会议和项目变化。</p><p>最值得关注的是：<strong>星海计划新增的数据导出需求可能影响 3 天排期</strong>，建议在今天 10:30 的评审会上先确认范围和优先级。</p>",time:"08:52"},{role:"user",text:"帮我看看还有哪些关键阻塞？",time:"08:54"},{role:"assistant",text:"<p>目前有 2 项：</p><p>1. 设计资源冲突，可能阻塞 3 个下游任务；<br />2. 客户续约方案缺少 ROI 测算。</p><p>我可以把上面的处理建议直接转成任务：</p>",time:"08:54",action:{title:"建议创建的行动",items:["周一前完成范围与资源评估","补齐客户续约 ROI 数据"]}}],tasks:[{id:1,title:"确认第二阶段范围变更",desc:"补充技术方案和资源影响评估",type:"产品决策",project:"星海计划",owner:"林然",due:"今天",status:"todo",tone:"coral",color:"#ff7657",ai:"AI 建议优先处理"},{id:2,title:"整理数据导出需求清单",desc:"汇总客户访谈中的场景与优先级",type:"客户研究",project:"客户成功",owner:"周可",due:"明天",status:"todo",tone:"",color:"#667dff"},{id:3,title:"补齐续约方案 ROI 测算",desc:"需要关联增长数据与合同金额",type:"文档任务",project:"客户续约",owner:"李慧",due:"今天 14:00",status:"doing",tone:"blue",color:"#667dff",ai:"缺少 2 项关键数据"},{id:4,title:"设计高保真交互稿",desc:"第二阶段核心工作流",type:"设计交付",project:"星海计划",owner:"陈默",due:"9月19日",status:"doing",tone:"",color:"#a9dc3e"},{id:5,title:"完成客户访谈记录结构化",desc:"7 家重点客户访谈已完成",type:"客户研究",project:"客户成功",owner:"李慧",due:"已完成",status:"done",tone:""},{id:6,title:"发布增长实验复盘",desc:"已同步至项目知识库",type:"项目复盘",project:"增长实验",owner:"周可",due:"已完成",status:"done",tone:""}]}},computed:{currentComponent:function(){return"view-"+this.currentView},currentWorkspace:function(){var i=null;return(this.workspaces||[]).forEach(function(s){s.id===this.workspaceId&&(i=s)},this),i||{id:this.workspaceId,name:"星海产品中心",meta:"企业空间 · 24 位成员"}},currentLabel:function(){var i="AI 工作台";return this.navGroups.forEach(function(s){s.items.forEach(function(n){n.id===this.currentView&&(i=n.label)},this)},this),i}},methods:{navigate:function(i){this.currentView=i,this.mobileSidebar=!1,window.scrollTo({top:0,behavior:"smooth"}),document.title=this.currentLabel+" · 合流 AI"},openModal:function(i){var s={"new-task":{type:"new-task",title:"创建新任务",sub:"AI 会自动推荐负责人、截止时间与关联上下文",confirmText:"创建任务"},meeting:{type:"meeting",title:"开始 AI 会议",sub:"Jitsi Meet 视频会议 · 实时转写 · 智能纪要",confirmText:"创建 Jitsi 会议"},upload:{type:"upload",title:"上传并分析文档",sub:"自动提取摘要、数据、风险与可执行行动",confirmText:"开始分析"},writing:{type:"writing",title:"创建 AI 文档",sub:"描述任务，AI 将结合业务上下文生成初稿",confirmText:"生成初稿"}};this.modal=typeof i=="string"?s[i]:i},closeModal:function(){this.modal=null},handleModalSubmit:function(i){if(i.type==="task"&&(this.createTaskRecord(i),this.currentView="projects"),i.type==="meeting"){this.openJitsiMeeting(i),this.modal=null;return}i.type==="upload"&&this.uploadDocument(i),(i.type==="generate"||i.type==="writing")&&(this.generationPrompt=i.prompt||i.title||"生成一份有数据支撑的项目复盘",this.currentView="writing"),this.modal=null,this.showToast("已完成 · AI 正在同步关联工作流")},generateJitsiRoom:function(i){var s=(i||"meeting").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,18)||"meeting";return"heliu-"+s+"-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,6)},openJitsiMeeting:function(i){var s=typeof i=="string"?{title:i}:i||{},n=s.title&&s.title.trim()?s.title.trim():"合流 AI 协作会议",o={room:this.generateJitsiRoom(n),title:n,userName:"林然",meetingId:""};this.jitsiMeeting=o,this.currentView="meetings",this.createMeetingRecord(o),this.showToast("Jitsi 会议室已创建，正在连接")},createMeetingRecord:function(i){var s=this;!window.HeliuApi||!window.HeliuApi.enabled()||window.HeliuApi.post("/meetings",{title:i.title}).then(function(n){n&&n.id&&s.jitsiMeeting&&(s.jitsiMeeting.meetingId=n.id,s.activeMeetingId=n.id)}).catch(function(){})},closeJitsiMeeting:function(){this.jitsiMeeting=null,this.showToast("已退出 Jitsi 会议室")},sendCommand:function(i){var s=(i||"").trim();if(s){this.copilotOpen=!0,this.messages.push({role:"user",text:this.escapeHtml(s),time:this.now()});var n=this,o=function(){n.$nextTick(function(){var u=document.querySelector(".copilot-body");u&&(u.scrollTop=u.scrollHeight)})};if(!this.apiEnabled()){setTimeout(function(){n.messages.push(n.createResponse(s)),o()},320);return}window.HeliuApi.post("/copilot/chat",{message:s,conversationId:this.copilotConversationId,projectId:this.projectId}).then(function(u){n.copilotConversationId=u.conversationId||n.copilotConversationId,n.messages.push({role:"assistant",text:n.escapeHtml(u.answer||""),time:n.now(),citations:u.citations||[],action:u.action?{type:u.action.type,title:u.action.title,items:u.action.items||[],taskId:u.action.taskId}:null}),u.action&&u.action.type==="task_created"&&n.hydrateTasks(),o()}).catch(function(u){n.messages.push(n.createResponse(s)),n.showToast("Copilot 后端调用失败，已切换演示回答："+(u&&u.message?u.message:"")),o()})}},sendChat:function(i){this.sendCommand(i)},createResponse:function(i){return i.indexOf("风险")>-1||i.indexOf("延期")>-1?{role:"assistant",text:"<p>我检查了项目计划、最近 3 次会议和 12 条任务更新，识别出 <strong>2 个关键风险</strong>：设计资源冲突和 ROI 数据缺失。</p><p>前者可能影响关键路径 3 天，建议今天完成范围确认；后者会阻塞 14:00 的客户会。</p>",time:this.now(),action:{title:"AI 建议创建的行动",items:["发起设计资源协调","补齐 ROI 数据并加入会议简报"]}}:i.indexOf("周报")>-1||i.indexOf("汇报")>-1?{role:"assistant",text:"<p>周报初稿已生成，包含 14 项进展、2 个风险、3 项下周计划。</p><p>我已将结论追溯到对应的任务和会议原声，可直接进入智能写作继续调整。</p>",time:this.now()}:{role:"assistant",text:"<p>我已理解目标，并调用了 <strong>3 个数据源</strong>：星海计划、客户反馈分析、最近会议纪要。</p><p>建议拆成“分析 → 生成 → 分发”三个步骤执行。你可以先确认范围和输出对象，我再生成可操作方案。</p>",time:this.now(),action:{title:"建议执行步骤",items:["汇总相关上下文并生成结论","创建任务并同步负责人","在完成后自动通知相关成员"]}}},executeAction:function(i){if(i&&i.type==="task_created"){this.hydrateTasks(),this.showToast("任务已同步到项目看板");return}this.tasks.unshift({id:Date.now(),title:"完成范围与资源评估",desc:"由 AI Copilot 创建",type:"AI 生成",project:"星海计划",owner:"陈默",due:"9月18日",status:"todo",tone:"coral",color:"#ff7657"}),this.showToast("2 项行动已创建，并同步至项目看板"),this.hydrateTasks()},apiEnabled:function(){return!!(window.HeliuApi&&window.HeliuApi.enabled())},loadWorkspaces:function(){if(this.apiEnabled()){var i=this;window.HeliuApi.get("/workspaces").then(function(s){s&&s.length&&(i.workspaces=s)}).catch(function(){})}},switchWorkspace:function(i){this.workspaceMenuOpen=!1,!(!i||i.id===this.workspaceId)&&(this.workspaceId=i.id,window.HELIU_WORKSPACE_ID=i.id,this.projectId=null,this.tasks=[],this.viewKey+=1,this.hydrateFromBackend(),this.loadUnreadCount(),this.showToast("已切换到「"+i.name+"」"))},hydrateFromBackend:function(){if(this.apiEnabled()){var i=this;window.HeliuApi.get("/projects").then(function(s){return!s||!s.length?null:(i.projectId=s[0].id,i.hydrateTasks())}).then(function(){i.apiReady=!0}).catch(function(){i.apiReady=!1,i.showToast("后端未连接，当前展示离线演示数据")})}},hydrateTasks:function(){var i=this;if(!this.apiEnabled()||!this.projectId)return Promise.resolve();var s=this.projectId;return window.HeliuApi.get("/projects/"+encodeURIComponent(s)+"/tasks").then(function(n){n&&n.length&&(i.tasks=n.map(function(o){return i.mapTask(o)}))})},mapTask:function(i){var s=i.priority==="URGENT"?"coral":i.priority==="HIGH"?"blue":"";return{id:i.id,apiId:i.id,title:i.title,desc:i.description||"暂无补充说明",type:i.milestone?"里程碑":this.priorityLabel(i.priority),project:"星海计划",owner:i.owner,due:this.formatDue(i.dueDate),status:this.mapStatus(i.status),tone:s,color:s==="coral"?"#ff7657":"#667dff",riskScore:i.riskScore,ai:i.riskScore>=60?"AI 识别高风险（评分 "+i.riskScore+"）":null}},mapStatus:function(i){return i==="DONE"?"done":i==="DOING"||i==="BLOCKED"?"doing":"todo"},priorityLabel:function(i){return{URGENT:"紧急",HIGH:"高优先级",MEDIUM:"常规",LOW:"低优先级"}[i]||"常规"},formatDue:function(i){if(!i)return"待定";var s=new Date;s.setHours(0,0,0,0);var n=new Date(i+"T00:00:00"),o=Math.round((n-s)/864e5);return o===0?"今天":o===1?"明天":o<0?"已逾期 "+Math.abs(o)+" 天":n.getMonth()+1+"月"+n.getDate()+"日"},createTaskRecord:function(i){var s="local-"+Date.now();if(this.tasks.unshift({id:s,title:i.title,desc:"由 AI 工作流创建，等待补充上下文",type:"新建任务",project:"星海计划",owner:i.owner,due:i.date.slice(5).replace("-","/"),status:"todo",tone:"blue",color:"#667dff"}),!(!this.apiEnabled()||!this.projectId)){var n=this;window.HeliuApi.post("/projects/"+encodeURIComponent(this.projectId)+"/tasks",{title:i.title,description:"由 AI 工作流创建，等待补充上下文",owner:i.owner,priority:"MEDIUM",dueDate:i.date,dependencyIds:[],milestone:!1}).then(function(o){var u=n.tasks.findIndex(function(h){return h.id===s});u>=0&&(n.tasks[u]=n.mapTask(o))}).catch(function(){n.showToast("后端同步失败，已保留本地任务")})}},uploadDocument:function(i){if(this.currentView="documents",!(!i||!i.file||!this.apiEnabled())){var s=new FormData;s.append("file",i.file);var n=this;window.HeliuApi.upload("/documents",s).then(function(o){n.showToast("《"+(o&&o.name?o.name:i.name)+"》已上传并完成分析"),n.loadUnreadCount(),n.viewKey+=1}).catch(function(o){n.showToast("上传失败："+(o&&o.message?o.message:"请检查后端服务"))})}},moveTask:function(i){var s=i.status==="todo"?"doing":i.status==="doing"?"done":null;if(!s){this.showToast("已完成任务暂不支持回退");return}if(this.apiEnabled()&&i.apiId){var n=this,o=s==="doing"?"DOING":"DONE";window.HeliuApi.patch("/tasks/"+encodeURIComponent(i.apiId)+"/status",{status:o}).then(function(){i.status=s,n.showToast("任务状态已同步，AI 已重新计算项目风险")}).catch(function(){n.showToast("后端同步失败，请稍后重试")})}else i.status=s,this.showToast("任务状态已更新，AI 已重新计算项目风险")},convertActions:function(i){if(!this.apiEnabled()){this.showToast("7 项行动已写入项目看板（离线演示）");return}var s=this;this.ensureMeetingSynced(i).then(function(n){return window.HeliuApi.post("/meetings/"+encodeURIComponent(n)+"/actions/convert",{projectId:s.projectId||"project-xinghai"})}).then(function(n){var o=n?n.length:0;return s.showToast(o>0?"已写入项目看板："+o+" 项会议行动":"该会议暂无行动项"),s.loadUnreadCount(),s.hydrateTasks()}).catch(function(n){s.showToast("写入失败："+(n&&n.message?n.message:"请检查后端服务"))})},ensureMeetingSynced:function(i){var s=this;return window.HeliuApi.get("/meetings").then(function(n){var o=(n||[]).filter(function(h){return h.status==="FINISHED"}),u=o.filter(function(h){return h.id===s.activeMeetingId})[0]||o[0];return u?(s.activeMeetingId=u.id,u.id):window.HeliuApi.post("/meetings",{title:"星海计划 · 第二阶段需求评审"}).then(function(h){s.activeMeetingId=h.id;var l=Promise.resolve();return(i||[]).forEach(function(e,m){l=l.then(function(){return window.HeliuApi.post("/meetings/"+encodeURIComponent(h.id)+"/segments",{speaker:e.name,content:e.text,startMs:m*6e4,endMs:m*6e4+3e3,confidence:.95})})}),l.then(function(){return window.HeliuApi.post("/meetings/"+encodeURIComponent(h.id)+"/finish",{})}).then(function(){return h.id})})})},showToast:function(i){this.toastMessage=i;var s=document.getElementById("toast");s&&(s.textContent=i,s.classList.add("show"),clearTimeout(this.toastTimer),this.toastTimer=setTimeout(function(){s.classList.remove("show")},2200))},loadUnreadCount:function(){if(this.apiEnabled()){var i=this;window.HeliuApi.get("/notifications/unread-count").then(function(s){i.unreadCount=s&&typeof s.count=="number"?s.count:0}).catch(function(){})}},toggleNotifications:function(){this.notificationOpen=!this.notificationOpen,this.notificationOpen&&this.loadNotifications()},loadNotifications:function(){if(!this.apiEnabled()){this.notificationsError="离线模式：连接后端后可查看通知",this.notifications=[];return}var i=this;this.notificationsBusy=!0,this.notificationsError="",window.HeliuApi.get("/notifications").then(function(s){i.notifications=s||[],i.notifications.length||(i.notificationsError="暂无通知")}).catch(function(s){i.notificationsError=s&&s.message?s.message:"通知加载失败",i.notifications=[]}).then(function(){i.notificationsBusy=!1})},openNotification:function(i){var s=this,n=function(){s.notificationOpen=!1;var o="knowledge";i.sourceType==="DOCUMENT"?o="documents":i.sourceType==="MEETING"?o="meetings":i.sourceType==="TASK"||i.sourceType==="PROJECT"?o="projects":(i.sourceType==="WORKFLOW_RUN"||i.sourceType==="WORKFLOW")&&(o="automation"),s.navigate(o),s.showToast(i.title)};if(!this.apiEnabled()||i.read){n();return}window.HeliuApi.post("/notifications/"+encodeURIComponent(i.id)+"/read",{}).then(function(){i.read=!0,s.unreadCount=Math.max(0,s.unreadCount-1)}).catch(function(){}).then(n)},markAllNotificationsRead:function(){if(!this.apiEnabled()){this.showToast("离线模式：连接后端后可用");return}var i=this;window.HeliuApi.post("/notifications/read-all",{}).then(function(){i.notifications.forEach(function(s){s.read=!0}),i.unreadCount=0,i.showToast("已全部标记为已读")}).catch(function(s){i.showToast("操作失败："+(s&&s.message?s.message:"请检查后端服务"))})},notificationTime:function(i){if(!i)return"";var s=new Date(i),n=Date.now()-s.getTime();return n<6e4?"刚刚":n<36e5?Math.floor(n/6e4)+" 分钟前":n<864e5?Math.floor(n/36e5)+" 小时前":s.getMonth()+1+"月"+s.getDate()+"日"},notificationTone:function(i){return i==="HIGH"?"coral":i==="SUCCESS"?"lime":i==="MEDIUM"?"yellow":"gray"},now:function(){return new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"})},escapeHtml:function(i){return i.replace(/[&<>"']/g,function(s){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[s]})},scheduleSearch:function(){var i=this;clearTimeout(this.searchTimer);var s=this.search.trim();if(!s){this.searchOpen=!1,this.searchResults=[];return}this.searchOpen=!0,this.searchTimer=setTimeout(function(){i.runSearch()},260)},runSearch:function(){var i=this.search.trim();if(i){if(this.searchOpen=!0,!this.apiEnabled()){this.searchError="离线模式仅展示命令入口",this.searchResults=[];return}var s=this;this.searchBusy=!0,this.searchError="",window.HeliuApi.get("/search?q="+encodeURIComponent(i)+"&limit=12").then(function(n){s.searchResults=n&&n.items||[],s.searchResults.length||(s.searchError="没有找到匹配内容")}).catch(function(n){s.searchError=n&&n.message?n.message:"搜索失败",s.searchResults=[]}).then(function(){s.searchBusy=!1})}},openSearchResult:function(i){this.searchOpen=!1;var s="knowledge";i.type==="DOCUMENT"?s="documents":i.type==="MEETING"?s="meetings":i.type==="TASK"||i.type==="PROJECT"?s="projects":i.type==="WORKFLOW"&&(s="automation"),this.navigate(s),this.showToast("已定位到："+i.title+" · "+(i.location||i.source||""))},askSearch:function(){var i=this.search.trim();i&&(this.searchOpen=!1,this.sendCommand("请结合知识库回答："+i))}},mounted:function(){document.title="合流 AI · 协同办公工作流中枢",this.loadWorkspaces(),this.hydrateFromBackend(),this.loadUnreadCount();var i=this;this.notificationTimer=window.setInterval(function(){i.loadUnreadCount()},3e4),this.closeNotificationsOnOutsideClick=function(s){if(i.notificationOpen){var n=i.$el?i.$el.querySelector(".notification-wrap"):null;n&&!n.contains(s.target)&&(i.notificationOpen=!1)}},this.closeWorkspaceMenuOnOutsideClick=function(s){if(i.workspaceMenuOpen){var n=i.$el?i.$el.querySelector(".workspace-switcher-wrap"):null;n&&!n.contains(s.target)&&(i.workspaceMenuOpen=!1)}},document.addEventListener("click",this.closeNotificationsOnOutsideClick),document.addEventListener("click",this.closeWorkspaceMenuOnOutsideClick),window.addEventListener("keydown",function(s){if((s.ctrlKey||s.metaKey)&&s.key.toLowerCase()==="k"){s.preventDefault();var n=document.querySelector(".global-search input");n&&n.focus()}s.key==="Escape"&&(i.modal=null,i.mobileSidebar=!1,i.searchOpen=!1,i.notificationOpen=!1)})},beforeUnmount:function(){this.notificationTimer&&window.clearInterval(this.notificationTimer),this.closeNotificationsOnOutsideClick&&document.removeEventListener("click",this.closeNotificationsOnOutsideClick),this.closeWorkspaceMenuOnOutsideClick&&document.removeEventListener("click",this.closeWorkspaceMenuOnOutsideClick),this.toastTimer&&clearTimeout(this.toastTimer)}}),Z={class:"brand"},_={class:"brand-mark"},x={class:"workspace-switcher-wrap"},ss=["aria-expanded"],is={class:"workspace-avatar"},ts={class:"workspace-copy"},es={class:"workspace-name"},ns={class:"workspace-meta"},as=["onClick"],os={class:"workspace-menu-avatar"},ls={class:"workspace-menu-copy"},ds={key:0,class:"workspace-menu-check"},rs={class:"nav-label"},cs=["onClick"],ps={class:"nav-label-text"},us={key:0,class:"nav-badge"},vs={class:"sidebar-insight"},ms={class:"sidebar-insight-head"},hs={class:"sidebar-footer"},fs={class:"main-column"},gs={class:"topbar"},bs=["title","aria-label","aria-expanded"],ks={key:0,class:"global-search-panel"},ws={class:"search-panel-head"},ys={key:0,class:"search-empty"},$s=["onClick"],Is={class:"search-type"},Cs={class:"search-result-main"},As={class:"search-score"},Ts={class:"notification-wrap"},Ss=["title","aria-label","aria-expanded"],qs={key:0,class:"notification-badge"},Es={class:"notification-head"},Os=["disabled"],Ms={key:0,class:"search-empty"},Rs={key:1,class:"search-empty"},Ds=["onClick"],js={class:"notification-main"};function Ns(i,s,n,o,u,h){const l=$("app-icon"),e=$("copilot-panel"),m=$("jitsi-meeting"),w=$("global-modal");return d(),r("div",{class:k(["app-shell",{"sidebar-collapsed":i.sidebarCollapsed,"copilot-closed":!i.copilotOpen}])},[t("aside",{class:k(["sidebar",{"mobile-open":i.mobileSidebar}])},[t("div",Z,[t("div",_,[c(l,{name:"network",size:22})]),s[18]||(s[18]=t("div",{class:"brand-copy"},[t("div",{class:"brand-name"},[p("合流"),t("em",null," AI")]),t("div",{class:"brand-sub"},"Workflow OS")],-1))]),t("div",x,[t("button",{class:"workspace-switcher","aria-expanded":String(i.workspaceMenuOpen),onClick:s[0]||(s[0]=v=>i.workspaceMenuOpen=!i.workspaceMenuOpen)},[t("div",is,a(i.currentWorkspace.name.charAt(0)),1),t("div",ts,[t("div",es,a(i.currentWorkspace.name),1),t("div",ns,a(i.currentWorkspace.meta),1)]),c(l,{name:"chevronDown",size:15})],8,ss),i.workspaceMenuOpen?(d(),r("div",{key:0,class:"workspace-menu",role:"menu",onClick:s[1]||(s[1]=O(()=>{},["stop"]))},[(d(!0),r(f,null,b(i.workspaces,v=>(d(),r("button",{key:v.id,class:k(["workspace-menu-item",{active:v.id===i.workspaceId}]),role:"menuitem",onClick:I=>i.switchWorkspace(v)},[t("span",os,a(v.name.charAt(0)),1),t("span",ls,[t("strong",null,a(v.name),1),t("small",null,a(v.meta),1)]),v.id===i.workspaceId?(d(),r("span",ds,"✓")):g("",!0)],10,as))),128))])):g("",!0)]),t("nav",null,[(d(!0),r(f,null,b(i.navGroups,v=>(d(),r("div",{key:v.label,class:"nav-group"},[t("div",rs,a(v.label),1),(d(!0),r(f,null,b(v.items,I=>(d(),r("button",{key:I.id,class:k(["nav-item",{active:i.currentView===I.id}]),onClick:P=>i.navigate(I.id)},[c(l,{name:I.icon},null,8,["name"]),t("span",ps,a(I.label),1),I.badge?(d(),r("span",us,a(I.badge),1)):g("",!0)],10,cs))),128))]))),128))]),s[24]||(s[24]=t("div",{class:"sidebar-spacer"},null,-1)),t("div",vs,[t("div",ms,[c(l,{name:"spark",size:12}),s[19]||(s[19]=p(" AI INSIGHT",-1))]),s[20]||(s[20]=t("div",{class:"sidebar-insight-title"},"减少 14.5h 协同时间",-1)),s[21]||(s[21]=t("div",{class:"sidebar-insight-copy"},"本周自动完成 86 项重复工作，任务准时率提升 12%。",-1)),t("button",{onClick:s[2]||(s[2]=v=>i.navigate("automation"))},"查看详情")]),t("div",hs,[s[22]||(s[22]=t("div",{class:"user-avatar"},"林",-1)),s[23]||(s[23]=t("div",{class:"sidebar-footer-copy"},[t("div",{class:"sidebar-footer-name"},"林然"),t("div",{class:"sidebar-footer-role"},"产品负责人")],-1)),c(l,{name:"more",size:16})])],2),i.mobileSidebar?(d(),r("div",{key:0,class:"mobile-overlay show",onClick:s[3]||(s[3]=v=>i.mobileSidebar=!1)})):g("",!0),t("section",fs,[t("header",gs,[t("button",{class:"icon-button mobile-menu",title:"打开导航","aria-label":"打开导航",onClick:s[4]||(s[4]=v=>i.mobileSidebar=!0)},[c(l,{name:"menu"})]),t("button",{class:"icon-button",title:i.sidebarCollapsed?"展开侧栏":"收窄侧栏","aria-label":i.sidebarCollapsed?"展开侧栏":"收窄侧栏","aria-expanded":String(!i.sidebarCollapsed),onClick:s[5]||(s[5]=v=>i.sidebarCollapsed=!i.sidebarCollapsed)},[c(l,{name:"panel"})],8,bs),t("div",{class:k(["global-search",{"has-results":i.searchOpen}])},[c(l,{name:"search"}),y(t("input",{"onUpdate:modelValue":s[6]||(s[6]=v=>i.search=v),onInput:s[7]||(s[7]=(...v)=>i.scheduleSearch&&i.scheduleSearch(...v)),onFocus:s[8]||(s[8]=v=>i.search&&i.scheduleSearch()),onKeydown:s[9]||(s[9]=E((...v)=>i.runSearch&&i.runSearch(...v),["enter"])),"aria-label":"全局搜索",placeholder:"搜索任务、文档、会议或向 AI 提问…"},null,544),[[C,i.search]]),s[25]||(s[25]=t("span",{class:"search-kbd"},"Ctrl K",-1)),i.searchOpen?(d(),r("div",ks,[t("div",ws,[t("span",null,a(i.searchBusy?"正在检索…":i.searchResults.length+" 条结果"),1),t("button",{class:"search-ask",onClick:s[10]||(s[10]=(...v)=>i.askSearch&&i.askSearch(...v))},"问 AI")]),i.searchError?(d(),r("div",ys,a(i.searchError),1)):g("",!0),(d(!0),r(f,null,b(i.searchResults,v=>(d(),r("button",{key:v.type+v.id,class:"search-result",onClick:I=>i.openSearchResult(v)},[t("span",Is,a(v.type),1),t("span",Cs,[t("strong",null,a(v.title),1),t("small",null,a(v.snippet),1)]),t("span",As,a(Math.round((v.score||0)*100))+"%",1)],8,$s))),128))])):g("",!0)],2),s[27]||(s[27]=t("div",{class:"topbar-spacer"},null,-1)),t("div",{class:k(["topbar-status",{offline:!i.apiReady}])},[s[26]||(s[26]=t("span",{class:"status-dot"},null,-1)),p(a(i.apiReady?"后端已连接 · 实时数据":"离线演示数据"),1)],2),t("div",Ts,[t("button",{class:"icon-button",title:i.unreadCount?"通知 · "+i.unreadCount+" 条未读":"通知","aria-label":i.unreadCount?"通知，"+i.unreadCount+" 条未读":"通知","aria-expanded":String(i.notificationOpen),onClick:s[11]||(s[11]=O((...v)=>i.toggleNotifications&&i.toggleNotifications(...v),["stop"]))},[c(l,{name:"bell"}),i.unreadCount?(d(),r("span",qs,a(i.unreadCount>99?"99+":i.unreadCount),1)):g("",!0)],8,Ss),i.notificationOpen?(d(),r("div",{key:0,class:"notification-panel",role:"dialog","aria-label":"通知中心",onClick:s[13]||(s[13]=O(()=>{},["stop"]))},[t("div",Es,[t("span",null,a(i.unreadCount?i.unreadCount+" 条未读":"全部已读"),1),t("button",{class:"card-link",disabled:!i.unreadCount,onClick:s[12]||(s[12]=(...v)=>i.markAllNotificationsRead&&i.markAllNotificationsRead(...v))},"全部已读",8,Os)]),i.notificationsBusy?(d(),r("div",Ms,"正在加载…")):i.notificationsError?(d(),r("div",Rs,a(i.notificationsError),1)):g("",!0),(d(!0),r(f,null,b(i.notifications,v=>(d(),r("button",{key:v.id,class:k(["notification-item",{unread:!v.read}]),onClick:I=>i.openNotification(v)},[t("span",{class:k(["notification-dot",i.notificationTone(v.level)])},null,2),t("span",js,[t("strong",null,a(v.title),1),t("small",null,a(v.message),1),t("em",null,a(i.notificationTime(v.createdAt)),1)])],10,Ds))),128))])):g("",!0)]),t("button",{class:"icon-button copilot-toggle",onClick:s[14]||(s[14]=v=>i.copilotOpen=!i.copilotOpen)},[c(l,{name:"spark"}),t("span",null,a(i.copilotOpen?"收起 Copilot":"唤起 Copilot"),1)])]),(d(),L(K(i.currentComponent),{key:i.viewKey,tasks:i.tasks,"meeting-id":i.activeMeetingId,"initial-prompt":i.generationPrompt,onNavigate:i.navigate,onOpenModal:i.openModal,onToast:i.showToast,onSendCommand:i.sendCommand,onTaskMove:i.moveTask,onConvertActions:i.convertActions,onMeetingCreated:s[15]||(s[15]=v=>i.activeMeetingId=v),onPromptConsumed:s[16]||(s[16]=v=>i.generationPrompt="")},null,40,["tasks","meeting-id","initial-prompt","onNavigate","onOpenModal","onToast","onSendCommand","onTaskMove","onConvertActions"]))]),i.copilotOpen?(d(),L(e,{key:1,messages:i.messages,onClose:s[17]||(s[17]=v=>i.copilotOpen=!1),onSend:i.sendChat,onExecute:i.executeAction,onOpenSource:i.openSearchResult},null,8,["messages","onSend","onExecute","onOpenSource"])):g("",!0),i.jitsiMeeting?(d(),L(m,{key:2,room:i.jitsiMeeting.room,title:i.jitsiMeeting.title,"user-name":i.jitsiMeeting.userName,"meeting-id":i.jitsiMeeting.meetingId,domain:i.jitsiDomain,onClose:i.closeJitsiMeeting,onToast:i.showToast},null,8,["room","title","user-name","meeting-id","domain","onClose","onToast"])):g("",!0),c(w,{modal:i.modal,onClose:i.closeModal,onSubmit:i.handleModalSubmit},null,8,["modal","onClose","onSubmit"])],2)}const Ps=S(Y,[["render",Ns]]),Ls=T({props:{name:{type:String,default:"spark"},size:{type:[Number,String],default:18},label:{type:String,default:""}},template:`<svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" :role="label ? 'img' : null" :aria-label="label || null" :aria-hidden="label ? null : 'true'" focusable="false"><title v-if="label">{{ label }}</title><path v-for="(d, i) in paths" :key="i" :d="d"></path></svg>`,computed:{paths:function(){return paths[this.name]||paths.spark}}}),Hs=["width","height","role","aria-label","aria-hidden"],Fs={key:0},Us=["d"];function zs(i,s,n,o,u,h){return d(),r("svg",{width:i.size,height:i.size,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round",role:i.label?"img":null,"aria-label":i.label||null,"aria-hidden":i.label?null:"true",focusable:"false"},[i.label?(d(),r("title",Fs,a(i.label),1)):g("",!0),(d(!0),r(f,null,b(i.paths,(l,e)=>(d(),r("path",{key:e,d:l},null,8,Us))),128))],8,Hs)}const Gs=S(Ls,[["render",zs]]),Js=T({props:{messages:{type:Array,default:function(){return[]}}},data:function(){return{draft:""}},methods:{send:function(){var i=this.draft.trim();i&&(this.$emit("send",i),this.draft="")},prompt:function(i){this.draft=i,this.$nextTick(function(){this.$refs.input.focus()})}},template:`
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
  `}),Vs={class:"copilot","aria-label":"AI 协同助手"},Ws={class:"copilot-head"},Ks={class:"copilot-avatar"},Bs={class:"copilot-body"},Xs={key:0,class:"message-avatar"},Qs={class:"message-content"},Ys=["innerHTML"],Zs={key:0,class:"ai-action-card"},_s={class:"ai-action-title"},xs=["id"],si=["for"],ii=["disabled","onClick"],ti={key:1,class:"message-citations"},ei=["onClick"],ni={class:"message-time"},ai={class:"copilot-form"},oi={class:"copilot-prompts"},li={class:"copilot-input-wrap mt-10"};function di(i,s,n,o,u,h){const l=$("app-icon");return d(),r("aside",Vs,[t("div",Ws,[t("div",Ks,[c(l,{name:"spark",size:18})]),s[7]||(s[7]=t("div",{class:"copilot-title"},[t("strong",null,"合流 Copilot"),t("span",null,"已连接项目上下文 · 在线")],-1)),t("button",{class:"icon-button ghost",title:"收起助手","aria-label":"收起助手",onClick:s[0]||(s[0]=e=>i.$emit("close"))},[c(l,{name:"x"})])]),t("div",Bs,[s[8]||(s[8]=A('<div class="context-card"><div class="context-card-head"><span>ACTIVE CONTEXT</span><span>自动同步</span></div><div class="context-title">星海计划 · 第二阶段</div><div class="context-meta">12 份文档 · 3 次会议 · 47 个任务</div><div class="context-sources"><span class="source-pill">PRD</span><span class="source-pill">周会</span><span class="source-pill">任务</span><span>RAG 已索引</span></div></div>',1)),(d(!0),r(f,null,b(i.messages,(e,m)=>(d(),r("div",{key:m,class:k(["message",e.role])},[e.role==="assistant"?(d(),r("div",Xs,[c(l,{name:"spark",size:15})])):g("",!0),t("div",Qs,[t("div",{innerHTML:e.text},null,8,Ys),e.action?(d(),r("div",Zs,[t("div",_s,a(e.action.title),1),(d(!0),r(f,null,b(e.action.items,(w,v)=>(d(),r("div",{key:v,class:"ai-action-row"},[t("input",{type:"checkbox",id:"ai-"+m+"-"+v,checked:""},null,8,xs),t("label",{for:"ai-"+m+"-"+v},[t("span",null,a(w),1)],8,si)]))),128)),t("button",{class:"btn lime sm mt-10",disabled:e.action.type==="task_created",onClick:w=>i.$emit("execute",e.action)},a(e.action.type==="task_created"?"已创建":"一键创建"),9,ii)])):g("",!0),e.citations&&e.citations.length?(d(),r("div",ti,[(d(!0),r(f,null,b(e.citations.slice(0,4),(w,v)=>(d(),r("button",{key:v,class:"citation-chip",onClick:I=>i.$emit("open-source",w)},a(w.sourceName)+" · "+a(w.location),9,ei))),128))])):g("",!0),t("div",ni,a(e.time),1)])],2))),128))]),t("div",ai,[t("div",oi,[t("button",{class:"prompt-chip",onClick:s[1]||(s[1]=e=>i.prompt("总结本周项目风险，并给出处理建议"))},"总结风险"),t("button",{class:"prompt-chip",onClick:s[2]||(s[2]=e=>i.prompt("把周会结论转成可执行任务"))},"生成任务"),t("button",{class:"prompt-chip",onClick:s[3]||(s[3]=e=>i.prompt("检索知识库，回答客户续约的关键问题"))},"检索知识")]),t("div",li,[y(t("textarea",{ref:"input","onUpdate:modelValue":s[4]||(s[4]=e=>i.draft=e),class:"copilot-input",placeholder:"向 Copilot 提问，或输入 / 调用工作流…",onKeydown:s[5]||(s[5]=E(O((...e)=>i.send&&i.send(...e),["exact","prevent"]),["enter"]))},null,544),[[C,i.draft]]),t("button",{class:"copilot-send",title:"发送","aria-label":"发送消息",onClick:s[6]||(s[6]=(...e)=>i.send&&i.send(...e))},[c(l,{name:"send",size:15})])]),s[9]||(s[9]=t("div",{class:"copilot-footnote"},"AI 可能出错，请核验关键结论 · 引用可追溯",-1))])])}const ri=S(Js,[["render",di]]),ci=T({props:{modal:{type:Object,default:null}},data:function(){return{taskTitle:"",taskOwner:"林然",taskDate:(function(){var i=new Date;return i.getFullYear()+"-"+String(i.getMonth()+1).padStart(2,"0")+"-"+String(i.getDate()).padStart(2,"0")})(),file:null,selectedFile:"Q3 客户反馈分析.md",meetingTitle:"产品增长复盘会",writingBrief:"面向管理层，输出一份有数据支撑的项目复盘"}},watch:{modal:function(i){i?(i.type==="upload"&&(this.file=null,this.selectedFile="未选择文件"),this.$nextTick(this.focusFirst)):this.restoreFocus()}},mounted:function(){this.lastFocused=null},methods:{focusables:function(){return!this.$el||!this.$el.querySelectorAll?[]:Array.prototype.slice.call(this.$el.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'))},focusFirst:function(){if(this.modal){this.lastFocused=document.activeElement;var i=this.focusables();i.length&&i[0].focus()}},restoreFocus:function(){this.lastFocused&&typeof this.lastFocused.focus=="function"&&this.lastFocused.focus(),this.lastFocused=null},onKeydown:function(i){if(this.modal){if(i.key==="Escape"){i.preventDefault(),this.close();return}if(i.key==="Tab"){var s=this.focusables();if(s.length){var n=s[0],o=s[s.length-1];i.shiftKey&&document.activeElement===n?(i.preventDefault(),o.focus()):!i.shiftKey&&document.activeElement===o&&(i.preventDefault(),n.focus())}}}},onFileChange:function(i){var s=i.target.files&&i.target.files[0];s&&(this.file=s,this.selectedFile=s.name)},close:function(){this.$emit("close")},submit:function(){this.modal&&(this.modal.type==="new-task"?this.$emit("submit",{type:"task",title:this.taskTitle||"未命名任务",owner:this.taskOwner,date:this.taskDate}):this.modal.type==="meeting"?this.$emit("submit",{type:"meeting",title:this.meetingTitle}):this.modal.type==="upload"?this.$emit("submit",{type:"upload",file:this.file,name:this.selectedFile}):this.modal.type==="writing"?this.$emit("submit",{type:"writing",prompt:this.writingBrief,title:this.modal.title}):this.$emit("submit",{type:"generate",title:this.modal.title}))}},template:`
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
  `}),pi={class:"modal",role:"dialog","aria-modal":"true","aria-labelledby":"modal-title",ref:"dialog",tabindex:"-1"},ui={class:"modal-head"},vi={class:"modal-title",id:"modal-title"},mi={class:"modal-sub"},hi={class:"modal-body"},fi={class:"form-row mt-16"},gi={class:"generated-note mt-16"},bi={class:"generated-note mt-16"},ki={class:"file-drop"},wi={class:"generated-note mt-16"},yi={key:4,class:"generated-note"},$i={class:"modal-actions"};function Ii(i,s,n,o,u,h){const l=$("app-icon");return i.modal?(d(),r("div",{key:0,class:"modal-backdrop",onClick:s[9]||(s[9]=O((...e)=>i.close&&i.close(...e),["self"])),onKeydown:s[10]||(s[10]=(...e)=>i.onKeydown&&i.onKeydown(...e))},[t("section",pi,[t("header",ui,[t("div",null,[t("h2",vi,a(i.modal.title),1),t("div",mi,a(i.modal.sub),1)]),t("button",{class:"icon-button ghost","aria-label":"关闭弹窗",onClick:s[0]||(s[0]=(...e)=>i.close&&i.close(...e))},[c(l,{name:"x"})])]),t("div",hi,[i.modal.type==="new-task"?(d(),r(f,{key:0},[s[16]||(s[16]=t("label",{class:"form-label"},"任务名称",-1)),y(t("input",{"onUpdate:modelValue":s[1]||(s[1]=e=>i.taskTitle=e),class:"form-input",placeholder:"例如：完成客户续约方案",autofocus:""},null,512),[[C,i.taskTitle]]),t("div",fi,[t("div",null,[s[12]||(s[12]=t("label",{class:"form-label"},"负责人",-1)),y(t("select",{"onUpdate:modelValue":s[2]||(s[2]=e=>i.taskOwner=e),class:"form-select"},[...s[11]||(s[11]=[t("option",null,"林然",-1),t("option",null,"周可",-1),t("option",null,"陈默",-1)])],512),[[B,i.taskOwner]])]),t("div",null,[s[13]||(s[13]=t("label",{class:"form-label"},"截止日期",-1)),y(t("input",{"onUpdate:modelValue":s[3]||(s[3]=e=>i.taskDate=e),type:"date",class:"form-input"},null,512),[[C,i.taskDate]])])]),t("div",gi,[t("h4",null,[c(l,{name:"spark",size:14}),s[14]||(s[14]=p(" AI 建议已生成",-1))]),s[15]||(s[15]=t("p",null,"建议关联「星海计划 / 客户成功」知识库，并在完成前自动检查遗漏项。",-1))])],64)):i.modal.type==="meeting"?(d(),r(f,{key:1},[s[19]||(s[19]=t("label",{class:"form-label"},"会议主题",-1)),y(t("input",{"onUpdate:modelValue":s[4]||(s[4]=e=>i.meetingTitle=e),class:"form-input"},null,512),[[C,i.meetingTitle]]),t("div",bi,[t("h4",null,[c(l,{name:"video",size:14}),s[17]||(s[17]=p(" Jitsi Meet 视频会议",-1))]),s[18]||(s[18]=t("p",null,"确认后将在当前页面直接创建并进入 Jitsi 会议室，不会跳转到 Jitsi 官网。会议结束后回到工作台即可回听原声。",-1))]),s[20]||(s[20]=t("div",{class:"empty-line"},null,-1)),s[21]||(s[21]=t("p",{class:"muted tiny mb-0"},"进入会议室时，请允许浏览器访问摄像头和麦克风。",-1))],64)):i.modal.type==="upload"?(d(),r(f,{key:2},[t("div",ki,[c(l,{name:"upload",size:28}),s[22]||(s[22]=t("strong",null,"选择 1 份业务文档",-1)),s[23]||(s[23]=t("span",null,"支持 TXT / MD / CSV / JSON 正文解析，其它格式按元数据入库",-1)),t("input",{ref:"fileInput",type:"file",class:"mt-10","aria-label":"选择要上传的文档",accept:".pdf,.doc,.docx,.xls,.xlsx,.txt,.md,.csv,.json",onChange:s[5]||(s[5]=(...e)=>i.onFileChange&&i.onFileChange(...e))},null,544)]),t("div",wi,[t("h4",null,"当前选择："+a(i.selectedFile),1),s[24]||(s[24]=t("p",null,"完成后将自动提取摘要、关键数据、风险条款，并写入可检索的知识库。",-1))])],64)):i.modal.type==="writing"?(d(),r(f,{key:3},[s[25]||(s[25]=t("label",{class:"form-label"},"写作任务说明",-1)),y(t("textarea",{"onUpdate:modelValue":s[6]||(s[6]=e=>i.writingBrief=e),class:"form-textarea"},null,512),[[C,i.writingBrief]]),s[26]||(s[26]=t("div",{class:"generated-note mt-16"},[t("h4",null,"AI 将结合的上下文"),t("p",null,"近 90 天项目进展、三次会议纪要、相关产品指标，以及你以往的输出风格。")],-1))],64)):(d(),r("div",yi,[t("h4",null,[c(l,{name:"spark",size:14}),p(" "+a(i.modal.generatedTitle||"AI 分析已完成"),1)]),t("p",null,a(i.modal.generatedText||"已结合当前权限范围内的业务上下文完成分析，结论均可追溯至原始来源。"),1)])),t("div",$i,[t("button",{class:"btn subtle",onClick:s[7]||(s[7]=(...e)=>i.close&&i.close(...e))},"取消"),t("button",{class:"btn primary",onClick:s[8]||(s[8]=(...e)=>i.submit&&i.submit(...e))},a(i.modal.confirmText||"确认创建"),1)])])],512)],32)):g("",!0)}const Ci=S(ci,[["render",Ii]]),Ai=T({props:{room:{type:String,required:!0},title:{type:String,default:"合流 AI 会议"},userName:{type:String,default:"林然"},meetingId:{type:String,default:""},domain:{type:String,default:"meet.jit.si"}},data:function(){return{api:null,loading:!0,error:"",participantCount:1,scriptPromise:null}},computed:{meetingUrl:function(){return"https://"+this.domain+"/"+encodeURIComponent(this.room)},shortRoom:function(){return this.room.length>34?this.room.slice(0,34)+"...":this.room}},methods:{loadJitsiScript:function(){var i=this;return window.JitsiMeetExternalAPI?Promise.resolve(window.JitsiMeetExternalAPI):this.scriptPromise?this.scriptPromise:(this.scriptPromise=new Promise(function(s,n){var o=document.querySelector("script[data-jitsi-external-api]"),u=setTimeout(function(){n(new Error("Jitsi script timeout"))},15e3);function h(){clearTimeout(u),window.JitsiMeetExternalAPI?s(window.JitsiMeetExternalAPI):n(new Error("Jitsi API unavailable"))}function l(){clearTimeout(u),n(new Error("Jitsi script failed to load"))}if(o){o.addEventListener("load",h),o.addEventListener("error",l),window.JitsiMeetExternalAPI&&h();return}var e=document.createElement("script");e.src="https://"+i.domain+"/external_api.js",e.async=!0,e.setAttribute("data-jitsi-external-api","true"),e.addEventListener("load",h),e.addEventListener("error",l),document.head.appendChild(e)}),this.scriptPromise)},initMeeting:function(){var i=this;this.loading=!0,this.error="",this.loadJitsiScript().then(function(s){if(!i.$refs.container)throw new Error("Jitsi container unavailable");i.api=new s(i.domain,{roomName:i.room,parentNode:i.$refs.container,width:"100%",height:"100%",userInfo:{displayName:i.userName},configOverwrite:{prejoinPageEnabled:!1,prejoinConfig:{enabled:!1},startWithAudioMuted:!1,startWithVideoMuted:!1,disableDeepLinking:!0,enableWelcomePage:!1},interfaceConfigOverwrite:{SHOW_JITSI_WATERMARK:!1,SHOW_WATERMARK_FOR_GUESTS:!1,TOOLBAR_ALWAYS_VISIBLE:!0,DEFAULT_BACKGROUND:"#14211b"}}),i.api.addEventListener("videoConferenceJoined",function(){i.loading=!1}),i.api.addEventListener("participantJoined",function(){i.participantCount+=1}),i.api.addEventListener("participantLeft",function(){i.participantCount=Math.max(1,i.participantCount-1)}),i.api.addEventListener("readyToClose",function(){i.$emit("close")}),window.setTimeout(function(){i.api&&(i.loading=!1)},2500)}).catch(function(s){i.loading=!1,i.error=s&&s.message?s.message:"Jitsi 加载失败"})},dispose:function(){if(this.api){try{this.api.dispose()}catch{}this.api=null}},retry:function(){this.dispose(),this.scriptPromise=null,this.initMeeting()},copyInvite:function(){var i=this,s="邀请你加入「"+this.title+"」："+this.meetingUrl;navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(s).then(function(){i.$emit("toast","Jitsi 邀请链接已复制")}).catch(function(){i.$emit("toast","邀请链接："+i.meetingUrl)}):this.$emit("toast","邀请链接："+this.meetingUrl)},endMeeting:function(){if(this.api)try{this.api.executeCommand("hangup")}catch{}this.dispose(),this.$emit("close")}},mounted:function(){this.initMeeting()},beforeUnmount:function(){this.dispose()},template:`
    <div class="jitsi-overlay" role="dialog" aria-modal="true" aria-label="Jitsi 视频会议">
      <section class="jitsi-shell" ref="shell">
        <header class="jitsi-head">
          <div class="jitsi-head-main">
            <span class="jitsi-live-dot"></span>
            <div>
              <div class="jitsi-title">{{ title }}</div>
              <div class="jitsi-meta">
                Jitsi Meet · {{ shortRoom }}
                <span v-if="meetingId"> · 已同步会议记录 {{ meetingId }}</span>
              </div>
            </div>
          </div>
          <div class="jitsi-head-actions">
            <span class="badge gray">{{ participantCount }} 人在线</span>
            <button class="btn subtle sm" @click="copyInvite"><app-icon name="link" :size="14"></app-icon>复制邀请</button>
            <button class="icon-button ghost" title="结束会议" aria-label="结束会议" @click="endMeeting"><app-icon name="x"></app-icon></button>
          </div>
        </header>
        <div class="jitsi-body">
          <div ref="container" class="jitsi-container" v-show="!error"></div>
          <div v-if="loading && !error" class="jitsi-loading">
            <div class="jitsi-loading-ring"></div>
            <strong>正在连接 Jitsi Meet</strong>
            <span>首次进入可能需要允许摄像头和麦克风权限</span>
          </div>
          <div v-if="error" class="jitsi-fallback">
            <div class="jitsi-fallback-icon"><app-icon name="video" :size="30"></app-icon></div>
            <h3>Jitsi 会议室已创建</h3>
            <p>当前网络未能加载 Jitsi 客户端，已切换到当前页面内的备用会议室，不会跳转到其他页面。</p>
            <div class="jitsi-room-code">{{ meetingUrl }}</div>
            <iframe class="jitsi-iframe-fallback" :src="meetingUrl" allow="camera; microphone; fullscreen; display-capture; autoplay" referrerpolicy="no-referrer-when-downgrade"></iframe>
            <div class="head-actions mt-16">
              <button class="btn primary" @click="retry"><app-icon name="link"></app-icon>重试嵌入</button>
              <button class="btn subtle" @click="copyInvite"><app-icon name="file"></app-icon>复制邀请链接</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `}),Ti={class:"jitsi-overlay",role:"dialog","aria-modal":"true","aria-label":"Jitsi 视频会议"},Si={class:"jitsi-shell",ref:"shell"},qi={class:"jitsi-head"},Ei={class:"jitsi-head-main"},Oi={class:"jitsi-title"},Mi={class:"jitsi-meta"},Ri={key:0},Di={class:"jitsi-head-actions"},ji={class:"badge gray"},Ni={class:"jitsi-body"},Pi={ref:"container",class:"jitsi-container"},Li={key:0,class:"jitsi-loading"},Hi={key:1,class:"jitsi-fallback"},Fi={class:"jitsi-fallback-icon"},Ui={class:"jitsi-room-code"},zi=["src"],Gi={class:"head-actions mt-16"};function Ji(i,s,n,o,u,h){const l=$("app-icon");return d(),r("div",Ti,[t("section",Si,[t("header",qi,[t("div",Ei,[s[4]||(s[4]=t("span",{class:"jitsi-live-dot"},null,-1)),t("div",null,[t("div",Oi,a(i.title),1),t("div",Mi,[p(" Jitsi Meet · "+a(i.shortRoom)+" ",1),i.meetingId?(d(),r("span",Ri," · 已同步会议记录 "+a(i.meetingId),1)):g("",!0)])])]),t("div",Di,[t("span",ji,a(i.participantCount)+" 人在线",1),t("button",{class:"btn subtle sm",onClick:s[0]||(s[0]=(...e)=>i.copyInvite&&i.copyInvite(...e))},[c(l,{name:"link",size:14}),s[5]||(s[5]=p("复制邀请",-1))]),t("button",{class:"icon-button ghost",title:"结束会议","aria-label":"结束会议",onClick:s[1]||(s[1]=(...e)=>i.endMeeting&&i.endMeeting(...e))},[c(l,{name:"x"})])])]),t("div",Ni,[y(t("div",Pi,null,512),[[X,!i.error]]),i.loading&&!i.error?(d(),r("div",Li,[...s[6]||(s[6]=[t("div",{class:"jitsi-loading-ring"},null,-1),t("strong",null,"正在连接 Jitsi Meet",-1),t("span",null,"首次进入可能需要允许摄像头和麦克风权限",-1)])])):g("",!0),i.error?(d(),r("div",Hi,[t("div",Fi,[c(l,{name:"video",size:30})]),s[9]||(s[9]=t("h3",null,"Jitsi 会议室已创建",-1)),s[10]||(s[10]=t("p",null,"当前网络未能加载 Jitsi 客户端，已切换到当前页面内的备用会议室，不会跳转到其他页面。",-1)),t("div",Ui,a(i.meetingUrl),1),t("iframe",{class:"jitsi-iframe-fallback",src:i.meetingUrl,allow:"camera; microphone; fullscreen; display-capture; autoplay",referrerpolicy:"no-referrer-when-downgrade"},null,8,zi),t("div",Gi,[t("button",{class:"btn primary",onClick:s[2]||(s[2]=(...e)=>i.retry&&i.retry(...e))},[c(l,{name:"link"}),s[7]||(s[7]=p("重试嵌入",-1))]),t("button",{class:"btn subtle",onClick:s[3]||(s[3]=(...e)=>i.copyInvite&&i.copyInvite(...e))},[c(l,{name:"file"}),s[8]||(s[8]=p("复制邀请链接",-1))])])])):g("",!0)])],512)])}const Vi=S(Ai,[["render",Ji]]),Wi=T({props:{tasks:{type:Array,default:function(){return[]}}},data:function(){return{command:""}},computed:{todayLabel:function(){var i=new Date,s=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];return i.getFullYear()+"年"+(i.getMonth()+1)+"月"+i.getDate()+"日 "+s[i.getDay()]}},methods:{submitCommand:function(){var i=this.command.trim();if(!i)return this.$emit("toast","请输入你想完成的工作");this.$emit("send-command",i),this.command=""}},template:`
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
  `}),Ki={class:"page"},Bi={class:"page-head"},Xi={class:"eyebrow"},Qi={class:"head-actions"},Yi={class:"command-bar"},Zi={class:"command-label"},_i={class:"command-input-wrap"},xi={class:"command-suggestions"},st={class:"dashboard-grid"},it={class:"column"},tt={class:"card tint-lime"},et={class:"card-head"},nt={class:"card-title"},at={class:"card"},ot={class:"card-head"},lt={class:"card-title"},dt={class:"card"},rt={class:"card-head"},ct={class:"card-title"},pt={class:"badge gray"},ut={class:"focus-list"},vt={class:"focus-main"},mt={class:"focus-title"},ht={class:"focus-meta"},ft={class:"focus-time"},gt={class:"column"},bt={class:"card tint-blue"},kt={class:"card-head"},wt={class:"card-title"},yt={class:"card"},$t={class:"card-head"},It={class:"card-title"},Ct={class:"card tint-coral"},At={class:"card-head"},Tt={class:"card-title"},St={class:"signal-list"},qt={class:"signal"},Et={class:"signal-icon"},Ot={class:"signal"},Mt={class:"signal-icon"},Rt={class:"signal"},Dt={class:"signal-icon"};function jt(i,s,n,o,u,h){const l=$("app-icon");return d(),r("main",Ki,[t("div",Bi,[t("div",null,[t("div",Xi,"工作台 · "+a(i.todayLabel),1),s[10]||(s[10]=t("h1",{class:"page-title"},"早上好，林然。",-1)),s[11]||(s[11]=t("p",{class:"page-subtitle"},"AI 已阅读你今天的 3 场会议、12 条项目更新和 28 份相关文档，并整理出最值得关注的 3 件事。",-1))]),t("div",Qi,[t("button",{class:"btn",onClick:s[0]||(s[0]=e=>i.$emit("open-modal","upload"))},[c(l,{name:"upload"}),s[12]||(s[12]=p("导入文档",-1))]),t("button",{class:"btn lime",onClick:s[1]||(s[1]=e=>i.$emit("open-modal","new-task"))},[c(l,{name:"plus"}),s[13]||(s[13]=p("新建任务",-1))])])]),t("section",Yi,[t("div",Zi,[c(l,{name:"spark",size:15}),s[14]||(s[14]=p("AI WORK COMMAND",-1))]),s[15]||(s[15]=t("h2",null,"告诉合流你希望完成什么，它会自动调用文档、会议与项目上下文。",-1)),t("div",_i,[c(l,{name:"wand"}),y(t("input",{"onUpdate:modelValue":s[2]||(s[2]=e=>i.command=e),onKeydown:s[3]||(s[3]=E((...e)=>i.submitCommand&&i.submitCommand(...e),["enter"])),placeholder:"例如：准备明天客户会的材料，并整理需要确认的 5 个问题"},null,544),[[C,i.command]]),t("button",{class:"command-submit",onClick:s[4]||(s[4]=(...e)=>i.submitCommand&&i.submitCommand(...e))},"开始执行")]),t("div",xi,[t("button",{class:"suggestion",onClick:s[5]||(s[5]=e=>{i.command="总结本周项目风险并生成周报",i.submitCommand()})},"✦ 生成项目周报"),t("button",{class:"suggestion",onClick:s[6]||(s[6]=e=>{i.command="找出今天会议中所有待办并分配负责人",i.submitCommand()})},"✦ 整理会议待办"),t("button",{class:"suggestion",onClick:s[7]||(s[7]=e=>{i.command="检查星海计划里程碑是否存在延期风险",i.submitCommand()})},"✦ 检查项目风险")])]),t("div",st,[t("div",it,[t("section",tt,[t("div",et,[t("div",null,[t("h2",nt,[c(l,{name:"target"}),s[16]||(s[16]=p("今日 AI 聚焦",-1))]),s[17]||(s[17]=t("p",{class:"card-note"},"根据影响力和紧迫度自动排序",-1))]),s[18]||(s[18]=t("span",{class:"badge lime"},"3 项关键",-1))]),s[19]||(s[19]=A('<div class="focus-list"><div class="focus-item"><div class="focus-index">01</div><div class="focus-main"><div class="focus-title">确认星海计划第二阶段范围变更</div><div class="focus-meta">产品评审会 · 会直接影响本周开发排期</div></div><div class="focus-time">10:30</div></div><div class="focus-item"><div class="focus-index">02</div><div class="focus-main"><div class="focus-title">补齐客户续约方案的 ROI 测算</div><div class="focus-meta">缺少 2 项关键数据 · AI 已标出引用位置</div></div><div class="focus-time">今天</div></div><div class="focus-item"><div class="focus-index">03</div><div class="focus-main"><div class="focus-title">审批设计资源增补申请</div><div class="focus-meta">等待 1 天 · 已阻塞 3 个下游任务</div></div><div class="focus-time">尽快</div></div></div>',1))]),t("section",at,[t("div",ot,[t("div",null,[t("h2",lt,[c(l,{name:"trending"}),s[20]||(s[20]=p("工作流概览",-1))]),s[21]||(s[21]=t("p",{class:"card-note"},"本周团队协同状态",-1))]),t("button",{class:"card-link",onClick:s[8]||(s[8]=e=>i.$emit("navigate","projects"))},"查看项目 →")]),s[22]||(s[22]=A('<div class="metrics-row"><div class="metric"><div class="metric-label">自动处理事项</div><div class="metric-value">86</div><div class="metric-trend">↑ 24% 较上周</div></div><div class="metric"><div class="metric-label">节省协同时间</div><div class="metric-value">14.5h</div><div class="metric-trend">≈ 1.8 个工作日</div></div><div class="metric"><div class="metric-label">任务准时率</div><div class="metric-value">92%</div><div class="metric-trend warn">2 项存在风险</div></div></div>',1))]),t("section",dt,[t("div",rt,[t("div",null,[t("h2",ct,[c(l,{name:"list"}),s[23]||(s[23]=p("下一步行动",-1))]),s[24]||(s[24]=t("p",{class:"card-note"},"跨会议、聊天和文档自动同步",-1))]),t("span",pt,a(i.tasks.length)+" 个进行中",1)]),t("div",ut,[(d(!0),r(f,null,b(i.tasks.slice(0,4),(e,m)=>(d(),r("div",{key:m,class:"focus-item"},[t("div",{class:"focus-index",style:H({background:e.color||"#132019"})},a(m+1),5),t("div",vt,[t("div",mt,a(e.title),1),t("div",ht,a(e.project)+" · "+a(e.owner),1)]),t("div",ft,a(e.due),1)]))),128))])])]),t("div",gt,[t("section",bt,[t("div",kt,[t("div",null,[t("h2",wt,[c(l,{name:"calendar"}),s[25]||(s[25]=p("今天",-1))]),s[26]||(s[26]=t("p",{class:"card-note"},"3 场会议 · 2 个专注时段",-1))]),s[27]||(s[27]=t("span",{class:"badge blue"},"已同步",-1))]),s[29]||(s[29]=A('<div class="schedule-list"><div class="schedule-item"><div class="schedule-time">10:30</div><div class="schedule-rail"></div><div><div class="schedule-title">星海计划产品评审</div><div class="schedule-meta">腾讯会议 · 6 人参与</div><div class="schedule-tag"><span class="badge blue">AI 已生成会前简报</span></div></div></div><div class="schedule-item"><div class="schedule-time">14:00</div><div class="schedule-rail"></div><div><div class="schedule-title">客户续约策略沟通</div><div class="schedule-meta">线上会议 · 4 人参与</div><div class="schedule-tag"><span class="badge coral">缺少 2 项材料</span></div></div></div><div class="schedule-item"><div class="schedule-time">16:30</div><div class="schedule-rail"></div><div><div class="schedule-title">增长实验复盘</div><div class="schedule-meta">会议室 A · 5 人参与</div><div class="schedule-tag"><span class="badge lime">自动录制已开启</span></div></div></div></div>',1)),t("button",{class:"btn subtle sm mt-10",onClick:s[9]||(s[9]=e=>i.$emit("open-modal","meeting"))},[c(l,{name:"video"}),s[28]||(s[28]=p("开始 AI 会议",-1))])]),t("section",yt,[t("div",$t,[t("div",null,[t("h2",It,[c(l,{name:"shield"}),s[30]||(s[30]=p("项目健康度",-1))]),s[31]||(s[31]=t("p",{class:"card-note"},"星海计划 · 第二阶段",-1))]),s[32]||(s[32]=t("span",{class:"badge lime"},"健康",-1))]),s[33]||(s[33]=A('<div class="project-health"><div class="health-ring"><div class="health-ring-value">78<span>综合分</span></div></div><div class="health-copy"><h3>进度符合预期</h3><p>关键路径还剩 18 天，设计资源是当前主要风险。</p><div class="progress lime"><span style="width:78%;"></span></div><div class="tiny muted">已完成 31 / 40 个里程碑</div></div></div>',1))]),t("section",Ct,[t("div",At,[t("div",null,[t("h2",Tt,[c(l,{name:"alert"}),s[34]||(s[34]=p("AI 信号雷达",-1))]),s[35]||(s[35]=t("p",{class:"card-note"},"值得立即关注的变化",-1))])]),t("div",St,[t("div",qt,[t("div",Et,[c(l,{name:"alert"})]),s[36]||(s[36]=t("div",{class:"signal-body"},[t("div",{class:"signal-title"},"需求范围在会议中新增 2 项"),t("div",{class:"signal-text"},"当前排期可能延期 3 天，建议今天评审确认。")],-1))]),t("div",Ot,[t("div",Mt,[c(l,{name:"file"})]),s[37]||(s[37]=t("div",{class:"signal-body"},[t("div",{class:"signal-title"},"客户反馈文档出现高频关键词"),t("div",{class:"signal-text"},"“数据导出”在近 7 天反馈中增长 180%。")],-1))]),t("div",Rt,[t("div",Dt,[c(l,{name:"check"})]),s[38]||(s[38]=t("div",{class:"signal-body"},[t("div",{class:"signal-title"},"周报初稿已自动生成"),t("div",{class:"signal-text"},"已汇总 14 项进展，可直接审阅和补充。")],-1))])])])])])])}const Nt=S(Wi,[["render",jt]]),Pt=T({props:{meetingId:{type:String,default:""}},data:function(){return{activeTab:"summary",playing:!1,playbackIndex:-1,speechSupported:!!window.speechSynthesis,zhVoice:null,playbackTimer:null,segmentTimer:null,liveRecording:!1,liveMeetingId:"",liveSocket:null,recognition:null,liveStartedAt:null,liveElapsed:0,liveStatus:"未开始",transcript:[{name:"周可",time:"00:12",text:"第二阶段的核心目标仍然是提升客户留存。我们希望把数据导出能力放进这次迭代。"},{name:"陈默",time:"00:41",text:"如果数据导出必须进入本迭代，设计资源会成为关键路径，现有排期预计增加 3 天。"},{name:"林然",time:"01:18",text:"先确认这是高优先级客户的共性需求还是单点需求。周一前给出影响范围和替代方案。"},{name:"李慧",time:"02:05",text:"客户访谈中 7 家里有 5 家提到了数据导出，可以认为是高优先级普遍需求。"}]}},computed:{replayProgress:function(){return!this.transcript.length||this.playbackIndex<0?0:Math.round((this.playbackIndex+1)/this.transcript.length*100)},currentTranscript:function(){return this.playbackIndex>=0?this.transcript[this.playbackIndex]:null},replayLabel:function(){return this.playing?"暂停回听":this.playbackIndex>=0?"继续回听":"回听原声"},liveLabel:function(){return this.liveRecording?"停止实时转写 · "+this.liveElapsed+"s":"开始实时转写"}},methods:{loadVoices:function(){if(this.speechSupported){var i=window.speechSynthesis.getVoices()||[];this.zhVoice=i.filter(function(s){return s.lang&&s.lang.toLowerCase().indexOf("zh")===0})[0]||null}},togglePlay:function(){this.playing?this.pauseReplay():this.startReplay(this.playbackIndex>=0?this.playbackIndex:0)},startReplay:function(i){if(this.transcript.length){var s=Math.max(0,Math.min(i||0,this.transcript.length-1));this.clearTimers(),window.speechSynthesis&&window.speechSynthesis.cancel(),this.playing=!0,this.playbackIndex=s,this.$emit("toast","开始回听："+this.transcript[s].name+" "+this.transcript[s].time);var n=this;this.segmentTimer=window.setTimeout(function(){n.speakSegment(s)},120)}},speakSegment:function(i){if(this.playing){if(i>=this.transcript.length){this.finishReplay();return}var s=this.transcript[i];if(this.playbackIndex=i,this.scrollToRow(i),!this.speechSupported){this.fallbackSegment(i);return}var n=new SpeechSynthesisUtterance(s.text);n.lang="zh-CN",n.rate=.96,n.pitch=s.name==="李慧"?1.12:s.name==="陈默"?.92:1,this.zhVoice&&(n.voice=this.zhVoice);var o=this;n.onend=function(){o.playing&&o.speakSegment(i+1)},n.onerror=function(){o.$emit("toast","浏览器语音回听失败，已切换为时间轴回放"),o.fallbackSegment(i)},window.speechSynthesis.speak(n)}},fallbackSegment:function(i){var s=this;this.playbackTimer=window.setTimeout(function(){s.playing&&s.speakSegment(i+1)},2600)},pauseReplay:function(){this.playing=!1,this.clearTimers(),window.speechSynthesis&&window.speechSynthesis.cancel(),this.$emit("toast","已暂停回听，点击继续从当前发言播放")},finishReplay:function(){this.playing=!1,this.playbackIndex=-1,this.clearTimers(),this.$emit("toast","会议原声回听完成")},jumpToSegment:function(i){this.playing&&(this.playing=!1,this.clearTimers(),window.speechSynthesis&&window.speechSynthesis.cancel()),this.startReplay(i)},clearTimers:function(){this.playbackTimer&&(window.clearTimeout(this.playbackTimer),this.playbackTimer=null),this.segmentTimer&&(window.clearTimeout(this.segmentTimer),this.segmentTimer=null)},scrollToRow:function(i){var s=this;this.$nextTick(function(){var n=s.$el.querySelectorAll(".transcript-row");n[i]&&n[i].scrollIntoView&&n[i].scrollIntoView({behavior:"smooth",block:"nearest"})})},apiEnabled:function(){return!!(window.HeliuApi&&window.HeliuApi.enabled())},wsBase:function(){var i=window.HELIU_API_BASE||"";return i?i.replace(/^http/,"ws").replace(/\/api\/v1\/?$/,""):""},startLiveTranscription:function(){if(!this.apiEnabled()){this.$emit("toast","实时转写需要连接后端服务");return}var i=window.SpeechRecognition||window.webkitSpeechRecognition;if(!i){this.$emit("toast","当前浏览器不支持实时语音识别，请使用 Chrome 或 Edge");return}var s=this;if(this.liveMeetingId||this.meetingId){this.liveMeetingId=this.liveMeetingId||this.meetingId,this.beginLiveTranscription(i);return}window.HeliuApi.post("/meetings",{title:"实时转写会议"}).then(function(n){s.liveMeetingId=n.id,s.$emit("meeting-created",n.id),s.beginLiveTranscription(i)}).catch(function(n){s.$emit("toast","创建会议失败："+(n&&n.message?n.message:"请检查后端服务"))})},beginLiveTranscription:function(i){this.liveRecording=!0,this.liveStartedAt=Date.now(),this.liveElapsed=0,this.liveStatus="连接中",this.connectTranscriptionSocket(),this.recognition=new i,this.recognition.lang="zh-CN",this.recognition.continuous=!0,this.recognition.interimResults=!0;var s=this;this.recognition.onresult=function(n){for(var o=n.resultIndex;o<n.results.length;o+=1)n.results[o].isFinal&&s.appendLiveSegment(n.results[o][0].transcript)},this.recognition.onerror=function(n){s.$emit("toast","语音识别异常："+(n.error||"请检查麦克风权限"))},this.recognition.onend=function(){s.liveRecording&&setTimeout(function(){if(s.liveRecording)try{s.recognition.start()}catch{}},300)},this.recognition.start(),this.liveStatus="转写中",this.$emit("toast","实时转写已开始，请允许浏览器访问麦克风")},connectTranscriptionSocket:function(){var i=this,s=this.wsBase();if(s){var n=s+"/ws/meetings/"+encodeURIComponent(this.liveMeetingId)+"?workspaceId="+encodeURIComponent(window.HELIU_WORKSPACE_ID||"ws-demo");this.liveSocket=new WebSocket(n),this.liveSocket.onopen=function(){i.liveStatus="已连接"},this.liveSocket.onerror=function(){i.liveStatus="连接异常",i.$emit("toast","转写通道连接失败，但本地文字仍保留在当前页面")},this.liveSocket.onclose=function(){i.liveRecording&&(i.liveStatus="重连中")}}},appendLiveSegment:function(i){var s=(i||"").trim();if(s){var n=Math.round((Date.now()-(this.liveStartedAt||Date.now()))/1e3);this.liveElapsed=n;var o=String(Math.floor(n/60)).padStart(2,"0"),u=String(n%60).padStart(2,"0");this.transcript.push({name:"我",time:o+":"+u,text:s}),this.liveSocket&&this.liveSocket.readyState===WebSocket.OPEN&&this.liveSocket.send(JSON.stringify({speaker:"我",content:s,startMs:n*1e3,endMs:n*1e3+1800,confidence:.92}))}},stopLiveTranscription:function(){if(this.liveRecording=!1,this.recognition)try{this.recognition.stop()}catch{}if(this.liveSocket)try{this.liveSocket.close()}catch{}this.liveStatus="已停止",this.$emit("toast","实时转写已停止，会议记录已保存")},toggleLiveTranscription:function(){this.liveRecording?this.stopLiveTranscription():this.startLiveTranscription()},copyMinutes:function(){var i=this.transcript.map(function(o){return o.name+"（"+o.time+"）："+o.text}),s=`星海计划 · 第二阶段需求评审

`+i.join(`
`),n=this;navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(s).then(function(){n.$emit("toast","会议纪要已复制到剪贴板")}).catch(function(){n.$emit("toast","复制失败，请检查浏览器权限")}):this.$emit("toast","当前浏览器不支持自动复制")}},mounted:function(){this.loadVoices(),this.speechSupported&&window.speechSynthesis.onvoiceschanged!==void 0&&(window.speechSynthesis.onvoiceschanged=this.loadVoices)},beforeUnmount:function(){this.clearTimers(),this.liveRecording&&this.stopLiveTranscription(),window.speechSynthesis&&window.speechSynthesis.cancel()},template:`
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
  `}),Lt={class:"page"},Ht={class:"page-head"},Ft={class:"head-actions"},Ut={class:"meeting-hero"},zt={class:"head-actions mt-16"},Gt={key:0,class:"replay-status"},Jt={class:"replay-status-head"},Vt={class:"replay-progress"},Wt={class:"split-layout mt-16"},Kt={class:"card"},Bt={class:"card-head"},Xt={class:"card-title"},Qt={class:"transcript"},Yt=["onClick"],Zt={class:"transcript-avatar"},_t={class:"transcript-name"},xt={class:"transcript-time"},se={class:"transcript-play"},ie={class:"transcript-text"},te={class:"generated-note"},ee={class:"stack"},ne={class:"card tint-lime"},ae={class:"card"},oe={class:"card-head"},le={class:"card-title"};function de(i,s,n,o,u,h){const l=$("app-icon");return d(),r("main",Lt,[t("div",Ht,[s[8]||(s[8]=t("div",null,[t("div",{class:"eyebrow"},"AI 会议 · 实时协作"),t("h1",{class:"page-title"},[p("会议不只是记录，"),t("br"),p("而是行动的起点。")]),t("p",{class:"page-subtitle"},"语音识别、说话人分离、决策提取与任务分配在同一工作流中完成。每个结论都能回听原始片段。")],-1)),t("div",Ft,[t("button",{class:"btn",onClick:s[0]||(s[0]=e=>i.$emit("navigate","knowledge"))},[c(l,{name:"book"}),s[6]||(s[6]=p("关联知识库",-1))]),t("button",{class:"btn coral",onClick:s[1]||(s[1]=e=>i.$emit("open-modal","meeting"))},[c(l,{name:"video"}),s[7]||(s[7]=p("开始新会议",-1))])])]),t("section",Ut,[t("div",null,[s[12]||(s[12]=t("span",{class:"badge lime"},"AI 纪要已生成 · 准确率 96%",-1)),s[13]||(s[13]=t("h2",null,"星海计划 · 第二阶段需求评审",-1)),s[14]||(s[14]=t("p",null,"2026年9月16日 10:30–11:12 · 6 人参与 · 42 分钟 · 自动关联 8 份项目资料",-1)),t("div",zt,[t("button",{class:"btn lime",onClick:s[2]||(s[2]=(...e)=>i.togglePlay&&i.togglePlay(...e))},[c(l,{name:i.playing?"clock":"play"},null,8,["name"]),p(a(i.replayLabel),1)]),t("button",{class:"btn subtle",onClick:s[3]||(s[3]=(...e)=>i.copyMinutes&&i.copyMinutes(...e))},[c(l,{name:"file"}),s[9]||(s[9]=p("复制纪要",-1))]),t("button",{class:k(["btn",{coral:i.liveRecording}]),onClick:s[4]||(s[4]=(...e)=>i.toggleLiveTranscription&&i.toggleLiveTranscription(...e))},[c(l,{name:"mic"}),p(a(i.liveLabel),1)],2)]),i.playing||i.playbackIndex>=0?(d(),r("div",Gt,[t("div",Jt,[s[10]||(s[10]=t("span",{class:"replay-live-dot"},null,-1)),t("span",null,[p(a(i.playing?"正在回听":"已暂停"),1),i.currentTranscript?(d(),r(f,{key:0},[p(" · "+a(i.currentTranscript.name)+" "+a(i.currentTranscript.time),1)],64)):g("",!0)])]),t("div",Vt,[t("span",{style:H({width:i.replayProgress+"%"})},null,4)]),s[11]||(s[11]=t("div",{class:"replay-tip"},"点击任意发言可从此处回听",-1))])):g("",!0)]),s[15]||(s[15]=A('<div class="meeting-stats"><div class="meeting-stat"><strong>6</strong><span>参与人</span></div><div class="meeting-stat"><strong>4</strong><span>关键决策</span></div><div class="meeting-stat"><strong>7</strong><span>待办事项</span></div><div class="meeting-stat"><strong>3</strong><span>争议点</span></div></div>',1))]),t("div",Wt,[t("section",Kt,[t("div",Bt,[t("div",null,[t("h2",Xt,[c(l,{name:"mic"}),s[16]||(s[16]=p("会议内容与证据链",-1))]),s[17]||(s[17]=t("p",{class:"card-note"},"点击 AI 结论可定位到原始发言",-1))]),t("span",{class:k(["badge",i.liveRecording?"coral":"gray"])},a(i.liveRecording?"实时转写 · "+i.liveStatus:"静态演示记录"),3)]),t("div",Qt,[(d(!0),r(f,null,b(i.transcript,(e,m)=>(d(),r("div",{key:m,class:k(["transcript-row",{playing:i.playbackIndex===m}]),onClick:w=>i.jumpToSegment(m)},[t("div",Zt,a(e.name.slice(0,1)),1),t("div",null,[t("div",_t,[p(a(e.name)+" ",1),t("span",xt,a(e.time),1),t("span",se,a(i.playbackIndex===m?"播放中":"点击回听"),1)]),t("div",ie,a(e.text),1)])],10,Yt))),128))]),s[20]||(s[20]=t("div",{class:"empty-line"},null,-1)),t("div",te,[t("h4",null,[c(l,{name:"spark",size:14}),s[18]||(s[18]=p(" AI 提取的关键决策",-1))]),s[19]||(s[19]=t("p",null,"数据导出能力进入第二阶段候选范围；周一前完成技术方案与资源影响评估后最终确认。",-1))])]),t("div",ee,[t("section",ne,[s[22]||(s[22]=A('<div class="insight-header"><h3>会后行动</h3><span>已分配 7 项</span></div><div class="insight-row"><div class="insight-check done"></div><div><div class="insight-text">整理数据导出需求清单</div><div class="insight-owner">周可 · 明天 18:00</div></div></div><div class="insight-row"><div class="insight-check"></div><div><div class="insight-text">评估设计与研发资源影响</div><div class="insight-owner">陈默 · 9月18日</div></div></div><div class="insight-row"><div class="insight-check"></div><div><div class="insight-text">补充 5 家客户需求证据</div><div class="insight-owner">李慧 · 9月18日</div></div></div><div class="insight-row"><div class="insight-check"></div><div><div class="insight-text">周一会议前同步决策摘要</div><div class="insight-owner">林然 · 9月21日</div></div></div>',5)),t("button",{class:"btn lime sm mt-10",onClick:s[5]||(s[5]=e=>i.$emit("convert-actions",i.transcript))},[c(l,{name:"kanban"}),s[21]||(s[21]=p("全部写入项目",-1))])]),t("section",ae,[t("div",oe,[t("div",null,[t("h2",le,[c(l,{name:"message"}),s[23]||(s[23]=p("AI 会中追问",-1))]),s[24]||(s[24]=t("p",{class:"card-note"},"基于当前发言与历史资料",-1))])]),s[25]||(s[25]=A('<div class="qa-card"><div class="qa-q">这个需求为什么被提升优先级？</div><div class="qa-a">近 30 天客户访谈中 5/7 家明确提及，且与续约意愿呈正相关。</div><div class="qa-source">来源：客户访谈记录 · 09/12</div></div><div class="qa-card"><div class="qa-q">如进入本迭代，最大风险是什么？</div><div class="qa-a">设计资源冲突。影响 3 个下游任务，关键路径可能延迟 3 天。</div><div class="qa-source">来源：项目排期 · 实时计算</div></div>',2))])])])])}const re=S(Pt,[["render",de]]),ce=T({props:{initialPrompt:{type:String,default:""}},data:function(){return{draftId:null,drafts:[],title:"星海计划第二阶段复盘",content:`星海计划第二阶段复盘：增长的关键不在功能数量

过去六周，团队围绕客户留存完成了 12 次产品迭代。真正影响续约意愿的是能否在关键工作流中节省时间，而不是功能数量本身。

01 发生了什么
第二阶段共触达 34 家企业客户，其中 7 家进入深度访谈。首次配置流程的流失率达到 31%。

02 关键判断
下一阶段应把资源从增加功能入口转向减少首次价值达成时间。数据导出、模板预置和跨团队协作是三个最高优先级的验证方向。

03 接下来的行动
团队将在本周完成技术方案与资源评估，下周进入 14 天灰度验证。`,style:"专业",aiPrompt:"",generatedText:"",generating:!1,saving:!1,savedAt:"",showSuggestions:!0}},computed:{wordCount:function(){return(this.content||"").replace(/\s+/g,"").length}},watch:{initialPrompt:function(i){i&&(this.aiPrompt=i,this.generateFromPrompt())}},methods:{apiEnabled:function(){return!!(window.HeliuApi&&window.HeliuApi.enabled())},onInput:function(){this.savedAt=""},loadDrafts:function(){if(this.apiEnabled()){var i=this;window.HeliuApi.get("/writing/drafts").then(function(s){i.drafts=s||[],i.drafts.length&&i.openDraft(i.drafts[0])}).catch(function(){})}},refreshDrafts:function(){if(this.apiEnabled()){var i=this;window.HeliuApi.get("/writing/drafts").then(function(s){i.drafts=s||[]}).catch(function(){})}},openDraft:function(i){this.draftId=i.id,this.title=i.title||"未命名文档",this.content=i.content||"",this.style=i.style||"专业",this.generatedText="",this.savedAt="已加载草稿"},newDraft:function(){this.draftId=null,this.title="未命名文档",this.content="",this.generatedText="",this.savedAt="",this.$emit("toast","已新建草稿，保存后写入后端")},saveDraft:function(){if(!this.apiEnabled()){this.savedAt="离线演示：未保存到后端",this.$emit("toast","离线模式未持久化，连接后端后会保存");return}var i=this;this.saving=!0;var s={title:this.title,content:this.content,style:this.style},n=this.draftId?window.HeliuApi.patch("/writing/drafts/"+encodeURIComponent(this.draftId),s):window.HeliuApi.post("/writing/drafts",s);n.then(function(o){i.draftId=o.id,i.savedAt="已保存 · "+new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"}),i.refreshDrafts(),i.$emit("toast","文档已保存并写入版本记录")}).catch(function(o){i.$emit("toast","保存失败："+(o&&o.message?o.message:"请检查后端服务"))}).then(function(){i.saving=!1})},generate:function(i,s){if(!this.apiEnabled()){this.$emit("toast","离线模式：请配置后端后使用真实 AI 写作");return}var n=(s||this.aiPrompt||"").trim();if(!n){this.$emit("toast","请输入写作任务说明");return}var o=this;this.generating=!0,this.generatedText="";var u=i+"："+n+`

已有正文：
`+this.content;window.HeliuApi.stream("/ai/writing/stream",{prompt:u,style:this.style,contextIds:[]},{onEvent:function(h,l){h==="token"&&(o.generatedText+=l)}}).then(function(){o.generating=!1,o.generatedText||(o.generatedText="模型没有返回内容，请稍后重试。")}).catch(function(h){o.generating=!1,o.$emit("toast","生成失败："+(h&&h.message?h.message:"请检查后端服务"))})},generateFromPrompt:function(){this.generate("请根据任务说明生成初稿",this.aiPrompt),this.$emit("prompt-consumed")},continueDraft:function(){this.generate("请延续已有正文，补充下一部分","基于当前内容继续写作，保持结构一致")},optimize:function(){this.generate("请优化表达并保持事实不变",this.aiPrompt||"提升逻辑、压缩重复内容并保留关键数据")},review:function(){this.generate("请检查事实、数据和引用风险","全文检查数据风险、逻辑漏洞和不可追溯结论")},rewrite:function(i){this.generate("请按指定风格重写正文","风格要求："+i)},applyGenerated:function(i){this.generatedText&&(this.content=i==="replace"?this.generatedText:this.content.trim()+`

`+this.generatedText.trim(),this.generatedText="",this.savedAt="",this.$emit("toast",i==="replace"?"AI 结果已替换正文":"AI 结果已追加到正文"),this.saveDraft())},discardGenerated:function(){this.generatedText=""},wrapSelection:function(i,s,n){var o=this.$refs.editor;if(o){var u=o.selectionStart||0,h=o.selectionEnd||0,l=this.content.slice(u,h)||n||"";this.content=this.content.slice(0,u)+i+l+s+this.content.slice(h),this.$nextTick(function(){o.focus(),o.selectionStart=u+i.length,o.selectionEnd=u+i.length+l.length})}},format:function(i){i==="bold"?this.wrapSelection("**","**","重点内容"):i==="italic"?this.wrapSelection("*","*","强调内容"):i==="link"?this.wrapSelection("[","](https://)","链接文字"):i==="bullet"?this.wrapSelection(`
• `,"","列表项"):i==="quote"?this.wrapSelection(`
> `,"","引用内容"):this.$emit("toast","正文样式已启用")}},mounted:function(){this.loadDrafts(),this.initialPrompt&&this.$nextTick(this.generateFromPrompt)},template:`
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
  `}),pe={class:"page"},ue={class:"page-head"},ve={class:"head-actions"},me=["disabled"],he=["disabled"],fe={class:"writer-shell"},ge={class:"editor-pane"},be={class:"editor-toolbar"},ke=["disabled"],we=["disabled"],ye={class:"writing-ai-quick"},$e=["disabled"],Ie={key:0,class:"generated-draft"},Ce={class:"generated-draft-head"},Ae={class:"head-actions"},Te={class:"doc-meta"},Se={class:"writer-tools"},qe={class:"draft-list"},Ee=["onClick"],Oe={key:0,class:"muted tiny"},Me={class:"tool-list"},Re={class:"insight-tabs"},De=["onClick"],je={class:"generated-note"};function Ne(i,s,n,o,u,h){const l=$("app-icon");return d(),r("main",pe,[t("div",ue,[s[25]||(s[25]=t("div",null,[t("div",{class:"eyebrow"},"AI 写作 · 项目复盘"),t("h1",{class:"page-title"},[p("把业务上下文，"),t("br"),p("直接变成高质量表达。")]),t("p",{class:"page-subtitle"},"文字、草稿和后端持久化已经连接；AI 结果可预览、追加、替换和保存。")],-1)),t("div",ve,[t("button",{class:"btn",disabled:i.generating,onClick:s[0]||(s[0]=(...e)=>i.review&&i.review(...e))},[c(l,{name:"shield"}),s[24]||(s[24]=p("全文检查",-1))],8,me),t("button",{class:"btn primary",disabled:i.saving,onClick:s[1]||(s[1]=(...e)=>i.saveDraft&&i.saveDraft(...e))},[c(l,{name:"check"}),p(a(i.saving?"保存中…":"保存并同步"),1)],8,he)])]),t("div",fe,[t("section",ge,[t("div",be,[t("button",{class:"tool-btn active",title:"正文",onClick:s[2]||(s[2]=e=>i.format("text"))},"Aa"),t("button",{class:"tool-btn",title:"加粗",onClick:s[3]||(s[3]=e=>i.format("bold"))},[...s[26]||(s[26]=[t("b",null,"B",-1)])]),t("button",{class:"tool-btn",title:"斜体",onClick:s[4]||(s[4]=e=>i.format("italic"))},[...s[27]||(s[27]=[t("i",null,"I",-1)])]),t("button",{class:"tool-btn",title:"链接","aria-label":"插入链接",onClick:s[5]||(s[5]=e=>i.format("link"))},[c(l,{name:"link",size:14})]),s[29]||(s[29]=t("span",{class:"tool-divider"},null,-1)),t("button",{class:"tool-btn",title:"列表",onClick:s[6]||(s[6]=e=>i.format("bullet"))},"•"),t("button",{class:"tool-btn",title:"引用",onClick:s[7]||(s[7]=e=>i.format("quote"))},"”"),s[30]||(s[30]=t("span",{class:"tool-divider"},null,-1)),t("button",{class:"btn lime sm",disabled:i.generating,onClick:s[8]||(s[8]=(...e)=>i.continueDraft&&i.continueDraft(...e))},[c(l,{name:"spark",size:14}),p(a(i.generating?"生成中…":"AI 续写"),1)],8,ke),t("button",{class:"btn subtle sm",disabled:i.generating,onClick:s[9]||(s[9]=(...e)=>i.optimize&&i.optimize(...e))},[c(l,{name:"wand",size:14}),s[28]||(s[28]=p("优化表达",-1))],8,we)]),t("div",ye,[y(t("input",{"onUpdate:modelValue":s[10]||(s[10]=e=>i.aiPrompt=e),class:"form-input",placeholder:"描述写作任务，例如：生成 5 条管理层摘要",onKeydown:s[11]||(s[11]=E((...e)=>i.generateFromPrompt&&i.generateFromPrompt(...e),["enter"]))},null,544),[[C,i.aiPrompt]]),t("button",{class:"btn primary sm",disabled:i.generating,onClick:s[12]||(s[12]=(...e)=>i.generateFromPrompt&&i.generateFromPrompt(...e))},"生成初稿",8,$e)]),y(t("input",{"onUpdate:modelValue":s[13]||(s[13]=e=>i.title=e),class:"draft-title-input","aria-label":"文档标题"},null,512),[[C,i.title]]),y(t("textarea",{ref:"editor","onUpdate:modelValue":s[14]||(s[14]=e=>i.content=e),class:"draft-editor","aria-label":"写作正文",onInput:s[15]||(s[15]=(...e)=>i.onInput&&i.onInput(...e))},null,544),[[C,i.content]]),i.generatedText?(d(),r("div",Ie,[t("div",Ce,[s[31]||(s[31]=t("strong",null,"AI 生成结果",-1)),t("span",null,a(i.generating?"正在生成…":"可应用或丢弃"),1)]),t("pre",null,a(i.generatedText),1),t("div",Ae,[t("button",{class:"btn subtle sm",onClick:s[16]||(s[16]=(...e)=>i.discardGenerated&&i.discardGenerated(...e))},"丢弃"),t("button",{class:"btn subtle sm",onClick:s[17]||(s[17]=e=>i.applyGenerated("append"))},"追加到正文"),t("button",{class:"btn primary sm",onClick:s[18]||(s[18]=e=>i.applyGenerated("replace"))},"替换正文")])])):g("",!0),t("div",Te,a(i.wordCount)+" 字 · AI 引用可追溯 · "+a(i.savedAt||"有未同步修改"),1)]),t("aside",Se,[s[39]||(s[39]=t("h3",null,"草稿",-1)),t("div",qe,[(d(!0),r(f,null,b(i.drafts,e=>(d(),r("button",{key:e.id,class:k(["draft-item",{active:i.draftId===e.id}]),onClick:m=>i.openDraft(e)},[t("strong",null,a(e.title||"未命名文档"),1),t("small",null,a(e.style||"专业"),1)],10,Ee))),128)),i.drafts.length?g("",!0):(d(),r("div",Oe,"暂无已保存草稿"))]),t("button",{class:"btn subtle sm mt-10",onClick:s[19]||(s[19]=(...e)=>i.newDraft&&i.newDraft(...e))},[c(l,{name:"plus",size:14}),s[32]||(s[32]=p("新建草稿",-1))]),s[40]||(s[40]=t("div",{class:"empty-line"},null,-1)),s[41]||(s[41]=t("h3",null,"AI 写作助手",-1)),t("div",Me,[t("div",{class:"tool-card",onClick:s[20]||(s[20]=e=>i.rewrite("更简洁"))},[...s[33]||(s[33]=[t("strong",null,"变得更简洁",-1),t("span",null,"去除重复表达，保留关键数据",-1)])]),t("div",{class:"tool-card",onClick:s[21]||(s[21]=e=>i.rewrite("更有说服力"))},[...s[34]||(s[34]=[t("strong",null,"增强说服力",-1),t("span",null,"补充证据链与逻辑连接",-1)])]),t("div",{class:"tool-card",onClick:s[22]||(s[22]=e=>i.rewrite("管理层摘要"))},[...s[35]||(s[35]=[t("strong",null,"生成管理层摘要",-1),t("span",null,"压缩为 5 个关键结论",-1)])]),t("div",{class:"tool-card",onClick:s[23]||(s[23]=(...e)=>i.review&&i.review(...e))},[...s[36]||(s[36]=[t("strong",null,"核验数据引用",-1),t("span",null,"检查来源、日期和口径一致性",-1)])])]),s[42]||(s[42]=t("div",{class:"empty-line"},null,-1)),s[43]||(s[43]=t("h3",null,"语气风格",-1)),t("div",Re,[(d(),r(f,null,b(["专业","克制","有温度"],e=>t("button",{key:e,class:k(["insight-tab",{active:i.style===e}]),onClick:m=>i.style=e},a(e),11,De)),64))]),t("div",je,[t("h4",null,[c(l,{name:"spark",size:14}),s[37]||(s[37]=p(" 上下文已连接",-1))]),s[38]||(s[38]=t("p",null,[p("项目周报 · 实时"),t("br"),p("客户访谈 · 已索引"),t("br"),p("会议纪要 · 可引用")],-1))])])])])}const Pe=S(ce,[["render",Ne]]),Le=T({props:{tasks:{type:Array,default:function(){return[]}}},data:function(){return{viewMode:"board",selectedTask:null}},computed:{todo:function(){return this.tasks.filter(function(i){return i.status==="todo"})},doing:function(){return this.tasks.filter(function(i){return i.status==="doing"})},done:function(){return this.tasks.filter(function(i){return i.status==="done"})}},methods:{move:function(i){this.$emit("task-move",i)}},template:`
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
  `}),He={class:"page"},Fe={class:"page-head"},Ue={class:"head-actions"},ze={class:"split-layout mt-16"},Ge={class:"card"},Je={class:"card-head"},Ve={class:"card-title"},We={class:"insight-tabs mb-0"},Ke={class:"project-board"},Be={class:"board-column"},Xe={class:"board-head"},Qe={class:"board-count"},Ye=["onClick"],Ze={class:"task-type"},_e={class:"task-title"},xe={class:"task-desc"},sn={key:0,class:"ai-chip"},tn={class:"task-foot"},en={class:"mini-avatars"},nn={class:"mini-avatar"},an={class:"task-due"},on={class:"board-column"},ln={class:"board-head"},dn={class:"board-count"},rn=["onClick"],cn={class:"task-type"},pn={class:"task-title"},un={class:"task-desc"},vn={key:0,class:"ai-chip"},mn={class:"task-foot"},hn={class:"mini-avatars"},fn={class:"mini-avatar"},gn={class:"task-due"},bn={class:"board-column"},kn={class:"board-head"},wn={class:"board-count"},yn={class:"task-type"},$n={class:"task-title"},In={class:"task-desc"},Cn={class:"task-foot"},An={class:"mini-avatars"},Tn={class:"mini-avatar"},Sn={class:"task-due"},qn={class:"stack"},En={class:"card tint-coral"},On={class:"card-head"},Mn={class:"card-title"},Rn={class:"signal-list"},Dn={class:"signal"},jn={class:"signal-icon"},Nn={class:"signal-body"},Pn={class:"signal"},Ln={class:"signal-icon"},Hn={class:"card"},Fn={class:"card-head"},Un={class:"card-title"};function zn(i,s,n,o,u,h){const l=$("app-icon");return d(),r("main",He,[t("div",Fe,[s[7]||(s[7]=t("div",null,[t("div",{class:"eyebrow"},"AI 项目 · 星海计划"),t("h1",{class:"page-title"},[p("项目推进，"),t("br"),p("不等周会才开始。")]),t("p",{class:"page-subtitle"},"AI 持续跟踪任务、依赖关系和会议结论，在风险真正阻塞交付之前主动提醒。")],-1)),t("div",Ue,[t("button",{class:"btn",onClick:s[0]||(s[0]=e=>i.$emit("toast","已生成 18 页项目进展报告"))},[c(l,{name:"file"}),s[5]||(s[5]=p("生成进展报告",-1))]),t("button",{class:"btn primary",onClick:s[1]||(s[1]=e=>i.$emit("open-modal","new-task"))},[c(l,{name:"plus"}),s[6]||(s[6]=p("新建任务",-1))])])]),s[25]||(s[25]=A('<div class="metrics-row mb-0"><div class="metric"><div class="metric-label">总体进度</div><div class="metric-value">68%</div><div class="progress lime"><span style="width:68%;"></span></div></div><div class="metric"><div class="metric-label">关键路径剩余</div><div class="metric-value">18天</div><div class="metric-trend">原计划 21 天</div></div><div class="metric"><div class="metric-label">AI 识别风险</div><div class="metric-value">2</div><div class="metric-trend warn">1 项需要今天处理</div></div></div>',1)),t("div",ze,[t("section",Ge,[t("div",Je,[t("div",null,[t("h2",Ve,[c(l,{name:"kanban"}),s[8]||(s[8]=p("交付看板",-1))]),s[9]||(s[9]=t("p",{class:"card-note"},"点击任务卡可推进到下一状态",-1))]),t("div",We,[s[10]||(s[10]=t("button",{class:"insight-tab active"},"看板",-1)),t("button",{class:"insight-tab",onClick:s[2]||(s[2]=e=>i.$emit("toast","时间线视图将在正式版开放"))},"时间线")])]),t("div",Ke,[t("div",Be,[t("div",Xe,[s[11]||(s[11]=t("span",null,"待处理",-1)),t("span",Qe,a(i.todo.length),1)]),(d(!0),r(f,null,b(i.todo,e=>(d(),r("article",{key:e.id,class:k(["task-card",e.tone]),onClick:m=>i.move(e)},[t("div",Ze,a(e.type),1),t("div",_e,a(e.title),1),t("div",xe,a(e.desc),1),e.ai?(d(),r("div",sn,[c(l,{name:"spark",size:11}),p(a(e.ai),1)])):g("",!0),t("div",tn,[t("div",en,[t("span",nn,a(e.owner.slice(0,1)),1),s[12]||(s[12]=t("span",{class:"mini-avatar"},"周",-1))]),t("span",an,a(e.due),1)])],10,Ye))),128))]),t("div",on,[t("div",ln,[s[13]||(s[13]=t("span",null,"进行中",-1)),t("span",dn,a(i.doing.length),1)]),(d(!0),r(f,null,b(i.doing,e=>(d(),r("article",{key:e.id,class:k(["task-card",e.tone]),onClick:m=>i.move(e)},[t("div",cn,a(e.type),1),t("div",pn,a(e.title),1),t("div",un,a(e.desc),1),e.ai?(d(),r("div",vn,[c(l,{name:"spark",size:11}),p(a(e.ai),1)])):g("",!0),t("div",mn,[t("div",hn,[t("span",fn,a(e.owner.slice(0,1)),1),s[14]||(s[14]=t("span",{class:"mini-avatar"},"李",-1))]),t("span",gn,a(e.due),1)])],10,rn))),128))]),t("div",bn,[t("div",kn,[s[15]||(s[15]=t("span",null,"已完成",-1)),t("span",wn,a(i.done.length),1)]),(d(!0),r(f,null,b(i.done,e=>(d(),r("article",{key:e.id,class:k(["task-card",e.tone]),onClick:s[3]||(s[3]=m=>i.$emit("toast","已完成任务暂不支持回退"))},[t("div",yn,a(e.type),1),t("div",$n,a(e.title),1),t("div",In,a(e.desc),1),t("div",Cn,[t("div",An,[t("span",Tn,a(e.owner.slice(0,1)),1)]),t("span",Sn,a(e.due),1)])],2))),128))])])]),t("div",qn,[t("section",En,[t("div",On,[t("div",null,[t("h2",Mn,[c(l,{name:"alert"}),s[16]||(s[16]=p("风险雷达",-1))]),s[17]||(s[17]=t("p",{class:"card-note"},"AI 自动关联任务依赖与会议变化",-1))]),s[18]||(s[18]=t("span",{class:"badge coral"},"2 项",-1))]),t("div",Rn,[t("div",Dn,[t("div",jn,[c(l,{name:"alert"})]),t("div",Nn,[s[19]||(s[19]=t("div",{class:"signal-title"},"设计资源可能阻塞关键路径",-1)),s[20]||(s[20]=t("div",{class:"signal-text"},"影响 3 个下游任务，最早可能延期 3 天。",-1)),t("button",{class:"btn sm mt-10",onClick:s[4]||(s[4]=e=>i.$emit("toast","已打开资源协调工作流"))},"处理风险")])]),t("div",Pn,[t("div",Ln,[c(l,{name:"clock"})]),s[21]||(s[21]=t("div",{class:"signal-body"},[t("div",{class:"signal-title"},"客户续约材料缺少 ROI 数据"),t("div",{class:"signal-text"},"会议将于 14:00 开始，建议会前补齐。")],-1))])])]),t("section",Hn,[t("div",Fn,[t("div",null,[t("h2",Un,[c(l,{name:"users"}),s[22]||(s[22]=p("团队负载",-1))]),s[23]||(s[23]=t("p",{class:"card-note"},"未来 7 天",-1))])]),s[24]||(s[24]=A('<div class="qa-card"><div class="qa-q">陈默 · 研发负责人 <span class="badge coral">112%</span></div><div class="progress coral"><span style="width:88%;"></span></div><div class="qa-source">建议将 1 项低优先级任务转交给周可</div></div><div class="qa-card"><div class="qa-q">周可 · 产品经理 <span class="badge lime">76%</span></div><div class="progress lime"><span style="width:76%;"></span></div><div class="qa-source">负荷健康，可承接额外协调工作</div></div><div class="qa-card"><div class="qa-q">李慧 · 客户成功 <span class="badge blue">83%</span></div><div class="progress"><span style="width:83%;"></span></div><div class="qa-source">2 项客户任务集中在周四</div></div>',3))])])])])}const Gn=S(Le,[["render",zn]]),Jn=T({data:function(){return{activeFile:0,activeInsight:"summary",detail:null,analysis:null,question:"",qaAnswer:"",asking:!1,metaModel:"",files:[{name:"Q3 客户反馈分析.pdf",meta:"32 页 · 刚刚解析",type:"PDF"},{name:"星海计划阶段复盘.docx",meta:"18 页 · 09/15",type:"DOC"},{name:"2026 行业趋势报告.pdf",meta:"64 页 · 09/12",type:"PDF"},{name:"增长实验数据.xlsx",meta:"6 个工作表 · 09/10",type:"XLS"}]}},computed:{current:function(){return this.files[this.activeFile]||null},previewParagraphs:function(){return!this.detail||!this.detail.extractedText?[]:this.detail.extractedText.split(/\n+/).filter(function(i){return i.trim()}).slice(0,14)}},methods:{apiEnabled:function(){return!!(window.HeliuApi&&window.HeliuApi.enabled())},loadFiles:function(){if(this.apiEnabled()){var i=this;window.HeliuApi.get("/documents").then(function(s){!s||!s.length||(i.files=s.map(function(n){return{id:n.id,name:n.name,type:i.typeOf(n.name),meta:i.sizeOf(n.sizeBytes)+" · "+i.statusLabel(n.status),summary:n.summary}}),i.activeFile=0,i.loadDocument())}).catch(function(){})}},typeOf:function(i){var s=String(i||"").split(".").pop().toUpperCase();return s==="MARKDOWN"?"MD":s.length>4?"DOC":s},sizeOf:function(i){return i?i<1024?i+" B":Math.round(i/1024)+" KB":"—"},statusLabel:function(i){return i==="READY"?"已解析":i==="FAILED"?"解析失败":"处理中"},selectFile:function(i){this.activeFile=i,this.$emit("toast","已切换文档，AI 正在重新建立上下文"),this.loadDocument()},loadDocument:function(){var i=this.current;if(this.detail=null,this.analysis=null,this.qaAnswer="",!(!this.apiEnabled()||!i||!i.id)){var s=this;window.HeliuApi.get("/documents/"+encodeURIComponent(i.id)).then(function(n){s.detail=n}).catch(function(){}),window.HeliuApi.get("/documents/"+encodeURIComponent(i.id)+"/analysis").then(function(n){s.analysis=n}).catch(function(){})}},ask:function(){var i=this.current;if(!this.apiEnabled()||!i||!i.id){this.$emit("toast","正在基于原文生成可追溯答案");return}if(!this.question.trim()){this.$emit("toast","请输入要追问的问题");return}var s=this;this.asking=!0,this.qaAnswer="",window.HeliuApi.stream("/documents/"+encodeURIComponent(i.id)+"/ask",{question:this.question},{onEvent:function(n,o){n==="token"?s.qaAnswer+=o:n==="meta"&&(s.metaModel="AI 回答 · 引用可追溯")}}).then(function(){s.asking=!1}).catch(function(n){s.asking=!1,s.$emit("toast","追问失败："+(n&&n.message?n.message:"请检查后端服务"))})}},mounted:function(){this.loadFiles()},template:`
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
  `}),Vn={class:"page"},Wn={class:"page-head"},Kn={class:"head-actions"},Bn={class:"docs-layout"},Xn={class:"card"},Qn={class:"card-head"},Yn={class:"card-title"},Zn={class:"card-note"},_n={class:"file-list",role:"listbox","aria-label":"文档列表"},xn=["aria-selected","onClick","onKeydown"],sa={class:"file-icon"},ia={class:"file-copy"},ta={class:"file-name"},ea={class:"file-meta"},na={class:"doc-preview"},aa={class:"doc-preview-head"},oa={class:"doc-preview-title"},la={class:"doc-preview-pages"},da={key:0,class:"doc-page"},ra={key:1,class:"doc-page"},ca={class:"stack"},pa={class:"card"},ua={class:"insight-tabs"},va={class:"qa-card"},ma={class:"qa-a"},ha={class:"qa-card"},fa={class:"qa-a"},ga={class:"qa-q"},ba={class:"badge coral"},ka={class:"qa-a"},wa={class:"qa-source"},ya={key:0,class:"qa-card"},$a={class:"qa-a"},Ia={class:"qa-source"},Ca={key:1,class:"qa-card"},Aa=["disabled"];function Ta(i,s,n,o,u,h){const l=$("app-icon");return d(),r("main",Vn,[t("div",Wn,[s[10]||(s[10]=t("div",null,[t("div",{class:"eyebrow"},"智能文档 · RAG 知识分析"),t("h1",{class:"page-title"},[p("不是读得更快，"),t("br"),p("而是问到真正重要的事。")]),t("p",{class:"page-subtitle"},"理解论文、合同、报告和数据表，生成摘要、风险提示，并用原始证据回答复杂问题。")],-1)),t("div",Kn,[t("button",{class:"btn","aria-label":"多文档对比",onClick:s[0]||(s[0]=e=>i.$emit("toast","已开始对比文档的核心结论与差异"))},[c(l,{name:"filter"}),s[8]||(s[8]=p("多文档对比",-1))]),t("button",{class:"btn primary",onClick:s[1]||(s[1]=e=>i.$emit("open-modal","upload"))},[c(l,{name:"upload"}),s[9]||(s[9]=p("上传文档",-1))])])]),t("div",Bn,[t("section",Xn,[t("div",Qn,[t("div",null,[t("h2",Yn,[c(l,{name:"folder"}),s[11]||(s[11]=p("文件",-1))]),t("p",Zn,"已索引 "+a(i.files.length)+" 份资料",1)])]),t("div",_n,[(d(!0),r(f,null,b(i.files,(e,m)=>(d(),r("div",{key:e.id||m,class:k(["file-item",{active:i.activeFile===m}]),role:"option","aria-selected":String(i.activeFile===m),tabindex:"0",onClick:w=>i.selectFile(m),onKeydown:[E(w=>i.selectFile(m),["enter"]),E(O(w=>i.selectFile(m),["prevent"]),["space"])]},[t("div",sa,a(e.type),1),t("div",ia,[t("div",ta,a(e.name),1),t("div",ea,a(e.meta),1)])],42,xn))),128))]),s[12]||(s[12]=t("div",{class:"empty-line"},null,-1)),s[13]||(s[13]=t("div",{class:"generated-note"},[t("h4",null,"知识库同步中"),t("p",null,"已完成 OCR、分段、向量化与权限标签写入。")],-1))]),t("section",na,[t("div",aa,[t("div",oa,a(i.current?i.current.name:""),1),s[14]||(s[14]=t("span",{class:"badge lime"},"AI 已完成分析",-1))]),t("div",la,[i.previewParagraphs.length?(d(),r("article",da,[s[15]||(s[15]=t("h2",null,"原文摘录",-1)),s[16]||(s[16]=t("div",{class:"doc-page-meta"},"来自后端解析结果 · 已建立可追溯引用",-1)),(d(!0),r(f,null,b(i.previewParagraphs,(e,m)=>(d(),r("p",{key:m},a(e),1))),128))])):(d(),r("article",ra,[...s[17]||(s[17]=[A('<h2>Q3 客户反馈与留存分析</h2><div class="doc-page-meta">客户成功部 · 2026 年 9 月 · 内部资料</div><h3>核心发现</h3><p>本季度共收集有效客户反馈 1,284 条，较上季度增长 23%。高活跃客户更关注<span class="marked">跨团队协作效率与数据沉淀能力</span>，而对单项功能的敏感度持续下降。</p><h3>流失信号</h3><p>首次配置超过 30 分钟的客户，前两周流失概率为 28%，较平均水平高 <span class="risk-mark">11 个百分点</span>。主要阻塞点集中在权限设置、模板选择和第三方系统接入。</p><h3>续约影响因素</h3><p>数据表明，当客户在关键工作流中形成固定使用习惯后，续约概率可提升至 84%。因此，下一阶段产品策略应从功能覆盖转向<span class="marked">工作流价值达成</span>。</p><h3>建议</h3><p>优先优化首次配置体验，建立行业模板库，并将 AI 摘要嵌入日常会议与项目流程，驱动更多高频协作场景。</p>',10)])]))])]),t("div",ca,[t("section",pa,[t("div",ua,[t("button",{class:k(["insight-tab",{active:i.activeInsight==="summary"}]),onClick:s[2]||(s[2]=e=>i.activeInsight="summary")},"摘要",2),t("button",{class:k(["insight-tab",{active:i.activeInsight==="risk"}]),onClick:s[3]||(s[3]=e=>i.activeInsight="risk")},"风险",2),t("button",{class:k(["insight-tab",{active:i.activeInsight==="qa"}]),onClick:s[4]||(s[4]=e=>i.activeInsight="qa")},"问答",2)]),i.activeInsight==="summary"?(d(),r(f,{key:0},[t("div",va,[s[18]||(s[18]=t("div",{class:"qa-q"},"一句话摘要",-1)),t("div",ma,a(i.analysis&&i.analysis.summary||i.current&&i.current.summary||"客户价值判断正在从“功能是否齐全”转向“工作流能否真正提效”。"),1)]),t("div",ha,[s[20]||(s[20]=t("div",{class:"qa-q"},"关键数据",-1)),t("div",fa,[i.analysis&&i.analysis.keyData&&i.analysis.keyData.length?(d(!0),r(f,{key:0},b(i.analysis.keyData,(e,m)=>(d(),r("span",{key:m},[p(a(e),1),s[19]||(s[19]=t("br",null,null,-1))]))),128)):(d(),r(f,{key:1},[p("反馈量 +23%；首次配置流失率 28%；习惯形成后续约率 84%。")],64))])])],64)):i.activeInsight==="risk"?(d(),r(f,{key:1},[i.analysis&&i.analysis.risks&&i.analysis.risks.length?(d(!0),r(f,{key:0},b(i.analysis.risks,(e,m)=>(d(),r("div",{key:m,class:"qa-card"},[t("div",ga,[t("span",ba,a(e.level),1),p(" "+a(e.title),1)]),t("div",ka,a(e.evidence),1),t("div",wa,"置信度 "+a(Math.round((e.confidence||0)*100))+"%",1)]))),128)):(d(),r(f,{key:1},[s[21]||(s[21]=A('<div class="qa-card"><div class="qa-q"><span class="badge coral">高</span> 首次配置流失</div><div class="qa-a">超过 30 分钟的客户流失概率高出均值 11 个百分点。</div><div class="qa-source">原文第 12 页 · 样本 486</div></div><div class="qa-card"><div class="qa-q"><span class="badge yellow">中</span> 数据导出需求增长</div><div class="qa-a">近 30 天提及率增长 180%，可能影响续约决策。</div><div class="qa-source">原文第 21 页 · 样本 93</div></div>',2))],64))],64)):(d(),r(f,{key:2},[i.qaAnswer?(d(),r("div",ya,[s[22]||(s[22]=t("div",{class:"qa-q"},"回答",-1)),t("div",$a,a(i.qaAnswer),1),t("div",Ia,a(i.metaModel||"基于原文生成"),1)])):(d(),r("div",Ca,[...s[23]||(s[23]=[t("div",{class:"qa-q"},"哪些因素最影响续约？",-1),t("div",{class:"qa-a"},"关键工作流形成固定使用习惯后，续约概率提升至 84%。",-1),t("div",{class:"qa-source"},"引用：第 18 页 · 置信度 93%",-1)])])),y(t("input",{"onUpdate:modelValue":s[5]||(s[5]=e=>i.question=e),class:"form-input","aria-label":"向文档提问",placeholder:"就当前文档继续追问…",onKeydown:s[6]||(s[6]=E((...e)=>i.ask&&i.ask(...e),["enter"]))},null,544),[[C,i.question]]),t("button",{class:"btn lime sm mt-10",disabled:i.asking,onClick:s[7]||(s[7]=(...e)=>i.ask&&i.ask(...e))},[c(l,{name:"spark",size:14}),p(a(i.asking?"生成中…":"继续追问"),1)],8,Aa)],64))])])])])}const Sa=S(Jn,[["render",Ta]]),qa=T({data:function(){return{query:"",stats:null,results:[],searchSummary:"",answer:"",citations:[],graph:{nodes:[],edges:[],nodeCount:0,edgeCount:0},graphFocus:"",graphLoading:!1,busy:!1}},computed:{insights:function(){return this.stats&&this.stats.insights&&this.stats.insights.length?this.stats.insights:[{question:"客户续约的 3 个前置信号",answer:"关键工作流使用深度、协作成员数、数据沉淀量。",source:"来自 6 份访谈和 2 次会议"},{question:"项目延期最常见的原因",answer:"设计资源冲突、范围变更未及时同步、验收标准模糊。",source:"来自近 90 天项目数据"}]},graphNodes:function(){var i=this.graph.nodes||[],s=Math.max(i.length,1),n=100,o=100;return i.map(function(u,h){var l=Math.PI*2*h/s-Math.PI/2,e=h%3===0?.34:.44;return Object.assign({},u,{x:50+Math.cos(l)*n*e,y:50+Math.sin(l)*o*e,shortTitle:String(u.title||"").length>12?String(u.title).slice(0,12)+"…":u.title})})},graphEdges:function(){var i={};return this.graphNodes.forEach(function(s){i[s.id]=s}),(this.graph.edges||[]).map(function(s){return Object.assign({},s,{fromNode:i[s.from],toNode:i[s.to]})}).filter(function(s){return s.fromNode&&s.toNode})}},methods:{apiEnabled:function(){return!!(window.HeliuApi&&window.HeliuApi.enabled())},loadStats:function(){if(this.apiEnabled()){var i=this;window.HeliuApi.get("/knowledge/stats").then(function(s){i.stats=s}).catch(function(){})}},loadGraph:function(i){if(this.apiEnabled()){var s=this;this.graphLoading=!0;var n="/knowledge/graph?depth=2&types=PROJECT,TASK,DOCUMENT,MEETING,PERSON,WORKFLOW";i&&(n+="&focusId="+encodeURIComponent(i)),window.HeliuApi.get(n).then(function(o){s.graph=o||{nodes:[],edges:[],nodeCount:0,edgeCount:0},s.graphFocus=i||""}).catch(function(o){s.$emit("toast","知识图谱加载失败："+(o&&o.message?o.message:"请检查后端服务"))}).then(function(){s.graphLoading=!1})}},selectGraphNode:function(i){this.graphFocus===i.sourceId?(this.graphFocus="",this.loadGraph("")):this.loadGraph(i.sourceId)},typeLabel:function(i){return{PROJECT:"项目",TASK:"任务",DOCUMENT:"文档",MEETING:"会议",PERSON:"成员",WORKFLOW:"自动"}[i]||i},search:function(){var i=this.query.trim();if(!i)return this.$emit("toast","请输入知识问题");if(!this.apiEnabled()){this.$emit("toast","已检索 128 份资料，找到 7 条可追溯证据");return}var s=this;this.busy=!0,this.answer="",this.citations=[],window.HeliuApi.get("/knowledge/search?q="+encodeURIComponent(i)).then(function(n){s.results=n&&n.items||[],s.searchSummary=n?"命中 "+n.total+" 条可追溯证据":"",s.results.length||s.$emit("toast","未检索到匹配内容，可试试“AI 回答”")}).catch(function(n){s.$emit("toast","检索失败："+(n&&n.message?n.message:"请检查后端服务"))}).then(function(){s.busy=!1})},ask:function(){var i=this.query.trim();if(!i)return this.$emit("toast","请输入知识问题");if(!this.apiEnabled()){this.$emit("toast","AI 正在跨会议、文档与项目生成可追溯回答");return}var s=this;this.busy=!0,this.answer="",this.citations=[],window.HeliuApi.post("/knowledge/ask",{question:i,contextIds:[]}).then(function(n){s.answer=n?n.answer:"",s.citations=n&&n.citations||[],s.query=""}).catch(function(n){s.$emit("toast","回答失败："+(n&&n.message?n.message:"请检查后端服务"))}).then(function(){s.busy=!1})}},mounted:function(){this.loadStats(),this.loadGraph("")},template:`
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
  `}),Ea={class:"page"},Oa={class:"page-head"},Ma={class:"head-actions"},Ra={class:"card mb-0"},Da={class:"command-input-wrap"},ja=["disabled"],Na={class:"mt-10 flex-gap"},Pa=["disabled"],La={key:0,class:"muted tiny"},Ha={key:0,class:"qa-card mt-16"},Fa={class:"qa-a"},Ua={key:1,class:"mt-16",role:"list","aria-label":"检索结果"},za={class:"qa-q"},Ga={class:"badge gray"},Ja={class:"qa-a"},Va={class:"qa-source"},Wa={class:"split-layout mt-16"},Ka={class:"knowledge-map"},Ba={class:"map-legend"},Xa={key:0},Qa={key:0,class:"knowledge-map-svg",viewBox:"0 0 100 100",preserveAspectRatio:"none"},Ya=["x1","y1","x2","y2"],Za=["onClick"],_a={key:1,class:"graph-empty"},xa={class:"knowledge-side"},so={class:"kstat"},io={class:"kstat-icon"},to={class:"kstat-value"},eo={class:"kstat"},no={class:"kstat-icon"},ao={class:"kstat-value"},oo={class:"kstat"},lo={class:"kstat-icon"},ro={class:"kstat-value"},co={class:"kstat"},po={class:"kstat-icon"},uo={class:"kstat-value"},vo={class:"card tint-lime"},mo={class:"card-head"},ho={class:"card-title"},fo={class:"qa-q"},go={class:"qa-a"},bo={class:"qa-source"};function ko(i,s,n,o,u,h){const l=$("app-icon");return d(),r("main",Ea,[t("div",Oa,[s[8]||(s[8]=t("div",null,[t("div",{class:"eyebrow"},"企业知识 · 自动沉淀"),t("h1",{class:"page-title"},[p("每一次工作，"),t("br"),p("都让组织更聪明。")]),t("p",{class:"page-subtitle"},"搜索和回答来自真实知识接口；图谱节点与关系边由文档、会议、任务和项目自动构建。")],-1)),t("div",Ma,[t("button",{class:"btn",onClick:s[0]||(s[0]=e=>i.loadGraph(""))},[c(l,{name:"network"}),s[6]||(s[6]=p("刷新图谱",-1))]),t("button",{class:"btn primary",onClick:s[1]||(s[1]=e=>i.$emit("open-modal","upload"))},[c(l,{name:"plus"}),s[7]||(s[7]=p("接入知识源",-1))])])]),t("section",Ra,[t("div",Da,[c(l,{name:"search"}),y(t("input",{"onUpdate:modelValue":s[2]||(s[2]=e=>i.query=e),onKeydown:s[3]||(s[3]=E((...e)=>i.search&&i.search(...e),["enter"])),"aria-label":"检索知识库",placeholder:"问一个跨越会议、文档和项目的问题…",style:{"padding-right":"200px"}},null,544),[[C,i.query]]),t("button",{class:"command-submit",disabled:i.busy,onClick:s[4]||(s[4]=(...e)=>i.search&&i.search(...e))},"检索知识",8,ja)]),t("div",Na,[t("button",{class:"btn lime sm",disabled:i.busy,onClick:s[5]||(s[5]=(...e)=>i.ask&&i.ask(...e))},[c(l,{name:"spark",size:14}),s[9]||(s[9]=p("AI 回答",-1))],8,Pa),i.searchSummary?(d(),r("span",La,a(i.searchSummary),1)):g("",!0)]),i.answer?(d(),r("div",Ha,[s[10]||(s[10]=t("div",{class:"qa-q"},"AI 回答",-1)),t("div",Fa,a(i.answer),1),(d(!0),r(f,null,b(i.citations,(e,m)=>(d(),r("div",{key:m,class:"qa-source"},a(e.sourceName)+" · "+a(e.location)+" · 置信度 "+a(Math.round((e.score||0)*100))+"%",1))),128))])):g("",!0),i.results.length?(d(),r("div",Ua,[(d(!0),r(f,null,b(i.results,(e,m)=>(d(),r("div",{key:m,class:"qa-card",role:"listitem"},[t("div",za,[t("span",Ga,a(e.type),1),p(" "+a(e.title),1)]),t("div",Ja,a(e.snippet),1),t("div",Va,a(e.source)+" · "+a(e.location)+" · 相关度 "+a(Math.round(e.score||0)),1)]))),128))])):g("",!0)]),t("div",Wa,[t("section",Ka,[t("div",Ba,[p("KNOWLEDGE GRAPH · "+a(i.graph.nodeCount||0)+" NODES · "+a(i.graph.edgeCount||0)+" EDGES ",1),i.graphLoading?(d(),r("span",Xa,"· 更新中")):g("",!0)]),i.graphNodes.length?(d(),r("svg",Qa,[(d(!0),r(f,null,b(i.graphEdges,e=>(d(),r("line",{key:e.id,x1:e.fromNode.x,y1:e.fromNode.y,x2:e.toNode.x,y2:e.toNode.y},null,8,Ya))),128))])):g("",!0),(d(!0),r(f,null,b(i.graphNodes,e=>(d(),r("button",{key:e.id,class:k(["node graph-node",["node-"+e.type.toLowerCase(),{active:i.graphFocus===e.sourceId}]]),style:H({left:e.x+"%",top:e.y+"%"}),onClick:m=>i.selectGraphNode(e)},[t("small",null,a(i.typeLabel(e.type)),1),p(a(e.shortTitle),1)],14,Za))),128)),i.graphNodes.length?g("",!0):(d(),r("div",_a,"暂无图谱数据，上传文档或创建任务后会自动生成。")),s[11]||(s[11]=t("div",{class:"map-caption"},"点击节点查看 2 跳关系 · 节点大小代表关联度",-1))]),t("div",xa,[t("div",so,[t("div",io,[c(l,{name:"file"})]),t("div",null,[t("div",to,a(i.stats?i.stats.documents:0),1),s[12]||(s[12]=t("div",{class:"kstat-label"},"已索引文档",-1))])]),t("div",eo,[t("div",no,[c(l,{name:"message"})]),t("div",null,[t("div",ao,a(i.stats?i.stats.meetings:0),1),s[13]||(s[13]=t("div",{class:"kstat-label"},"会议与讨论",-1))])]),t("div",oo,[t("div",lo,[c(l,{name:"link"})]),t("div",null,[t("div",ro,a(i.graph.edgeCount||0),1),s[14]||(s[14]=t("div",{class:"kstat-label"},"知识关联边",-1))])]),t("div",co,[t("div",po,[c(l,{name:"shield"})]),t("div",null,[t("div",uo,a(i.stats?i.stats.traceability:"100%"),1),s[15]||(s[15]=t("div",{class:"kstat-label"},"引用可追溯",-1))])]),t("section",vo,[t("div",mo,[t("div",null,[t("h2",ho,[c(l,{name:"spark"}),s[16]||(s[16]=p("知识洞察",-1))]),s[17]||(s[17]=t("p",{class:"card-note"},"AI 自动提炼可复用经验",-1))])]),(d(!0),r(f,null,b(i.insights,(e,m)=>(d(),r("div",{key:m,class:"qa-card"},[t("div",fo,a(e.question),1),t("div",go,a(e.answer),1),t("div",bo,a(e.source),1)]))),128))])])])])}const wo=S(qa,[["render",ko]]),yo=T({data:function(){return{prompt:"",busy:!1,workflows:[{name:"会议结束自动生成纪要与任务",desc:"会议录音 → 转写 → 决策提取 → 写入项目",on:!0,icon:"video"},{name:"文档上传后自动摘要与风险识别",desc:"文件解析 → RAG 索引 → 风险扫描",on:!0,icon:"file"},{name:"项目风险每日主动播报",desc:"项目数据 → 风险检测 → 企业微信通知",on:!1,icon:"alert"},{name:"周报自动汇总与发送",desc:"项目更新 → 生成周报 → 管理者审批",on:!0,icon:"trending"}]}},computed:{runningCount:function(){return this.workflows.filter(function(i){return i.on}).length}},methods:{apiEnabled:function(){return!!(window.HeliuApi&&window.HeliuApi.enabled())},iconFor:function(i){var s=(i.name||"")+(i.prompt||"")+(i.triggerType||"");return s.indexOf("会议")>-1||s.indexOf("MEETING")>-1?"video":s.indexOf("文档")>-1||s.indexOf("DOCUMENT")>-1?"file":s.indexOf("风险")>-1||s.indexOf("RISK")>-1?"alert":s.indexOf("周报")>-1||s.indexOf("SCHEDULE")>-1?"trending":"automation"},load:function(){if(this.apiEnabled()){var i=this;window.HeliuApi.get("/workflows").then(function(s){!s||!s.length||(i.workflows=s.map(function(n){return i.mapWorkflow(n)}))}).catch(function(){})}},mapWorkflow:function(i){return{id:i.id,name:i.name,desc:i.prompt||i.triggerType+" · 由 AI 编排并持续执行",on:i.enabled,icon:this.iconFor(i)}},toggle:function(i){if(!this.apiEnabled()||!i.id){i.on=!i.on,this.$emit("toast",i.name+(i.on?" 已启用":" 已暂停"));return}var s=this;window.HeliuApi.patch("/workflows/"+encodeURIComponent(i.id)+"/toggle",{}).then(function(n){i.on=n?n.enabled:!i.on,s.$emit("toast",i.name+(i.on?" 已启用":" 已暂停"))}).catch(function(n){s.$emit("toast","切换失败："+(n&&n.message?n.message:"请检查后端服务"))})},run:function(i){if(!this.apiEnabled()||!i.id){this.$emit("toast","已触发「"+i.name+"」，预计 1 分钟内完成");return}var s=this;this.busy=!0,window.HeliuApi.post("/workflows/"+encodeURIComponent(i.id)+"/run",{}).then(function(n){var o=n&&n.status?n.status:"COMPLETED";s.$emit("toast","已执行「"+i.name+"」："+o)}).catch(function(n){s.$emit("toast","执行失败："+(n&&n.message?n.message:"请检查后端服务"))}).then(function(){s.busy=!1})},createFromPrompt:function(){var i=this.prompt.trim();if(!i)return this.$emit("toast","请描述你希望自动化的目标");if(!this.apiEnabled()){this.workflows.unshift({name:i.slice(0,18),desc:"触发条件 → AI 分析 → 业务动作",on:!0,icon:"automation"}),this.prompt="",this.$emit("toast","工作流已生成（离线演示）");return}var s=this;this.busy=!0,window.HeliuApi.post("/workflows/from-prompt",{prompt:i}).then(function(n){s.workflows.unshift(s.mapWorkflow(n)),s.prompt="",s.$emit("toast","已根据自然语言生成工作流")}).catch(function(n){s.$emit("toast","生成失败："+(n&&n.message?n.message:"请检查后端服务"))}).then(function(){s.busy=!1})}},mounted:function(){this.load()},template:`
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
  `}),$o={class:"page"},Io={class:"page-head"},Co={class:"head-actions"},Ao={class:"card"},To={class:"card-head"},So={class:"card-title"},qo={class:"command-input-wrap"},Eo=["disabled"],Oo={class:"card mt-16"},Mo={class:"card-head"},Ro={class:"card-title"},Do={class:"card mt-16"},jo={class:"card-head"},No={class:"card-title"},Po={class:"card-note"},Lo={class:"workflow-icon"},Ho={class:"workflow-body"},Fo={class:"workflow-name"},Uo={class:"workflow-desc"},zo=["disabled","onClick"],Go=["aria-label","aria-pressed","onClick"];function Jo(i,s,n,o,u,h){const l=$("app-icon");return d(),r("main",$o,[t("div",Io,[s[8]||(s[8]=t("div",null,[t("div",{class:"eyebrow"},"AI 自动化 · 工作流编排"),t("h1",{class:"page-title"},[p("让重复工作，"),t("br"),p("自己找到下一步。")]),t("p",{class:"page-subtitle"},"用自然语言描述目标，AI 自动连接业务服务、模型能力和外部系统，形成可观测的自动化工作流。")],-1)),t("div",Co,[t("button",{class:"btn",onClick:s[0]||(s[0]=e=>i.$emit("toast","已打开 14 个可接入应用"))},[c(l,{name:"link"}),s[6]||(s[6]=p("接入应用",-1))]),t("button",{class:"btn primary",onClick:s[1]||(s[1]=e=>i.$refs.prompt.focus())},[c(l,{name:"plus"}),s[7]||(s[7]=p("新建工作流",-1))])])]),t("section",Ao,[t("div",To,[t("div",null,[t("h2",So,[c(l,{name:"wand"}),s[9]||(s[9]=p("用一句话创建工作流",-1))]),s[10]||(s[10]=t("p",{class:"card-note"},"描述触发条件和期望结果，AI 会拆成可执行节点",-1))])]),t("div",qo,[c(l,{name:"spark"}),y(t("input",{ref:"prompt","onUpdate:modelValue":s[2]||(s[2]=e=>i.prompt=e),onKeydown:s[3]||(s[3]=E((...e)=>i.createFromPrompt&&i.createFromPrompt(...e),["enter"])),"aria-label":"用自然语言创建工作流",placeholder:"例如：每周五汇总项目风险，生成周报并通知负责人"},null,544),[[C,i.prompt]]),t("button",{class:"command-submit",disabled:i.busy,onClick:s[4]||(s[4]=(...e)=>i.createFromPrompt&&i.createFromPrompt(...e))},"生成工作流",8,Eo)])]),t("section",Oo,[t("div",Mo,[t("div",null,[t("h2",Ro,[c(l,{name:"workflow"}),s[11]||(s[11]=p("客户续约预警工作流",-1))]),s[12]||(s[12]=t("p",{class:"card-note"},"由自然语言创建 · 已稳定运行 28 天",-1))]),s[13]||(s[13]=t("span",{class:"badge lime"},"运行中",-1))]),s[14]||(s[14]=A('<div class="flow-canvas"><div class="flow-node trigger"><div class="flow-node-label">TRIGGER · 触发</div><div class="flow-node-title">监测客户活跃度</div><div class="flow-node-meta">每日 09:00 · 数据服务</div></div><div class="flow-arrow"></div><div class="flow-node ai"><div class="flow-node-label">AI · 分析</div><div class="flow-node-title">判断续约风险</div><div class="flow-node-meta">LLM + RAG · 6 个信号</div></div><div class="flow-arrow"></div><div class="flow-node action"><div class="flow-node-label">ACTION · 执行</div><div class="flow-node-title">创建跟进任务</div><div class="flow-node-meta">项目管理 · 通知负责人</div></div></div>',1))]),t("section",Do,[t("div",jo,[t("div",null,[t("h2",No,[c(l,{name:"automation"}),s[15]||(s[15]=p("自动化工作流",-1))]),t("p",Po,a(i.workflows.length)+" 个流程 · 其中 "+a(i.runningCount)+" 个运行中",1)]),t("button",{class:"card-link",onClick:s[5]||(s[5]=e=>i.$emit("toast","已展示全部工作流"))},"全部工作流 →")]),t("div",null,[(d(!0),r(f,null,b(i.workflows,(e,m)=>(d(),r("div",{key:e.id||m,class:"workflow-item"},[t("div",Lo,[c(l,{name:e.icon},null,8,["name"])]),t("div",Ho,[t("div",Fo,a(e.name),1),t("div",Uo,a(e.desc),1)]),t("button",{class:"btn subtle sm",disabled:i.busy,onClick:w=>i.run(e)},"立即执行",8,zo),t("span",{class:k(["badge",e.on?"lime":"gray"])},a(e.on?"运行中":"已暂停"),3),t("button",{class:k(["switch",{on:e.on}]),"aria-label":(e.on?"暂停":"启用")+e.name,"aria-pressed":String(e.on),onClick:w=>i.toggle(e)},null,10,Go)]))),128))])])])}const Vo=S(yo,[["render",Jo]]);class M extends Error{constructor(n,o){super(n);U(this,"status");this.name="ApiException",this.status=o}}(function(){try{const s=new URLSearchParams(window.location.search).get("api");s&&(window.HELIU_API_BASE=s.replace(/\/+$/,""))}catch{}})();function R(){return String(window.HELIU_API_BASE||"").replace(/\/+$/,"")}function N(){return!!R()&&typeof window.fetch=="function"}function Wo(){return{"Content-Type":"application/json","X-Workspace-Id":window.HELIU_WORKSPACE_ID||"ws-demo"}}function z(){try{return sessionStorage.getItem("heliu_token")||""}catch{return""}}function G(){const i=Wo(),s=z();return s&&(i.Authorization="Bearer "+s),i}function J(i){return i.json().catch(()=>null).then(s=>{if(!i.ok||s&&s.success===!1){const n=s&&s.message||"请求失败 HTTP "+i.status;throw new M(n,i.status)}return s?s.data:null})}function j(i,s,n){if(!N())return Promise.reject(new M("后端未配置"));const o={method:i,headers:G()};return n!==void 0&&(o.body=JSON.stringify(n)),fetch(R()+s,o).then(J)}function Ko(i,s){if(!N())return Promise.reject(new M("后端未配置"));const n={"X-Workspace-Id":window.HELIU_WORKSPACE_ID||"ws-demo"},o=z();return o&&(n.Authorization="Bearer "+o),fetch(R()+i,{method:"POST",headers:n,body:s}).then(J)}function Bo(i,s,n,o){return N()?fetch(R()+s,{method:i,headers:G(),body:JSON.stringify(n)}).then(u=>{if(!u.ok||!u.body)throw new M("请求失败 HTTP "+u.status);const h=u.body.getReader(),l=new TextDecoder("utf-8");let e="";function m(){return h.read().then(w=>{if(w.done)return null;e+=l.decode(w.value,{stream:!0});const v=e.split(`

`);return e=v.pop()||"",v.forEach(I=>{let P="message",F="";I.split(`
`).forEach(D=>{D.indexOf("event:")===0?P=D.slice(6).trim():D.indexOf("data:")===0&&(F+=D.slice(5).trim())}),o&&o.onEvent&&o.onEvent(P,F)}),m()})}return m()}):Promise.reject(new M("后端未配置"))}const Xo={enabled:N,base:R,get:i=>j("GET",i),post:(i,s)=>j("POST",i,s),patch:(i,s)=>j("PATCH",i,s),del:i=>j("DELETE",i),upload:(i,s)=>Ko(i,s),stream:(i,s,n)=>Bo("POST",i,s,n)};window.HeliuApi=Xo;const q=Q(Ps);q.component("app-icon",Gs);q.component("copilot-panel",ri);q.component("modal-host",Ci);q.component("jitsi-meeting",Vi);q.component("view-dashboard",Nt);q.component("view-meetings",re);q.component("view-writing",Pe);q.component("view-projects",Gn);q.component("view-documents",Sa);q.component("view-knowledge",wo);q.component("view-automation",Vo);q.mount("#app");
