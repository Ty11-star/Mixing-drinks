// api/ai.js
const request = require('../utils/request');

module.exports = {
  // AI 调酒推荐（传入材料名列表）；生成耗时较长，超时给 60s
  recommend: (ingredients) => request({ url: '/ai/recommend', method: 'POST', data: { ingredients }, timeout: 60000 }),

  // 每日抽卡：随机返回一款酒（酒谱库 / AI 二选一）
  daily: () => request({ url: '/ai/daily', method: 'GET', timeout: 60000 })
};
