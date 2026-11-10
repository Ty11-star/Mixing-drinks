const { Ingredient } = require('../models');
const { Op, Sequelize } = require('sequelize');

// 材料分类的固定排序（基酒 → 利口酒 → 果汁/饮料 → 糖浆 → 装饰 → 其他）
const CATEGORY_ORDER = Sequelize.literal(
  "FIELD(`category`, 'base_spirit', 'liqueur', 'juice', 'syrup', 'garnish', 'other')"
);

class IngredientService {
  /**
   * 获取材料列表
   */
  async getIngredients(params = {}) {
    const { category, page, pageSize, status } = params;
    const where = {};

    // 状态过滤：默认只返回启用（小程序端）；管理端可传 status=all 或 0/1
    if (status === 'all') {
      // 不过滤
    } else if (status !== undefined && status !== '') {
      where.status = Number(status);
    } else {
      where.status = 1;
    }

    if (category) {
      where.category = category;
    }

    // 如果有分页参数
    if (page && pageSize) {
      const offset = (page - 1) * pageSize;
      const { count, rows } = await Ingredient.findAndCountAll({
        where,
        limit: parseInt(pageSize),
        offset,
        order: [[CATEGORY_ORDER, 'ASC'], ['id', 'ASC']]
      });

      return {
        total: count,
        list: rows,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      };
    }

    // 不分页，返回所有
    const ingredients = await Ingredient.findAll({
      where,
      order: [[CATEGORY_ORDER, 'ASC'], ['id', 'ASC']]
    });

    return ingredients;
  }

  /**
   * 获取材料详情
   */
  async getIngredientById(id) {
    const ingredient = await Ingredient.findByPk(id);
    if (!ingredient || ingredient.status === 0) {
      throw new Error('材料不存在');
    }
    return ingredient;
  }

  /**
   * 创建材料
   */
  async createIngredient(data) {
    // 检查是否已存在同名材料
    const existing = await Ingredient.findOne({
      where: { name: data.name }
    });

    if (existing) {
      throw new Error('该材料已存在');
    }

    return await Ingredient.create(data);
  }

  /**
   * 更新材料
   */
  async updateIngredient(id, data) {
    const ingredient = await Ingredient.findByPk(id);
    if (!ingredient) {
      throw new Error('材料不存在');
    }

    // 如果修改了名称，检查是否与其他材料重名
    if (data.name && data.name !== ingredient.name) {
      const existing = await Ingredient.findOne({
        where: {
          name: data.name,
          id: { [Op.ne]: id }
        }
      });

      if (existing) {
        throw new Error('该材料名称已被使用');
      }
    }

    await ingredient.update(data);
    return ingredient;
  }

  /**
   * 删除材料（软删除）
   */
  async deleteIngredient(id) {
    const ingredient = await Ingredient.findByPk(id);
    if (!ingredient) {
      throw new Error('材料不存在');
    }

    await ingredient.update({ status: 0 });
    return true;
  }

  /**
   * 按分类分组获取材料
   */
  async getIngredientsByCategory() {
    const ingredients = await Ingredient.findAll({
      where: { status: 1 },
      order: [[CATEGORY_ORDER, 'ASC'], ['id', 'ASC']]
    });

    // 按分类分组
    const grouped = ingredients.reduce((acc, item) => {
      const category = item.category || 'other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});

    return grouped;
  }
}

module.exports = new IngredientService();
