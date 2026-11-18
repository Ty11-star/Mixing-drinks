// pages/index/index.js
const cocktailApi = require('../../api/cocktail');
const categoryApi = require('../../api/category');
const format = require('../../utils/format');
const app = getApp();

Page({
  data: {
    list: [],
    page: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    finished: false,
    baseSpirit: '',
    spirits: [],
    viewMode: 'grid'
  },

  onLoad() {
    this.loadCategories();
    this.loadList(true);
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }
    // 从详情页返回后，同步列表的收藏状态
    if (this.data.list.length) {
      this.setData({
        list: this.data.list.map(i => Object.assign({}, i, { _isFav: app.isFavorite(i.id) }))
      });
    }
  },

  async loadCategories() {
    try {
      const cats = await categoryApi.getList({ type: 'base_spirit' });
      const spirits = [{ name: '', label: '全部' }].concat(
        cats.map(c => ({ name: c.name, label: c.name, count: c.cocktailCount }))
      );
      this.setData({ spirits });
    } catch (e) {
      // ignore
    }
  },

  enrich(list) {
    return list.map(c => ({
      ...c,
      _gradient: format.getSpiritGradient(c.baseSpirit),
      _icon: format.getSpiritIcon(c.baseSpirit),
      _imgLoaded: false,
      _isFav: app.isFavorite(c.id),
      _taste: format.parseTasteTags(c.tasteTags).slice(0, 3),
      _diff: format.getDifficulty(c.difficulty)
    }));
  },

  onListImageLoad(e) {
    const id = e.currentTarget.dataset.id;
    const idx = this.data.list.findIndex(i => i.id === id);
    if (idx >= 0) {
      this.setData({ [`list[${idx}]._imgLoaded`]: true });
    }
  },

  toggleFav(e) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.list.find(i => i.id === id);
    if (!item) return;
    const added = app.toggleFavorite(item);
    this.setData({ [`list[${this.data.list.indexOf(item)}]._isFav`]: added });
    wx.showToast({ title: added ? '已收藏' : '已取消收藏', icon: 'none' });
  },

  async loadList(reset) {
    if (this.data.loading) return;
    if (reset) this.setData({ page: 1, list: [], finished: false });
    if (this.data.finished && !reset) return;

    this.setData({ loading: true });
    try {
      const res = await cocktailApi.getList({
        page: this.data.page,
        pageSize: this.data.pageSize,
        baseSpirit: this.data.baseSpirit
      });
      const items = this.enrich(res.list);
      const list = reset ? items : this.data.list.concat(items);
      this.setData({
        list,
        total: res.total,
        page: res.page + 1,
        finished: list.length >= res.total || res.list.length === 0,
        loading: false
      });
    } catch (e) {
      this.setData({ loading: false });
    }
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
    if (!this.data.finished && !this.data.loading) this.loadList(false);
  },

  onPullDownRefresh() {
    this.loadList(true);
  },

  selectSpirit(e) {
    const name = e.currentTarget.dataset.name;
    if (name === this.data.baseSpirit) return;
    this.setData({ baseSpirit: name });
    this.loadList(true);
  },

  toggleView() {
    this.setData({ viewMode: this.data.viewMode === 'grid' ? 'list' : 'grid' });
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/cocktail-detail/cocktail-detail?id=' + id });
  },

  goSearch() {
    wx.navigateTo({ url: '/pages/search/search' });
  },

  goMine() {
    wx.navigateTo({ url: '/pages/user/user' });
  },

  goIngredient() {
    wx.switchTab({ url: '/pages/shake/shake' });
  }
});
