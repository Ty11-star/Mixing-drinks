const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken, optionalAuth } = require('../middlewares/auth');

// 公开接口
router.get('/', optionalAuth, categoryController.getCategories);
router.get('/:id', optionalAuth, categoryController.getCategoryById);

// 管理端接口
router.post('/', authenticateToken, categoryController.createCategory);
router.put('/:id', authenticateToken, categoryController.updateCategory);
router.delete('/:id', authenticateToken, categoryController.deleteCategory);

module.exports = router;
