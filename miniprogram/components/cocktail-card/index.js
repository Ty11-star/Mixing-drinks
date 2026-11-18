// components/cocktail-card/index.js
const format = require('../../utils/format');
const app = getApp();

Component({
  properties: {
    cocktail: { type: Object, value: {} }
  },
  data: {
    gradient: '',
    icon: '🍸',
    image: '',
    imageLoaded: false,
    isFav: false,
    taste: [],
    diffMeta: {}
  },
  observers: {
    cocktail(c) {
      if (!c || !c.id) return;
      this.setData({
        gradient: format.getSpiritGradient(c.baseSpirit),
        icon: format.getSpiritIcon(c.baseSpirit),
        image: c.image || '',
        imageLoaded: false,
        isFav: app.isFavorite(c.id),
        taste: format.parseTasteTags(c.tasteTags).slice(0, 3),
        diffMeta: format.getDifficulty(c.difficulty)
      });
    }
  },
  methods: {
    onImageLoad() {
      this.setData({ imageLoaded: true });
    },
    toggleFav() {
      const c = this.data.cocktail;
      if (!c || !c.id) return;
      const added = app.toggleFavorite(c);
      this.setData({ isFav: added });
      wx.showToast({ title: added ? '已收藏' : '已取消收藏', icon: 'none' });
    },
    goDetail() {
      const id = this.data.cocktail.id;
      if (!id) return;
      wx.navigateTo({ url: '/pages/cocktail-detail/cocktail-detail?id=' + id });
    }
  }
});
