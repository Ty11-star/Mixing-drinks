const categoryService = require('../services/categoryService');
const Response = require('../utils/response');

class CategoryController {
  /**
   * 获取分类列表
   */
  async getCategories(req, res, next) {
    try {
      const { type } = req.query;
      const categories = await categoryService.getCategories(req.query);
      res.json(Response.success(categories));
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取分类详情
   */
  async getCategoryById(req, res, next) {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      res.json(Response.success(category));
    } catch (error) {
      next(error);
    }
  }

  /**
   * 创建分类
   */
  async createCategory(req, res, next) {
    try {
      const category = await categoryService.createCategory(req.body);
      res.json(Response.success(category, '创建成功'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * 更新分类
   */
  async updateCategory(req, res, next) {
    try {
      const category = await categoryService.updateCategory(req.params.id, req.body);
      res.json(Response.success(category, '更新成功'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * 删除分类
   */
  async deleteCategory(req, res, next) {
    try {
      await categoryService.deleteCategory(req.params.id);
      res.json(Response.success(null, '删除成功'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CategoryController();
