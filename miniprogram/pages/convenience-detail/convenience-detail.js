// pages/convenience-detail/convenience-detail.js
const convenience = require('../../utils/convenience');
const { icons } = require('../../utils/icons');
const app = getApp();

Page({
  onShow() {
    try {
      const app = getApp();
      this.setData({ isDark: app.globalData.theme === 'dark' });
    } catch (e) {}
  },

  data: {
    icons: icons,
    isDark: false,

    drink: null,
    materials: [],
    isFav: false
  },

  onLoad(options) {
    const id = Number(options.id);
    const drink = convenience.DRINKS.find(d => d.id === id);
    if (!drink) {
      wx.showToast({ title: '找不到这杯酒', icon: 'none' });
      return;
    }
    this.setData({
      drink,
      materials: convenience.getMaterialsByNames(drink.materials),
      isFav: app.isFavorite(id)
    });
  },

  toggleFav() {
    const d = this.data.drink;
    if (!d) return;
    const added = app.toggleFavorite({
      id: d.id, name: d.name, nameEn: d.nameEn,
      image: '', tasteTags: d.tag, baseSpirit: '便利店'
    });
    this.setData({ isFav: added });
    wx.showToast({ title: added ? '已收藏' : '已取消收藏', icon: 'none' });
  }
});
