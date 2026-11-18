// api/auth.js
const request = require('../utils/request');

module.exports = {
  // 微信小程序登录（携带用户在授权弹窗填写的昵称头像）
  wechatLogin: (code, profile = {}) => request({ url: '/auth/wechat/login', method: 'POST', data: Object.assign({ code }, profile) }),
  // 更新用户昵称/头像（需登录 token）
  updateProfile: (data) => request({ url: '/auth/user/profile', method: 'PUT', data })
};
