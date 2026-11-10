// utils/request.js
// wx.request 封装：统一响应处理 + 离线 mock 回退
const config = require('./config');
const mock = require('./mock');
const storage = require('./storage');

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
      wx.showToast({ title: err.message || '请求失败', icon: 'none' });
      return Promise.reject(err);
    });
  }

  // 真实请求
  return new Promise((resolve, reject) => {
    const token = storage.get('token', '');
    wx.request({
      url: config.baseUrl + url,
      method,
      data,
      timeout: options.timeout || config.timeout,
      header: {
        'content-type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      success(res) {
        const body = res.data;
        if (res.statusCode === 200 && body && body.code === 200) {
          resolve(body.data);
        } else {
          const msg = body && body.message ? body.message : ('网络错误 ' + res.statusCode);
          wx.showToast({ title: msg, icon: 'none' });
          reject(new Error(msg));
        }
      },
      fail(err) {
        const msg = (err && err.errMsg) ? err.errMsg : '网络请求失败';
        wx.showToast({ title: msg, icon: 'none' });
        reject(new Error(msg));
      }
    });
  });
}

module.exports = request;
