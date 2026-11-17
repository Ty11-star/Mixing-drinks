const request = require('../utils/request');

module.exports = {
  // 获取我的收藏列表
  list: () => request({ url: '/favorites', method: 'GET' }),

  // 添加收藏
  add: (cocktailId) => request({ url: '/favorites', method: 'POST', data: { cocktailId } }),

  // 取消收藏
  remove: (cocktailId) => request({ url: `/favorites/${cocktailId}`, method: 'DELETE' }),

  // 批量检查是否已收藏
  check: (cocktailIds) => request({ url: '/favorites/check', method: 'POST', data: { cocktailIds } })
};
