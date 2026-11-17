-- ============================================
-- 修复鸡尾酒分类错误
-- 执行日期: 2026-11-17
-- 说明: 检查并修正基酒与分类不一致的问题
-- ============================================

USE `mixing_drinks`;

-- 查看当前所有鸡尾酒的基酒和分类对应关系
-- SELECT 
--   c.id, 
--   c.name, 
--   c.base_spirit,
--   GROUP_CONCAT(cat.name ORDER BY cat.id SEPARATOR ', ') as categories,
--   GROUP_CONCAT(cat.id ORDER BY cat.id SEPARATOR ', ') as category_ids
-- FROM cocktails c
-- LEFT JOIN cocktail_categories cc ON c.id = cc.cocktail_id
-- LEFT JOIN categories cat ON cc.category_id = cat.id
-- WHERE c.id >= 18
-- GROUP BY c.id
-- ORDER BY c.id;

-- 修复帕洛玛 (id=29) 的分类
-- 基酒是龙舌兰，应该是 category_id = 4，而不是威士忌(5)

-- 先删除可能错误的分类关联
DELETE FROM `cocktail_categories` WHERE `cocktail_id` = 29 AND `category_id` = 5;

-- 确保正确的分类存在
INSERT IGNORE INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(29, 4),  -- 龙舌兰
(29, 7),  -- 清爽
(29, 13); -- 简单

-- 检查其他可能的不一致问题
-- 曼哈顿 (id=18) - 威士忌基酒
DELETE FROM `cocktail_categories` WHERE `cocktail_id` = 18 AND `category_id` NOT IN (5, 8, 14);
INSERT IGNORE INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(18, 5),  -- 威士忌
(18, 8),  -- 浓烈
(18, 14); -- 中等

-- 马天尼 (id=19) - 金酒基酒
DELETE FROM `cocktail_categories` WHERE `cocktail_id` = 19 AND `category_id` NOT IN (3, 8, 15);
INSERT IGNORE INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(19, 3),  -- 金酒
(19, 8),  -- 浓烈
(19, 15); -- 复杂

-- 白俄罗斯 (id=20) - 伏特加基酒
DELETE FROM `cocktail_categories` WHERE `cocktail_id` = 20 AND `category_id` NOT IN (1, 9, 13);
INSERT IGNORE INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(20, 1),  -- 伏特加
(20, 9),  -- 香甜
(20, 13); -- 简单

-- 侧车 (id=21) - 白兰地基酒
DELETE FROM `cocktail_categories` WHERE `cocktail_id` = 21 AND `category_id` NOT IN (6, 7, 14);
INSERT IGNORE INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(21, 6),  -- 白兰地
(21, 7),  -- 清爽
(21, 14); -- 中等

-- 薄荷朱利普 (id=22) - 威士忌基酒
DELETE FROM `cocktail_categories` WHERE `cocktail_id` = 22 AND `category_id` NOT IN (5, 7, 14);
INSERT IGNORE INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(22, 5),  -- 威士忌
(22, 7),  -- 清爽
(22, 14); -- 中等

-- 黑俄罗斯 (id=23) - 伏特加基酒
DELETE FROM `cocktail_categories` WHERE `cocktail_id` = 23 AND `category_id` NOT IN (1, 9, 13);
INSERT IGNORE INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(23, 1),  -- 伏特加
(23, 9),  -- 香甜
(23, 13); -- 简单

-- 新加坡司令 (id=24) - 金酒基酒
DELETE FROM `cocktail_categories` WHERE `cocktail_id` = 24 AND `category_id` NOT IN (3, 9, 15);
INSERT IGNORE INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(24, 3),  -- 金酒
(24, 9),  -- 香甜
(24, 15); -- 复杂

-- 青草蚱蜢 (id=25) - 利口酒基酒(其他)
DELETE FROM `cocktail_categories` WHERE `cocktail_id` = 25 AND `category_id` NOT IN (12, 9, 13);
INSERT IGNORE INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(25, 12), -- 其他
(25, 9),  -- 香甜
(25, 13); -- 简单

-- 教父 (id=26) - 威士忌基酒
DELETE FROM `cocktail_categories` WHERE `cocktail_id` = 26 AND `category_id` NOT IN (5, 8, 13);
INSERT IGNORE INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(26, 5),  -- 威士忌
(26, 8),  -- 浓烈
(26, 13); -- 简单

-- 验证修复结果
SELECT 
  c.id, 
  c.name, 
  c.base_spirit,
  GROUP_CONCAT(cat.name ORDER BY cat.id SEPARATOR ', ') as categories
FROM cocktails c
LEFT JOIN cocktail_categories cc ON c.id = cc.cocktail_id
LEFT JOIN categories cat ON cc.category_id = cat.id
WHERE c.id >= 18
GROUP BY c.id
ORDER BY c.id;
