// pages/shake/shake.js
const ingredientApi = require('../../api/ingredient');
const format = require('../../utils/format');
const storage = require('../../utils/storage');

const ORDER = ['base_spirit', 'liqueur', 'juice', 'syrup', 'garnish', 'other'];

// 每种材料按分类给一个酒液颜色，倒入后做分层渐变
const PALETTE = {
  base_spirit: ['#E6B566', '#D9A441', '#C68A2E', '#EAD08A', '#B97E2E'],
  liqueur:     ['#C77DA8', '#9B6FB0', '#E08FB0', '#B56A8E', '#7E5AA2'],
  juice:       ['#F2A65A', '#E8C45A', '#7FB06A', '#E58A5A', '#F0D24A'],
  syrup:       ['#D9A441', '#E0B45A', '#C98A2E', '#EAC56A'],
  garnish:     ['#7FB06A', '#5E9A52', '#8FC07A', '#6FA85C'],
  other:       ['#BFD8E0', '#C9D6C0', '#D8CFE0', '#CFE0E8']
};

function colorFor(cat, id) {
  const arr = PALETTE[cat] || PALETTE.other;
  return arr[Number(id) % arr.length];
}

function buildLiquid(selected) {
  if (!selected.length) return { fill: 0, gradient: 'transparent' };
  const fill = Math.min(92, 16 + selected.length * 16);
  if (selected.length === 1) return { fill, gradient: selected[0].color };
  const n = selected.length;
  const stops = selected.map((s, i) => {
    const pct = Math.round((i / (n - 1)) * 100);
    return `${s.color} ${pct}%`;
  });
  return { fill, gradient: `linear-gradient(to top, ${stops.join(', ')})` };
}

Page({
  data: {
    groups: [],
    selected: [],          // [{id, name, category, color}]
    selectedIds: {},
    fill: 0,
    gradient: 'transparent',
    pourTag: '',
    pourColor: '#D4A574',
    pouring: false,
    shaking: false,
    bubbles: []
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 });
    }
  },

  onLoad() {
    const bubbles = [];
    for (let i = 0; i < 9; i++) {
      bubbles.push({
        l: 10 + (i * 11) % 78,
        d: (i * 0.37) % 3,
        s: 8 + (i % 4) * 3
      });
    }
    this.setData({ bubbles });
    this.load();
  },

  async load() {
    try {
      const grouped = await ingredientApi.getByCategory();
      const groups = ORDER.filter(c => grouped[c]).map(c => ({
        key: c,
        label: format.getIngredientCategoryLabel(c),
        items: grouped[c]
      }));
      const ingMap = {};
      groups.forEach(g => g.items.forEach(i => { ingMap[i.id] = i; }));
      this.ingMap = ingMap;
      this.setData({ groups });
    } catch (e) { /* ignore */ }
  },

  toggle(e) {
    const id = Number(e.currentTarget.dataset.id);
    const map = Object.assign({}, this.data.selectedIds);
    let selected = this.data.selected.slice();
    if (map[id]) {
      delete map[id];
      selected = selected.filter(s => s.id !== id);
    } else {
      const ing = this.ingMap[id];
      if (!ing) return;
      selected.push({ id: ing.id, name: ing.name, category: ing.category, color: colorFor(ing.category, ing.id) });
      map[id] = true;
      this.setData({ pouring: true, pourTag: ing.name, pourColor: colorFor(ing.category, ing.id) });
      clearTimeout(this._pourT);
      this._pourT = setTimeout(() => this.setData({ pouring: false }), 650);
    }
    const liquid = buildLiquid(selected);
    this.setData({ selectedIds: map, selected, fill: liquid.fill, gradient: liquid.gradient });
  },

  remove(e) {
    const id = Number(e.currentTarget.dataset.id);
    const map = Object.assign({}, this.data.selectedIds);
    delete map[id];
    const selected = this.data.selected.filter(s => s.id !== id);
    const liquid = buildLiquid(selected);
    this.setData({ selectedIds: map, selected, fill: liquid.fill, gradient: liquid.gradient });
  },

  clearAll() {
    this.setData({ selectedIds: {}, selected: [], fill: 0, gradient: 'transparent' });
  },

  // 规则匹配：把所选材料交给「找找能调什么」（复用 match-result）
  findMatch() {
    if (!this.data.selected.length) {
      wx.showToast({ title: '先往杯里加点料吧', icon: 'none' });
      return;
    }
    const ids = this.data.selected.map(s => s.id);
    storage.set('match_ids', ids);
    wx.navigateTo({ url: '/pages/match-result/match-result' });
  },

  shake() {
    if (!this.data.selected.length) {
      wx.showToast({ title: '先往杯里加点料吧', icon: 'none' });
      return;
    }
    if (this.data.shaking) return;
    this.setData({ shaking: true });
    const names = this.data.selected.map(s => s.name);
    storage.set('ai_ingredients', names);
    setTimeout(() => {
      this.setData({ shaking: false });
      wx.navigateTo({ url: '/pages/ai-recipe/ai-recipe' });
    }, 900);
  }
});
