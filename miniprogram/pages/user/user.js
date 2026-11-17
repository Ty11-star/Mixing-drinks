// pages/user/user.js
const app = getApp();
const authApi = require('../../api/auth');
const favoriteApi = require('../../api/favorite');
const storage = require('../../utils/storage');
const myRecipes = require('../../utils/myRecipes');

Page({
  data: {
    userInfo: null,
    token: '',
    avatarUrl: '',
    nickname: '',
    favorites: [],
    history: [],
    myRecipeCount: 0
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 4 });
    }
    const userInfo = storage.get('userInfo', null);
    const token = storage.get('token', '');
    this.setData({
      userInfo,
      token,
      avatarUrl: userInfo ? userInfo.avatar : '',
      nickname: userInfo ? userInfo.nickname : '',
      history: app.getHistory(),
      myRecipeCount: myRecipes.list().length,
      favorites: []
    });
    if (token) {
      this.loadFavorites();
    }
  },

  async loadFavorites() {
    try {
      const list = await favoriteApi.list();
      this.setData({ favorites: list || [] });
    } catch (e) {
      this.setData({ favorites: [] });
    }
  },

  onChooseAvatar(e) {
    const avatarUrl = e.detail.avatarUrl;
    this.setData({ avatarUrl });
    this.saveProfile();
  },

  onNicknameInput(e) {
    this.setData({ nickname: e.detail.value });
  },

  saveProfile() {
    const userInfo = Object.assign({}, this.data.userInfo || {}, {
      avatar: this.data.avatarUrl,
      nickname: this.data.nickname
    });
    storage.set('userInfo', userInfo);
    this.setData({ userInfo });
    // 已登录时同步到后端
    if (this.data.token) {
      authApi.updateProfile({ nickname: userInfo.nickname, avatar: userInfo.avatar }).catch(() => {});
    }
  },

  onNicknameBlur() {
    this.saveProfile();
  },

  async doLogin() {
    try {
      const loginRes = await wx.login();
      if (!loginRes.code) {
        wx.showToast({ title: '登录失败', icon: 'none' });
        return;
      }
      wx.showLoading({ title: '登录中' });
      const res = await authApi.wechatLogin(loginRes.code);
      storage.set('token', res.token);
      storage.set('userInfo', res.userInfo);
      const app = getApp();
      app.globalData.token = res.token;
      app.globalData.userInfo = res.userInfo;
      this.setData({
        token: res.token,
        userInfo: res.userInfo,
        avatarUrl: res.userInfo.avatar,
        nickname: res.userInfo.nickname
      });
      wx.hideLoading();
      wx.showToast({ title: '登录成功', icon: 'success' });
      this.loadFavorites();
    } catch (e) {
      wx.hideLoading();
      // request.js 已 toast 过具体原因，这里仅在无信息时兜底提示
      if (!e || !e.message) {
        wx.showToast({ title: '登录失败', icon: 'none' });
      }
    }
  },

  openPrivacyContract() {
    if (!wx.openPrivacyContract) {
      wx.showToast({ title: '当前微信版本不支持', icon: 'none' });
      return;
    }
    wx.openPrivacyContract({
      fail: () => wx.showToast({ title: '打开失败，请稍后重试', icon: 'none' })
    });
  },

  goMyRecipes() {
    wx.navigateTo({ url: '/pages/my-recipes/my-recipes' });
  },

  goDetail(e) {
    wx.navigateTo({ url: '/pages/cocktail-detail/cocktail-detail?id=' + e.currentTarget.dataset.id });
  },

  clearHistory() {
    storage.set('browse_history', []);
    this.setData({ history: [] });
  }
});
