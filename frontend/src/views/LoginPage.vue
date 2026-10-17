<template>
  <div class="login-shell">
    <div class="box">
      <h2>登录</h2>
      <form id="login-form" @submit.prevent="onSubmit">
        <div class="input-box">
          <label for="account">账号</label>
          <input id="account" v-model="account" type="text" autocomplete="username" required />
        </div>
        <div class="input-box">
          <label for="password">密码</label>
          <input id="password" v-model="password" type="password" autocomplete="current-password" required />
        </div>
        <div class="bth-box">
          <a href="#" onclick="return false;">忘记密码</a>
          <div>
            <button type="submit" :disabled="busy">{{ busy ? '登录中…' : '登录' }}</button>
            <button type="button" @click="goOffline">注册</button>
          </div>
        </div>
        <p v-if="error" class="login-error">{{ error }}</p>
        <p v-else-if="hint" class="login-hint">{{ hint }}</p>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const account = ref('');
    const password = ref('');
    const busy = ref(false);
    const error = ref('');
    const hint = ref('');

    const params = new URLSearchParams(window.location.search);
    const apiBase = (params.get('api') || (window as any).HELIU_API_BASE || '').replace(/\/+$/, '');

    if (!apiBase) {
      hint.value = '未配置后端，将进入离线演示模式';
    } else {
      hint.value = '演示账号：linran / heliu123，zhao / heliu123，demo / demo1234';
    }

    function targetApp(): string {
      return 'app.html' + (apiBase ? ('?api=' + encodeURIComponent(apiBase)) : '');
    }

    function goOffline() {
      window.location.href = targetApp();
    }

    async function onSubmit() {
      error.value = '';
      if (!apiBase || !window.fetch) {
        window.location.href = targetApp();
        return;
      }
      busy.value = true;
      try {
        const resp = await fetch(apiBase + '/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: account.value, password: password.value })
        });
        const payload = await resp.json().catch(() => null);
        if (resp.ok && payload && payload.success && payload.data && payload.data.token) {
          try { sessionStorage.setItem('heliu_token', payload.data.token); } catch (e) {}
          window.location.href = targetApp();
          return;
        }
        error.value = (payload && payload.message) || ('登录失败 HTTP ' + resp.status);
        busy.value = false;
      } catch (e: any) {
        error.value = '无法连接后端：' + (e && e.message ? e.message : '网络错误');
        busy.value = false;
      }
    }

    return { account, password, busy, error, hint, onSubmit, goOffline };
  }
});
</script>
