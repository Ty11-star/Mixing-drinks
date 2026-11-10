// pages/match-result/match-result.js
const cocktailApi = require('../../api/cocktail');
const format = require('../../utils/format');
const storage = require('../../utils/storage');

function tierOf(rate) {
  if (rate >= 100) return 'perfect';
  if (rate >= 80) return 'high';
  if (rate >= 60) return 'mid';
  return 'low';
}

const TIER_LABEL = {
  perfect: '完美匹配',
  high: '高度匹配',
  mid: '可以一试',
  low: '勉强可调'
};

Page({
  data: {
    loading: true,
    results: [],
    total: 0
  },

  onLoad() {
    const ids = storage.get('match_ids', []);
    if (!ids.length) {
      this.setData({ loading: false });
      return;
    }
    this.load(ids);
  },

  async load(ids) {
    try {
      const raw = await cocktailApi.match(ids);
      const results = raw.map(r => ({
        ...r,
        _tier: tierOf(r.matchRate),
        _tierLabel: TIER_LABEL[tierOf(r.matchRate)],
        _gradient: format.getSpiritGradient(r.cocktail.baseSpirit),
        _taste: format.parseTasteTags(r.cocktail.tasteTags).slice(0, 3),
        _diff: format.getDifficulty(r.cocktail.difficulty)
      }));
      this.setData({ results, total: results.length, loading: false });
    } catch (e) {
      this.setData({ loading: false });
    }
  },

  goDetail(e) {
    wx.navigateTo({ url: '/pages/cocktail-detail/cocktail-detail?id=' + e.currentTarget.dataset.id });
  },

  goSelect() {
    wx.switchTab({ url: '/pages/shake/shake' });
  }
});
