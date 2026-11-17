// pages/cocktail-detail/cocktail-detail.js
const cocktailApi = require('../../api/cocktail');
const favoriteApi = require('../../api/favorite');
const format = require('../../utils/format');
const storage = require('../../utils/storage');
const app = getApp();

function parseAmountVal(amount) {
  if (!amount) return 0.3;
  const s = String(amount);
  if (s.includes('适量')) return 0.35;
  if (s.includes('少许')) return 0.2;
  if (s.includes('滴')) return 0.12;
  if (s.includes('片') || s.includes('颗') || s.includes('根') || s.includes('勺') || s.includes('杯')) return 0.28;
  const m = s.match(/(\d+(\.\d+)?)/);
  return m ? parseFloat(m[1]) : 0.3;
}

Page({
  data: {
    id: null,
    detail: null,
    loading: true,
    gradient: '',
    icon: '🍸',
    image: '',
    taste: [],
    diff: {},
    methodLabel: '',
    ingredients: [],
    isFav: false,
    scrollTop: 0,
    favRipple: false
  },

  onLoad(options) {
    const id = Number(options.id);
    this.setData({ id });
    this.loadDetail(id);
  },

  async loadDetail(id) {
    try {
      const detail = await cocktailApi.getDetail(id);
      const maxVal = Math.max(1, ...detail.ingredients.map(i => parseAmountVal(i.amount)));
      const ingredients = detail.ingredients.map(i => ({
        ...i,
        _ratio: Math.max(0.06, parseAmountVal(i.amount) / maxVal),
        _optional: i.isOptional === 1 || i.isOptional === '1'
      }));
      const summary = {
        id: detail.id, name: detail.name, nameEn: detail.nameEn,
        baseSpirit: detail.baseSpirit, difficulty: detail.difficulty, tasteTags: detail.tasteTags
      };
      app.addHistory(summary);
      this.setData({
        detail,
        loading: false,
        gradient: format.getSpiritGradient(detail.baseSpirit),
        icon: format.getSpiritIcon(detail.baseSpirit),
        image: detail.image || '',
        taste: format.parseTasteTags(detail.tasteTags),
        diff: format.getDifficulty(detail.difficulty),
        methodLabel: format.getMethodLabel(detail.method),
        ingredients
      });
      if (storage.get('token')) {
        this.checkFavoriteStatus();
      }
    } catch (e) {
      this.setData({ loading: false });
    }
  },

  async checkFavoriteStatus() {
    try {
      const map = await favoriteApi.check([this.data.id]);
      this.setData({ isFav: !!map[this.data.id] });
    } catch (e) {
      this.setData({ isFav: false });
    }
  },

  onPageScroll(e) {
    const t = e.scrollTop;
    if (Math.abs(t - this.data.scrollTop) > 4) {
      this.setData({ scrollTop: t });
    }
  },

  async toggleFav() {
    if (!this.data.detail) return;
    if (!storage.get('token')) {
      wx.showModal({
        title: '需要登录',
        content: '登录后可收藏喜欢的酒谱',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) wx.switchTab({ url: '/pages/user/user' });
        }
      });
      return;
    }
    const isFav = this.data.isFav;
    const id = this.data.detail.id;
    try {
      if (isFav) {
        await favoriteApi.remove(id);
        this.setData({ isFav: false, favRipple: true });
        wx.showToast({ title: '已取消收藏', icon: 'none' });
      } else {
        await favoriteApi.add(id);
        this.setData({ isFav: true, favRipple: true });
        wx.showToast({ title: '已收藏', icon: 'none' });
      }
      setTimeout(() => this.setData({ favRipple: false }), 600);
    } catch (e) {
      wx.showToast({ title: '操作失败', icon: 'none' });
    }
  },

  onShareAppMessage() {
    const d = this.data.detail;
    return {
      title: d ? `${d.name} ${d.nameEn || ''} · 调一杯` : '调一杯',
      path: `/pages/cocktail-detail/cocktail-detail?id=${this.data.id}`
    };
  }
});
