const express = require('express');
const router = express.Router();
const cocktailController = require('../controllers/cocktailController');
const { authenticateToken, optionalAuth } = require('../middlewares/auth');

// 公开接口（小程序端）
router.get('/', optionalAuth, cocktailController.getCocktails);
router.get('/search', optionalAuth, cocktailController.searchCocktails);
router.get('/:id', optionalAuth, cocktailController.getCocktailById);
router.post('/match', optionalAuth, cocktailController.matchByIngredients);

// 管理端接口（需要认证）
router.post('/', authenticateToken, cocktailController.createCocktail);
router.put('/:id', authenticateToken, cocktailController.updateCocktail);
router.delete('/:id', authenticateToken, cocktailController.deleteCocktail);

module.exports = router;
