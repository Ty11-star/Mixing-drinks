const { icons } = require('../../utils/icons');
const app = getApp();

Component({
  properties: {
    drink: { type: Object, value: {} }
  },
  data: {
    icons: icons,
    isFav: false,
    imageLoaded: false,
    isDark: false
  },
  lifetimes: {
    attached() {
      try { this.setData({ isDark: app.globalData.theme === 'dark' }); } catch (e) {}
      if (wx.onThemeChange) {
        this._onTheme = (res) => this.setData({ isDark: res.theme === 'dark' });
        wx.onThemeChange(this._onTheme);
      }
    },
    detached() {
      if (wx.offThemeChange && this._onTheme) wx.offThemeChange(this._onTheme);
    }
  },
  observers: {
    drink(d) {
      if (!d || !d.id) return;
      this.setData({ isFav: app.isFavorite(d.id), imageLoaded: false });
    }
  },
  methods: {
    onImageLoad() { this.setData({ imageLoaded: true }); },
    onImageError() { this.setData({ imageLoaded: false }); },
    toggleFav() {
      const d = this.data.drink;
      if (!d || !d.id) return;
      const added = app.toggleFavorite({
        id: d.id, name: d.name, nameEn: d.nameEn,
        image: '', tasteTags: d.tag, baseSpirit: '便利店'
      });
      this.setData({ isFav: added });
      wx.showToast({ title: added ? '已收藏' : '已取消收藏', icon: 'none' });
    },
    goDetail() {
      wx.navigateTo({ url: '/pages/convenience-detail/convenience-detail?id=' + this.data.drink.id });
    }
  }
});
