// 导出 MySQL 现有数据为云开发 seed 文件
// 用法：在 server 目录下 node src/scripts/exportToCloudSeed.js
// 输出：D:\code\Mixing drinks cloudbase\miniprogram\cloudfunctions\seed\data.js
const fs = require('fs');
const path = require('path');
const { sequelize, Cocktail, Ingredient, Category, CocktailIngredient, CocktailStep } = require('../models');

const OUT = path.join(
  'D:',
  'code',
  'Mixing drinks cloudbase',
  'miniprogram',
  'cloudfunctions',
  'seed',
  'data.js'
);

function toBool(v) {
  return v === 1 || v === true || v === '1';
}

async function main() {
  // 分类
  const categories = await Category.findAll({ raw: true });
  const catDocs = categories.map((c) => ({
    _id: String(c.id),
    name: c.name,
    type: c.type,
    icon: c.icon || '',
    color: c.color || '',
    description: c.description || '',
    sortOrder: c.sort_order ?? 0,
    status: c.status ?? 1
  }));

  // 材料
  const ingredients = await Ingredient.findAll({ raw: true });
  const ingDocs = ingredients.map((i) => ({
    _id: String(i.id),
    name: i.name,
    nameEn: i.name_en || '',
    category: i.category,
    commonUnit: i.common_unit || '',
    status: i.status ?? 1,
    description: i.description || ''
  }));

  // 酒谱（含材料明细、步骤、分类）
  const cocktails = await Cocktail.findAll({
    include: [
      {
        model: CocktailIngredient,
        as: 'cocktailIngredients',
        include: [{ model: Ingredient, as: 'ingredient' }]
      },
      { model: CocktailStep, as: 'steps' },
      { model: Category, as: 'categories' }
    ],
    order: [['sort_order', 'DESC']]
  });

  const cockDocs = cocktails.map((c) => {
    const plain = c.toJSON ? c.toJSON() : c;
    const ingredientItems = (plain.cocktailIngredients || []).map((ci) => ({
      id: String(ci.ingredientId),
      name: ci.ingredient ? ci.ingredient.name : '',
      amount: ci.amount || '',
      isOptional: toBool(ci.isOptional),
      sortOrder: ci.sortOrder ?? 0
    }));
    const steps = (plain.steps || []).map((s) => ({
      stepNumber: s.stepNumber,
      description: s.description
    }));
    const cats = (plain.categories || []).map((cat) => String(cat.id));
    return {
      _id: String(plain.id),
      name: plain.name,
      nameEn: plain.nameEn || '',
      description: plain.description || '',
      difficulty: plain.difficulty ?? 1,
      baseSpirit: plain.baseSpirit || '',
      tasteTags: plain.tasteTags || '',
      glassType: plain.glassType || '',
      method: plain.method || '',
      tips: plain.tips || '',
      source: plain.source || 'official',
      sortOrder: plain.sortOrder ?? 0,
      status: plain.status ?? 1,
      createTime: plain.createAt || plain.createdAt || new Date().toISOString(),
      ingredients: ingredientItems,
      steps,
      categories: cats
    };
  });

  const content = `// 自动生成，请勿手动编辑（由 server/src/scripts/exportToCloudSeed.js 导出）
// 首次使用：在微信开发者工具右键 seed 云函数 -> 上传并部署 -> 调用一次 import
module.exports = {
  categories: ${JSON.stringify(catDocs, null, 2)},
  ingredients: ${JSON.stringify(ingDocs, null, 2)},
  cocktails: ${JSON.stringify(cockDocs, null, 2)}
};
`;
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, content, 'utf8');
  console.log(`已导出：分类 ${catDocs.length} 条，材料 ${ingDocs.length} 条，酒谱 ${cockDocs.length} 条`);
  console.log('输出文件：', OUT);
  await sequelize.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
