const axios = require('axios');

// access_token 缓存：提前 5 分钟过期，避免临界点失效
let tokenCache = { token: '', expiresAt: 0 };

function getWechatConfig() {
  return {
    appid: process.env.WECHAT_APPID,
    secret: process.env.WECHAT_SECRET
  };
}

async function getAccessToken() {
  const { appid, secret } = getWechatConfig();
  if (!appid || !secret) {
    throw new Error('未配置 WECHAT_APPID / WECHAT_SECRET');
  }

  if (tokenCache.token && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const res = await axios.get('https://api.weixin.qq.com/cgi-bin/token', {
    params: {
      grant_type: 'client_credential',
      appid,
      secret
    },
    timeout: 5000
  });

  const data = res.data || {};
  if (data.errcode) {
    throw new Error('获取 access_token 失败：' + (data.errmsg || data.errcode));
  }

  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + Math.max(data.expires_in - 300, 60) * 1000
  };
  return tokenCache.token;
}

/**
 * 文本内容安全校验
 * @param {string} content 待检测文本
 * @param {string} openid 用户 openid（v2 接口必填）
 * @param {number} scene 场景值，2=评论/资料等用户文本
 * @returns {{pass: boolean, suggest?: string, label?: number, skipped?: boolean}}
 */
async function checkText(content, openid, scene = 2) {
  const text = String(content || '').trim().slice(0, 2500);
  if (!text) return { pass: true };

  const { appid, secret } = getWechatConfig();
  if (!appid || !secret || !openid) {
    console.warn('[msgSecCheck] 缺少微信凭据或 openid，跳过文本安全校验');
    return { pass: true, skipped: true };
  }

  try {
    const accessToken = await getAccessToken();
    const res = await axios.post(
      'https://api.weixin.qq.com/wxa/msg_sec_check',
      {
        content: text,
        version: 2,
        scene,
        openid
      },
      {
        params: { access_token: accessToken },
        timeout: 5000
      }
    );

    const data = res.data || {};
    if (data.errcode && data.errcode !== 0) {
      console.warn('[msgSecCheck] 接口返回异常', data.errcode, data.errmsg);
      return { pass: true, skipped: true };
    }

    const suggest = data.result && data.result.suggest;
    const label = data.result && data.result.label;
    // 只有明确 pass 才放行；review / risky 一律拦截，避免公共内容风险
    return { pass: suggest === 'pass', suggest, label };
  } catch (error) {
    // 网络或配置异常时放行主流程，但要打日志便于排查
    console.warn('[msgSecCheck] 调用失败，放行本次文本：', error.message);
    return { pass: true, skipped: true };
  }
}

module.exports = { checkText, getAccessToken };
