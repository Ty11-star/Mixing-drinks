const express = require('express');
const router = express.Router();
const convenienceController = require('../controllers/convenienceController');

// 小程序端公开读取全部便利店数据（无需认证）
router.get('/', convenienceController.getPublicData);

module.exports = router;
