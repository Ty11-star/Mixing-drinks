-- ============================================================
-- 008_fix_convenience_image.sql
-- 修复已创建的便利店表：补充 Sequelize 模型需要的 image 列
-- 可重复执行（列已存在时自动跳过）
-- ============================================================
SET NAMES utf8mb4;

-- 材料表 image 列
SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'convenience_materials'
     AND COLUMN_NAME = 'image') = 0,
  'ALTER TABLE `convenience_materials` ADD COLUMN `image` VARCHAR(200) DEFAULT NULL COMMENT "材料图片URL" AFTER `category`',
  'SELECT 1'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 配方表 image 列
SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'convenience_drinks'
     AND COLUMN_NAME = 'image') = 0,
  'ALTER TABLE `convenience_drinks` ADD COLUMN `image` VARCHAR(200) DEFAULT NULL COMMENT "配方图片URL" AFTER `tag`',
  'SELECT 1'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
