// pages/user/user.js
const app = getApp();
const convenience = require('../../utils/convenience');

Page({
  data: {
    isDark: false,

    favorites: []
  },

  onShow() {
    try { const app = getApp(); this.setData({ isDark: app.globalData.theme === 'dark' }); } catch (e) {}

    const render = () => {
      const drinks = convenience.getDrinks();
      const favorites = app.getFavorites().map(item => {
        const conv = drinks.find(d => d.id === item.id);
        const isConvenience = item.type === 'convenience'
          || item.baseSpirit === '便利店'
          || (!item.type && !!conv);
        if (!isConvenience) return item;

        return Object.assign({}, item, {
          type: 'convenience',
          image: item.image || (conv && conv.image) || '',
          name: item.name || (conv && conv.name) || '',
          nameEn: item.nameEn || (conv && conv.nameEn) || '',
          emoji: item.emoji || (conv && conv.emoji) || '🥤',
          gradient: item.gradient || (conv && conv.gradient) || '',
          gradientDark: item.gradientDark || (conv && conv.gradientDark) || '',
          tag: item.tag || (conv && conv.tag) || '',
          steps: item.steps || (conv && conv.steps) || 0,
          tasteTags: item.tasteTags || (conv && conv.tag) || '',
          baseSpirit: '便利店'
        });
      });

      // 修正旧版本收藏记录中丢失的图片和来源类型
      app.saveFavorites(favorites);
      this.setData({ favorites });
    };

    render();
    // 远端内容加载完成后再刷新一次，补上便利店配方封面
    convenience.loadRemote().then(render);
  },

  goDetail(e) {
    const { id, type } = e.currentTarget.dataset;
    if (!id) return;
    const path = type === 'convenience'
      ? '/pages/convenience-detail/convenience-detail?id='
      : '/pages/cocktail-detail/cocktail-detail?id=';
    wx.navigateTo({ url: path + id });
  },

  copyBeian() {
    wx.setClipboardData({
      data: '粤公网安备44130202001841号',
      success: () => wx.showToast({ title: '备案号已复制', icon: 'none' })
    });
  }
});
