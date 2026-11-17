const myRecipes = require('../../utils/myRecipes');
const format = require('../../utils/format');

function pad(n) {
  return n < 10 ? '0' + n : String(n);
}

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
    ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}

Page({
  data: {
    recipes: [],
    expandedId: ''
  },

  onShow() {
    this.load();
  },

  load() {
    const recipes = myRecipes.list().map(item => Object.assign({}, item, {
      timeText: formatTime(item.createdAt),
      diffMeta: format.getDifficulty(item.difficulty || 1)
    }));
    this.setData({ recipes });
  },

  toggle(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ expandedId: this.data.expandedId === id ? '' : id });
  },

  remove(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除配方',
      content: '确定删除这条本地配方吗？删除后无法恢复。',
      confirmText: '删除',
      confirmColor: '#B45B5B',
      success: (res) => {
        if (res.confirm) {
          myRecipes.remove(id);
          this.load();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  }
});
