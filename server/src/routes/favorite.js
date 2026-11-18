const express = require('express');
const router = express.Router();
const { Favorite, Cocktail } = require('../models');
const { authenticateToken } = require('../middlewares/auth');
const Response = require('../utils/response');

// 获取当前用户的收藏列表
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    // 先查收藏记录，拿到酒谱ID（不连表，避免关联查询问题）
    const favorites = await Favorite.findAll({
      where: { userId },
      attributes: ['cocktailId'],
      order: [['createdAt', 'DESC']]
    });
    const ids = favorites.map(f => f.cocktailId).filter(Boolean);
    if (ids.length === 0) {
      return res.json(Response.success([]));
    }

    // 单独查酒谱。优先带 cover，兼容旧表无 cover 字段的情况
    let cocktails;
    try {
      cocktails = await Cocktail.findAll({
        where: { id: ids },
        attributes: ['id', 'name', 'nameEn', 'baseSpirit', 'glassType', 'difficulty', 'cover', 'tasteTags']
      });
    } catch (e) {
      cocktails = await Cocktail.findAll({
        where: { id: ids },
        attributes: ['id', 'name', 'nameEn', 'baseSpirit', 'glassType', 'difficulty', 'tasteTags']
      });
    }

    const byId = {};
    cocktails.forEach(c => { byId[c.id] = c; });
    const list = ids.map(id => byId[id]).filter(Boolean);
    res.json(Response.success(list));
  } catch (e) {
    const detail = (e.parent && e.parent.sqlMessage) ? e.parent.sqlMessage : e.message;
    return res.json(Response.error('数据库操作失败: ' + detail, 500));
  }
});

// 收藏某个酒谱
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { cocktailId } = req.body;
    if (!cocktailId) {
      return res.json(Response.error('缺少酒谱ID', 400));
    }
    const cocktail = await Cocktail.findByPk(cocktailId);
    if (!cocktail) {
      return res.json(Response.error('酒谱不存在', 404));
    }
    const [favorite, created] = await Favorite.findOrCreate({
      where: { userId, cocktailId },
      defaults: { userId, cocktailId }
    });
    res.json(Response.success({ id: favorite.id, alreadyExists: !created }));
  } catch (e) {
    next(e);
  }
});

// 取消收藏
router.delete('/:cocktailId', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cocktailId = parseInt(req.params.cocktailId, 10);
    if (!cocktailId) {
      return res.json(Response.error('酒谱ID无效', 400));
    }
    const count = await Favorite.destroy({ where: { userId, cocktailId } });
    res.json(Response.success({ deleted: count > 0 }));
  } catch (e) {
    next(e);
  }
});

// 检查是否已收藏（批量）
router.post('/check', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { cocktailIds } = req.body;
    if (!Array.isArray(cocktailIds) || cocktailIds.length === 0) {
      return res.json(Response.success({}));
    }
    const favorites = await Favorite.findAll({
      where: { userId, cocktailId: cocktailIds },
      attributes: ['cocktailId']
    });
    const map = {};
    favorites.forEach(f => { map[f.cocktailId] = true; });
    res.json(Response.success(map));
  } catch (e) {
    next(e);
  }
});

module.exports = router;
