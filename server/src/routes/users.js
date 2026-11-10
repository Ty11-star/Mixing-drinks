const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/auth');

// 所有用户相关接口均需管理员登录
router.use(authenticateToken);

// 用户列表
router.get('/', userController.getUsers);

// 删除用户
router.delete('/:id', userController.deleteUser);

module.exports = router;
