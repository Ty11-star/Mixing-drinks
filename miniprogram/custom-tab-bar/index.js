// custom-tab-bar/index.js
Component({
  data: {
    selected: 0,
    list: [
      { pagePath: '/pages/index/index', text: '首页', icon: '🍸' },
      { pagePath: '/pages/shake/shake', text: '调一杯', icon: '🥃' },
      { pagePath: '/pages/lottery/lottery', text: '抽卡', icon: '🎲' },
      { pagePath: '/pages/knowledge/knowledge', text: '知识', icon: '📖' },
      { pagePath: '/pages/user/user', text: '我的', icon: '👤' }
    ]
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
