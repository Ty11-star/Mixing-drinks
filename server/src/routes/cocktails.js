const express = require('express');
const router = express.Router();
const cocktailController = require('../controllers/cocktailController');
const { optionalAuth, requireAdmin } = require('../middlewares/auth');

// 公开接口（小程序端）
router.get('/', optionalAuth, cocktailController.getCocktails);
router.get('/search', optionalAuth, cocktailController.searchCocktails);
router.get('/:id', optionalAuth, cocktailController.getCocktailById);
router.post('/match', optionalAuth, cocktailController.matchByIngredients);

// 管理端接口（需要管理员权限）
router.post('/', requireAdmin, cocktailController.createCocktail);
router.put('/:id', requireAdmin, cocktailController.updateCocktail);
router.delete('/:id', requireAdmin, cocktailController.deleteCocktail);

module.exports = router;
