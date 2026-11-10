/**
 * 数据库迁移脚本：为 cocktails 表补充 cover（封面图）字段
 * 适用于生产环境（NODE_ENV != development 时 app.js 不会自动 alter 同步）。
 * 用法：npm run db:migrate
 */
require('dotenv').config();
const { sequelize } = require('../config/database');

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.query(
      "ALTER TABLE cocktails ADD COLUMN cover VARCHAR(255) NULL COMMENT '封面图地址' AFTER status"
    );
    console.log('✅ 已为 cocktails 表添加 cover 字段');
  } catch (err) {
    if (String(err.message).includes('Duplicate column')) {
      console.log('ℹ️ cover 字段已存在，跳过');
    } else {
      console.error('❌ 添加 cover 字段失败:', err.message);
      process.exit(1);
    }
  } finally {
    await sequelize.close();
  }
})();
