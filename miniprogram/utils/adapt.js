// utils/adapt.js
// 后端数据 -> 视图模型 归一化适配层
// 已知差异：
// 1. 关联查询中材料的用量放在 ingredientDetail（amount/isOptional/sortOrder）里
// 2. steps 的 include 未带排序，顺序可能不保证
// 3. 后端 Cocktail 模型暂无 alcoholContent/iceType/garnish/origin 字段（视图层已做守卫）

const config = require('./config');

/**
 * 将后端返回的相对封面路径（如 /uploads/xxx.jpg）拼接为小程序可访问的绝对地址；
 * 已是完整 http(s) 地址则原样返回。
 */
function buildImageUrl(cover) {
  if (!cover) return '';
  if (/^https?:\/\//.test(cover)) return cover;
  const host = (config.baseUrl || '').replace(/\/api\/v1\/?$/, '');
  return host + cover;
}

function normalizeIngredientItem(ing) {
  if (!ing) return ing;
  const detail = ing.ingredientDetail || {};
  return {
    id: ing.id,
    name: ing.name,
    nameEn: ing.nameEn,
    category: ing.category,
    commonUnit: ing.commonUnit,
    amount: ing.amount !== undefined && ing.amount !== null ? ing.amount : detail.amount,
    isOptional: ing.isOptional !== undefined && ing.isOptional !== null ? ing.isOptional : detail.isOptional,
    _sort: detail.sortOrder !== undefined && detail.sortOrder !== null ? Number(detail.sortOrder) : 0
  };
}

function normalizeCocktail(cocktail) {
  if (!cocktail) return cocktail;
  const next = Object.assign({}, cocktail);

  // 封面图：相对路径转绝对地址，供卡片与详情页展示
  next.image = buildImageUrl(next.cover);

  if (Array.isArray(next.ingredients)) {
    next.ingredients = next.ingredients
      .map(normalizeIngredientItem)
      .sort((a, b) => a._sort - b._sort)
      .map(item => {
        const clean = Object.assign({}, item);
        delete clean._sort;
        return clean;
      });
  }

  if (Array.isArray(next.steps)) {
    next.steps = next.steps.slice().sort((a, b) => (a.stepNumber || 0) - (b.stepNumber || 0));
  }

  return next;
}

// 分页响应：{ list, total, page, pageSize }
function normalizePage(res) {
  if (!res) return res;
  if (Array.isArray(res.list)) {
    res.list = res.list.map(normalizeCocktail);
  }
  return res;
}

// 材料匹配响应：[{ cocktail, matchRate, missingIngredients }]
function normalizeMatch(list) {
  if (!Array.isArray(list)) return list || [];
  return list.map(item => {
    if (item && item.cocktail) {
      item.cocktail = normalizeCocktail(item.cocktail);
    }
    return item;
  });
}

module.exports = {
  normalizeCocktail,
  normalizePage,
  normalizeMatch
};
