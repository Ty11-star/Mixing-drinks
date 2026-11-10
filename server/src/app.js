const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const { sequelize, testConnection } = require('./config/database');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API 路由
app.use('/api/v1', routes);

// 静态资源：上传图片与素材（如 /uploads/xxx.jpg、/images/xxx.png）
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// 根路径
app.get('/', (req, res) => {
  res.json({
    message: '🍸 调酒小程序 API',
    version: '1.0.0',
    docs: '/api/v1/health'
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: '接口不存在',
    path: req.path
  });
});

// 全局错误处理
app.use(errorHandler);

// 启动服务器
const startServer = async () => {
  try {
    // 测试数据库连接
    await testConnection();

    // 同步数据库模型（开发环境）
    // 注意：不要使用 sync({ alter: true })，它在每次重启时都会重建唯一索引，
    // 导致 admins/ingredients/users 等表索引无限膨胀，最终触发 ER_TOO_MANY_KEYS 无法启动。
    // 表结构变更请使用迁移脚本（如 npm run db:migrate）。
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync();
      console.log('✅ 数据库模型同步完成');
    }

    // 启动服务器
    app.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════════╗
║   🍸 调酒小程序后端服务启动成功         ║
║   Environment: ${process.env.NODE_ENV || 'development'}                    ║
║   Port: ${PORT}                              ║
║   API Base: http://localhost:${PORT}/api/v1  ║
╚══════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ 服务启动失败:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
