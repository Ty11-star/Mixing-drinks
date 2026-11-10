const { Category, Cocktail } = require('../models');
const { Op } = require('sequelize');

class CategoryService {
  /**
   * 获取分类列表
   */
  async getCategories(params = {}) {
    const { type, status } = params;
    const where = {};

    // 状态过滤：默认只返回启用（小程序端）；管理端可传 status=all 或 0/1
    if (status === 'all') {
      // 不过滤
    } else if (status !== undefined && status !== '') {
      where.status = Number(status);
    } else {
      where.status = 1;
    }

    if (type) {
      where.type = type;
    }

    const categories = await Category.findAll({
      where,
      order: [['sortOrder', 'DESC'], ['id', 'ASC']]
    });

    // 统计每个分类下的酒谱数量
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await category.countCocktails({
          where: { status: 1 }
        });
        return {
          ...category.toJSON(),
          cocktailCount: count
        };
      })
    );

    return categoriesWithCount;
  }

  /**
   * 获取分类详情
   */
  async getCategoryById(id) {
    const category = await Category.findByPk(id);
    if (!category || category.status === 0) {
      throw new Error('分类不存在');
    }
    return category;
  }

  /**
   * 创建分类
   */
  async createCategory(data) {
    // 检查同类型下是否有同名分类
    const existing = await Category.findOne({
      where: {
        name: data.name,
        type: data.type
      }
    });

    if (existing) {
      throw new Error('该分类已存在');
    }

    return await Category.create(data);
  }

  /**
   * 更新分类
   */
  async updateCategory(id, data) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new Error('分类不存在');
    }

    // 检查是否与其他分类重名
    if (data.name || data.type) {
      const existing = await Category.findOne({
        where: {
          name: data.name || category.name,
          type: data.type || category.type,
          id: { [Op.ne]: id }
        }
      });

      if (existing) {
        throw new Error('该分类名称已被使用');
      }
    }

    await category.update(data);
    return category;
  }

  /**
   * 删除分类（软删除）
   */
  async deleteCategory(id) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new Error('分类不存在');
    }

    await category.update({ status: 0 });
    return true;
  }
}

module.exports = new CategoryService();
