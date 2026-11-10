const cocktailService = require('../services/cocktailService');
const Response = require('../utils/response');

class CocktailController {
  /**
   * 获取酒谱列表
   */
  async getCocktails(req, res, next) {
    try {
      const result = await cocktailService.getCocktails(req.query);
      res.json(Response.page(result.list, result.total, result.page, result.pageSize));
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取酒谱详情
   */
  async getCocktailById(req, res, next) {
    try {
      const cocktail = await cocktailService.getCocktailById(req.params.id);
      res.json(Response.success(cocktail));
    } catch (error) {
      next(error);
    }
  }

  /**
   * 管理端获取酒谱详情（包含禁用状态）
   */
  async getAdminCocktailById(req, res, next) {
    try {
      const cocktail = await cocktailService.getCocktailById(req.params.id, true);
      res.json(Response.success(cocktail));
    } catch (error) {
      next(error);
    }
  }

  /**
   * 创建酒谱
   */
  async createCocktail(req, res, next) {
    try {
      const cocktail = await cocktailService.createCocktail(req.body);
      res.json(Response.success(cocktail, '创建成功'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * 更新酒谱
   */
  async updateCocktail(req, res, next) {
    try {
      const cocktail = await cocktailService.updateCocktail(req.params.id, req.body);
      res.json(Response.success(cocktail, '更新成功'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * 删除酒谱
   */
  async deleteCocktail(req, res, next) {
    try {
      await cocktailService.deleteCocktail(req.params.id);
      res.json(Response.success(null, '删除成功'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * 搜索酒谱
   */
  async searchCocktails(req, res, next) {
    try {
      const { keyword, ...params } = req.query;
      if (!keyword) {
        return res.json(Response.error('请提供搜索关键词', 400));
      }

      const result = await cocktailService.searchCocktails(keyword, params);
      res.json(Response.page(result.list, result.total, result.page, result.pageSize));
    } catch (error) {
      next(error);
    }
  }

  /**
   * 根据材料匹配酒谱
   */
  async matchByIngredients(req, res, next) {
    try {
      const { ingredientIds } = req.body;

      if (!ingredientIds || !Array.isArray(ingredientIds) || ingredientIds.length === 0) {
        return res.json(Response.error('请提供材料ID列表', 400));
      }

      const result = await cocktailService.matchByIngredients(ingredientIds);
      res.json(Response.success(result));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CocktailController();
