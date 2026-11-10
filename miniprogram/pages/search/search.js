// pages/search/search.js
const cocktailApi = require('../../api/cocktail');
const storage = require('../../utils/storage');

const HOT = ['莫吉托', '金汤力', '玛格丽特', '长岛冰茶', '威士忌酸', '龙舌兰日出', '内格罗尼', '蓝色夏威夷'];

Page({
  data: {
    keyword: '',
    history: [],
    hot: HOT,
    list: [],
    page: 1,
    pageSize: 20,
    total: 0,
    finished: false,
    loading: false,
    searched: false
  },

  onShow() {
    this.setData({ history: storage.get('search_history', []) });
  },

  onInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  clearInput() {
    this.setData({ keyword: '' });
  },

  doSearch(e) {
    let kw;
    if (e && e.currentTarget && e.currentTarget.dataset) {
      kw = e.currentTarget.dataset.kw;
    }
    kw = (kw || this.data.keyword || '').trim();
    if (!kw) return;
    this.setData({ keyword: kw, searched: true, page: 1, list: [], finished: false });
    this.saveHistory(kw);
    this.loadList(true);
  },

  saveHistory(kw) {
    let h = storage.get('search_history', []);
    h = [kw, ...h.filter(x => x !== kw)].slice(0, 10);
    storage.set('search_history', h);
    this.setData({ history: h });
  },

  async loadList(reset) {
    if (this.data.loading) return;
    if (this.data.finished && !reset) return;
    this.setData({ loading: true });
    try {
      const res = await cocktailApi.search({
        keyword: this.data.keyword,
        page: this.data.page,
        pageSize: this.data.pageSize
      });
      const list = reset ? res.list : this.data.list.concat(res.list);
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
  },

  onReachBottom() {
    if (!this.data.finished && !this.data.loading) this.loadList(false);
  },

  clearHistory() {
    storage.set('search_history', []);
    this.setData({ history: [] });
  }
});
