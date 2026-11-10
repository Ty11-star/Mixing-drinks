/**
 * 数据看板统计控制器
 */
const { Admin, Cocktail, CocktailIngredient, CocktailCategory, Ingredient, Category, sequelize } = require('../models');
const { Op } = require('sequelize');
const { success, error } = require('../utils/response');

const toNum = (val) => Number(val) || 0;

// 数据看板统计数据
exports.getDashboardStats = async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // 1. 总量统计（并行查询）
    const [
      cocktailCount,
      ingredientCount,
      categoryCount,
      adminCount,
      newCocktailCount,
    ] = await Promise.all([
      Cocktail.count(),
      Ingredient.count(),
      Category.count(),
      Admin.count(),
      Cocktail.count({ where: { create_time: { [Op.gte]: sevenDaysAgo } } }),
    ]);

    // 2. 酒谱按基酒分布
    const byBaseSpirit = (await Cocktail.findAll({
      attributes: ['baseSpirit', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['base_spirit'],
      order: [[sequelize.literal('count'), 'DESC']],
      raw: true,
    })).map(item => ({ name: item.baseSpirit || '未设置', count: toNum(item.count) }));

    // 3. 酒谱按难度分布
    const byDifficulty = (await Cocktail.findAll({
      attributes: ['difficulty', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['difficulty'],
      raw: true,
    })).map(item => ({ difficulty: toNum(item.difficulty), count: toNum(item.count) }));

    // 4. 酒谱按调制方法分布
    const byMethod = (await Cocktail.findAll({
      attributes: ['method', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['method'],
      raw: true,
    })).map(item => ({ name: item.method || '未设置', count: toNum(item.count) }));

    // 5. 材料按分类分布
    const ingredientsByCategory = (await Ingredient.findAll({
      attributes: ['category', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['category'],
      order: [[sequelize.literal('count'), 'DESC']],
      raw: true,
    })).map(item => ({ name: item.category, count: toNum(item.count) }));

    // 6. 各分类下的酒谱数量（先统计关联数，再合并分类信息）
    const perCategoryRaw = await CocktailCategory.findAll({
      attributes: ['categoryId', [sequelize.fn('COUNT', sequelize.col('cocktail_id')), 'count']],
      group: ['category_id'],
      raw: true,
    });
    const categories = await Category.findAll({
      attributes: ['id', 'name', 'type'],
      raw: true,
    });
    const categoryMap = new Map(categories.map(c => [c.id, c]));
    const cocktailsPerCategory = perCategoryRaw
      .map(item => ({
        name: categoryMap.get(item.categoryId)?.name || `分类${item.categoryId}`,
        type: categoryMap.get(item.categoryId)?.type || '',
        count: toNum(item.count),
      }))
      .sort((a, b) => b.count - a.count);

    // 7. 材料使用频次 TOP10（被多少酒谱引用）
    const topIngredientsRaw = await CocktailIngredient.findAll({
      attributes: ['ingredientId', [sequelize.fn('COUNT', sequelize.col('cocktail_id')), 'count']],
      group: ['ingredient_id'],
      order: [[sequelize.literal('count'), 'DESC']],
      limit: 10,
      raw: true,
    });
    const ingredients = await Ingredient.findAll({
      attributes: ['id', 'name'],
      raw: true,
    });
    const ingredientMap = new Map(ingredients.map(i => [i.id, i.name]));
    const topIngredients = topIngredientsRaw.map(item => ({
      name: ingredientMap.get(item.ingredientId) || `材料${item.ingredientId}`,
      count: toNum(item.count),
    }));

    // 8. 最新添加的酒谱
    const recentCocktails = await Cocktail.findAll({
      attributes: ['id', 'name', 'name_en', 'difficulty', 'base_spirit', 'status', 'create_time'],
      order: [['create_time', 'DESC']],
      limit: 8,
      raw: true,
    });

    res.json(success({
      overview: {
        cocktailCount,
        ingredientCount,
        categoryCount,
        adminCount,
        newCocktailCount,
      },
      byBaseSpirit,
      byDifficulty,
      byMethod,
      ingredientsByCategory,
      cocktailsPerCategory,
      topIngredients,
      recentCocktails,
    }));
  } catch (err) {
    console.error('获取看板统计数据失败:', err);
    res.status(500).json(error('获取看板统计数据失败'));
  }
};
