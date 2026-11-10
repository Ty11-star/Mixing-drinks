/**
 * 图片上传路由（管理端）
 * 上传的图片保存到 manage/public/images/upload/，与现有静态资源体系一致，
 * 返回可直接用于分类 icon 的相对地址（如 /images/upload/xxx.png）。
 */
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { authenticateToken } = require('../middlewares/auth');
const { success, error } = require('../utils/response');

const router = express.Router();

// 上传目录：manage/public/images/upload（不存在则创建）
const uploadDir = path.resolve(__dirname, '../../../manage/public/images/upload');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const ALLOWED_MIME = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase() || '.png';
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      cb(new Error('仅支持 PNG / JPG / WEBP / GIF / SVG 图片'));
      return;
    }
    cb(null, true);
  },
});

// 所有上传接口均需管理员登录
router.use(authenticateToken);

// 上传分类图标
router.post('/icon', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(error('请选择要上传的图片'));
    }
    const url = `/images/upload/${req.file.filename}`;
    res.json(success({ url }, '上传成功'));
  } catch (err) {
    console.error('上传图标失败:', err);
    res.status(500).json(error('上传失败'));
  }
});

// multer 错误统一处理（文件过大 / 类型不支持等）
router.use((err, req, res, next) => {
  if (err) {
    const msg = err.code === 'LIMIT_FILE_SIZE' ? '图片不能超过 5MB' : err.message;
    return res.status(400).json(error(msg));
  }
  next();
});

module.exports = router;
