const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/auth');

// 管理员登录
router.post('/admin/login', authController.adminLogin);

// 微信小程序登录
router.post('/wechat/login', authController.wechatLogin);

// 更新用户信息（需要认证）
router.put('/user/profile', authenticateToken, authController.updateUserInfo);

// 获取当前用户信息
router.get('/user/me', authenticateToken, authController.getCurrentUser);

module.exports = router;
