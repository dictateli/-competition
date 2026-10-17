// 合流 AI 前端 API 客户端（TypeScript 版）。
// 未配置 window.HELIU_API_BASE 时 enabled() 返回 false，界面自动降级为内置演示数据，
// 因此离线原型（直接打开页面）依然可用。

export class ApiException extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
  }
}

export interface StreamHandlers {
  onEvent?: (event: string, data: string) => void;
}

declare global {
  interface Window {
    HELIU_API_BASE?: string;
    HELIU_WORKSPACE_ID?: string;
    HeliuApi?: typeof HeliuApi;
  }
}

// 支持地址栏 ?api=... 传参：登录页跳转到 app.html?api=... 后，主应用此前不会读取
// 该参数，导致登录成功却仍走离线演示。这里在模块加载时把 URL 里的 api 回填一次。
(function resolveApiBase() {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('api');
    if (fromUrl) window.HELIU_API_BASE = fromUrl.replace(/\/+$/, '');
  } catch (e) {
    // 非法查询参数，忽略即可。
  }
})();

function base(): string {
  return String(window.HELIU_API_BASE || '').replace(/\/+$/, '');
}

function enabled(): boolean {
  return !!base() && typeof window.fetch === 'function';
}

function headers(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'X-Workspace-Id': window.HELIU_WORKSPACE_ID || 'ws-demo'
  };
}

function token(): string {
  try {
    return sessionStorage.getItem('heliu_token') || '';
  } catch {
    return '';
  }
}

function authHeaders(): Record<string, string> {
  const h = headers();
  const t = token();
  if (t) h['Authorization'] = 'Bearer ' + t;
  return h;
}

function unwrap(response: Response): Promise<any> {
  return response.json().catch(() => null).then((payload: any) => {
    if (!response.ok || (payload && payload.success === false)) {
      const message = (payload && payload.message) || ('请求失败 HTTP ' + response.status);
      throw new ApiException(message, response.status);
    }
    return payload ? payload.data : null;
  });
}

function request(method: string, path: string, body?: unknown): Promise<any> {
  if (!enabled()) return Promise.reject(new ApiException('后端未配置'));
  const options: RequestInit = { method, headers: authHeaders() };
  if (body !== undefined) options.body = JSON.stringify(body);
  return fetch(base() + path, options).then(unwrap);
}

// 文件上传：使用 multipart/form-data，不能手工设置 Content-Type，交给浏览器生成 boundary。
function upload(path: string, formData: FormData): Promise<any> {
  if (!enabled()) return Promise.reject(new ApiException('后端未配置'));
  const h: Record<string, string> = { 'X-Workspace-Id': window.HELIU_WORKSPACE_ID || 'ws-demo' };
  const t = token();
  if (t) h['Authorization'] = 'Bearer ' + t;
  return fetch(base() + path, { method: 'POST', headers: h, body: formData }).then(unwrap);
}

// 读取 text/event-stream 响应（文档问答等接口使用 SSE）。
// handlers.onEvent(event, data) 会在每个事件到达时被调用。
function streamRequest(method: string, path: string, body: unknown, handlers: StreamHandlers): Promise<void> {
  if (!enabled()) return Promise.reject(new ApiException('后端未配置'));
  return fetch(base() + path, { method, headers: authHeaders(), body: JSON.stringify(body) }).then((response: Response) => {
    if (!response.ok || !response.body) throw new ApiException('请求失败 HTTP ' + response.status);
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    function pump(): Promise<any> {
      return reader.read().then((result: ReadableStreamReadResult<Uint8Array>) => {
        if (result.done) return null;
        buffer += decoder.decode(result.value, { stream: true });
        const blocks = buffer.split('\n\n');
        buffer = blocks.pop() || '';
        blocks.forEach((block: string) => {
          let event = 'message';
          let data = '';
          block.split('\n').forEach((line: string) => {
            if (line.indexOf('event:') === 0) event = line.slice(6).trim();
            else if (line.indexOf('data:') === 0) data += line.slice(5).trim();
          });
          if (handlers && handlers.onEvent) handlers.onEvent(event, data);
        });
        return pump();
      });
    }
    return pump();
  });
}

export const HeliuApi = {
  enabled,
  base,
  get: (path: string) => request('GET', path),
  post: (path: string, body?: unknown) => request('POST', path, body),
  patch: (path: string, body?: unknown) => request('PATCH', path, body),
  del: (path: string) => request('DELETE', path),
  upload: (path: string, formData: FormData) => upload(path, formData),
  stream: (path: string, body: unknown, handlers: StreamHandlers) => streamRequest('POST', path, body, handlers)
};

window.HeliuApi = HeliuApi;
