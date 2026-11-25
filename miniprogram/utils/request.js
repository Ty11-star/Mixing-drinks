// utils/request.js
// wx.request 封装：统一响应处理 + 离线 mock 回退 + 登录令牌
const config = require('./config');
const mock = require('./mock');
const storage = require('./storage');

const TOKEN_KEY = 'auth_token';
let loginTask = null;

function getToken() {
  return storage.get(TOKEN_KEY, '');
}

// 用 wx.login 的 code 换取后端签发的令牌；并发请求共用同一次登录
function login() {
  if (loginTask) return loginTask;

  loginTask = new Promise((resolve, reject) => {
    wx.login({
      success(loginRes) {
        if (!loginRes.code) {
          reject(new Error('微信登录失败：未获取到 code'));
          return;
        }
        wx.request({
          url: config.baseUrl + '/auth/wechat/login',
          method: 'POST',
          data: { code: loginRes.code },
          timeout: config.timeout,
          header: { 'content-type': 'application/json' },
          success(res) {
            const body = res.data || {};
            if (res.statusCode === 200 && body.code === 200 && body.data && body.data.token) {
              storage.set(TOKEN_KEY, body.data.token);
              resolve(body.data.token);
            } else {
              reject(new Error(body.message || '登录失败'));
            }
          },
          fail(err) {
            reject(new Error((err && err.errMsg) || '登录请求失败'));
          }
        });
      },
      fail(err) {
        reject(new Error((err && err.errMsg) || '微信登录失败'));
      }
    });
  }).then(
    (token) => { loginTask = null; return token; },
    (err) => { loginTask = null; throw err; }
  );

  return loginTask;
}

function ensureToken() {
  const token = getToken();
  if (token) return Promise.resolve(token);
  return login();
}

function doRequest(options, token, retried) {
  const method = (options.method || 'GET').toUpperCase();
  const fullUrl = config.baseUrl + options.url;

  return new Promise((resolve, reject) => {
    wx.request({
      url: fullUrl,
      method,
      data: options.data || {},
      timeout: options.timeout || config.timeout,
      header: {
        'content-type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      success(res) {
        const body = res.data;
        if (res.statusCode === 200 && body && body.code === 200) {
          resolve(body.data);
          return;
        }

        // 令牌失效：清掉旧令牌，重新登录后只重试一次
        if (Number(body && body.code) === 401 && !retried) {
          storage.remove(TOKEN_KEY);
          login().then(
            (newToken) => doRequest(options, newToken, true).then(resolve, reject),
            reject
          );
          return;
        }

        const msg = (body && (body.message || body.msg)) || ('网络错误 ' + res.statusCode);
        console.error('[request] 响应异常', fullUrl, res.statusCode, body);
        reject(new Error(msg));
      },
      fail(err) {
        const msg = (err && err.errMsg) || '网络请求失败';
        console.error('[request] 请求失败', fullUrl, err);
        reject(new Error(msg));
      }
    });
  });
}

/**
 * 发起请求
 * @param {Object} options { url, method, data }
 * @returns Promise<data> 成功时 resolve 后端返回的 data 字段
 */
function request(options) {
  const method = (options.method || 'GET').toUpperCase();
  const url = options.url;
  const data = options.data || {};

  if (config.useMock) {
    const query = method === 'GET' ? data : {};
    const body = method === 'POST' ? data : {};
    return mock.request(method, url, query, body).then(res => res).catch(err => {
      if (!options.silent) wx.showToast({ title: err.message || '请求失败', icon: 'none' });
      return Promise.reject(err);
    });
  }

  return ensureToken()
    .then(token => doRequest(options, token, false))
    .catch(err => {
      if (!options.silent) wx.showToast({ title: err.message || '请求失败', icon: 'none' });
      return Promise.reject(err);
    });
}

module.exports = request;
