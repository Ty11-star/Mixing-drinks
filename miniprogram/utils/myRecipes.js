// utils/myRecipes.js
// 本地“我的 AI 配方”存储工具：配方只保存在当前设备，不写入公共酒谱库

const storage = require('./storage');

const KEY = 'my_ai_recipes';

function normalizeIngredients(list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter(i => i && i.name)
    .map(i => ({ name: String(i.name), amount: i.amount || '' }));
}

function normalizeSteps(list) {
  if (!Array.isArray(list)) return [];
  return list
    .map(s => (typeof s === 'string' ? s : (s && s.description) || ''))
    .filter(Boolean)
    .map(String);
}

function normalize(recipe) {
  const r = recipe || {};
  return {
    name: String(r.name || '').trim(),
    nameEn: r.nameEn || '',
    baseSpirit: r.baseSpirit || '',
    glassType: r.glassType || '',
    difficulty: r.difficulty || 1,
    description: r.description || r.summary || '',
    tips: r.tips || '',
    ingredients: normalizeIngredients(r.ingredients),
    steps: normalizeSteps(r.steps),
    source: 'ai'
  };
}

function list() {
  const records = storage.get(KEY, []);
  return Array.isArray(records) ? records : [];
}

function save(recipe) {
  const normalized = normalize(recipe);
  if (!normalized.name) return { id: null, alreadyExists: false };

  const records = list();
  const existed = records.find(item => item.name === normalized.name);
  if (existed) {
    return { id: existed.id, alreadyExists: true };
  }

  const record = Object.assign({
    id: Date.now() + '_' + Math.random().toString(36).slice(2, 8),
    createdAt: new Date().toISOString()
  }, normalized);

  storage.set(KEY, [record].concat(records));
  return { id: record.id, alreadyExists: false };
}

function get(id) {
  return list().find(item => item.id === id) || null;
}

function remove(id) {
  storage.set(KEY, list().filter(item => item.id !== id));
}

module.exports = { KEY, list, save, get, remove };
