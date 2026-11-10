const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredientController');
const { authenticateToken, optionalAuth } = require('../middlewares/auth');

// 公开接口
router.get('/', optionalAuth, ingredientController.getIngredients);
router.get('/by-category', optionalAuth, ingredientController.getIngredientsByCategory);
router.get('/:id', optionalAuth, ingredientController.getIngredientById);

// 管理端接口
router.post('/', authenticateToken, ingredientController.createIngredient);
router.put('/:id', authenticateToken, ingredientController.updateIngredient);
router.delete('/:id', authenticateToken, ingredientController.deleteIngredient);

module.exports = router;
