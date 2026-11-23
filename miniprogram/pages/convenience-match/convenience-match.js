// pages/convenience-match/convenience-match.js
const convenience = require('../../utils/convenience');

Page({
  onShow() {
    try {
      const app = getApp();
      this.setData({ isDark: app.globalData.theme === 'dark' });
    } catch (e) {}
  },

  data: {
    isDark: false,

    groups: [],
    selected: [],
    results: []
  },

  onLoad() {
    // 按 category 分组
    const cats = [];
    convenience.MATERIALS.forEach(m => {
      let group = cats.find(g => g.category === m.category);
      if (!group) {
        group = { category: m.category, materials: [] };
        cats.push(group);
      }
      group.materials.push({ name: m.name, emoji: m.emoji, selected: false });
    });
    this.setData({ groups: cats });
  },

  toggleMaterial(e) {
    const name = e.currentTarget.dataset.name;
    const selected = this.data.selected.slice();
    const idx = selected.indexOf(name);
    if (idx >= 0) selected.splice(idx, 1);
    else selected.push(name);

    const groups = this.data.groups.map(g => ({
      category: g.category,
      materials: g.materials.map(m => Object.assign({}, m, { selected: selected.indexOf(m.name) >= 0 }))
    }));

    this.setData({
      selected,
      groups,
      results: convenience.matchByMaterials(selected).slice(0, 20)
    });
  },

  goDetail(e) {
    wx.navigateTo({ url: '/pages/convenience-detail/convenience-detail?id=' + e.currentTarget.dataset.id });
  }
});
