// utils/format.js
// 展示层格式化与映射工具

// 难度元数据：用杯具类型表达难度（杯具图标用 emoji 占位，整体仍保持极简）
const DIFFICULTY_MAP = {
  1: { label: '简单', color: '#7ECFA0', glass: '🥤', bg: 'rgba(126,207,160,0.15)' },
  2: { label: '中等', color: '#F5C77E', glass: '🍸', bg: 'rgba(245,199,126,0.18)' },
  3: { label: '困难', color: '#C54B3D', glass: '🍹', bg: 'rgba(197,75,61,0.15)' }
};

function getDifficulty(d) {
  return DIFFICULTY_MAP[d] || DIFFICULTY_MAP[1];
}

// 基酒 -> 渐变色（用于占位图与卡片底色）
const SPIRIT_GRADIENTS = {
  '朗姆酒': 'linear-gradient(135deg, #D4A574 0%, #8B6F47 100%)',
  '伏特加': 'linear-gradient(135deg, #E8F1F5 0%, #B8C5D0 100%)',
  '威士忌': 'linear-gradient(135deg, #C8956B 0%, #8B5A3C 100%)',
  '金酒': 'linear-gradient(135deg, #C8E3D4 0%, #7ECFA0 100%)',
  '龙舌兰': 'linear-gradient(135deg, #F5E6D3 0%, #D4A574 100%)',
  '白兰地': 'linear-gradient(135deg, #D9A066 0%, #A0522D 100%)',
  '混合基酒': 'linear-gradient(135deg, #C8B6E2 0%, #8A5A2C 100%)',
  '无酒精': 'linear-gradient(135deg, #BFE3D0 0%, #7ECFA0 100%)'
};

function getSpiritGradient(baseSpirit) {
  return SPIRIT_GRADIENTS[baseSpirit] || 'linear-gradient(135deg, #D4A574 0%, #B8935E 100%)';
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
  '无酒精': '🧃'
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
