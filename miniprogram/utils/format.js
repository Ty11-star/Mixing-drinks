// utils/format.js
// 展示层格式化与映射工具

// 难度元数据：用杯具类型表达难度（杯具图标用 emoji 占位，整体仍保持极简）
const DIFFICULTY_MAP = {
  1: { label: '简单', color: '#7E9C8C', glass: '🥤', bg: 'rgba(126,156,140,0.14)' },
  2: { label: '中等', color: '#A87844', glass: '🍸', bg: 'rgba(168,120,68,0.12)' },
  3: { label: '困难', color: '#B9786C', glass: '🍹', bg: 'rgba(185,120,108,0.12)' }
};

function getDifficulty(d) {
  return DIFFICULTY_MAP[d] || DIFFICULTY_MAP[1];
}

// 基酒 -> 渐变色（用于占位图与卡片底色）
const SPIRIT_GRADIENTS = {
  '朗姆酒': 'linear-gradient(135deg, #D8B98E 0%, #A87844 100%)',
  '伏特加': 'linear-gradient(135deg, #EFF1EC 0%, #C4CEC8 100%)',
  '威士忌': 'linear-gradient(135deg, #D3AB84 0%, #9C6E45 100%)',
  '金酒': 'linear-gradient(135deg, #D6E4DA 0%, #9CB9A8 100%)',
  '龙舌兰': 'linear-gradient(135deg, #F0E3CE 0%, #D8B98E 100%)',
  '白兰地': 'linear-gradient(135deg, #DBAE82 0%, #A87844 100%)',
  '混合基酒': 'linear-gradient(135deg, #D5C6DA 0%, #9C7A5E 100%)',
  '无酒精': 'linear-gradient(135deg, #D4E6DA 0%, #9CB9A8 100%)',
  '便利店': 'linear-gradient(135deg, #E8EAD9 0%, #F5EBD4 100%)'
};

function getSpiritGradient(baseSpirit) {
  return SPIRIT_GRADIENTS[baseSpirit] || 'linear-gradient(135deg, #D8B98E 0%, #A87844 100%)';
}

// 基酒 -> 图标（用于卡片/详情占位图，替代首字水印）
const SPIRIT_ICONS = {
  '朗姆酒': '🍹',
  '伏特加': '🍸',
  '金酒': '🍸',
  '威士忌': '🥃',
  '龙舌兰': '🍹',
  '白兰地': '🥃',
  '混合基酒': '🍸',
  '无酒精': '🧃',
  '便利店': '🏪'
};
function getSpiritIcon(baseSpirit) {
  return SPIRIT_ICONS[baseSpirit] || '🍸';
}

// 取名称首字符作为占位图水印（保留备用）
function getInitial(name) {
  if (!name) return '·';
  return name.charAt(0);
}

// 口味标签字符串 -> 数组
function parseTasteTags(str) {
  if (!str) return [];
  return String(str).split(/[,，]/).map(s => s.trim()).filter(Boolean);
}

// 分类类型 -> 中文
const CATEGORY_TYPE_MAP = {
  base_spirit: '基酒',
  taste: '口味',
  occasion: '场合'
};
function getCategoryTypeLabel(type) {
  return CATEGORY_TYPE_MAP[type] || type;
}

// 材料分类 -> 中文分组名
const INGREDIENT_CATEGORY_MAP = {
  base_spirit: '基酒',
  liqueur: '利口酒',
  juice: '果汁 / 饮料',
  syrup: '糖浆',
  garnish: '装饰 / 辅料',
  other: '其他'
};
function getIngredientCategoryLabel(category) {
  return INGREDIENT_CATEGORY_MAP[category] || '其他';
}

// 调制方法 -> 中文
const METHOD_MAP = {
  shake: '摇和法',
  stir: '搅拌法',
  build: '兑和法'
};
function getMethodLabel(method) {
  return METHOD_MAP[method] || method || '兑和法';
}

module.exports = {
  getDifficulty,
  getSpiritGradient,
  getSpiritIcon,
  getInitial,
  parseTasteTags,
  getCategoryTypeLabel,
  getIngredientCategoryLabel,
  getMethodLabel
};
