// pages/user/user.js
const app = getApp();

Page({
  data: {
    isDark: false,

    favorites: []
  },

  onShow() {
    try { const app = getApp(); this.setData({ isDark: app.globalData.theme === 'dark' }); } catch (e) {}
    this.setData({
      favorites: app.getFavorites()
    });
  },

  goDetail(e) {
    wx.navigateTo({ url: '/pages/cocktail-detail/cocktail-detail?id=' + e.currentTarget.dataset.id });
  },

  copyBeian() {
    wx.setClipboardData({
      data: '粤公网安备44130202001841号',
      success: () => wx.showToast({ title: '备案号已复制', icon: 'none' })
    });
  }
});
