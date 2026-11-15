// utils/config.js
// 全局配置：API 地址与运行模式
const config = {
  // 生产地址：域名 myty11.com 已解析到服务器 8.134.248.177
  // 小程序要求 HTTPS + 已备案域名。正式发布前置：先按指南步骤 18 签发证书，
  //   再在微信公众平台配置 request 合法域名 https://myty11.com，最后用开发者工具上传发布
  // 过渡期（证书或合法域名尚未就绪）开发者工具会报 request:fail url not in domain list：
  //   此时保持两个 project config 的 urlCheck: false；若 https 域名连不上，
  //   可临时把 baseUrl 改成 'http://8.134.248.177/api/v1' 验证真实数据（公网 IP 的 /api/v1 仍开放）。
  //   上传发布前必须恢复下面的 HTTPS 域名，并把两处 urlCheck 改回 true。
  // 本地后端调试：http://localhost:3000/api/v1
  baseUrl: 'https://myty11.com/api/v1',

  // 离线运行开关：false = 走真实后端；true = 使用内置模拟数据（后端未启动时临时预览用）
  useMock: false,

  timeout: 10000
};

module.exports = config;
