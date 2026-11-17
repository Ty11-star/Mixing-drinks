// pages/ai-recipe/ai-recipe.js
const aiApi = require('../../api/ai');
const format = require('../../utils/format');
const storage = require('../../utils/storage');
const myRecipes = require('../../utils/myRecipes');

Page({
  data: {
    ingredients: [],
    loading: true,
    failed: false,
    errMsg: '',
    recipe: null,
    alternatives: [],
    summary: '',
    diffMeta: null,
    taste: [],
    saveState: 'idle',   // idle | saving | saved | exists
    savedId: null
  },

  onLoad() {
    const ingredients = storage.get('ai_ingredients', []);
    this.setData({ ingredients });
    this.generate();
  },

  async generate() {
    if (!this.data.ingredients.length) {
      this.setData({ loading: false, failed: true, errMsg: '没有可用的材料' });
      return;
    }
    this.setData({ loading: true, failed: false, recipe: null });
    try {
      const res = await aiApi.recommend(this.data.ingredients);
      const rec = res.recommendation || {};
      this.setData({
        recipe: rec,
        alternatives: Array.isArray(res.alternatives) ? res.alternatives : [],
        summary: res.summary || '',
        diffMeta: format.getDifficulty(rec.difficulty),
        loading: false
      });
    } catch (e) {
      this.setData({
        loading: false,
        failed: true,
        errMsg: (e && e.message) || 'AI 生成失败，请稍后重试'
      });
    }
  },

  copyRecipe() {
    const r = this.data.recipe;
    if (!r) return;
    const lines = [];
    lines.push('🍸 ' + r.name + (r.nameEn ? ' (' + r.nameEn + ')' : ''));
    if (r.glassType) lines.push('杯型：' + r.glassType);
    lines.push('');
    (r.ingredients || []).forEach(i => lines.push('· ' + i.name + ' ' + (i.amount || '')));
    lines.push('');
    (r.steps || []).forEach((s, idx) => lines.push((idx + 1) + '. ' + s));
    if (r.tips) lines.push('');
    lines.push('Tips：' + r.tips);
    lines.push('—— 来自「调一杯」AI 调酒师');
    wx.setClipboardData({ data: lines.join('\n') });
  },

  // 将 AI 配方保存到当前设备的本地配方，不进入公共酒谱库
  async saveRecipe() {
    const r = this.data.recipe;
    if (!r || this.data.saveState === 'saving' || this.data.saveState === 'saved' || this.data.saveState === 'exists') return;
    this.setData({ saveState: 'saving' });
    try {
      const res = myRecipes.save({
        name: r.name,
        nameEn: r.nameEn || '',
        baseSpirit: r.baseSpirit || '',
        glassType: r.glassType || '',
        difficulty: r.difficulty || 1,
        summary: this.data.summary || '',
        tips: r.tips || '',
        ingredients: (r.ingredients || []).map(i => ({ name: i.name, amount: i.amount || '' })),
        steps: (r.steps || []).map(s => (typeof s === 'string' ? s : s && s.description))
      });
      if (!res.id) throw new Error('配方名称为空');
      if (res.alreadyExists) {
        this.setData({ saveState: 'exists', savedId: res.id });
        wx.showToast({ title: '已在本地配方中', icon: 'none' });
      } else {
        this.setData({ saveState: 'saved', savedId: res.id });
        wx.showToast({ title: '已存到我的配方', icon: 'success' });
      }
    } catch (e) {
      this.setData({ saveState: 'idle' });
      wx.showToast({ title: '保存失败，可重试', icon: 'none' });
    }
  },

  goSavedDetail() {
    wx.navigateTo({ url: '/pages/my-recipes/my-recipes' });
  }
});
