// pages/user/user.js
const app = getApp();
const myRecipes = require('../../utils/myRecipes');

Page({
  data: {
    favorites: [],
    myRecipeCount: 0
  },

  onShow() {
    this.setData({
      favorites: app.getFavorites(),
      myRecipeCount: myRecipes.list().length
    });
  },

  goMyRecipes() {
    wx.navigateTo({ url: '/pages/my-recipes/my-recipes' });
  },

  goDetail(e) {
    wx.navigateTo({ url: '/pages/cocktail-detail/cocktail-detail?id=' + e.currentTarget.dataset.id });
  }
});
