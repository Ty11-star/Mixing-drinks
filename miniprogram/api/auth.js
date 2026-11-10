// api/auth.js
const request = require('../utils/request');

module.exports = {
  // 微信小程序登录
  wechatLogin: (code) => request({ url: '/auth/wechat/login', method: 'POST', data: { code } }),
  // 更新用户昵称/头像（需登录 token）
  updateProfile: (data) => request({ url: '/auth/user/profile', method: 'PUT', data })
};
