// components/cocktail-card/index.js
const format = require('../../utils/format');
const { icons } = require('../../utils/icons');
const app = getApp();

Component({
  properties: {
    cocktail: { type: Object, value: {} }
  },
  data: {
    icons: icons,
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
      const prev = this.data;
      const nextImage = c.image || '';
      const isLocal = nextImage && !/^https?:\/\//.test(nextImage);
      // 本地缓存图直接视为已加载；网络地址变化才重置，避免闪烁
      this.setData({
        gradient: format.getSpiritGradient(c.baseSpirit),
        icon: format.getSpiritIcon(c.baseSpirit),
        image: nextImage,
        imageLoaded: isLocal || (prev.image === nextImage ? prev.imageLoaded : false),
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
