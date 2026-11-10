const { Cocktail, Ingredient, CocktailIngredient, CocktailStep, Category, CocktailCategory } = require('../models');
const { Op } = require('sequelize');
const { matchCocktails } = require('./matchEngine');

class CocktailService {
  /**
   * 获取酒谱列表（分页）
   */
  async getCocktails(params) {
    const {
      page = 1,
      pageSize = 10,
      categoryId,
      difficulty,
      baseSpirit,
      keyword,
      status
    } = params;

    const offset = (page - 1) * pageSize;
    const where = {};

    // 状态过滤：默认只返回启用（小程序端）；管理端可传 status=all 或 0/1
    if (status === 'all') {
      // 不过滤
    } else if (status !== undefined && status !== '') {
      where.status = Number(status);
    } else {
      where.status = 1;
    }

    // 添加筛选条件
    if (difficulty) where.difficulty = difficulty;
    if (baseSpirit) where.baseSpirit = baseSpirit;
    if (keyword) {
      where.name = { [Op.like]: `%${keyword}%` };
    }

    const include = [
      {
        model: Ingredient,
        as: 'ingredients',
        through: { attributes: ['amount', 'isOptional', 'sortOrder'] },
        attributes: ['id', 'name', 'nameEn', 'category', 'commonUnit']
      },
      {
        model: Category,
        as: 'categories',
        through: { attributes: [] },
        attributes: ['id', 'name', 'type']
      }
    ];

    // 如果有分类筛选
    if (categoryId) {
      include[1].where = { id: categoryId };
      include[1].required = true;
    }

    const { count, rows } = await Cocktail.findAndCountAll({
      where,
      include,
      limit: parseInt(pageSize),
      offset,
      order: [['sortOrder', 'DESC'], ['id', 'ASC']],
      distinct: true
    });

    return {
      total: count,
      list: rows,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    };
  }

  /**
   * 获取酒谱详情
   */
  async getCocktailById(id, includeDisabled = false) {
    const cocktail = await Cocktail.findByPk(id, {
      include: [
        {
          model: Ingredient,
          as: 'ingredients',
          through: {
            attributes: ['amount', 'isOptional', 'sortOrder'],
            as: 'ingredientDetail'
          },
          attributes: ['id', 'name', 'nameEn', 'category', 'commonUnit', 'description']
        },
        {
          model: CocktailStep,
          as: 'steps',
          attributes: ['id', 'stepNumber', 'description'],
          order: [['stepNumber', 'ASC']]
        },
        {
          model: Category,
          as: 'categories',
          through: { attributes: [] },
          attributes: ['id', 'name', 'type', 'icon']
        }
      ]
    });

    if (!cocktail || (!includeDisabled && cocktail.status === 0)) {
      throw new Error('酒谱不存在');
    }

    return cocktail;
  }

  /**
   * 创建酒谱
   */
  async createCocktail(data) {
    const { ingredients = [], steps = [], categories = [], ...cocktailData } = data;

    const cocktail = await Cocktail.create(cocktailData);

    // 关联材料
    if (ingredients.length > 0) {
      await this.updateCocktailIngredients(cocktail.id, ingredients);
    }

    // 创建步骤
    if (steps.length > 0) {
      await this.updateCocktailSteps(cocktail.id, steps);
    }

    // 关联分类
    if (categories.length > 0) {
      await this.updateCocktailCategories(cocktail.id, categories);
    }

    return await this.getCocktailById(cocktail.id, true);
  }

  /**
   * 更新酒谱
   */
  async updateCocktail(id, data) {
    const cocktail = await Cocktail.findByPk(id);
    if (!cocktail) {
      throw new Error('酒谱不存在');
    }

    const { ingredients, steps, categories, ...cocktailData } = data;

    // 更新基本信息
    await cocktail.update(cocktailData);

    // 更新材料
    if (ingredients) {
      await this.updateCocktailIngredients(id, ingredients);
    }

    // 更新步骤
    if (steps) {
      await this.updateCocktailSteps(id, steps);
    }

    // 更新分类
    if (categories) {
      await this.updateCocktailCategories(id, categories);
    }

    return await this.getCocktailById(id, true);
  }

  /**
   * 删除酒谱（软删除）
   */
  async deleteCocktail(id) {
    const cocktail = await Cocktail.findByPk(id);
    if (!cocktail) {
      throw new Error('酒谱不存在');
    }

    await cocktail.update({ status: 0 });
    return true;
  }

  /**
   * 更新酒谱材料
   */
  async updateCocktailIngredients(cocktailId, ingredients) {
    // 删除旧的关联
    await CocktailIngredient.destroy({ where: { cocktailId } });

    // 创建新的关联
    const ingredientData = ingredients.map(item => ({
      cocktailId,
      ingredientId: item.ingredientId,
      amount: item.amount,
      isOptional: item.isOptional || 0,
      sortOrder: item.sortOrder || 0
    }));

    await CocktailIngredient.bulkCreate(ingredientData);
  }

  /**
   * 更新酒谱步骤
   */
  async updateCocktailSteps(cocktailId, steps) {
    // 删除旧步骤
    await CocktailStep.destroy({ where: { cocktailId } });

    // 创建新步骤
    const stepData = steps.map((step, index) => ({
      cocktailId,
      stepNumber: step.stepNumber || index + 1,
      description: step.description
    }));

    await CocktailStep.bulkCreate(stepData);
  }

  /**
   * 更新酒谱分类
   */
  async updateCocktailCategories(cocktailId, categories) {
    // 删除旧的关联
    await CocktailCategory.destroy({ where: { cocktailId } });

    // 创建新的关联
    const categoryData = categories.map(categoryId => ({
      cocktailId,
      categoryId
    }));

    await CocktailCategory.bulkCreate(categoryData);
  }

  /**
   * 搜索酒谱
   */
  async searchCocktails(keyword, params = {}) {
    const { page = 1, pageSize = 10 } = params;
    const offset = (page - 1) * pageSize;

    const where = {
      status: 1,
      [Op.or]: [
        { name: { [Op.like]: `%${keyword}%` } },
        { nameEn: { [Op.like]: `%${keyword}%` } },
        { baseSpirit: { [Op.like]: `%${keyword}%` } },
        { tasteTags: { [Op.like]: `%${keyword}%` } }
      ]
    };

    const { count, rows } = await Cocktail.findAndCountAll({
      where,
      include: [
        {
          model: Ingredient,
          as: 'ingredients',
          through: { attributes: ['amount', 'isOptional'] },
          attributes: ['id', 'name', 'category']
        }
      ],
      limit: parseInt(pageSize),
      offset,
      order: [['sortOrder', 'DESC'], ['createTime', 'DESC']]
    });

    return {
      total: count,
      list: rows,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    };
  }

  /**
   * 根据材料匹配酒谱
   */
  async matchByIngredients(ingredientIds) {
    // 获取所有启用的酒谱及其材料
    const cocktails = await Cocktail.findAll({
      where: { status: 1 },
      include: [
        {
          model: Ingredient,
          as: 'ingredients',
          through: {
            attributes: ['amount', 'isOptional'],
            as: 'ingredientDetail'
          },
          attributes: ['id', 'name', 'category', 'commonUnit']
        }
      ]
    });

    return matchCocktails(cocktails, ingredientIds);
  }
}

module.exports = new CocktailService();
