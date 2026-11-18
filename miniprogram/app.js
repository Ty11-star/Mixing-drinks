// app.js
const storage = require('./utils/storage');

App({
  globalData: {
    searchHistoryKey: 'search_history',
    favoriteKey: 'favorite_list'
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
