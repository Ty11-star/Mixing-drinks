const ingredientService = require('../services/ingredientService');
const Response = require('../utils/response');

class IngredientController {
  /**
   * 获取材料列表
   */
  async getIngredients(req, res, next) {
    try {
      const result = await ingredientService.getIngredients(req.query);

      // 判断是否分页
      if (result.list) {
        res.json(Response.page(result.list, result.total, result.page, result.pageSize));
      } else {
        res.json(Response.success(result));
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * 按分类获取材料
   */
  async getIngredientsByCategory(req, res, next) {
    try {
      const result = await ingredientService.getIngredientsByCategory();
      res.json(Response.success(result));
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取材料详情
   */
  async getIngredientById(req, res, next) {
    try {
      const ingredient = await ingredientService.getIngredientById(req.params.id);
      res.json(Response.success(ingredient));
    } catch (error) {
      next(error);
    }
  }

  /**
   * 创建材料
   */
  async createIngredient(req, res, next) {
    try {
      const ingredient = await ingredientService.createIngredient(req.body);
      res.json(Response.success(ingredient, '创建成功'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * 更新材料
   */
  async updateIngredient(req, res, next) {
    try {
      const ingredient = await ingredientService.updateIngredient(req.params.id, req.body);
      res.json(Response.success(ingredient, '更新成功'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * 删除材料
   */
  async deleteIngredient(req, res, next) {
    try {
      await ingredientService.deleteIngredient(req.params.id);
      res.json(Response.success(null, '删除成功'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new IngredientController();
