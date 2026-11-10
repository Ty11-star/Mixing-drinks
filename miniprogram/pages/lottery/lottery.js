// pages/lottery/lottery.js
const aiApi = require('../../api/ai');
const format = require('../../utils/format');
const storage = require('../../utils/storage');

function todayKey() {
  const d = new Date();
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}

Page({
  data: {
    today: '',
    drawn: false,
    drink: null,
    gradient: '',
    shaking: false,
    pouring: false,
    reveal: false,
    saveState: 'idle',
    savedId: null,
    bubbles: []
  },

  onLoad() {
    this.onAccel = this.onAccel.bind(this);
    const bubbles = [];
    for (let i = 0; i < 10; i++) {
      bubbles.push({
        l: 8 + (i * 9) % 84,
        s: 6 + (i % 4) * 3,
        d: (i * 0.4) % 3,
        dur: 2.2 + (i % 3) * 0.7
      });
    }
    this.setData({ bubbles });
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
    this.checkToday();
    this.startShake();
  },

  onHide() {
    this.stopShake();
  },

  onUnload() {
    this.stopShake();
  },

  // 开启加速度计并监听摇一摇
  startShake() {
    this.lastAcc = null;
    this.lastShakeTime = 0;
    try {
      wx.startAccelerometer({ interval: 'ui' });
      wx.onAccelerometerChange(this.onAccel);
    } catch (e) {
      // 部分基础库不支持时静默忽略，仍可手动点按钮抽卡
    }
  },

  // 关闭加速度计，避免页面隐藏后继续监听
  stopShake() {
    try {
      wx.offAccelerometerChange(this.onAccel);
      wx.stopAccelerometer();
    } catch (e) {}
  },

  // 加速度变化回调：三轴变化量超过阈值即判定为摇一摇，带去抖
  onAccel(res) {
    const now = Date.now();
    if (this.lastAcc) {
      const diff =
        Math.abs(res.x - this.lastAcc.x) +
        Math.abs(res.y - this.lastAcc.y) +
        Math.abs(res.z - this.lastAcc.z);
      if (diff > 1.4 && now - this.lastShakeTime > 1200) {
        this.lastShakeTime = now;
        this.draw();
      }
    }
    this.lastAcc = { x: res.x, y: res.y, z: res.z };
  },

  checkToday() {
    const key = todayKey();
    const cached = storage.get('daily_draw', null);
    if (cached && cached.date === key && cached.drink) {
      this.applyDrink(cached.drink, true);
    } else {
      this.setData({
        today: key, drawn: false, drink: null,
        gradient: '', reveal: false,
        saveState: 'idle', savedId: null
      });
    }
  },

  applyDrink(drink, revealed) {
    this.setData({
      today: todayKey(),
      drawn: true,
      drink,
      gradient: format.getSpiritGradient(drink.baseSpirit),
      reveal: revealed,
      saveState: drink.source === 'ai' ? (drink.savedId ? 'saved' : 'idle') : 'official',
      savedId: drink.savedId || null
    });
  },

  draw() {
    if (this.data.drawn || this.data.shaking) return;
    this.setData({ shaking: true });
    aiApi.daily().then(res => {
      const drink = res;
      storage.set('daily_draw', { date: todayKey(), drink });
      // 摇晃 0.9s 后停止，开始注酒；注酒流再播 1s 后消失
      setTimeout(() => {
        this.setData({ shaking: false, pouring: true });
        this.applyDrink(drink, true);
        setTimeout(() => this.setData({ pouring: false }), 1000);
      }, 900);
    }).catch(() => {
      this.setData({ shaking: false });
      wx.showToast({ title: '抽取失败，稍后再试', icon: 'none' });
    });
  },

  // 直接点击酒杯也能抽卡
  onGlassTap() {
    if (!this.data.drawn && !this.data.shaking) {
      this.draw();
    }
  },

  saveRecipe() {
    const d = this.data.drink;
    if (!d || d.source !== 'ai' || this.data.saveState === 'saved') return;
    wx.showLoading({ title: '保存中' });
    aiApi.save({
      name: d.name, nameEn: d.nameEn, baseSpirit: d.baseSpirit,
      glassType: d.glassType, difficulty: d.difficulty,
      description: d.description, tips: d.tips,
      ingredients: d.ingredients || [], steps: d.steps || []
    }).then(res => {
      wx.hideLoading();
      if (res && res.alreadyExists) {
        wx.showToast({ title: '已收录过啦', icon: 'none' });
      } else {
        wx.showToast({ title: '已存到酒谱库', icon: 'success' });
      }
      const updated = Object.assign({}, d, { savedId: res ? res.id : null });
      this.setData({ saveState: 'saved', savedId: updated.savedId, drink: updated });
      storage.set('daily_draw', { date: todayKey(), drink: updated });
    }).catch(() => {
      wx.hideLoading();
      wx.showToast({ title: '保存失败', icon: 'none' });
    });
  },

  goDetail() {
    const d = this.data.drink;
    if (d && d.source === 'official' && d.id) {
      wx.navigateTo({ url: '/pages/cocktail-detail/cocktail-detail?id=' + d.id });
    }
  },

  // 测试用：清除今日记录，便于重新体验抽卡 / 测试摇一摇
  resetToday() {
    storage.remove('daily_draw');
    this.setData({
      drawn: false, drink: null, gradient: '', icon: '🍸',
      reveal: false, saveState: 'idle', savedId: null
    });
    wx.showToast({ title: '已清除，可重新摇', icon: 'none' });
  }
});
