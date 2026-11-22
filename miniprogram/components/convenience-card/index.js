const app = getApp();

Component({
  properties: {
    drink: { type: Object, value: {} }
  },
  data: {
    isFav: false
  },
  observers: {
    drink(d) {
      if (!d || !d.id) return;
      this.setData({ isFav: app.isFavorite(d.id) });
    }
  },
  methods: {
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
