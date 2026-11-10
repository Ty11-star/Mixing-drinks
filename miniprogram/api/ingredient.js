// api/ingredient.js
const request = require('../utils/request');

module.exports = {
  getList: (params) => request({ url: '/ingredients', method: 'GET', data: params }),
  getByCategory: () => request({ url: '/ingredients/by-category', method: 'GET' })
};
