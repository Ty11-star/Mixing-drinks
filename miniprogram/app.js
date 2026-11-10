// app.js
const storage = require('./utils/storage');

App({
  globalData: {
    // 标记是否已登录（微信登录获取 openid + token）
    token: '',
    userInfo: null,
    // 浏览历史（本地缓存，最多 20 条）
    historyKey: 'browse_history',
    searchHistoryKey: 'search_history',
    favoriteKey: 'favorite_list'
  },

  onLaunch() {
    // 读取本地登录态
    this.globalData.token = storage.get('token') || '';
    this.globalData.userInfo = storage.get('userInfo') || null;
  },

  /**
   * 写入浏览历史（去重，最新在前，最多 20 条）
   */
  addHistory(cocktail) {
    if (!cocktail || !cocktail.id) return;
    const key = this.globalData.historyKey;
    const list = storage.get(key, []);
    const next = [cocktail, ...list.filter(i => i.id !== cocktail.id)].slice(0, 20);
    storage.set(key, next);
  },

  /**
   * 读取浏览历史
   */
  getHistory() {
    return storage.get(this.globalData.historyKey, []);
  },

  /**
   * 切换收藏状态
   */
  toggleFavorite(cocktail) {
    const key = this.globalData.favoriteKey;
    const list = storage.get(key, []);
    const idx = list.findIndex(i => i.id === cocktail.id);
    if (idx >= 0) {
      list.splice(idx, 1);
      storage.set(key, list);
      return false;
    }
    list.unshift(cocktail);
    storage.set(key, list);
    return true;
  },

  isFavorite(id) {
    const list = storage.get(this.globalData.favoriteKey, []);
    return list.some(i => i.id === id);
  },

  getFavorites() {
    return storage.get(this.globalData.favoriteKey, []);
  }
});
