-- ============================================
-- 新增10款经典鸡尾酒数据
-- 执行日期: 2026-11-17
-- 注意：生产库名为 mixing_drinks（与 deploy/update.sh 的 DB 变量一致），
--   不能使用旧库名 cocktail_db；status 采用 1=启用（与 Sequelize Model/service 一致，
--   后端列表只显示 status=1 的酒谱，写 0 会导致数据入库但前台不可见）
-- 注意：列清单以 server/src/models/Cocktail.js 为准（生产库与本地库均按 Model 同步生成），
--   不含 ice_type/garnish 等仅存在于 database/schema.sql 的列——按 schema 列写入会报
--   Unknown column；冰型、装饰、酒精度信息已并入 tips 与步骤描述
-- ============================================

USE `mixing_drinks`;

-- ============================================
-- 18. 曼哈顿 (Manhattan)
-- ============================================
INSERT INTO `cocktails` (`name`, `name_en`, `description`, `difficulty`, `base_spirit`, `taste_tags`, `glass_type`, `method`, `tips`, `sort_order`, `status`) VALUES
('曼哈顿', 'Manhattan', '被誉为"鸡尾酒之王"，以威士忌为基酒，搭配甜味美思酒和安格斯图拉苦精，口感醇厚复杂。', 2, '威士忌', '醇厚,微苦,甜', '鸡尾酒杯', 'stir', '使用黑麦威士忌风味更佳，搅拌时要充分冰镇但不要过度稀释。樱桃要用maraschino樱桃。', 95, 1);

SET @manhattan_id = LAST_INSERT_ID();

INSERT INTO `cocktail_ingredients` (`cocktail_id`, `ingredient_id`, `amount`, `is_optional`, `sort_order`) VALUES
(@manhattan_id, 3, '60ml', 0, 1),   -- 威士忌
(@manhattan_id, 10, '30ml', 0, 2),  -- 甜味美思
(@manhattan_id, 32, '2滴', 0, 3),   -- 安格斯图拉苦精
(@manhattan_id, 49, '适量', 0, 4);  -- 冰块

INSERT INTO `cocktail_steps` (`cocktail_id`, `step_number`, `description`) VALUES
(@manhattan_id, 1, '在调酒杯中加入冰块'),
(@manhattan_id, 2, '倒入威士忌、甜味美思和安格斯图拉苦精'),
(@manhattan_id, 3, '用吧匙顺时针搅拌约30秒，充分冰镇'),
(@manhattan_id, 4, '滤掉冰块，倒入冰镇的鸡尾酒杯中'),
(@manhattan_id, 5, '用樱桃和橙皮装饰');

INSERT INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(@manhattan_id, 5),  -- 威士忌
(@manhattan_id, 8),  -- 浓烈
(@manhattan_id, 14); -- 中等

-- ============================================
-- 19. 马天尼 (Martini)
-- ============================================
INSERT INTO `cocktails` (`name`, `name_en`, `description`, `difficulty`, `base_spirit`, `taste_tags`, `glass_type`, `method`, `tips`, `sort_order`, `status`) VALUES
('马天尼', 'Martini', '最经典的鸡尾酒，被誉为"鸡尾酒之王"。金酒与干味美思的完美比例，优雅而纯粹。', 3, '金酒', '干爽,清冽', '马天尼杯', 'stir', '金酒与干味美思的比例可根据喜好调整，传统为2:1到6:1。搅拌要轻柔但充分，保持酒体清澈。', 94, 1);

SET @martini_id = LAST_INSERT_ID();

INSERT INTO `cocktail_ingredients` (`cocktail_id`, `ingredient_id`, `amount`, `is_optional`, `sort_order`) VALUES
(@martini_id, 5, '60ml', 0, 1),    -- 金酒
(@martini_id, 11, '10ml', 0, 2),   -- 干味美思
(@martini_id, 61, '1颗', 0, 3),    -- 橄榄
(@martini_id, 49, '适量', 0, 4);   -- 冰块

INSERT INTO `cocktail_steps` (`cocktail_id`, `step_number`, `description`) VALUES
(@martini_id, 1, '在调酒杯中加满冰块'),
(@martini_id, 2, '倒入金酒和干味美思'),
(@martini_id, 3, '用吧匙轻柔搅拌30-40秒'),
(@martini_id, 4, '滤入冰镇的马天尼杯中'),
(@martini_id, 5, '用橄榄或柠檬皮装饰');

INSERT INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(@martini_id, 3),  -- 金酒
(@martini_id, 8),  -- 浓烈
(@martini_id, 15); -- 复杂

-- ============================================
-- 20. 白俄罗斯 (White Russian)
-- ============================================
INSERT INTO `cocktails` (`name`, `name_en`, `description`, `difficulty`, `base_spirit`, `taste_tags`, `glass_type`, `method`, `tips`, `sort_order`, `status`) VALUES
('白俄罗斯', 'White Russian', '电影《谋杀绿脚趾》中主角最爱的鸡尾酒，奶油般丝滑的口感，带有咖啡和伏特加的完美平衡。', 1, '伏特加', '香甜,奶香,咖啡', '古典杯', 'build', '可以用鲜奶油代替奶油利口酒，口感会更清爽。也可在上层浮一层奶油，不搅拌饮用。', 93, 1);

SET @white_russian_id = LAST_INSERT_ID();

INSERT INTO `cocktail_ingredients` (`cocktail_id`, `ingredient_id`, `amount`, `is_optional`, `sort_order`) VALUES
(@white_russian_id, 1, '45ml', 0, 1),   -- 伏特加
(@white_russian_id, 7, '30ml', 0, 2),   -- 咖啡利口酒
(@white_russian_id, 16, '30ml', 0, 3),  -- 鲜奶油
(@white_russian_id, 49, '适量', 0, 4);  -- 冰块

INSERT INTO `cocktail_steps` (`cocktail_id`, `step_number`, `description`) VALUES
(@white_russian_id, 1, '在古典杯中加入冰块'),
(@white_russian_id, 2, '倒入伏特加和咖啡利口酒'),
(@white_russian_id, 3, '轻轻搅拌均匀'),
(@white_russian_id, 4, '慢慢倒入鲜奶油，制作分层效果'),
(@white_russian_id, 5, '可搅拌后饮用，也可直接品尝分层口感');

INSERT INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(@white_russian_id, 1),  -- 伏特加
(@white_russian_id, 9),  -- 香甜
(@white_russian_id, 13); -- 简单

-- ============================================
-- 21. 侧车 (Sidecar)
-- ============================================
INSERT INTO `cocktails` (`name`, `name_en`, `description`, `difficulty`, `base_spirit`, `taste_tags`, `glass_type`, `method`, `tips`, `sort_order`, `status`) VALUES
('侧车', 'Sidecar', '诞生于一战后巴黎的经典酒款，以白兰地为基底，酸甜平衡，杯口糖边是其特色。', 2, '白兰地', '酸甜,果香', '鸡尾酒杯', 'shake', '糖边制作与玛格丽特类似，可用白砂糖或细砂糖。白兰地推荐使用干邑。', 92, 1);

SET @sidecar_id = LAST_INSERT_ID();

INSERT INTO `cocktail_ingredients` (`cocktail_id`, `ingredient_id`, `amount`, `is_optional`, `sort_order`) VALUES
(@sidecar_id, 4, '45ml', 0, 1),    -- 白兰地
(@sidecar_id, 9, '20ml', 0, 2),    -- 橙味利口酒
(@sidecar_id, 14, '20ml', 0, 3),   -- 柠檬汁
(@sidecar_id, 43, '适量', 0, 4),   -- 白糖（糖边用）
(@sidecar_id, 49, '适量', 0, 5);   -- 冰块

INSERT INTO `cocktail_steps` (`cocktail_id`, `step_number`, `description`) VALUES
(@sidecar_id, 1, '用柠檬片擦拭鸡尾酒杯口，蘸取细砂糖制作糖边'),
(@sidecar_id, 2, '在调酒壶中加入冰块'),
(@sidecar_id, 3, '倒入白兰地、橙味利口酒和柠檬汁'),
(@sidecar_id, 4, '用力摇匀约15秒'),
(@sidecar_id, 5, '双重过滤倒入准备好的杯中，用橙皮装饰');

INSERT INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(@sidecar_id, 6),  -- 白兰地
(@sidecar_id, 7),  -- 清爽
(@sidecar_id, 14); -- 中等

-- ============================================
-- 22. 薄荷朱利普 (Mint Julep)
-- ============================================
INSERT INTO `cocktails` (`name`, `name_en`, `description`, `difficulty`, `base_spirit`, `taste_tags`, `glass_type`, `method`, `tips`, `sort_order`, `status`) VALUES
('薄荷朱利普', 'Mint Julep', '肯塔基赛马会的官方鸡尾酒，波本威士忌与新鲜薄荷的完美融合，清凉提神。', 2, '威士忌', '清爽,薄荷,微甜', '朱利普杯', 'muddle', '使用银制朱利普杯效果最佳，碎冰要尽量细碎。薄荷叶要用手掌拍打释放香气。', 91, 1);

SET @julep_id = LAST_INSERT_ID();

INSERT INTO `cocktail_ingredients` (`cocktail_id`, `ingredient_id`, `amount`, `is_optional`, `sort_order`) VALUES
(@julep_id, 3, '60ml', 0, 1),      -- 波本威士忌
(@julep_id, 38, '15ml', 0, 2),     -- 糖浆
(@julep_id, 54, '8-10片', 0, 3),   -- 薄荷叶
(@julep_id, 49, '适量', 0, 4);     -- 碎冰

INSERT INTO `cocktail_steps` (`cocktail_id`, `step_number`, `description`) VALUES
(@julep_id, 1, '在朱利普杯中放入薄荷叶和糖浆'),
(@julep_id, 2, '用捣棒轻轻按压薄荷叶释放香气，不要捣碎'),
(@julep_id, 3, '加满碎冰至杯口'),
(@julep_id, 4, '倒入波本威士忌'),
(@julep_id, 5, '用吧匙充分搅拌至杯外结霜'),
(@julep_id, 6, '再加碎冰至杯口溢出，插入薄荷枝装饰');

INSERT INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(@julep_id, 5),  -- 威士忌
(@julep_id, 7),  -- 清爽
(@julep_id, 14); -- 中等

-- ============================================
-- 23. 黑俄罗斯 (Black Russian)
-- ============================================
INSERT INTO `cocktails` (`name`, `name_en`, `description`, `difficulty`, `base_spirit`, `taste_tags`, `glass_type`, `method`, `tips`, `sort_order`, `status`) VALUES
('黑俄罗斯', 'Black Russian', '白俄罗斯的前身，更简单直接的配方，伏特加与咖啡利口酒的经典组合。', 1, '伏特加', '香甜,咖啡', '古典杯', 'build', '选用优质咖啡利口酒（如Kahlúa）会让口感更佳。可根据喜好调整两者比例。', 90, 1);

SET @black_russian_id = LAST_INSERT_ID();

INSERT INTO `cocktail_ingredients` (`cocktail_id`, `ingredient_id`, `amount`, `is_optional`, `sort_order`) VALUES
(@black_russian_id, 1, '45ml', 0, 1),   -- 伏特加
(@black_russian_id, 7, '30ml', 0, 2),   -- 咖啡利口酒
(@black_russian_id, 49, '适量', 0, 3);  -- 冰块

INSERT INTO `cocktail_steps` (`cocktail_id`, `step_number`, `description`) VALUES
(@black_russian_id, 1, '在古典杯中加入冰块'),
(@black_russian_id, 2, '倒入伏特加'),
(@black_russian_id, 3, '加入咖啡利口酒'),
(@black_russian_id, 4, '轻轻搅拌均匀即可');

INSERT INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(@black_russian_id, 1),  -- 伏特加
(@black_russian_id, 9),  -- 香甜
(@black_russian_id, 13); -- 简单

-- ============================================
-- 24. 新加坡司令 (Singapore Sling)
-- ============================================
INSERT INTO `cocktails` (`name`, `name_en`, `description`, `difficulty`, `base_spirit`, `taste_tags`, `glass_type`, `method`, `tips`, `sort_order`, `status`) VALUES
('新加坡司令', 'Singapore Sling', '诞生于新加坡莱佛士酒店的传奇鸡尾酒，色泽艳丽，口感复杂多层次。', 3, '金酒', '果香,酸甜,复杂', '高球杯', 'shake', '配方众多，此为接近原版的配方。樱桃白兰地可用樱桃利口酒代替。', 89, 1);

SET @sling_id = LAST_INSERT_ID();

INSERT INTO `cocktail_ingredients` (`cocktail_id`, `ingredient_id`, `amount`, `is_optional`, `sort_order`) VALUES
(@sling_id, 5, '30ml', 0, 1),      -- 金酒
(@sling_id, 8, '15ml', 0, 2),      -- 樱桃白兰地
(@sling_id, 9, '8ml', 0, 3),       -- 橙味利口酒
(@sling_id, 14, '15ml', 0, 4),     -- 柠檬汁
(@sling_id, 17, '60ml', 0, 5),     -- 菠萝汁
(@sling_id, 33, '10ml', 0, 6),     -- 石榴糖浆
(@sling_id, 32, '1滴', 0, 7),      -- 安格斯图拉苦精
(@sling_id, 49, '适量', 0, 8);     -- 冰块

INSERT INTO `cocktail_steps` (`cocktail_id`, `step_number`, `description`) VALUES
(@sling_id, 1, '在调酒壶中加入冰块'),
(@sling_id, 2, '倒入金酒、樱桃白兰地、橙味利口酒、柠檬汁和菠萝汁'),
(@sling_id, 3, '充分摇匀约10秒'),
(@sling_id, 4, '滤入装有冰块的高球杯中'),
(@sling_id, 5, '慢慢倒入石榴糖浆制作渐变效果'),
(@sling_id, 6, '在顶部加一滴安格斯图拉苦精'),
(@sling_id, 7, '用樱桃、菠萝片和橙片装饰');

INSERT INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(@sling_id, 3),  -- 金酒
(@sling_id, 9),  -- 香甜
(@sling_id, 15); -- 复杂

-- ============================================
-- 25. 青草蚱蜢 (Grasshopper)
-- ============================================
INSERT INTO `cocktails` (`name`, `name_en`, `description`, `difficulty`, `base_spirit`, `taste_tags`, `glass_type`, `method`, `tips`, `sort_order`, `status`) VALUES
('青草蚱蜢', 'Grasshopper', '薄荷巧克力风味的甜美鸡尾酒，色泽翠绿，口感如奶昔般丝滑，适合餐后饮用。', 1, '利口酒', '香甜,薄荷,奶香', '鸡尾酒杯', 'shake', '摇匀时间要久一点，让奶油充分乳化。可以加少量碎冰混合摇制，口感更冰爽。', 88, 1);

SET @grasshopper_id = LAST_INSERT_ID();

INSERT INTO `cocktail_ingredients` (`cocktail_id`, `ingredient_id`, `amount`, `is_optional`, `sort_order`) VALUES
(@grasshopper_id, 62, '30ml', 0, 1),   -- 绿薄荷利口酒
(@grasshopper_id, 63, '30ml', 0, 2),   -- 白可可利口酒
(@grasshopper_id, 16, '30ml', 0, 3),   -- 鲜奶油
(@grasshopper_id, 49, '适量', 0, 4);   -- 冰块

INSERT INTO `cocktail_steps` (`cocktail_id`, `step_number`, `description`) VALUES
(@grasshopper_id, 1, '在调酒壶中加入冰块'),
(@grasshopper_id, 2, '倒入绿薄荷利口酒、白可可利口酒和鲜奶油'),
(@grasshopper_id, 3, '用力摇匀约20秒，让奶油充分乳化'),
(@grasshopper_id, 4, '双重过滤倒入冰镇的鸡尾酒杯中'),
(@grasshopper_id, 5, '用薄荷叶和巧克力碎装饰');

INSERT INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(@grasshopper_id, 12), -- 其他
(@grasshopper_id, 9),  -- 香甜
(@grasshopper_id, 13); -- 简单

-- ============================================
-- 26. 教父 (Godfather)
-- ============================================
INSERT INTO `cocktails` (`name`, `name_en`, `description`, `difficulty`, `base_spirit`, `taste_tags`, `glass_type`, `method`, `tips`, `sort_order`, `status`) VALUES
('教父', 'Godfather', '电影《教父》同名鸡尾酒，苏格兰威士忌与杏仁利口酒的简约组合，口感醇厚带杏仁香。', 1, '威士忌', '醇厚,杏仁,微甜', '古典杯', 'build', '威士忌与杏仁利口酒的比例可调整，喜欢更甜可以增加杏仁利口酒。也可用波本代替苏格兰威士忌。', 87, 1);

SET @godfather_id = LAST_INSERT_ID();

INSERT INTO `cocktail_ingredients` (`cocktail_id`, `ingredient_id`, `amount`, `is_optional`, `sort_order`) VALUES
(@godfather_id, 3, '45ml', 0, 1),      -- 威士忌
(@godfather_id, 64, '30ml', 0, 2),     -- 杏仁利口酒（Amaretto）
(@godfather_id, 49, '适量', 0, 3);     -- 冰块

INSERT INTO `cocktail_steps` (`cocktail_id`, `step_number`, `description`) VALUES
(@godfather_id, 1, '在古典杯中加入大冰块'),
(@godfather_id, 2, '倒入苏格兰威士忌'),
(@godfather_id, 3, '加入杏仁利口酒'),
(@godfather_id, 4, '轻轻搅拌均匀'),
(@godfather_id, 5, '用橙皮装饰，或挤压橙皮喷出精油');

INSERT INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(@godfather_id, 5),  -- 威士忌
(@godfather_id, 8),  -- 浓烈
(@godfather_id, 13); -- 简单

-- ============================================
-- 27. 帕洛玛 (Paloma)
-- ============================================
INSERT INTO `cocktails` (`name`, `name_en`, `description`, `difficulty`, `base_spirit`, `taste_tags`, `glass_type`, `method`, `tips`, `sort_order`, `status`) VALUES
('帕洛玛', 'Paloma', '在墨西哥比玛格丽特更受欢迎的龙舌兰鸡尾酒，清爽的西柚汁与龙舌兰完美搭配。', 1, '龙舌兰', '清爽,西柚,微咸', '高球杯', 'build', '推荐使用新鲜西柚汁，若用气泡西柚汽水口感会更清爽。盐边是可选项。', 86, 1);

SET @paloma_id = LAST_INSERT_ID();

INSERT INTO `cocktail_ingredients` (`cocktail_id`, `ingredient_id`, `amount`, `is_optional`, `sort_order`) VALUES
(@paloma_id, 6, '50ml', 0, 1),     -- 龙舌兰
(@paloma_id, 15, '80ml', 0, 2),    -- 西柚汁
(@paloma_id, 13, '15ml', 0, 3),    -- 青柠汁
(@paloma_id, 38, '10ml', 1, 4),    -- 糖浆（可选）
(@paloma_id, 44, '少许', 1, 5),    -- 盐（盐边，可选）
(@paloma_id, 49, '适量', 0, 6);    -- 冰块

INSERT INTO `cocktail_steps` (`cocktail_id`, `step_number`, `description`) VALUES
(@paloma_id, 1, '可选：用青柠片擦拭杯口后蘸盐制作盐边'),
(@paloma_id, 2, '在高球杯中加入冰块'),
(@paloma_id, 3, '倒入龙舌兰和青柠汁'),
(@paloma_id, 4, '加入西柚汁（或气泡西柚汽水）'),
(@paloma_id, 5, '根据口味加入少许糖浆'),
(@paloma_id, 6, '轻轻搅拌，用西柚片装饰');

INSERT INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(@paloma_id, 4),  -- 龙舌兰
(@paloma_id, 7),  -- 清爽
(@paloma_id, 13); -- 简单

-- ============================================
-- 结束标记
-- ============================================
-- 成功新增10款经典鸡尾酒：
-- 18. 曼哈顿 (Manhattan)
-- 19. 马天尼 (Martini)
-- 20. 白俄罗斯 (White Russian)
-- 21. 侧车 (Sidecar)
-- 22. 薄荷朱利普 (Mint Julep)
-- 23. 黑俄罗斯 (Black Russian)
-- 24. 新加坡司令 (Singapore Sling)
-- 25. 青草蚱蜢 (Grasshopper)
-- 26. 教父 (Godfather)
-- 27. 帕洛玛 (Paloma)
