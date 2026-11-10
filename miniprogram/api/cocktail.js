// api/cocktail.js
const request = require('../utils/request');
const adapt = require('../utils/adapt');

module.exports = {
  // 酒谱列表（分页 + 筛选）
  getList: (params) => request({ url: '/cocktails', method: 'GET', data: params }).then(adapt.normalizePage),
  // 酒谱详情
  getDetail: (id) => request({ url: '/cocktails/' + id, method: 'GET' }).then(adapt.normalizeCocktail),
  // 搜索
  search: (params) => request({ url: '/cocktails/search', method: 'GET', data: params }).then(adapt.normalizePage),
  // 材料匹配
  match: (ingredientIds) => request({ url: '/cocktails/match', method: 'POST', data: { ingredientIds } }).then(adapt.normalizeMatch)
};
