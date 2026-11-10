// api/category.js
const request = require('../utils/request');

module.exports = {
  getList: (params) => request({ url: '/categories', method: 'GET', data: params })
};
