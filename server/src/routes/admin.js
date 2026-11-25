const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const statsController = require('../controllers/statsController');
const cocktailController = require('../controllers/cocktailController');
const uploadController = require('../controllers/uploadController');
const convenienceController = require('../controllers/convenienceController');
const upload = require('../middlewares/upload');
const { requireAdmin } = require('../middlewares/auth');

// 管理员登录
router.post('/login', adminController.login);

// 图片上传（封面等）
router.post('/upload', requireAdmin, upload.single('file'), uploadController.uploadImage);

// 获取当前管理员信息（需要认证）
router.get('/profile', requireAdmin, adminController.getProfile);

// 退出登录
router.post('/logout', requireAdmin, adminController.logout);

// 数据看板统计
router.get('/stats/dashboard', requireAdmin, statsController.getDashboardStats);

// 酒谱管理
router.get('/cocktails/:id', requireAdmin, cocktailController.getAdminCocktailById);
router.post('/cocktails', requireAdmin, adminController.createCocktail);
router.put('/cocktails/:id', requireAdmin, adminController.updateCocktail);
router.delete('/cocktails/:id', requireAdmin, adminController.deleteCocktail);
router.post('/cocktails/batch-delete', requireAdmin, adminController.batchDeleteCocktails);
router.put('/cocktails/:id/status', requireAdmin, adminController.updateCocktailStatus);

// 材料管理
router.post('/ingredients', requireAdmin, adminController.createIngredient);
router.put('/ingredients/:id', requireAdmin, adminController.updateIngredient);
router.delete('/ingredients/:id', requireAdmin, adminController.deleteIngredient);
router.post('/ingredients/batch-delete', requireAdmin, adminController.batchDeleteIngredients);

// 分类管理
router.post('/categories', requireAdmin, adminController.createCategory);
router.put('/categories/:id', requireAdmin, adminController.updateCategory);
router.delete('/categories/:id', requireAdmin, adminController.deleteCategory);

// 便利店调酒管理
router.get('/convenience/drinks', requireAdmin, convenienceController.drinks.list);
router.post('/convenience/drinks', requireAdmin, convenienceController.drinks.create);
router.put('/convenience/drinks/:id', requireAdmin, convenienceController.drinks.update);
router.delete('/convenience/drinks/:id', requireAdmin, convenienceController.drinks.remove);
router.put('/convenience/drinks/:id/status', requireAdmin, convenienceController.toggleDrinkStatus);

router.get('/convenience/materials', requireAdmin, convenienceController.materials.list);
router.post('/convenience/materials', requireAdmin, convenienceController.materials.create);
router.put('/convenience/materials/:id', requireAdmin, convenienceController.materials.update);
router.delete('/convenience/materials/:id', requireAdmin, convenienceController.materials.remove);

router.get('/convenience/pitfalls', requireAdmin, convenienceController.pitfalls.list);
router.post('/convenience/pitfalls', requireAdmin, convenienceController.pitfalls.create);
router.put('/convenience/pitfalls/:id', requireAdmin, convenienceController.pitfalls.update);
router.delete('/convenience/pitfalls/:id', requireAdmin, convenienceController.pitfalls.remove);

module.exports = router;
