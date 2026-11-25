const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredientController');
const { optionalAuth, requireAdmin } = require('../middlewares/auth');

// 公开接口
router.get('/', optionalAuth, ingredientController.getIngredients);
router.get('/by-category', optionalAuth, ingredientController.getIngredientsByCategory);
router.get('/:id', optionalAuth, ingredientController.getIngredientById);

// 管理端接口（需要管理员权限）
router.post('/', requireAdmin, ingredientController.createIngredient);
router.put('/:id', requireAdmin, ingredientController.updateIngredient);
router.delete('/:id', requireAdmin, ingredientController.deleteIngredient);

module.exports = router;
