const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const statsController = require('../controllers/statsController');
const cocktailController = require('../controllers/cocktailController');
const uploadController = require('../controllers/uploadController');
const upload = require('../middlewares/upload');
const { authenticateToken } = require('../middlewares/auth');

// 管理员登录
router.post('/login', adminController.login);

// 图片上传（封面等）
router.post('/upload', authenticateToken, upload.single('file'), uploadController.uploadImage);

// 获取当前管理员信息（需要认证）
router.get('/profile', authenticateToken, adminController.getProfile);

// 退出登录
router.post('/logout', authenticateToken, adminController.logout);

// 数据看板统计
router.get('/stats/dashboard', authenticateToken, statsController.getDashboardStats);

// 酒谱管理
router.get('/cocktails/:id', authenticateToken, cocktailController.getAdminCocktailById);
router.post('/cocktails', authenticateToken, adminController.createCocktail);
router.put('/cocktails/:id', authenticateToken, adminController.updateCocktail);
router.delete('/cocktails/:id', authenticateToken, adminController.deleteCocktail);
router.post('/cocktails/batch-delete', authenticateToken, adminController.batchDeleteCocktails);
router.put('/cocktails/:id/status', authenticateToken, adminController.updateCocktailStatus);

// 材料管理
router.post('/ingredients', authenticateToken, adminController.createIngredient);
router.put('/ingredients/:id', authenticateToken, adminController.updateIngredient);
router.delete('/ingredients/:id', authenticateToken, adminController.deleteIngredient);
router.post('/ingredients/batch-delete', authenticateToken, adminController.batchDeleteIngredients);

// 分类管理
router.post('/categories', authenticateToken, adminController.createCategory);
router.put('/categories/:id', authenticateToken, adminController.updateCategory);
router.delete('/categories/:id', authenticateToken, adminController.deleteCategory);

module.exports = router;
