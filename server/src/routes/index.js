const express = require('express');
const router = express.Router();

// 导入各模块路由
const authRoutes = require('./auth');
const cocktailRoutes = require('./cocktails');
const ingredientRoutes = require('./ingredients');
const categoryRoutes = require('./categories');
const adminRoutes = require('./admin');
const userRoutes = require('./users');
const aiRoutes = require('./ai');
const uploadRoutes = require('./upload');

// 注册路由
router.use('/auth', authRoutes);
router.use('/cocktails', cocktailRoutes);
router.use('/ingredients', ingredientRoutes);
router.use('/categories', categoryRoutes);
router.use('/admin', adminRoutes);
router.use('/users', userRoutes);
router.use('/ai', aiRoutes);
router.use('/upload', uploadRoutes);

// 健康检查
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: Date.now(),
    service: 'mixing-drinks-api'
  });
});

module.exports = router;
