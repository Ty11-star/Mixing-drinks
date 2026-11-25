const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { optionalAuth, requireAdmin } = require('../middlewares/auth');

// 公开接口
router.get('/', optionalAuth, categoryController.getCategories);
router.get('/:id', optionalAuth, categoryController.getCategoryById);

// 管理端接口（需要管理员权限）
router.post('/', requireAdmin, categoryController.createCategory);
router.put('/:id', requireAdmin, categoryController.updateCategory);
router.delete('/:id', requireAdmin, categoryController.deleteCategory);

module.exports = router;
