// pages/convenience-pitfalls/convenience-pitfalls.js
const convenience = require('../../utils/convenience');

Page({
  onShow() {
    try {
      const app = getApp();
      this.setData({ isDark: app.globalData.theme === 'dark' });
    } catch (e) {}
  },

  data: {
    isDark: false,

    pitfalls: convenience.PITFALLS
  }
});
