// utils/config.js
// 全局配置：API 地址与运行模式
const config = {
  // 生产地址：域名 myty11.com 已解析到服务器 8.134.248.177
  // 小程序要求 HTTPS + 已备案域名，备案通过并在微信公众平台配置 request 合法域名后即可使用
  // 备案期间临时调试：改成 http://8.134.248.177/api/v1，
  //   并在微信开发者工具「详情 → 本地设置」勾选「不校验合法域名」
  // 本地后端调试：http://localhost:3000/api/v1
  baseUrl: 'https://myty11.com/api/v1',

  // 离线运行开关：false = 走真实后端；true = 使用内置模拟数据（后端未启动时临时预览用）
  useMock: false,

  timeout: 10000
};

module.exports = config;
