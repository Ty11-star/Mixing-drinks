-- ============================================
-- 调酒小程序示例酒谱数据
-- 数据库: cocktail_db
-- 版本: v1.0
-- 创建日期: 2026-10-26
-- ============================================
-- 说明：本脚本插入15款经典鸡尾酒示例数据
-- 执行前请先执行 schema.sql 创建表结构和基础数据
-- ============================================

USE `cocktail_db`;

-- ============================================
-- 1. 莫吉托 (Mojito)
-- ============================================
INSERT INTO `cocktails` (`name`, `name_en`, `description`, `difficulty`, `base_spirit`, `taste_tags`, `glass_type`, `method`, `tips`, `ice_type`, `garnish`, `alcohol_content`, `origin`, `sort_order`, `status`) VALUES
('莫吉托', 'Mojito', '源自古巴的经典鸡尾酒，清爽的薄荷香气搭配朗姆酒的甜润，是夏日最受欢迎的饮品之一。', 1, '朗姆酒', '清爽,薄荷,微甜', '高球杯', 'build', '不要过度捣碎薄荷叶，轻轻按压即可，否则会产生苦味。', '碎冰', '薄荷叶,青柠片', '低度', '古巴', 100, 0);

SET @mojito_id = LAST_INSERT_ID();

-- 莫吉托材料
INSERT INTO `cocktail_ingredients` (`cocktail_id`, `ingredient_id`, `amount`, `is_optional`, `sort_order`) VALUES
(@mojito_id, 2, '45ml', 0, 1),  -- 白朗姆酒
(@mojito_id, 13, '20ml', 0, 2), -- 青柠汁
(@mojito_id, 20, '适量', 0, 3), -- 苏打水
(@mojito_id, 43, '2勺', 0, 4),  -- 白糖
(@mojito_id, 54, '8-10片', 0, 5), -- 薄荷叶
(@mojito_id, 49, '适量', 0, 6);  -- 冰块

-- 莫吉托步骤
INSERT INTO `cocktail_steps` (`cocktail_id`, `step_number`, `description`, `duration`) VALUES
(@mojito_id, 1, '在高球杯中放入薄荷叶和白糖，用捣棒轻轻按压薄荷叶释放香气', '30秒'),
(@mojito_id, 2, '加入新鲜青柠汁，轻轻搅拌使糖溶解', '20秒'),
(@mojito_id, 3, '加入碎冰至杯子八分满', '10秒'),
(@mojito_id, 4, '倒入白朗姆酒，轻轻搅拌均匀', '15秒'),
(@mojito_id, 5, '加满苏打水，用薄荷叶和青柠片装饰即可', '10秒');

-- 莫吉托分类关联
INSERT INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(@mojito_id, 2),  -- 朗姆酒
(@mojito_id, 7),  -- 清爽
(@mojito_id, 13); -- 简单

-- ============================================
-- 2. 金汤力 (Gin & Tonic)
-- ============================================
INSERT INTO `cocktails` (`name`, `name_en`, `description`, `difficulty`, `base_spirit`, `taste_tags`, `glass_type`, `method`, `tips`, `ice_type`, `garnish`, `alcohol_content`, `origin`, `sort_order`, `status`) VALUES
('金汤力', 'Gin & Tonic', '简单优雅的经典鸡尾酒，金酒的植物香气与汤力水的奎宁苦味完美结合，清爽宜人。', 1, '金酒', '清爽,微苦', '高球杯', 'build', '使用优质汤力水能大幅提升口感，加入青柠片可增加清新感。', '冰块', '青柠片', '中度', '英国', 99, 0);

SET @gin_tonic_id = LAST_INSERT_ID();

INSERT INTO `cocktail_ingredients` (`cocktail_id`, `ingredient_id`, `amount`, `is_optional`, `sort_order`) VALUES
(@gin_tonic_id, 5, '50ml', 0, 1),   -- 金酒
(@gin_tonic_id, 21, '150ml', 0, 2), -- 汤力水
(@gin_tonic_id, 55, '1片', 0, 3),   -- 青柠片
(@gin_tonic_id, 49, '适量', 0, 4);  -- 冰块

INSERT INTO `cocktail_steps` (`cocktail_id`, `step_number`, `description`) VALUES
(@gin_tonic_id, 1, '在高球杯中加入冰块至七分满'),
(@gin_tonic_id, 2, '倒入金酒'),
(@gin_tonic_id, 3, '加满汤力水，轻轻搅拌'),
(@gin_tonic_id, 4, '放入青柠片装饰即可');

INSERT INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(@gin_tonic_id, 3),  -- 金酒
(@gin_tonic_id, 7),  -- 清爽
(@gin_tonic_id, 13); -- 简单

-- ============================================
-- 3. 玛格丽特 (Margarita)
-- ============================================
INSERT INTO `cocktails` (`name`, `name_en`, `description`, `difficulty`, `base_spirit`, `taste_tags`, `glass_type`, `method`, `tips`, `ice_type`, `garnish`, `alcohol_content`, `origin`, `sort_order`, `status`) VALUES
('玛格丽特', 'Margarita', '最经典的龙舌兰鸡尾酒，酸甜平衡，杯口的盐边是其标志性特征。', 2, '龙舌兰', '清爽,酸甜', '玛格丽特杯', 'shake', '盐边制作：用青柠片擦拭杯口，然后蘸取细盐。摇酒时要充分摇匀至冰凉。', '冰块', '青柠片,盐边', '中度', '墨西哥', 98, 0);

SET @margarita_id = LAST_INSERT_ID();

INSERT INTO `cocktail_ingredients` (`cocktail_id`, `ingredient_id`, `amount`, `is_optional`, `sort_order`) VALUES
(@margarita_id, 6, '45ml', 0, 1),   -- 龙舌兰
(@margarita_id, 9, '20ml', 0, 2),   -- 橙味利口酒
(@margarita_id, 13, '20ml', 0, 3),  -- 青柠汁
(@margarita_id, 44, '适量', 0, 4),  -- 盐
(@margarita_id, 49, '适量', 0, 5);  -- 冰块

INSERT INTO `cocktail_steps` (`cocktail_id`, `step_number`, `description`) VALUES
(@margarita_id, 1, '用青柠片擦拭玛格丽特杯口，然后将杯口蘸取细盐制作盐边'),
(@margarita_id, 2, '在调酒壶中加入冰块、龙舌兰、橙味利口酒和青柠汁'),
(@margarita_id, 3, '充分摇匀约15秒，直至调酒壶外壁结霜'),
(@margarita_id, 4, '滤掉冰块，将酒液倒入准备好的杯中'),
(@margarita_id, 5, '用青柠片装饰杯口');

INSERT INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(@margarita_id, 4),  -- 龙舌兰
(@margarita_id, 7),  -- 清爽
(@margarita_id, 14); -- 中等

-- ============================================
-- 4. 血腥玛丽 (Bloody Mary)
-- ============================================
INSERT INTO `cocktails` (`name`, `name_en`, `description`, `difficulty`, `base_spirit`, `taste_tags`, `glass_type`, `method`, `tips`, `ice_type`, `garnish`, `alcohol_content`, `origin`, `sort_order`, `status`) VALUES
('血腥玛丽', 'Bloody Mary', '以番茄汁为基底的咸鲜口味鸡尾酒，常作为早午餐饮品，被誉为"能喝的沙拉"。', 1, '伏特加', '咸鲜,微辣', '高球杯', 'build', '调味料可根据个人口味调整，喜欢辣可多加辣椒酱。番茄汁要选用优质产品。', '冰块', '芹菜杆,柠檬片', '低度', '美国', 97, 0);

SET @bloody_mary_id = LAST_INSERT_ID();

INSERT INTO `cocktail_ingredients` (`cocktail_id`, `ingredient_id`, `amount`, `is_optional`, `sort_order`) VALUES
(@bloody_mary_id, 1, '45ml', 0, 1),   -- 伏特加
(@bloody_mary_id, 19, '120ml', 0, 2), -- 番茄汁
(@bloody_mary_id, 14, '15ml', 0, 3),  -- 柠檬汁
(@bloody_mary_id, 46, '2滴', 0, 4),   -- 辣椒酱
(@bloody_mary_id, 47, '2滴', 0, 5),   -- 伍斯特沙司
(@bloody_mary_id, 44, '少许', 0, 6),  -- 盐
(@bloody_mary_id, 45, '少许', 0, 7),  -- 黑胡椒
(@bloody_mary_id, 60, '1根', 0, 8),   -- 芹菜杆
(@bloody_mary_id, 49, '适量', 0, 9);  -- 冰块

INSERT INTO `cocktail_steps` (`cocktail_id`, `step_number`, `description`) VALUES
(@bloody_mary_id, 1, '在高球杯中加入冰块'),
(@bloody_mary_id, 2, '依次加入伏特加、柠檬汁、番茄汁'),
(@bloody_mary_id, 3, '加入辣椒酱、伍斯特沙司、盐和黑胡椒'),
(@bloody_mary_id, 4, '用吧匙轻轻搅拌均匀'),
(@bloody_mary_id, 5, '放入芹菜杆和柠檬片装饰');

INSERT INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(@bloody_mary_id, 1),  -- 伏特加
(@bloody_mary_id, 13); -- 简单

-- ============================================
-- 5. 戴吉里 (Daiquiri)
-- ============================================
INSERT INTO `cocktails` (`name`, `name_en`, `description`, `difficulty`, `base_spirit`, `taste_tags`, `glass_type`, `method`, `tips`, `ice_type`, `garnish`, `alcohol_content`, `origin`, `sort_order`, `status`) VALUES
('戴吉里', 'Daiquiri', '海明威最爱的经典鸡尾酒，只用朗姆酒、青柠汁和糖浆三种材料，简单却完美平衡。', 2, '朗姆酒', '清爽,酸甜', '鸡尾酒杯', 'shake', '关键在于酸甜平衡，可根据个人口味调整糖浆用量。一定要充分摇匀。', '冰块', '青柠片', '中度', '古巴', 96, 0);

SET @daiquiri_id = LAST_INSERT_ID();

INSERT INTO `cocktail_ingredients` (`cocktail_id`, `ingredient_id`, `amount`, `is_optional`, `sort_order`) VALUES
(@daiquiri_id, 2, '60ml', 0, 1),   -- 白朗姆酒
(@daiquiri_id, 13, '25ml', 0, 2),  -- 青柠汁
(@daiquiri_id, 38, '15ml', 0, 3),  -- 糖浆
(@daiquiri_id, 49, '适量', 0, 4);  -- 冰块

INSERT INTO `cocktail_steps` (`cocktail_id`, `step_number`, `description`) VALUES
(@daiquiri_id, 1, '在调酒壶中加入冰块'),
(@daiquiri_id, 2, '倒入白朗姆酒、青柠汁和糖浆'),
(@daiquiri_id, 3, '用力摇匀约15秒，直至调酒壶外壁结霜'),
(@daiquiri_id, 4, '双重过滤倒入冰镇的鸡尾酒杯中'),
(@daiquiri_id, 5, '用青柠片装饰杯口');

INSERT INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(@daiquiri_id, 2),  -- 朗姆酒
(@daiquiri_id, 7),  -- 清爽
(@daiquiri_id, 14); -- 中等

-- ============================================
-- 6. 长岛冰茶 (Long Island Iced Tea)
-- ============================================
INSERT INTO `cocktails` (`name`, `name_en`, `description`, `difficulty`, `base_spirit`, `taste_tags`, `glass_type`, `method`, `tips`, `ice_type`, `garnish`, `alcohol_content`, `origin`, `sort_order`, `status`) VALUES
('长岛冰茶', 'Long Island Iced Tea', '混合五种基酒的强力鸡尾酒，虽然名叫冰茶但不含茶叶，口感却很像冰红茶。', 3, '混合基酒', '浓烈,香甜', '高球杯', 'build', '酒精度很高，需要提醒客人慢慢品尝。各种基酒的比例要准确。', '冰块', '柠檬片', '高度', '美国', 95, 0);

SET @long_island_id = LAST_INSERT_ID();

INSERT INTO `cocktail_ingredients` (`cocktail_id`, `ingredient_id`, `amount`, `is_optional`, `sort_order`) VALUES
(@long_island_id, 1, '15ml', 0, 1),   -- 伏特加
(@long_island_id, 2, '15ml', 0, 2),   -- 白朗姆酒
(@long_island_id, 5, '15ml', 0, 3),   -- 金酒
(@long_island_id, 6, '15ml', 0, 4),   -- 龙舌兰
(@long_island_id, 9, '15ml', 0, 5),   -- 橙味利口酒
(@long_island_id, 14, '25ml', 0, 6),  -- 柠檬汁
(@long_island_id, 38, '15ml', 0, 7),  -- 糖浆
(@long_island_id, 22, '适量', 0, 8),  -- 可乐
(@long_island_id, 49, '适量', 0, 9);  -- 冰块

INSERT INTO `cocktail_steps` (`cocktail_id`, `step_number`, `description`) VALUES
(@long_island_id, 1, '在高球杯中加入冰块'),
(@long_island_id, 2, '依次倒入伏特加、白朗姆酒、金酒、龙舌兰和橙味利口酒'),
(@long_island_id, 3, '加入柠檬汁和糖浆'),
(@long_island_id, 4, '轻轻搅拌均匀'),
(@long_island_id, 5, '加入少许可乐至颜色如冰红茶，用柠檬片装饰');

INSERT INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(@long_island_id, 9),  -- 浓烈
(@long_island_id, 15); -- 困难

-- ============================================
-- 7. 螺丝起子 (Screwdriver)
-- ============================================
INSERT INTO `cocktails` (`name`, `name_en`, `description`, `difficulty`, `base_spirit`, `taste_tags`, `glass_type`, `method`, `tips`, `ice_type`, `garnish`, `alcohol_content`, `origin`, `sort_order`, `status`) VALUES
('螺丝起子', 'Screwdriver', '最简单的鸡尾酒之一，只需伏特加和橙汁，清新果香，适合初学者。', 1, '伏特加', '果香,香甜', '高球杯', 'build', '使用新鲜橙汁效果最佳，可根据口味调整伏特加用量。', '冰块', '橙片', '低度', '美国', 94, 0);

SET @screwdriver_id = LAST_INSERT_ID();

INSERT INTO `cocktail_ingredients` (`cocktail_id`, `ingredient_id`, `amount`, `is_optional`, `sort_order`) VALUES
(@screwdriver_id, 1, '45ml', 0, 1),   -- 伏特加
(@screwdriver_id, 15, '120ml', 0, 2), -- 橙汁
(@screwdriver_id, 57, '1片', 1, 3),   -- 橙片
(@screwdriver_id, 49, '适量', 0, 4);  -- 冰块

INSERT INTO `cocktail_steps` (`cocktail_id`, `step_number`, `description`) VALUES
(@screwdriver_id, 1, '在高球杯中加入冰块'),
(@screwdriver_id, 2, '倒入伏特加'),
(@screwdriver_id, 3, '加满新鲜橙汁'),
(@screwdriver_id, 4, '轻轻搅拌均匀，用橙片装饰');

INSERT INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(@screwdriver_id, 1),  -- 伏特加
(@screwdriver_id, 10), -- 果香
(@screwdriver_id, 13); -- 简单

-- ============================================
-- 8. 莫斯科骡子 (Moscow Mule)
-- ============================================
INSERT INTO `cocktails` (`name`, `name_en`, `description`, `difficulty`, `base_spirit`, `taste_tags`, `glass_type`, `method`, `tips`, `ice_type`, `garnish`, `alcohol_content`, `origin`, `sort_order`, `status`) VALUES
('莫斯科骡子', 'Moscow Mule', '传统上用铜杯盛装的经典鸡尾酒，姜汁汽水的辛辣和青柠的清爽完美结合。', 1, '伏特加', '清爽,辛辣', '铜杯/高球杯', 'build', '传统用铜杯能保持冰凉口感更佳，姜汁汽水的品质很重要。', '冰块', '青柠片,薄荷叶', '低度', '美国', 93, 0);

SET @moscow_mule_id = LAST_INSERT_ID();

INSERT INTO `cocktail_ingredients` (`cocktail_id`, `ingredient_id`, `amount`, `is_optional`, `sort_order`) VALUES
(@moscow_mule_id, 1, '45ml', 0, 1),   -- 伏特加
(@moscow_mule_id, 24, '120ml', 0, 2), -- 姜汁汽水
(@moscow_mule_id, 13, '15ml', 0, 3),  -- 青柠汁
(@moscow_mule_id, 55, '1片', 0, 4),   -- 青柠片
(@moscow_mule_id, 49, '适量', 0, 5);  -- 冰块

INSERT INTO `cocktail_steps` (`cocktail_id`, `step_number`, `description`) VALUES
(@moscow_mule_id, 1, '在铜杯或高球杯中加入冰块'),
(@moscow_mule_id, 2, '倒入伏特加和青柠汁'),
(@moscow_mule_id, 3, '加满姜汁汽水'),
(@moscow_mule_id, 4, '轻轻搅拌，用青柠片和薄荷叶装饰');

INSERT INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(@moscow_mule_id, 1),  -- 伏特加
(@moscow_mule_id, 7),  -- 清爽
(@moscow_mule_id, 13); -- 简单

-- ============================================
-- 9. 大都会 (Cosmopolitan)
-- ============================================
INSERT INTO `cocktails` (`name`, `name_en`, `description`, `difficulty`, `base_spirit`, `taste_tags`, `glass_type`, `method`, `tips`, `ice_type`, `garnish`, `alcohol_content`, `origin`, `sort_order`, `status`) VALUES
('大都会', 'Cosmopolitan', '《欲望都市》让这款粉红色鸡尾酒风靡全球，优雅时尚，酸甜平衡。', 2, '伏特加', '果香,酸甜', '马天尼杯', 'shake', '蔓越莓汁不宜过多，否则会过甜。摇匀后要双重过滤。', '冰块', '橙皮', '中度', '美国', 92, 0);

SET @cosmopolitan_id = LAST_INSERT_ID();

INSERT INTO `cocktail_ingredients` (`cocktail_id`, `ingredient_id`, `amount`, `is_optional`, `sort_order`) VALUES
(@cosmopolitan_id, 1, '40ml', 0, 1),   -- 伏特加
(@cosmopolitan_id, 10, '15ml', 0, 2),  -- 君度
(@cosmopolitan_id, 14, '15ml', 0, 3),  -- 柠檬汁
(@cosmopolitan_id, 16, '30ml', 0, 4),  -- 蔓越莓汁
(@cosmopolitan_id, 49, '适量', 0, 5);  -- 冰块

INSERT INTO `cocktail_steps` (`cocktail_id`, `step_number`, `description`) VALUES
(@cosmopolitan_id, 1, '在调酒壶中加入冰块'),
(@cosmopolitan_id, 2, '倒入伏特加、君度、柠檬汁和蔓越莓汁'),
(@cosmopolitan_id, 3, '用力摇匀约15秒'),
(@cosmopolitan_id, 4, '双重过滤倒入冰镇的马天尼杯中'),
(@cosmopolitan_id, 5, '用橙皮拧出精油，擦拭杯口后投入杯中装饰');

INSERT INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(@cosmopolitan_id, 1),  -- 伏特加
(@cosmopolitan_id, 10), -- 果香
(@cosmopolitan_id, 14); -- 中等

-- ============================================
-- 10. 威士忌酸 (Whiskey Sour)
-- ============================================
INSERT INTO `cocktails` (`name`, `name_en`, `description`, `difficulty`, `base_spirit`, `taste_tags`, `glass_type`, `method`, `tips`, `ice_type`, `garnish`, `alcohol_content`, `origin`, `sort_order`, `status`) VALUES
('威士忌酸', 'Whiskey Sour', '经典的酸酒系列代表作，威士忌的醇厚与柠檬的酸爽完美融合。', 2, '威士忌', '酸甜,醇厚', '古典杯', 'shake', '可选择性加入蛋清，能产生细腻的泡沫层。柠檬汁一定要用新鲜的。', '冰块', '柠檬片,樱桃', '中度', '美国', 91, 0);

SET @whiskey_sour_id = LAST_INSERT_ID();

INSERT INTO `cocktail_ingredients` (`cocktail_id`, `ingredient_id`, `amount`, `is_optional`, `sort_order`) VALUES
(@whiskey_sour_id, 8, '50ml', 0, 1),  -- 波本威士忌
(@whiskey_sour_id, 14, '25ml', 0, 2), -- 柠檬汁
(@whiskey_sour_id, 38, '15ml', 0, 3), -- 糖浆
(@whiskey_sour_id, 56, '1片', 0, 4),  -- 柠檬片
(@whiskey_sour_id, 58, '1颗', 1, 5),  -- 樱桃
(@whiskey_sour_id, 49, '适量', 0, 6); -- 冰块

INSERT INTO `cocktail_steps` (`cocktail_id`, `step_number`, `description`) VALUES
(@whiskey_sour_id, 1, '在调酒壶中加入冰块'),
(@whiskey_sour_id, 2, '倒入波本威士忌、柠檬汁和糖浆'),
(@whiskey_sour_id, 3, '用力摇匀约15秒'),
(@whiskey_sour_id, 4, '滤冰倒入装有冰块的古典杯中'),
(@whiskey_sour_id, 5, '用柠檬片和樱桃装饰');

INSERT INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(@whiskey_sour_id, 5),  -- 威士忌
(@whiskey_sour_id, 14); -- 中等

-- ============================================
-- 11. 老式鸡尾酒 (Old Fashioned)
-- ============================================
INSERT INTO `cocktails` (`name`, `name_en`, `description`, `difficulty`, `base_spirit`, `taste_tags`, `glass_type`, `method`, `tips`, `ice_type`, `garnish`, `alcohol_content`, `origin`, `sort_order`, `status`) VALUES
('老式鸡尾酒', 'Old Fashioned', '最古老的鸡尾酒之一，简单却经典，展现威士忌的本真风味。', 2, '威士忌', '醇厚,微苦', '古典杯', 'build', '使用大块冰球能减缓融化速度。橙皮精油是关键，一定要拧出精油。', '冰球', '橙皮,樱桃', '高度', '美国', 90, 0);

SET @old_fashioned_id = LAST_INSERT_ID();

INSERT INTO `cocktail_ingredients` (`cocktail_id`, `ingredient_id`, `amount`, `is_optional`, `sort_order`) VALUES
(@old_fashioned_id, 8, '60ml', 0, 1),  -- 波本威士忌
(@old_fashioned_id, 38, '10ml', 0, 2), -- 糖浆
(@old_fashioned_id, 48, '2滴', 0, 3),  -- 苦精
(@old_fashioned_id, 57, '1片', 0, 4),  -- 橙片
(@old_fashioned_id, 58, '1颗', 1, 5),  -- 樱桃
(@old_fashioned_id, 49, '适量', 0, 6); -- 冰块

INSERT INTO `cocktail_steps` (`cocktail_id`, `step_number`, `description`) VALUES
(@old_fashioned_id, 1, '在古典杯中加入糖浆和苦精'),
(@old_fashioned_id, 2, '加入少量冰块，轻轻搅拌'),
(@old_fashioned_id, 3, '倒入威士忌'),
(@old_fashioned_id, 4, '加入大冰球，继续搅拌至冰凉'),
(@old_fashioned_id, 5, '拧出橙皮精油擦拭杯口，将橙皮和樱桃投入杯中装饰');

INSERT INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(@old_fashioned_id, 5),  -- 威士忌
(@old_fashioned_id, 11), -- 微苦
(@old_fashioned_id, 14); -- 中等

-- ============================================
-- 12. 内格罗尼 (Negroni)
-- ============================================
INSERT INTO `cocktails` (`name`, `name_en`, `description`, `difficulty`, `base_spirit`, `taste_tags`, `glass_type`, `method`, `tips`, `ice_type`, `garnish`, `alcohol_content`, `origin`, `sort_order`, `status`) VALUES
('内格罗尼', 'Negroni', '意大利经典鸡尾酒，苦甜平衡，层次丰富，适合餐前饮用。', 2, '金酒', '微苦,浓烈', '古典杯', 'build', '三种酒的比例是1:1:1，搅拌而非摇和，保持酒体清澈。', '冰块', '橙片', '高度', '意大利', 89, 0);

SET @negroni_id = LAST_INSERT_ID();

-- 注意：内格罗尼需要甜味美思和金巴利，这两个材料在ingredients表中不存在
-- 为了演示完整性，我们暂时用已有材料替代，实际使用时需要补充这些材料
INSERT INTO `cocktail_ingredients` (`cocktail_id`, `ingredient_id`, `amount`, `is_optional`, `sort_order`, `remark`) VALUES
(@negroni_id, 5, '30ml', 0, 1, NULL),  -- 金酒
(@negroni_id, 57, '1片', 0, 2, NULL),  -- 橙片（装饰）
(@negroni_id, 49, '适量', 0, 3, NULL); -- 冰块

INSERT INTO `cocktail_steps` (`cocktail_id`, `step_number`, `description`) VALUES
(@negroni_id, 1, '在古典杯中加入冰块'),
(@negroni_id, 2, '依次倒入金酒、甜味美思和金巴利各30ml'),
(@negroni_id, 3, '用吧匙搅拌约30秒至冰凉'),
(@negroni_id, 4, '用橙片装饰');

INSERT INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(@negroni_id, 3),  -- 金酒
(@negroni_id, 11), -- 微苦
(@negroni_id, 14); -- 中等

-- ============================================
-- 13. 龙舌兰日出 (Tequila Sunrise)
-- ============================================
INSERT INTO `cocktails` (`name`, `name_en`, `description`, `difficulty`, `base_spirit`, `taste_tags`, `glass_type`, `method`, `tips`, `ice_type`, `garnish`, `alcohol_content`, `origin`, `sort_order`, `status`) VALUES
('龙舌兰日出', 'Tequila Sunrise', '如日出般渐变色彩的美丽鸡尾酒，视觉和味觉的双重享受。', 1, '龙舌兰', '果香,香甜', '高球杯', 'build', '石榴糖浆要最后沿杯壁慢慢倒入，让其自然沉底形成渐变效果。', '冰块', '橙片,樱桃', '低度', '墨西哥', 88, 0);

SET @tequila_sunrise_id = LAST_INSERT_ID();

INSERT INTO `cocktail_ingredients` (`cocktail_id`, `ingredient_id`, `amount`, `is_optional`, `sort_order`) VALUES
(@tequila_sunrise_id, 6, '45ml', 0, 1),   -- 龙舌兰
(@tequila_sunrise_id, 15, '120ml', 0, 2), -- 橙汁
(@tequila_sunrise_id, 39, '15ml', 0, 3),  -- 石榴糖浆
(@tequila_sunrise_id, 57, '1片', 0, 4),   -- 橙片
(@tequila_sunrise_id, 58, '1颗', 1, 5),   -- 樱桃
(@tequila_sunrise_id, 49, '适量', 0, 6);  -- 冰块

INSERT INTO `cocktail_steps` (`cocktail_id`, `step_number`, `description`) VALUES
(@tequila_sunrise_id, 1, '在高球杯中加入冰块'),
(@tequila_sunrise_id, 2, '倒入龙舌兰和橙汁，轻轻搅拌'),
(@tequila_sunrise_id, 3, '沿杯壁慢慢倒入石榴糖浆，让其自然沉底'),
(@tequila_sunrise_id, 4, '不要搅拌，保持渐变效果'),
(@tequila_sunrise_id, 5, '用橙片和樱桃装饰');

INSERT INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(@tequila_sunrise_id, 4),  -- 龙舌兰
(@tequila_sunrise_id, 10), -- 果香
(@tequila_sunrise_id, 13); -- 简单

-- ============================================
-- 14. 自由古巴 (Cuba Libre)
-- ============================================
INSERT INTO `cocktails` (`name`, `name_en`, `description`, `difficulty`, `base_spirit`, `taste_tags`, `glass_type`, `method`, `tips`, `ice_type`, `garnish`, `alcohol_content`, `origin`, `sort_order`, `status`) VALUES
('自由古巴', 'Cuba Libre', '升级版的朗姆可乐，加入青柠汁后层次更丰富，是古巴独立的象征。', 1, '朗姆酒', '清爽,香甜', '高球杯', 'build', '一定要加青柠汁，这是与普通朗姆可乐的区别。用新鲜青柠效果最好。', '冰块', '青柠片', '低度', '古巴', 87, 0);

SET @cuba_libre_id = LAST_INSERT_ID();

INSERT INTO `cocktail_ingredients` (`cocktail_id`, `ingredient_id`, `amount`, `is_optional`, `sort_order`) VALUES
(@cuba_libre_id, 2, '50ml', 0, 1),   -- 白朗姆酒
(@cuba_libre_id, 13, '10ml', 0, 2),  -- 青柠汁
(@cuba_libre_id, 22, '120ml', 0, 3), -- 可乐
(@cuba_libre_id, 55, '1片', 0, 4),   -- 青柠片
(@cuba_libre_id, 49, '适量', 0, 5);  -- 冰块

INSERT INTO `cocktail_steps` (`cocktail_id`, `step_number`, `description`) VALUES
(@cuba_libre_id, 1, '在高球杯中加入冰块'),
(@cuba_libre_id, 2, '倒入白朗姆酒和青柠汁'),
(@cuba_libre_id, 3, '加满可乐'),
(@cuba_libre_id, 4, '轻轻搅拌，用青柠片装饰');

INSERT INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(@cuba_libre_id, 2),  -- 朗姆酒
(@cuba_libre_id, 7),  -- 清爽
(@cuba_libre_id, 13); -- 简单

-- ============================================
-- 15. 蓝色夏威夷 (Blue Hawaiian)
-- ============================================
INSERT INTO `cocktails` (`name`, `name_en`, `description`, `difficulty`, `base_spirit`, `taste_tags`, `glass_type`, `method`, `tips`, `ice_type`, `garnish`, `alcohol_content`, `origin`, `sort_order`, `status`) VALUES
('蓝色夏威夷', 'Blue Hawaiian', '蓝色浪漫的热带鸡尾酒，椰香浓郁，果味十足，如同海滩度假。', 2, '朗姆酒', '果香,香甜', '飓风杯', 'shake', '可以用碎冰增加冰沙口感。蓝橙利口酒是标志性的蓝色来源。', '碎冰', '菠萝片,樱桃', '低度', '美国', 86, 0);

SET @blue_hawaiian_id = LAST_INSERT_ID();

INSERT INTO `cocktail_ingredients` (`cocktail_id`, `ingredient_id`, `amount`, `is_optional`, `sort_order`) VALUES
(@blue_hawaiian_id, 2, '40ml', 0, 1),  -- 白朗姆酒
(@blue_hawaiian_id, 11, '20ml', 0, 2), -- 蓝橙利口酒
(@blue_hawaiian_id, 17, '60ml', 0, 3), -- 菠萝汁
(@blue_hawaiian_id, 49, '适量', 0, 4); -- 冰块

INSERT INTO `cocktail_steps` (`cocktail_id`, `step_number`, `description`) VALUES
(@blue_hawaiian_id, 1, '在调酒壶中加入冰块'),
(@blue_hawaiian_id, 2, '倒入白朗姆酒、蓝橙利口酒和菠萝汁'),
(@blue_hawaiian_id, 3, '用力摇匀约15秒'),
(@blue_hawaiian_id, 4, '倒入装有碎冰的飓风杯中'),
(@blue_hawaiian_id, 5, '用菠萝片和樱桃装饰');

INSERT INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(@blue_hawaiian_id, 2),  -- 朗姆酒
(@blue_hawaiian_id, 10), -- 果香
(@blue_hawaiian_id, 14); -- 中等

-- ============================================
-- 16. 维珍莫吉托 (Virgin Mojito) - 无酒精
-- ============================================
INSERT INTO `cocktails` (`name`, `name_en`, `description`, `difficulty`, `base_spirit`, `taste_tags`, `glass_type`, `method`, `tips`, `ice_type`, `garnish`, `alcohol_content`, `origin`, `sort_order`, `status`) VALUES
('维珍莫吉托', 'Virgin Mojito', '无酒精版莫吉托，保留薄荷和青柠的清爽，适合不喝酒的人群。', 1, '无酒精', '清爽,薄荷', '高球杯', 'build', '制作方法与莫吉托相同，只是省去了朗姆酒，同样美味清爽。', '碎冰', '薄荷叶,青柠片', '无酒精', '古巴', 85, 0);

SET @virgin_mojito_id = LAST_INSERT_ID();

INSERT INTO `cocktail_ingredients` (`cocktail_id`, `ingredient_id`, `amount`, `is_optional`, `sort_order`) VALUES
(@virgin_mojito_id, 13, '20ml', 0, 1),  -- 青柠汁
(@virgin_mojito_id, 20, '适量', 0, 2),  -- 苏打水
(@virgin_mojito_id, 43, '2勺', 0, 3),   -- 白糖
(@virgin_mojito_id, 54, '8-10片', 0, 4), -- 薄荷叶
(@virgin_mojito_id, 49, '适量', 0, 5);  -- 冰块

INSERT INTO `cocktail_steps` (`cocktail_id`, `step_number`, `description`) VALUES
(@virgin_mojito_id, 1, '在高球杯中放入薄荷叶和白糖，轻轻捣碎'),
(@virgin_mojito_id, 2, '加入青柠汁，搅拌使糖溶解'),
(@virgin_mojito_id, 3, '加入碎冰至八分满'),
(@virgin_mojito_id, 4, '加满苏打水'),
(@virgin_mojito_id, 5, '用薄荷叶和青柠片装饰');

INSERT INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(@virgin_mojito_id, 7),  -- 清爽
(@virgin_mojito_id, 13); -- 简单

-- ============================================
-- 17. 雪碧青柠 (Sprite Lime) - 无酒精
-- ============================================
INSERT INTO `cocktails` (`name`, `name_en`, `description`, `difficulty`, `base_spirit`, `taste_tags`, `glass_type`, `method`, `tips`, `ice_type`, `garnish`, `alcohol_content`, `origin`, `sort_order`, `status`) VALUES
('雪碧青柠', 'Sprite Lime', '最简单的无酒精饮品，清凉解渴，适合任何场合。', 1, '无酒精', '清爽,香甜', '高球杯', 'build', '使用新鲜青柠是关键，瓶装青柠汁效果会打折扣。', '冰块', '青柠片,薄荷叶', '无酒精', '现代', 84, 0);

SET @sprite_lime_id = LAST_INSERT_ID();

INSERT INTO `cocktail_ingredients` (`cocktail_id`, `ingredient_id`, `amount`, `is_optional`, `sort_order`) VALUES
(@sprite_lime_id, 23, '200ml', 0, 1),  -- 雪碧
(@sprite_lime_id, 13, '15ml', 0, 2),   -- 青柠汁
(@sprite_lime_id, 55, '2片', 0, 3),    -- 青柠片
(@sprite_lime_id, 54, '2片', 1, 4),    -- 薄荷叶
(@sprite_lime_id, 49, '适量', 0, 5);   -- 冰块

INSERT INTO `cocktail_steps` (`cocktail_id`, `step_number`, `description`) VALUES
(@sprite_lime_id, 1, '在高球杯中加入冰块'),
(@sprite_lime_id, 2, '倒入新鲜青柠汁'),
(@sprite_lime_id, 3, '加满雪碧'),
(@sprite_lime_id, 4, '轻轻搅拌，用青柠片和薄荷叶装饰');

INSERT INTO `cocktail_categories` (`cocktail_id`, `category_id`) VALUES
(@sprite_lime_id, 7),  -- 清爽
(@sprite_lime_id, 13); -- 简单

-- ============================================
-- 数据导入完成
-- ============================================
-- 共导入17款经典鸡尾酒：
-- 1. 莫吉托 (Mojito)
-- 2. 金汤力 (Gin & Tonic)
-- 3. 玛格丽特 (Margarita)
-- 4. 血腥玛丽 (Bloody Mary)
-- 5. 戴吉里 (Daiquiri)
-- 6. 长岛冰茶 (Long Island Iced Tea)
-- 7. 螺丝起子 (Screwdriver)
-- 8. 莫斯科骡子 (Moscow Mule)
-- 9. 大都会 (Cosmopolitan)
-- 10. 威士忌酸 (Whiskey Sour)
-- 11. 老式鸡尾酒 (Old Fashioned)
-- 12. 内格罗尼 (Negroni)
-- 13. 龙舌兰日出 (Tequila Sunrise)
-- 14. 自由古巴 (Cuba Libre)
-- 15. 蓝色夏威夷 (Blue Hawaiian)
-- 16. 维珍莫吉托 (Virgin Mojito) - 无酒精
-- 17. 雪碧青柠 (Sprite Lime) - 无酒精

-- 执行说明：
-- 1. 先执行 schema.sql 创建表结构和基础数据
-- 2. 再执行本文件导入酒谱示例数据
-- 3. 所有酒谱均使用 schema.sql 中已存在的材料ID
-- 4. 难度：1-简单 2-中等 3-困难
-- 5. 状态：0-启用 1-禁用（所有示例数据均为启用状态）
