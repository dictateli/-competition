// 合流 AI 前端 API 客户端。
// 未配置 window.HELIU_API_BASE 时 enabled() 返回 false，界面自动降级为内置演示数据，
// 因此离线原型（直接打开 prototype-final.html）依然可用。
(function () {
  function base() {
    return String(window.HELIU_API_BASE || '').replace(/\/+$/, '');
  }

  function enabled() {
    return !!base() && typeof window.fetch === 'function';
  }

  function headers() {
    return {
      'Content-Type': 'application/json',
      'X-Workspace-Id': window.HELIU_WORKSPACE_ID || 'ws-demo'
    };
  }

  function unwrap(response) {
    return response.json().catch(function () { return null; }).then(function (payload) {
      if (!response.ok || (payload && payload.success === false)) {
        var message = (payload && payload.message) || ('请求失败 HTTP ' + response.status);
        throw new Error(message);
      }
      return payload ? payload.data : null;
    });
  }

  function request(method, path, body) {
    if (!enabled()) return Promise.reject(new Error('后端未配置'));
    var options = { method: method, headers: headers() };
    if (body !== undefined) options.body = JSON.stringify(body);
    return fetch(base() + path, options).then(unwrap);
  }

  // 文件上传：使用 multipart/form-data，不能手工设置 Content-Type，交给浏览器生成 boundary。
  function upload(path, formData) {
    if (!enabled()) return Promise.reject(new Error('后端未配置'));
    return fetch(base() + path, {
      method: 'POST',
      headers: { 'X-Workspace-Id': window.HELIU_WORKSPACE_ID || 'ws-demo' },
      body: formData
    }).then(unwrap);
  }

  // 读取 text/event-stream 响应（文档问答等接口使用 SSE）。
  // handlers.onEvent(event, data) 会在每个事件到达时被调用。
  function streamRequest(method, path, body, handlers) {
    if (!enabled()) return Promise.reject(new Error('后端未配置'));
    return fetch(base() + path, { method: method, headers: headers(), body: JSON.stringify(body) }).then(function (response) {
      if (!response.ok || !response.body) throw new Error('请求失败 HTTP ' + response.status);
      var reader = response.body.getReader();
      var decoder = new TextDecoder('utf-8');
      var buffer = '';
      function pump() {
        return reader.read().then(function (result) {
          if (result.done) return null;
          buffer += decoder.decode(result.value, { stream: true });
          var blocks = buffer.split('\n\n');
          buffer = blocks.pop();
          blocks.forEach(function (block) {
            var event = 'message';
            var data = '';
            block.split('\n').forEach(function (line) {
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

  window.HeliuApi = {
    enabled: enabled,
    base: base,
    get: function (path) { return request('GET', path); },
    post: function (path, body) { return request('POST', path, body); },
    patch: function (path, body) { return request('PATCH', path, body); },
    del: function (path) { return request('DELETE', path); },
    upload: upload,
    stream: function (path, body, handlers) { return streamRequest('POST', path, body, handlers); }
  };
})();
