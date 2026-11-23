// custom-tab-bar/index.js
const { icons } = require('../utils/icons');

Component({
  data: {
    selected: 0,
    isDark: false,
    icons: icons,
    list: [
      { pagePath: '/pages/index/index', text: '首页', icon: 'home' },
      { pagePath: '/pages/shake/shake', text: '调一杯', icon: 'shaker' },
      { pagePath: '/pages/lottery/lottery', text: '抽卡', icon: 'card' },
      { pagePath: '/pages/knowledge/knowledge', text: '知识', icon: 'book' }
    ]
  },

  lifetimes: {
    attached() {
      try {
        const app = getApp();
        this.setData({ isDark: app.globalData.theme === 'dark', icons: icons });
      } catch (e) {}
      if (wx.onThemeChange) {
        this._onTheme = (res) => this.setData({
          isDark: res.theme === 'dark',
          icons: icons
        });
        wx.onThemeChange(this._onTheme);
      }
    },
    detached() {
      if (wx.offThemeChange && this._onTheme) {
        wx.offThemeChange(this._onTheme);
      }
    }
  },

  methods: {
    switchTab(e) {
      const index = e.currentTarget.dataset.index;
      const path = this.data.list[index].pagePath;
      wx.switchTab({ url: path });
      this.setData({ selected: index });
    }
  }
});
