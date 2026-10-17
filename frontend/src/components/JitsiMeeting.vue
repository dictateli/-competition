<template>
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
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    room: { type: String, required: true },
    title: { type: String, default: '合流 AI 会议' },
    userName: { type: String, default: '林然' },
    meetingId: { type: String, default: '' },
    domain: { type: String, default: 'meet.jit.si' }
  },
  data: function () {
    return {
      api: null,
      loading: true,
      error: '',
      participantCount: 1,
      scriptPromise: null
    };
  },
  computed: {
    meetingUrl: function () {
      return 'https://' + this.domain + '/' + encodeURIComponent(this.room);
    },
    shortRoom: function () {
      return this.room.length > 34 ? this.room.slice(0, 34) + '...' : this.room;
    }
  },
  methods: {
    loadJitsiScript: function () {
      var self = this;
      if (window.JitsiMeetExternalAPI) return Promise.resolve(window.JitsiMeetExternalAPI);
      if (this.scriptPromise) return this.scriptPromise;
      this.scriptPromise = new Promise(function (resolve, reject) {
        var existing = document.querySelector('script[data-jitsi-external-api]');
        var timer = setTimeout(function () {
          reject(new Error('Jitsi script timeout'));
        }, 15000);
        function finish() {
          clearTimeout(timer);
          if (window.JitsiMeetExternalAPI) resolve(window.JitsiMeetExternalAPI);
          else reject(new Error('Jitsi API unavailable'));
        }
        function fail() {
          clearTimeout(timer);
          reject(new Error('Jitsi script failed to load'));
        }
        if (existing) {
          existing.addEventListener('load', finish);
          existing.addEventListener('error', fail);
          if (window.JitsiMeetExternalAPI) finish();
          return;
        }
        var script = document.createElement('script');
        script.src = 'https://' + self.domain + '/external_api.js';
        script.async = true;
        script.setAttribute('data-jitsi-external-api', 'true');
        script.addEventListener('load', finish);
        script.addEventListener('error', fail);
        document.head.appendChild(script);
      });
      return this.scriptPromise;
    },
    initMeeting: function () {
      var self = this;
      this.loading = true;
      this.error = '';
      this.loadJitsiScript().then(function (JitsiMeetExternalAPI) {
        if (!self.$refs.container) throw new Error('Jitsi container unavailable');
        self.api = new JitsiMeetExternalAPI(self.domain, {
          roomName: self.room,
          parentNode: self.$refs.container,
          width: '100%',
          height: '100%',
          userInfo: { displayName: self.userName },
          configOverwrite: {
            prejoinPageEnabled: false,
            prejoinConfig: { enabled: false },
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            disableDeepLinking: true,
            enableWelcomePage: false
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            TOOLBAR_ALWAYS_VISIBLE: true,
            DEFAULT_BACKGROUND: '#14211b'
          }
        });
        self.api.addEventListener('videoConferenceJoined', function () {
          self.loading = false;
        });
        self.api.addEventListener('participantJoined', function () {
          self.participantCount += 1;
        });
        self.api.addEventListener('participantLeft', function () {
          self.participantCount = Math.max(1, self.participantCount - 1);
        });
        self.api.addEventListener('readyToClose', function () {
          self.$emit('close');
        });
        window.setTimeout(function () {
          if (self.api) self.loading = false;
        }, 2500);
      }).catch(function (error) {
        self.loading = false;
        self.error = error && error.message ? error.message : 'Jitsi 加载失败';
      });
    },
    dispose: function () {
      if (this.api) {
        try { this.api.dispose(); } catch (error) { }
        this.api = null;
      }
    },
    retry: function () {
      this.dispose();
      this.scriptPromise = null;
      this.initMeeting();
    },
    copyInvite: function () {
      var self = this;
      var text = '邀请你加入「' + this.title + '」：' + this.meetingUrl;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          self.$emit('toast', 'Jitsi 邀请链接已复制');
        }).catch(function () {
          self.$emit('toast', '邀请链接：' + self.meetingUrl);
        });
      } else {
        this.$emit('toast', '邀请链接：' + this.meetingUrl);
      }
    },
    endMeeting: function () {
      if (this.api) {
        try { this.api.executeCommand('hangup'); } catch (error) { }
      }
      this.dispose();
      this.$emit('close');
    }
  },
  mounted: function () {
    this.initMeeting();
  },
  beforeUnmount: function () {
    this.dispose();
  },
  template: `
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
  `
});
</script>
