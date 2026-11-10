/**
 * 文件上传中间件（multer）
 * 仅允许图片类型，保存到 server/public/uploads，返回 /uploads/xxx.jpg
 */
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, unique + ext);
  },
});

const ALLOWED = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (ALLOWED.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('仅支持 jpg / png / gif / webp 图片'));
    }
  },
});

module.exports = upload;
