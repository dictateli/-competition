import { createApp } from 'vue';
import App from './App.vue';
import AppIcon from './components/AppIcon.vue';
import Copilot from './components/Copilot.vue';
import ModalHost from './components/ModalHost.vue';
import JitsiMeeting from './components/JitsiMeeting.vue';
import DashboardView from './views/DashboardView.vue';
import MeetingsView from './views/MeetingsView.vue';
import WritingView from './views/WritingView.vue';
import ProjectsView from './views/ProjectsView.vue';
import DocumentsView from './views/DocumentsView.vue';
import KnowledgeView from './views/KnowledgeView.vue';
import AutomationView from './views/AutomationView.vue';
import './api';
import '../public/styles.css';
import '../public/runtime.css';

declare global {
  interface Window {
    HELIU_API_BASE?: string;
    HELIU_WORKSPACE_ID?: string;
    HELIU_JITSI_DOMAIN?: string;
    FlowViews?: Record<string, unknown>;
  }
}

const app = createApp(App);

app.component('app-icon', AppIcon);
app.component('copilot-panel', Copilot);
app.component('modal-host', ModalHost);
app.component('jitsi-meeting', JitsiMeeting);
app.component('view-dashboard', DashboardView);
app.component('view-meetings', MeetingsView);
app.component('view-writing', WritingView);
app.component('view-projects', ProjectsView);
app.component('view-documents', DocumentsView);
app.component('view-knowledge', KnowledgeView);
app.component('view-automation', AutomationView);

app.mount('#app');
