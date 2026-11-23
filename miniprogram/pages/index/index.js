// pages/index/index.js
const cocktailApi = require('../../api/cocktail');
const categoryApi = require('../../api/category');
const format = require('../../utils/format');
const convenience = require('../../utils/convenience');
const imageCache = require('../../utils/imageCache');
const { icons } = require('../../utils/icons');
const app = getApp();

Page({
  data: {
    isDark: false,

    icons: icons,
    list: [],
    page: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    finished: false,
    baseSpirit: '',
    spirits: [],
    viewMode: 'grid',
    heroImage: '',
    // 便利店模式
    mode: 'pro',
    convScenes: convenience.SCENES,
    convScene: 'all',
    convDrinks: convenience.DRINKS
  },

  onLoad() {
    this.loadCategories();
    this.loadList(true);
    this.loadHeroImage();
  },

  loadHeroImage() {
    const page = this;
    const host = 'https://myty11.com/uploads/1793787710854-457430532.png';
    const src = imageCache.resolve(host, {
      onReady(local) { page.setData({ heroImage: local }); }
    });
    this.setData({ heroImage: src });
  },

  onShow() {
    try { const app = getApp(); this.setData({ isDark: app.globalData.theme === 'dark' }); } catch (e) {}
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ isDark: (getApp().globalData.theme === "dark"), selected: 0 });
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
    const page = this;
    // 无封面图的酒：按 id 循环分配一张实拍图兜底，保证卡片视觉统一
    const FALLBACK = [
      'https://myty11.com/uploads/1793787710854-457430532.png',
      'https://myty11.com/uploads/1793796778405-679592327.png',
      'https://myty11.com/uploads/1793796787995-498359043.png',
      'https://myty11.com/uploads/1793796795373-304837180.png',
      'https://myty11.com/uploads/1793796806024-690644324.png'
    ];
    return list.map((c, i) => {
      const item = {
        ...c,
        _gradient: format.getSpiritGradient(c.baseSpirit),
        _icon: format.getSpiritIcon(c.baseSpirit),
        _imgLoaded: false,
        _isFav: app.isFavorite(c.id),
        _taste: format.parseTasteTags(c.tasteTags).slice(0, 3),
        _diff: format.getDifficulty(c.difficulty)
      };
      if (!item.image && item.id) {
        item.image = FALLBACK[Number(item.id) % FALLBACK.length];
      }
      if (item.image) {
        const url = item.image;
        // 命中缓存返回本地路径；未命中后台下载，完成后回调刷新当前项
        item.image = imageCache.resolve(url, {
          onReady(localPath) {
            const idx = page.data.list.findIndex(x => x.id === item.id);
            if (idx >= 0) {
              page.setData({
                [`list[${idx}].image`]: localPath,
                [`list[${idx}]._imgLoaded`]: true
              });
            }
          }
        });
        // 来自本地缓存的图片无需再等 onload
        if (item.image !== url) item._imgLoaded = true;
      }
      return item;
    });
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
  },

  // ===== 便利店模式 =====
  switchMode(e) {
    const mode = e.currentTarget.dataset.mode;
    if (mode === this.data.mode) return;
    this.setData({ mode });
  },

  selectConvScene(e) {
    const key = e.currentTarget.dataset.key;
    if (key === this.data.convScene) return;
    this.setData({
      convScene: key,
      convDrinks: convenience.getDrinksByScene(key)
    });
  },

  goConvenienceMatch() {
    wx.navigateTo({ url: '/pages/convenience-match/convenience-match' });
  },

  goPitfalls() {
    wx.navigateTo({ url: '/pages/convenience-pitfalls/convenience-pitfalls' });
  }
});
