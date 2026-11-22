-- ============================================================
-- 006_expand_content.sql
-- 增量扩充：+20 款经典鸡尾酒、+28 种原料
-- 基于服务器真实备份 mixing_drinks_backup.sql 编写
--
-- 执行前确认：cocktails 当前最大 id = 29（备份 AUTO_INCREMENT=30）
--             ingredients 当前最大 id = 67（备份 AUTO_INCREMENT=69）
-- 本脚本使用显式 id（酒 30-49、原料 68-95），只可首次执行；
-- 关联表通过子查询按原料 name 取 id，避免硬编码错位。
--
-- 【执行前预检查】先运行以下两句，确认都返回 0 再执行本脚本：
--   SELECT COUNT(*) FROM cocktails WHERE id BETWEEN 30 AND 49;
--   SELECT COUNT(*) FROM ingredients WHERE id BETWEEN 68 AND 95;
-- ============================================================

SET NAMES utf8mb4;

-- ===================== 一、补充原料（id 68-95）=====================
INSERT INTO `ingredients` (`id`,`name`,`name_en`,`category`,`description`,`common_unit`,`status`,`create_time`) VALUES
(68,'黑麦威士忌','Rye Whiskey','base_spirit','辛香的黑麦威士忌，古典与曼哈顿经典基酒。','ml',1,NOW()),
(69,'苏格兰威士忌','Scotch Whisky','base_spirit','带烟熏泥煤风味的苏格兰威士忌。','ml',1,NOW()),
(70,'苹果白兰地','Calvados','base_spirit','法国诺曼底苹果白兰地，苹果风味浓郁。','ml',1,NOW()),
(71,'梅斯卡尔','Mezcal','base_spirit','带烟熏气息的墨西哥龙舌兰蒸馏酒。','ml',1,NOW()),
(72,'君度','Cointreau','liqueur','澄澈的橙味利口酒，边车与大都会常用。','ml',1,NOW()),
(73,'马拉斯奇诺利口酒','Maraschino Liqueur','liqueur','樱桃利口酒，经典鸡尾酒的点睛之笔。','ml',1,NOW()),
(74,'阿佩罗','Aperol','liqueur','意大利橙红色苦甜开胃利口酒，Spritz 灵魂。','ml',1,NOW()),
(75,'接骨木花利口酒','Elderflower Liqueur','liqueur','清雅花香利口酒，法式清新风味。','ml',1,NOW()),
(76,'可可利口酒','Creme de Cacao','liqueur','巧克力风味利口酒，甜点类鸡尾酒常用。','ml',1,NOW()),
(77,'西柚汽水','Grapefruit Soda','juice','带气泡的西柚饮料，帕洛玛的便捷之选。','ml',1,NOW()),
(78,'柚子汁','Yuzu Juice','juice','日式柚子汁，香气独特清新。','ml',1,NOW()),
(79,'气泡葡萄酒','Sparkling Wine','juice','干型起泡酒，贝里尼与 Spritz 的基底。','ml',1,NOW()),
(80,'西瓜汁','Watermelon Juice','juice','清甜的夏日西瓜汁。','ml',1,NOW()),
(81,'红茶','Black Tea','juice','醇厚红茶，可做长饮茶底。','ml',1,NOW()),
(82,'蛋奶','Egg Nog','juice','蛋奶混合饮品，节日风味浓郁。','ml',1,NOW()),
(83,'枫糖浆','Maple Syrup','syrup','加拿大枫糖浆，风味圆润独特。','ml',1,NOW()),
(84,'接骨木花糖浆','Elderflower Syrup','syrup','清雅花香糖浆。','ml',1,NOW()),
(85,'黑糖糖浆','Brown Sugar Syrup','syrup','黑糖风味糖浆，焦香浓郁。','ml',1,NOW()),
(86,'橄榄','Olive','garnish','马天尼经典咸味装饰。','个',1,NOW()),
(87,'柠檬皮','Lemon Twist','garnish','柠檬皮卷，挤出香气增加层次。','个',1,NOW()),
(88,'橙皮','Orange Twist','garnish','橙皮卷，经典鸡尾酒装饰。','个',1,NOW()),
(89,'芹菜杆','Celery Stick','garnish','血腥玛丽的经典咸香搭配。','根',1,NOW()),
(90,'肉桂棒','Cinnamon Stick','garnish','秋冬热饮的香气装饰。','根',1,NOW()),
(91,'巧克力碎','Chocolate Shaving','garnish','巧克力风味饮品的顶部点缀。','少许',1,NOW()),
(92,'咖啡豆','Coffee Bean','garnish','咖啡类鸡尾酒的香气装饰。','颗',1,NOW()),
(93,'海盐','Sea Salt','other','精美盐边与风味点缀。','适量',1,NOW()),
(94,'罗勒叶','Basil Leaf','garnish','清新草本装饰，可轻拍出味。','片',1,NOW()),
(95,'薰衣草','Lavender','garnish','花香装饰，适合花香调饮品。','枝',1,NOW());

-- ===================== 二、补充 20 款鸡尾酒（id 30-49）=====================
-- cover 留 NULL：前端会显示渐变+图标占位，不影响展示
-- 原料引用统一用子查询按 name 取 id，避免硬编码错位

-- 30 内格罗尼
INSERT INTO `cocktails` (`id`,`name`,`name_en`,`description`,`difficulty`,`base_spirit`,`taste_tags`,`glass_type`,`method`,`tips`,`sort_order`,`status`,`create_time`,`update_time`,`source`,`cover`)
VALUES (30,'内格罗尼','Negroni','意大利经典苦甜鸡尾酒，金酒、金巴利与甜味美思的完美三角，橙皮香气点睛。',2,'金酒','苦味,微甜,草本','古典杯','stir','搅拌要充分冰镇，橙皮挤油在表面是点睛之笔。',85,1,NOW(),NOW(),'official',NULL);
INSERT INTO `cocktail_categories` (`cocktail_id`,`category_id`) VALUES (30,3),(30,10),(30,8);
INSERT INTO `cocktail_ingredients` (`cocktail_id`,`ingredient_id`,`amount`,`is_optional`,`sort_order`) VALUES
(30,(SELECT id FROM ingredients WHERE name='金酒'),'30ml',0,0),
(30,(SELECT id FROM ingredients WHERE name='金巴利'),'30ml',0,1),
(30,(SELECT id FROM ingredients WHERE name='甜味美思'),'30ml',0,2),
(30,(SELECT id FROM ingredients WHERE name='橙皮'),'1个',1,3),
(30,(SELECT id FROM ingredients WHERE name='冰块'),'适量',0,4);
INSERT INTO `cocktail_steps` (`cocktail_id`,`step_number`,`description`,`create_time`) VALUES
(30,1,'在古典杯中放入大冰块',NOW()),(30,2,'倒入金酒、金巴利和甜味美思',NOW()),(30,3,'用吧匙搅拌约30秒至充分冰镇',NOW()),(30,4,'挤入橙皮油并以此装饰',NOW());

-- 31 古典 Old Fashioned
INSERT INTO `cocktails` (`id`,`name`,`name_en`,`description`,`difficulty`,`base_spirit`,`taste_tags`,`glass_type`,`method`,`tips`,`sort_order`,`status`,`create_time`,`update_time`,`source`,`cover`)
VALUES (31,'古典','Old Fashioned','鸡尾酒始祖，威士忌、糖与苦精的极简组合，醇厚深邃。',2,'威士忌','醇厚,微甜,微苦','古典杯','stir','用少许水化开糖，能更好释放威士忌风味。',84,1,NOW(),NOW(),'official',NULL);
INSERT INTO `cocktail_categories` (`cocktail_id`,`category_id`) VALUES (31,4),(31,12),(31,8);
INSERT INTO `cocktail_ingredients` (`cocktail_id`,`ingredient_id`,`amount`,`is_optional`,`sort_order`) VALUES
(31,(SELECT id FROM ingredients WHERE name='黑麦威士忌'),'60ml',0,0),
(31,(SELECT id FROM ingredients WHERE name='苦精'),'2滴',0,1),
(31,(SELECT id FROM ingredients WHERE name='白糖'),'1茶匙',0,2),
(31,(SELECT id FROM ingredients WHERE name='橙皮'),'1个',1,3),
(31,(SELECT id FROM ingredients WHERE name='冰块'),'适量',0,4);
INSERT INTO `cocktail_steps` (`cocktail_id`,`step_number`,`description`,`create_time`) VALUES
(31,1,'在古典杯中将糖与少许水搅化',NOW()),(31,2,'加入苦精搅拌',NOW()),(31,3,'倒入威士忌并加大冰块',NOW()),(31,4,'搅拌至冰镇，以橙皮装饰',NOW());

-- 32 阿佩罗 Spritz
INSERT INTO `cocktails` (`id`,`name`,`name_en`,`description`,`difficulty`,`base_spirit`,`taste_tags`,`glass_type`,`method`,`tips`,`sort_order`,`status`,`create_time`,`update_time`,`source`,`cover`)
VALUES (32,'阿佩罗气泡','Aperol Spritz','意大利国民开胃酒，阿佩罗的苦甜与气泡酒的清爽完美交融。',1,'利口酒','苦味,果香,清爽','高球杯','build','经典比例 3:2:1（气泡酒:阿佩罗:苏打水），橙片点缀。',83,1,NOW(),NOW(),'official',NULL);
INSERT INTO `cocktail_categories` (`cocktail_id`,`category_id`) VALUES (32,10),(32,8),(32,7);
INSERT INTO `cocktail_ingredients` (`cocktail_id`,`ingredient_id`,`amount`,`is_optional`,`sort_order`) VALUES
(32,(SELECT id FROM ingredients WHERE name='气泡葡萄酒'),'90ml',0,0),
(32,(SELECT id FROM ingredients WHERE name='阿佩罗'),'60ml',0,1),
(32,(SELECT id FROM ingredients WHERE name='苏打水'),'30ml',0,2),
(32,(SELECT id FROM ingredients WHERE name='橙片'),'1片',1,3),
(32,(SELECT id FROM ingredients WHERE name='冰块'),'适量',0,4);
INSERT INTO `cocktail_steps` (`cocktail_id`,`step_number`,`description`,`create_time`) VALUES
(32,1,'高球杯加满冰块',NOW()),(32,2,'倒入气泡酒和阿佩罗',NOW()),(32,3,'注入苏打水轻轻搅拌',NOW()),(32,4,'以橙片装饰',NOW());

-- 33 龙舌兰日出
INSERT INTO `cocktails` (`id`,`name`,`name_en`,`description`,`difficulty`,`base_spirit`,`taste_tags`,`glass_type`,`method`,`tips`,`sort_order`,`status`,`create_time`,`update_time`,`source`,`cover`)
VALUES (33,'龙舌兰日出','Tequila Sunrise','龙舌兰与橙汁的渐变日出，石榴糖浆沉底形成绚丽分层。',1,'龙舌兰','甜味,果香,清爽','高球杯','build','先倒橙汁再缓慢淋入石榴糖浆，形成渐层。',82,1,NOW(),NOW(),'official',NULL);
INSERT INTO `cocktail_categories` (`cocktail_id`,`category_id`) VALUES (33,5),(33,8),(33,7);
INSERT INTO `cocktail_ingredients` (`cocktail_id`,`ingredient_id`,`amount`,`is_optional`,`sort_order`) VALUES
(33,(SELECT id FROM ingredients WHERE name='龙舌兰'),'45ml',0,0),
(33,(SELECT id FROM ingredients WHERE name='橙汁'),'90ml',0,1),
(33,(SELECT id FROM ingredients WHERE name='石榴糖浆'),'15ml',0,2),
(33,(SELECT id FROM ingredients WHERE name='冰块'),'适量',0,3);
INSERT INTO `cocktail_steps` (`cocktail_id`,`step_number`,`description`,`create_time`) VALUES
(33,1,'高球杯加满冰块',NOW()),(33,2,'倒入龙舌兰和橙汁搅匀',NOW()),(33,3,'沿杯壁缓慢倒入石榴糖浆形成分层',NOW());

-- 34 美国佬 Americano
INSERT INTO `cocktails` (`id`,`name`,`name_en`,`description`,`difficulty`,`base_spirit`,`taste_tags`,`glass_type`,`method`,`tips`,`sort_order`,`status`,`create_time`,`update_time`,`source`,`cover`)
VALUES (34,'美国佬','Americano','金巴利与甜味美思加苏打水的开胃酒，微苦清爽，意大利国民饮品。',1,'利口酒','苦味,微甜,清爽','高球杯','build','金巴利与味美思等量，苏打水注满。',81,1,NOW(),NOW(),'official',NULL);
INSERT INTO `cocktail_categories` (`cocktail_id`,`category_id`) VALUES (34,10),(34,8),(34,7);
INSERT INTO `cocktail_ingredients` (`cocktail_id`,`ingredient_id`,`amount`,`is_optional`,`sort_order`) VALUES
(34,(SELECT id FROM ingredients WHERE name='金巴利'),'30ml',0,0),
(34,(SELECT id FROM ingredients WHERE name='甜味美思'),'30ml',0,1),
(34,(SELECT id FROM ingredients WHERE name='苏打水'),'80ml',0,2),
(34,(SELECT id FROM ingredients WHERE name='橙片'),'1片',1,3),
(34,(SELECT id FROM ingredients WHERE name='冰块'),'适量',0,4);
INSERT INTO `cocktail_steps` (`cocktail_id`,`step_number`,`description`,`create_time`) VALUES
(34,1,'高球杯加满冰块',NOW()),(34,2,'倒入金巴利和甜味美思',NOW()),(34,3,'注入苏打水轻轻搅拌',NOW()),(34,4,'以橙片装饰',NOW());

-- 35 边车（经典）
INSERT INTO `cocktails` (`id`,`name`,`name_en`,`description`,`difficulty`,`base_spirit`,`taste_tags`,`glass_type`,`method`,`tips`,`sort_order`,`status`,`create_time`,`update_time`,`source`,`cover`)
VALUES (35,'边车经典','Sidecar Classic','干邑、君度与柠檬的经典酸酒，杯口糖边优雅。',2,'白兰地','酸甜,果香,醇厚','鸡尾酒杯','shake','干邑与君度比例2:1，柠檬汁调平衡。',80,1,NOW(),NOW(),'official',NULL);
INSERT INTO `cocktail_categories` (`cocktail_id`,`category_id`) VALUES (35,6),(35,9),(35,8);
INSERT INTO `cocktail_ingredients` (`cocktail_id`,`ingredient_id`,`amount`,`is_optional`,`sort_order`) VALUES
(35,(SELECT id FROM ingredients WHERE name='白兰地'),'50ml',0,0),
(35,(SELECT id FROM ingredients WHERE name='君度'),'20ml',0,1),
(35,(SELECT id FROM ingredients WHERE name='柠檬汁'),'20ml',0,2),
(35,(SELECT id FROM ingredients WHERE name='白糖'),'适量',1,3),
(35,(SELECT id FROM ingredients WHERE name='冰块'),'适量',0,4);
INSERT INTO `cocktail_steps` (`cocktail_id`,`step_number`,`description`,`create_time`) VALUES
(35,1,'用柠檬片擦杯口并沾糖边',NOW()),(35,2,'将干邑、君度和柠檬汁倒入摇壶',NOW()),(35,3,'加冰充分摇晃',NOW()),(35,4,'过滤入杯',NOW());

-- 36 大都会
INSERT INTO `cocktails` (`id`,`name`,`name_en`,`description`,`difficulty`,`base_spirit`,`taste_tags`,`glass_type`,`method`,`tips`,`sort_order`,`status`,`create_time`,`update_time`,`source`,`cover`)
VALUES (36,'大都会','Cosmopolitan','伏特加与蔓越莓的粉红经典，酸甜果香，都市宠儿。',1,'伏特加','酸甜,果香,清爽','马天尼杯','shake','用新鲜青柠汁，颜色口感俱佳。',79,1,NOW(),NOW(),'official',NULL);
INSERT INTO `cocktail_categories` (`cocktail_id`,`category_id`) VALUES (36,2),(36,9),(36,11);
INSERT INTO `cocktail_ingredients` (`cocktail_id`,`ingredient_id`,`amount`,`is_optional`,`sort_order`) VALUES
(36,(SELECT id FROM ingredients WHERE name='伏特加'),'40ml',0,0),
(36,(SELECT id FROM ingredients WHERE name='君度'),'15ml',0,1),
(36,(SELECT id FROM ingredients WHERE name='蔓越莓汁'),'30ml',0,2),
(36,(SELECT id FROM ingredients WHERE name='青柠汁'),'15ml',0,3),
(36,(SELECT id FROM ingredients WHERE name='冰块'),'适量',0,4);
INSERT INTO `cocktail_steps` (`cocktail_id`,`step_number`,`description`,`create_time`) VALUES
(36,1,'将所有材料倒入摇壶',NOW()),(36,2,'加冰充分摇晃',NOW()),(36,3,'过滤入冰镇马天尼杯',NOW());

-- 37 汤姆柯林斯
INSERT INTO `cocktails` (`id`,`name`,`name_en`,`description`,`difficulty`,`base_spirit`,`taste_tags`,`glass_type`,`method`,`tips`,`sort_order`,`status`,`create_time`,`update_time`,`source`,`cover`)
VALUES (37,'汤姆柯林斯','Tom Collins','金酒、柠檬与苏打水的清爽长饮，气泡轻盈。',1,'金酒','酸味,清爽,微甜','高球杯','build','用新鲜柠檬汁，气泡水最后注入保持气泡。',78,1,NOW(),NOW(),'official',NULL);
INSERT INTO `cocktail_categories` (`cocktail_id`,`category_id`) VALUES (37,3),(37,9),(37,7);
INSERT INTO `cocktail_ingredients` (`cocktail_id`,`ingredient_id`,`amount`,`is_optional`,`sort_order`) VALUES
(37,(SELECT id FROM ingredients WHERE name='金酒'),'45ml',0,0),
(37,(SELECT id FROM ingredients WHERE name='柠檬汁'),'25ml',0,1),
(37,(SELECT id FROM ingredients WHERE name='糖浆'),'15ml',0,2),
(37,(SELECT id FROM ingredients WHERE name='苏打水'),'90ml',0,3),
(37,(SELECT id FROM ingredients WHERE name='冰块'),'适量',0,4);
INSERT INTO `cocktail_steps` (`cocktail_id`,`step_number`,`description`,`create_time`) VALUES
(37,1,'高球杯加满冰块',NOW()),(37,2,'倒入金酒、柠檬汁和糖浆',NOW()),(37,3,'注满苏打水轻轻搅拌',NOW()),(37,4,'以柠檬片装饰',NOW());

-- 38 金菲兹
INSERT INTO `cocktails` (`id`,`name`,`name_en`,`description`,`difficulty`,`base_spirit`,`taste_tags`,`glass_type`,`method`,`tips`,`sort_order`,`status`,`create_time`,`update_time`,`source`,`cover`)
VALUES (38,'金菲兹','Gin Fizz','金酒酸酒加气泡的清爽版本，蛋清带来绵密泡沫。',2,'金酒','酸味,清爽,绵密','高球杯','shake','先干摇蛋清起泡，再加冰摇。',77,1,NOW(),NOW(),'official',NULL);
INSERT INTO `cocktail_categories` (`cocktail_id`,`category_id`) VALUES (38,3),(38,9),(38,7);
INSERT INTO `cocktail_ingredients` (`cocktail_id`,`ingredient_id`,`amount`,`is_optional`,`sort_order`) VALUES
(38,(SELECT id FROM ingredients WHERE name='金酒'),'50ml',0,0),
(38,(SELECT id FROM ingredients WHERE name='柠檬汁'),'25ml',0,1),
(38,(SELECT id FROM ingredients WHERE name='糖浆'),'15ml',0,2),
(38,(SELECT id FROM ingredients WHERE name='蛋清'),'1个',1,3),
(38,(SELECT id FROM ingredients WHERE name='苏打水'),'60ml',0,4),
(38,(SELECT id FROM ingredients WHERE name='冰块'),'适量',0,5);
INSERT INTO `cocktail_steps` (`cocktail_id`,`step_number`,`description`,`create_time`) VALUES
(38,1,'金酒、柠檬汁、糖浆和蛋清干摇起泡',NOW()),(38,2,'加冰再摇',NOW()),(38,3,'过滤入杯，注入苏打水',NOW());

-- 39 蓝色玛格丽特
INSERT INTO `cocktails` (`id`,`name`,`name_en`,`description`,`difficulty`,`base_spirit`,`taste_tags`,`glass_type`,`method`,`tips`,`sort_order`,`status`,`create_time`,`update_time`,`source`,`cover`)
VALUES (39,'蓝色玛格丽特','Blue Margarita','玛格丽特的蓝色版本，蓝橙利口酒赋予海洋般的色泽。',1,'龙舌兰','酸甜,果香,清爽','玛格丽特杯','shake','盐边可选，蓝色来自蓝橙利口酒。',76,1,NOW(),NOW(),'official',NULL);
INSERT INTO `cocktail_categories` (`cocktail_id`,`category_id`) VALUES (39,5),(39,9),(39,7);
INSERT INTO `cocktail_ingredients` (`cocktail_id`,`ingredient_id`,`amount`,`is_optional`,`sort_order`) VALUES
(39,(SELECT id FROM ingredients WHERE name='龙舌兰'),'45ml',0,0),
(39,(SELECT id FROM ingredients WHERE name='蓝橙利口酒'),'20ml',0,1),
(39,(SELECT id FROM ingredients WHERE name='青柠汁'),'20ml',0,2),
(39,(SELECT id FROM ingredients WHERE name='盐'),'适量',1,3),
(39,(SELECT id FROM ingredients WHERE name='冰块'),'适量',0,4);
INSERT INTO `cocktail_steps` (`cocktail_id`,`step_number`,`description`,`create_time`) VALUES
(39,1,'制作盐边',NOW()),(39,2,'所有材料加冰摇晃',NOW()),(39,3,'过滤入杯',NOW());

-- 40 椰林飘香
INSERT INTO `cocktails` (`id`,`name`,`name_en`,`description`,`difficulty`,`base_spirit`,`taste_tags`,`glass_type`,`method`,`tips`,`sort_order`,`status`,`create_time`,`update_time`,`source`,`cover`)
VALUES (40,'椰林飘香','Pina Colada','波多黎各国饮，朗姆、椰浆与菠萝的热带交融，奶香浓郁。',1,'朗姆酒','甜味,果香,奶香','飓风杯','shake','用椰浆而非椰子水，口感才浓郁。',75,1,NOW(),NOW(),'official',NULL);
INSERT INTO `cocktail_categories` (`cocktail_id`,`category_id`) VALUES (40,1),(40,8),(40,11);
INSERT INTO `cocktail_ingredients` (`cocktail_id`,`ingredient_id`,`amount`,`is_optional`,`sort_order`) VALUES
(40,(SELECT id FROM ingredients WHERE name='白朗姆酒'),'50ml',0,0),
(40,(SELECT id FROM ingredients WHERE name='椰浆'),'30ml',0,1),
(40,(SELECT id FROM ingredients WHERE name='菠萝汁'),'90ml',0,2),
(40,(SELECT id FROM ingredients WHERE name='冰块'),'适量',0,3);
INSERT INTO `cocktail_steps` (`cocktail_id`,`step_number`,`description`,`create_time`) VALUES
(40,1,'所有材料加冰放入搅打机',NOW()),(40,2,'搅打至顺滑浓稠',NOW()),(40,3,'倒入飓风杯，以菠萝装饰',NOW());

-- 41 樱桃得其利
INSERT INTO `cocktails` (`id`,`name`,`name_en`,`description`,`difficulty`,`base_spirit`,`taste_tags`,`glass_type`,`method`,`tips`,`sort_order`,`status`,`create_time`,`update_time`,`source`,`cover`)
VALUES (41,'樱桃得其利','Cherry Daiquiri','得其利的樱桃变体，石榴糖浆染出宝石色泽。',1,'朗姆酒','酸甜,果香,清爽','鸡尾酒杯','shake','樱桃利口酒可替换石榴糖浆，风味更浓。',74,1,NOW(),NOW(),'official',NULL);
INSERT INTO `cocktail_categories` (`cocktail_id`,`category_id`) VALUES (41,1),(41,9),(41,11);
INSERT INTO `cocktail_ingredients` (`cocktail_id`,`ingredient_id`,`amount`,`is_optional`,`sort_order`) VALUES
(41,(SELECT id FROM ingredients WHERE name='白朗姆酒'),'50ml',0,0),
(41,(SELECT id FROM ingredients WHERE name='青柠汁'),'20ml',0,1),
(41,(SELECT id FROM ingredients WHERE name='石榴糖浆'),'10ml',0,2),
(41,(SELECT id FROM ingredients WHERE name='糖浆'),'10ml',0,3),
(41,(SELECT id FROM ingredients WHERE name='冰块'),'适量',0,4);
INSERT INTO `cocktail_steps` (`cocktail_id`,`step_number`,`description`,`create_time`) VALUES
(41,1,'所有材料加冰摇晃',NOW()),(41,2,'过滤入冰镇鸡尾酒杯',NOW());

-- 42 处决者（无酒精）
INSERT INTO `cocktails` (`id`,`name`,`name_en`,`description`,`difficulty`,`base_spirit`,`taste_tags`,`glass_type`,`method`,`tips`,`sort_order`,`status`,`create_time`,`update_time`,`source`,`cover`)
VALUES (42,'处决者','Shirley Temple','经典无酒精饮品，姜汁啤酒与石榴糖浆的甜美组合。',1,'无酒精','甜味,清爽,果香','高球杯','build','深受喜爱的无酒精选择，儿童友好。',73,1,NOW(),NOW(),'official',NULL);
INSERT INTO `cocktail_categories` (`cocktail_id`,`category_id`) VALUES (42,7),(42,8);
INSERT INTO `cocktail_ingredients` (`cocktail_id`,`ingredient_id`,`amount`,`is_optional`,`sort_order`) VALUES
(42,(SELECT id FROM ingredients WHERE name='姜汁啤酒'),'120ml',0,0),
(42,(SELECT id FROM ingredients WHERE name='石榴糖浆'),'15ml',0,1),
(42,(SELECT id FROM ingredients WHERE name='樱桃'),'1个',1,2),
(42,(SELECT id FROM ingredients WHERE name='冰块'),'适量',0,3);
INSERT INTO `cocktail_steps` (`cocktail_id`,`step_number`,`description`,`create_time`) VALUES
(42,1,'高球杯加满冰块',NOW()),(42,2,'倒入姜汁啤酒和石榴糖浆',NOW()),(42,3,'以樱桃装饰',NOW());

-- 43 爱尔兰咖啡
INSERT INTO `cocktails` (`id`,`name`,`name_en`,`description`,`difficulty`,`base_spirit`,`taste_tags`,`glass_type`,`method`,`tips`,`sort_order`,`status`,`create_time`,`update_time`,`source`,`cover`)
VALUES (43,'爱尔兰咖啡','Irish Coffee','热咖啡、威士忌与奶油的温暖组合，冬日经典。',2,'威士忌','醇厚,奶香,微甜','爱尔兰咖啡杯','build','奶油要浮在表面，不要搅拌。',72,1,NOW(),NOW(),'official',NULL);
INSERT INTO `cocktail_categories` (`cocktail_id`,`category_id`) VALUES (43,4),(43,12),(43,8);
INSERT INTO `cocktail_ingredients` (`cocktail_id`,`ingredient_id`,`amount`,`is_optional`,`sort_order`) VALUES
(43,(SELECT id FROM ingredients WHERE name='威士忌'),'45ml',0,0),
(43,(SELECT id FROM ingredients WHERE name='冷萃咖啡'),'90ml',0,1),
(43,(SELECT id FROM ingredients WHERE name='淡奶油'),'30ml',0,2),
(43,(SELECT id FROM ingredients WHERE name='白糖'),'适量',0,3);
INSERT INTO `cocktail_steps` (`cocktail_id`,`step_number`,`description`,`create_time`) VALUES
(43,1,'温热爱尔兰咖啡杯',NOW()),(43,2,'倒入威士忌和糖搅化',NOW()),(43,3,'注入热咖啡',NOW()),(43,4,'漂浮一层奶油',NOW());

-- 44 贝里尼（无酒精）
INSERT INTO `cocktails` (`id`,`name`,`name_en`,`description`,`difficulty`,`base_spirit`,`taste_tags`,`glass_type`,`method`,`tips`,`sort_order`,`status`,`create_time`,`update_time`,`source`,`cover`)
VALUES (44,'贝里尼','Bellini','意大利经典起泡饮品，白桃与气泡的优雅，无酒精也精彩。',1,'无酒精','甜味,果香,清爽','笛形杯','build','用冰镇气泡酒，白桃泥要细腻。',71,1,NOW(),NOW(),'official',NULL);
INSERT INTO `cocktail_categories` (`cocktail_id`,`category_id`) VALUES (44,7),(44,8),(44,11);
INSERT INTO `cocktail_ingredients` (`cocktail_id`,`ingredient_id`,`amount`,`is_optional`,`sort_order`) VALUES
(44,(SELECT id FROM ingredients WHERE name='蜜桃汁'),'60ml',0,0),
(44,(SELECT id FROM ingredients WHERE name='气泡葡萄酒'),'90ml',0,1);
INSERT INTO `cocktail_steps` (`cocktail_id`,`step_number`,`description`,`create_time`) VALUES
(44,1,'杯中倒入冰镇白桃汁',NOW()),(44,2,'缓慢注入气泡酒',NOW()),(44,3,'轻轻搅拌',NOW());

-- 45 罗宾汉
INSERT INTO `cocktails` (`id`,`name`,`name_en`,`description`,`difficulty`,`base_spirit`,`taste_tags`,`glass_type`,`method`,`tips`,`sort_order`,`status`,`create_time`,`update_time`,`source`,`cover`)
VALUES (45,'罗宾汉','Rob Roy','曼哈顿的苏格兰版本，威士忌与味美思的经典碰撞。',2,'威士忌','醇厚,微甜,草本','鸡尾酒杯','stir','用苏格兰威士忌，樱桃装饰。',70,1,NOW(),NOW(),'official',NULL);
INSERT INTO `cocktail_categories` (`cocktail_id`,`category_id`) VALUES (45,4),(45,12),(45,8);
INSERT INTO `cocktail_ingredients` (`cocktail_id`,`ingredient_id`,`amount`,`is_optional`,`sort_order`) VALUES
(45,(SELECT id FROM ingredients WHERE name='苏格兰威士忌'),'50ml',0,0),
(45,(SELECT id FROM ingredients WHERE name='甜味美思'),'25ml',0,1),
(45,(SELECT id FROM ingredients WHERE name='苦精'),'2滴',0,2),
(45,(SELECT id FROM ingredients WHERE name='樱桃'),'1个',1,3),
(45,(SELECT id FROM ingredients WHERE name='冰块'),'适量',0,4);
INSERT INTO `cocktail_steps` (`cocktail_id`,`step_number`,`description`,`create_time`) VALUES
(45,1,'所有材料加冰搅拌',NOW()),(45,2,'过滤入鸡尾酒杯',NOW()),(45,3,'以樱桃装饰',NOW());

-- 46 蓝色泻湖
INSERT INTO `cocktails` (`id`,`name`,`name_en`,`description`,`difficulty`,`base_spirit`,`taste_tags`,`glass_type`,`method`,`tips`,`sort_order`,`status`,`create_time`,`update_time`,`source`,`cover`)
VALUES (46,'蓝色泻湖','Blue Lagoon','伏特加与蓝橙的湛蓝长饮，热带风情满满。',1,'伏特加','甜味,果香,清爽','高球杯','build','柠檬汁平衡甜度，色泽惊艳。',69,1,NOW(),NOW(),'official',NULL);
INSERT INTO `cocktail_categories` (`cocktail_id`,`category_id`) VALUES (46,2),(46,8),(46,7);
INSERT INTO `cocktail_ingredients` (`cocktail_id`,`ingredient_id`,`amount`,`is_optional`,`sort_order`) VALUES
(46,(SELECT id FROM ingredients WHERE name='伏特加'),'45ml',0,0),
(46,(SELECT id FROM ingredients WHERE name='蓝橙利口酒'),'20ml',0,1),
(46,(SELECT id FROM ingredients WHERE name='柠檬汁'),'15ml',0,2),
(46,(SELECT id FROM ingredients WHERE name='柠檬汽水'),'90ml',0,3),
(46,(SELECT id FROM ingredients WHERE name='冰块'),'适量',0,4);
INSERT INTO `cocktail_steps` (`cocktail_id`,`step_number`,`description`,`create_time`) VALUES
(46,1,'高球杯加满冰块',NOW()),(46,2,'倒入伏特加、蓝橙和柠檬汁',NOW()),(46,3,'注满柠檬汽水',NOW()),(46,4,'以柠檬片装饰',NOW());

-- 47 布法罗士兵
INSERT INTO `cocktails` (`id`,`name`,`name_en`,`description`,`difficulty`,`base_spirit`,`taste_tags`,`glass_type`,`method`,`tips`,`sort_order`,`status`,`create_time`,`update_time`,`source`,`cover`)
VALUES (47,'布法罗士兵','Buffalo Soldier','内格罗尼加橙汁的变体，口感更圆润果香。',2,'金酒','苦味,果香,微甜','古典杯','stir','橙汁用量不宜过多，点缀即可。',68,1,NOW(),NOW(),'official',NULL);
INSERT INTO `cocktail_categories` (`cocktail_id`,`category_id`) VALUES (47,3),(47,10),(47,11);
INSERT INTO `cocktail_ingredients` (`cocktail_id`,`ingredient_id`,`amount`,`is_optional`,`sort_order`) VALUES
(47,(SELECT id FROM ingredients WHERE name='金酒'),'30ml',0,0),
(47,(SELECT id FROM ingredients WHERE name='金巴利'),'30ml',0,1),
(47,(SELECT id FROM ingredients WHERE name='甜味美思'),'30ml',0,2),
(47,(SELECT id FROM ingredients WHERE name='橙汁'),'20ml',0,3),
(47,(SELECT id FROM ingredients WHERE name='冰块'),'适量',0,4);
INSERT INTO `cocktail_steps` (`cocktail_id`,`step_number`,`description`,`create_time`) VALUES
(47,1,'所有材料加冰搅拌',NOW()),(47,2,'过滤入古典杯的大冰块上',NOW()),(47,3,'以橙皮装饰',NOW());

-- 48 维斯珀马天尼
INSERT INTO `cocktails` (`id`,`name`,`name_en`,`description`,`difficulty`,`base_spirit`,`taste_tags`,`glass_type`,`method`,`tips`,`sort_order`,`status`,`create_time`,`update_time`,`source`,`cover`)
VALUES (48,'维斯珀马天尼','Vesper Martini','詹姆斯·邦德挚爱，金酒与伏特加的双基酒组合，冷冽有力。',3,'金酒','干爽,清冽,浓烈','马天尼杯','stir','充分冰镇，以柠檬皮装饰。',67,1,NOW(),NOW(),'official',NULL);
INSERT INTO `cocktail_categories` (`cocktail_id`,`category_id`) VALUES (48,3),(48,12),(48,10);
INSERT INTO `cocktail_ingredients` (`cocktail_id`,`ingredient_id`,`amount`,`is_optional`,`sort_order`) VALUES
(48,(SELECT id FROM ingredients WHERE name='金酒'),'45ml',0,0),
(48,(SELECT id FROM ingredients WHERE name='伏特加'),'15ml',0,1),
(48,(SELECT id FROM ingredients WHERE name='干味美思'),'7.5ml',0,2),
(48,(SELECT id FROM ingredients WHERE name='柠檬皮'),'1个',1,3),
(48,(SELECT id FROM ingredients WHERE name='冰块'),'适量',0,4);
INSERT INTO `cocktail_steps` (`cocktail_id`,`step_number`,`description`,`create_time`) VALUES
(48,1,'所有材料加冰充分搅拌',NOW()),(48,2,'过滤入冰镇马天尼杯',NOW()),(48,3,'以柠檬皮装饰',NOW());

-- 49  Jack Rose
INSERT INTO `cocktails` (`id`,`name`,`name_en`,`description`,`difficulty`,`base_spirit`,`taste_tags`,`glass_type`,`method`,`tips`,`sort_order`,`status`,`create_time`,`update_time`,`source`,`cover`)
VALUES (49,'杰克玫瑰','Jack Rose','苹果白兰地、石榴糖浆与柠檬的经典酸酒，色泽玫红。',2,'白兰地','酸甜,果香,醇厚','鸡尾酒杯','shake','用苹果白兰地（Calvados）风味最佳。',66,1,NOW(),NOW(),'official',NULL);
INSERT INTO `cocktail_categories` (`cocktail_id`,`category_id`) VALUES (49,6),(49,9),(49,11);
INSERT INTO `cocktail_ingredients` (`cocktail_id`,`ingredient_id`,`amount`,`is_optional`,`sort_order`) VALUES
(49,(SELECT id FROM ingredients WHERE name='苹果白兰地'),'50ml',0,0),
(49,(SELECT id FROM ingredients WHERE name='石榴糖浆'),'15ml',0,1),
(49,(SELECT id FROM ingredients WHERE name='柠檬汁'),'20ml',0,2),
(49,(SELECT id FROM ingredients WHERE name='冰块'),'适量',0,3);
INSERT INTO `cocktail_steps` (`cocktail_id`,`step_number`,`description`,`create_time`) VALUES
(49,1,'所有材料加冰摇晃',NOW()),(49,2,'过滤入冰镇鸡尾酒杯',NOW());
