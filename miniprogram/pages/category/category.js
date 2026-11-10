// pages/category/category.js
const cocktailApi = require('../../api/cocktail');
const categoryApi = require('../../api/category');
const format = require('../../utils/format');

Page({
  data: {
    spirits: [],
    tastes: [],
    difficulties: [
      { v: 1, label: '简单' },
      { v: 2, label: '中等' },
      { v: 3, label: '困难' }
    ],
    sel: { spirit: '', difficulty: '', taste: '' },
    all: [],
    list: [],
    loading: true
  },

  onLoad() {
    this.init();
  },

  async init() {
    try {
      const [spirits, tastes, res] = await Promise.all([
        categoryApi.getList({ type: 'base_spirit' }),
        categoryApi.getList({ type: 'taste' }),
        cocktailApi.getList({ pageSize: 100 })
      ]);
      this.setData({ spirits, tastes, all: res.list, loading: false });
      this.applyFilter();
    } catch (e) {
      this.setData({ loading: false });
    }
  },

  applyFilter() {
    const { spirit, difficulty, taste } = this.data.sel;
    let list = this.data.all;
    if (spirit) list = list.filter(c => c.baseSpirit === spirit);
    if (difficulty) list = list.filter(c => String(c.difficulty) === String(difficulty));
    if (taste) list = list.filter(c => format.parseTasteTags(c.tasteTags).includes(taste));
    this.setData({ list });
  },

  selectSpirit(e) {
    const name = e.currentTarget.dataset.name;
    this.setData({ 'sel.spirit': name === this.data.sel.spirit ? '' : name });
    this.applyFilter();
  },
  selectTaste(e) {
    const name = e.currentTarget.dataset.name;
    this.setData({ 'sel.taste': name === this.data.sel.taste ? '' : name });
    this.applyFilter();
  },
  selectDiff(e) {
    const v = e.currentTarget.dataset.v;
    this.setData({ 'sel.difficulty': v === this.data.sel.difficulty ? '' : v });
    this.applyFilter();
  },
  reset() {
    this.setData({ sel: { spirit: '', difficulty: '', taste: '' } });
    this.applyFilter();
  }
});
