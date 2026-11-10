// utils/config.js
// 全局配置：API 地址与运行模式
const config = {
  // 真实后端地址（server 端口 3000，前缀 /api/v1）
  // 真机预览/调试：填电脑的局域网 IP（手机需与电脑同一 WiFi）
  // 本地开发者工具调试：可改回 http://localhost:3000/api/v1
  // 开发者工具中请勾选「不校验合法域名」，或在小程序后台配置 request 合法域名
  baseUrl: 'http://10.30.49.155:3000/api/v1',

  // 离线运行开关：false = 走真实后端；true = 使用内置模拟数据（后端未启动时临时预览用）
  useMock: false,

  timeout: 10000
};

module.exports = config;
