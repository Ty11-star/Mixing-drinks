// components/cocktail-card/index.js
const format = require('../../utils/format');

Component({
  properties: {
    cocktail: { type: Object, value: {} }
  },
  data: {
    gradient: '',
    icon: '🍸',
    image: '',
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
        taste: format.parseTasteTags(c.tasteTags).slice(0, 3),
        diffMeta: format.getDifficulty(c.difficulty)
      });
    }
  },
  methods: {
    goDetail() {
      const id = this.data.cocktail.id;
      if (!id) return;
      wx.navigateTo({ url: '/pages/cocktail-detail/cocktail-detail?id=' + id });
    }
  }
});
