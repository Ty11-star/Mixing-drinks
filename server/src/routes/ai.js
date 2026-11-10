const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const Response = require('../utils/response');
const { optionalAuth } = require('../middlewares/auth');
const { Cocktail, CocktailIngredient, CocktailStep, Ingredient } = require('../models');

/**
 * AI 调酒推荐
 * POST /api/v1/ai/recommend  body: { ingredients: ["伏特加", "柠檬汁", ...] }
 */
router.post('/recommend', optionalAuth, async (req, res, next) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.json(Response.error('请提供材料清单', 400));
    }

    // 最多传 60 种材料，防止 prompt 过长
    const names = ingredients
      .filter(n => typeof n === 'string' && n.trim())
      .map(n => n.trim())
      .slice(0, 60);

    if (names.length === 0) {
      return res.json(Response.error('请提供材料清单', 400));
    }

    const result = await aiService.recommendByIngredients(names);
    res.json(Response.success(result, '生成成功'));
  } catch (error) {
    next(error);
  }
});

/**
 * 保存 AI 生成的配方到酒谱库
 * POST /api/v1/ai/save
 * body: { name, nameEn, baseSpirit, glassType, difficulty, description, tips, ingredients:[{name,amount}], steps:[{description}] }
 */
router.post('/save', optionalAuth, async (req, res, next) => {
  try {
    const {
      name, nameEn, baseSpirit, glassType, difficulty,
      description, tips, ingredients, steps
    } = req.body;

    if (!name || !String(name).trim()) {
      return res.json(Response.error('缺少酒谱名称', 400));
    }

    // 同名已存在则直接返回，避免重复入库
    const existed = await Cocktail.findOne({ where: { name: name.trim() } });
    if (existed) {
      return res.json(Response.success({ id: existed.id, alreadyExists: true }, '该配方已收录'));
    }

    const t = await Cocktail.sequelize.transaction();
    try {
      const cocktail = await Cocktail.create({
        name: name.trim(),
        nameEn: nameEn || null,
        baseSpirit: baseSpirit || null,
        glassType: glassType || null,
        difficulty: difficulty || 1,
        description: description || null,
        tips: tips || null,
        method: 'build',
        status: 1,
        source: 'ai',
        sortOrder: 0
      }, { transaction: t });

      if (Array.isArray(ingredients)) {
        for (let i = 0; i < ingredients.length; i++) {
          const it = ingredients[i];
          if (!it || !it.name) continue;
          let ing = await Ingredient.findOne({ where: { name: it.name } });
          if (!ing) {
            ing = await Ingredient.create(
              { name: it.name, category: 'other', status: 1 },
              { transaction: t }
            );
          }
          await CocktailIngredient.create({
            cocktailId: cocktail.id,
            ingredientId: ing.id,
            amount: it.amount || '',
            isOptional: 0,
            sortOrder: i
          }, { transaction: t });
        }
      }

      if (Array.isArray(steps)) {
        for (let i = 0; i < steps.length; i++) {
          const d = typeof steps[i] === 'string' ? steps[i] : steps[i].description;
          if (!d) continue;
          await CocktailStep.create({
            cocktailId: cocktail.id,
            stepNumber: i + 1,
            description: d
          }, { transaction: t });
        }
      }

      await t.commit();
      res.json(Response.success({ id: cocktail.id, alreadyExists: false }, '保存成功'));
    } catch (e) {
      await t.rollback();
      throw e;
    }
  } catch (error) {
    next(error);
  }
});

/**
 * 每日抽卡：随机返回一款酒（酒谱库 / AI 各占一部分概率）
 * GET /api/v1/ai/daily
 */
router.get('/daily', optionalAuth, async (req, res, next) => {
  try {
    const result = await aiService.randomCocktail();
    res.json(Response.success(result, '抽卡成功'));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
