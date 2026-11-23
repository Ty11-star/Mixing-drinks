-- ============================================================
-- 007_convenience_tables.sql
-- 便利店调酒内容管理：建表 + 初始化现有全部数据
-- 可重复执行：使用 INSERT IGNORE，已有数据不会被覆盖
-- ============================================================
SET NAMES utf8mb4;

-- 1. 便利店材料库
CREATE TABLE IF NOT EXISTS `convenience_materials` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` VARCHAR(50) NOT NULL COMMENT '材料名称',
  `emoji` VARCHAR(20) DEFAULT '' COMMENT '表情图标',
  `category` VARCHAR(30) DEFAULT '' COMMENT '材料分类',
  `sort_order` INT DEFAULT 0 COMMENT '排序，越小越靠前',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_conv_material_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='便利店材料库';

-- 2. 便利店配方
CREATE TABLE IF NOT EXISTS `convenience_drinks` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '主键，从1001起',
  `name` VARCHAR(100) NOT NULL COMMENT '配方名称',
  `name_en` VARCHAR(100) DEFAULT '' COMMENT '英文名',
  `emoji` VARCHAR(20) DEFAULT '' COMMENT '表情图标',
  `gradient` VARCHAR(150) DEFAULT '' COMMENT '卡片渐变背景',
  `cost` DECIMAL(6,1) DEFAULT 0 COMMENT '估算成本（元）',
  `steps` INT DEFAULT 0 COMMENT '步骤数',
  `tag` VARCHAR(30) DEFAULT '' COMMENT '标签',
  `tips` TEXT COMMENT '小贴士',
  `instructions` JSON COMMENT '步骤数组',
  `materials` JSON COMMENT '材料数组 [{name,amount}]',
  `scenes` JSON COMMENT '场景数组',
  `status` TINYINT DEFAULT 1 COMMENT '1-启用 0-禁用',
  `sort_order` INT DEFAULT 0 COMMENT '排序，越小越靠前',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_conv_drink_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=1001 DEFAULT CHARSET=utf8mb4 COMMENT='便利店配方';

-- 3. 便利店避坑指南
CREATE TABLE IF NOT EXISTS `convenience_pitfalls` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '主键',
  `emoji` VARCHAR(20) DEFAULT '' COMMENT '表情图标',
  `title` VARCHAR(100) NOT NULL COMMENT '标题',
  `desc` TEXT COMMENT '说明',
  `sort_order` INT DEFAULT 0 COMMENT '排序，越小越靠前',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='便利店避坑指南';

-- ============================================================
-- 初始化数据
-- ============================================================

-- 材料库
INSERT IGNORE INTO `convenience_materials` (`name`,`emoji`,`category`,`sort_order`) VALUES
  ('可乐','🥤','碳酸饮料',0),
  ('雪碧','🥤','碳酸饮料',1),
  ('七喜','🍋','碳酸饮料',2),
  ('苏打水','💧','碳酸饮料',3),
  ('气泡水','🫧','碳酸饮料',4),
  ('橙汁','🍊','果汁',5),
  ('葡萄汁','🍇','果汁',6),
  ('西瓜汁','🍉','果汁',7),
  ('蜜桃汁','🍑','果汁',8),
  ('番茄汁','🍅','果汁',9),
  ('柠檬','🍋','水果',10),
  ('青柠','🍋','水果',11),
  ('薄荷','🌿','水果',12),
  ('牛奶','🥛','乳品',13),
  ('酸奶','🥛','乳品',14),
  ('养乐多','🧫','乳品',15),
  ('椰汁','🥥','乳品',16),
  ('淡奶油','🥛','乳品',17),
  ('罐装咖啡','☕','茶饮咖啡',18),
  ('冰红茶','🧋','茶饮咖啡',19),
  ('乌龙茶','🍵','茶饮咖啡',20),
  ('橙片','🍊','水果',21),
  ('话梅','🫒','调味',22),
  ('蜂蜜','🍯','调味',23),
  ('盐','🧂','调味',24),
  ('黑胡椒','🌶️','调味',25),
  ('冰块','🧊','其他',26),
  ('伏特加小瓶','🍶','酒类',27),
  ('朗姆酒小瓶','🍶','酒类',28),
  ('梅子酒','🍶','酒类',29),
  ('预调酒','🍸','酒类',30),
  ('米酒','🍶','酒类',31),
  ('百利甜','🥃','酒类',32),
  ('野格','🌿','酒类',33),
  ('金酒小瓶','🍸','酒类',34),
  ('威士忌小瓶','🥃','酒类',35),
  ('烧酒','🍶','酒类',36),
  ('维他柠檬茶','🍋','茶饮咖啡',37),
  ('汤力水','🥤','碳酸饮料',38),
  ('椰子水','🥥','果汁',39),
  ('旺仔牛奶','🥛','乳品',40),
  ('阿华田','☕','茶饮咖啡',41),
  ('奶茶','🧋','茶饮咖啡',42),
  ('茉莉茶','🍵','茶饮咖啡',43),
  ('红牛','🥫','功能饮料',44),
  ('魔爪','🥫','功能饮料',45),
  ('西柚汁','🍊','果汁',46),
  ('红石榴汁','🍒','果汁',47),
  ('薄荷糖','🍬','调味',48),
  ('果冻','🍮','其他',49);

-- 配方
INSERT IGNORE INTO `convenience_drinks` (`id`,`name`,`name_en`,`emoji`,`gradient`,`cost`,`steps`,`tag`,`tips`,`instructions`,`materials`,`scenes`,`status`,`sort_order`) VALUES
  (1001,'咸柠七','Salted Lemon Seven','🍋','linear-gradient(135deg,#F0E6D2,#E6D2A8)',6,3,'3分钟','咸味能把气泡的清爽放大，夏天喝一杯特别解渴。','["柠檬切半，挤汁入杯，留一片装饰","加少许盐和冰块","倒入七喜，轻轻搅拌即可"]','[{"name":"七喜","amount":"1罐"},{"name":"柠檬","amount":"1个"},{"name":"盐","amount":"少许"},{"name":"冰块","amount":"适量"}]','["zero","dorm","camping"]',1,0),
  (1002,'自由古巴','Cuba Libre','🥤','linear-gradient(135deg,#E6D2A8,#DCB88A)',12,3,'经典','便利店买小瓶朗姆就够，青柠是灵魂，别省。','["杯中加满冰块","倒入朗姆酒和可乐","挤入青柠汁，放一块青柠装饰"]','[{"name":"朗姆酒小瓶","amount":"1瓶"},{"name":"可乐","amount":"1罐"},{"name":"青柠","amount":"1块"},{"name":"冰块","amount":"适量"}]','["tipsy","camping"]',1,1),
  (1003,'乳酸气泡','Yogurt Fizz','🧫','linear-gradient(135deg,#E4EBDD,#CFDCC0)',7,2,'2分钟','养乐多和气泡水的比例约 1:2，酸甜又轻盈。','["杯中加冰，倒入养乐多","缓缓注入气泡水，轻轻搅匀"]','[{"name":"养乐多","amount":"1瓶"},{"name":"气泡水","amount":"1罐"},{"name":"冰块","amount":"适量"}]','["zero","tea","dorm"]',1,2),
  (1004,'柠檬红茶','Lemon Tea','🍋','linear-gradient(135deg,#EFE4D5,#E3C9A6)',6,3,'零失败','蜂蜜先用少量温水化开更好融合。','["柠檬切片放入杯中","加蜂蜜和冰块","倒入冰红茶摇匀"]','[{"name":"冰红茶","amount":"1瓶"},{"name":"柠檬","amount":"1片"},{"name":"蜂蜜","amount":"1勺"},{"name":"冰块","amount":"适量"}]','["zero","tea","dorm"]',1,3),
  (1005,'西瓜气泡','Watermelon Fizz','🍉','linear-gradient(135deg,#EFDFD9,#E3C4BD)',8,2,'3分钟','西瓜汁和气泡水 1:1，颜色粉嫩特别适合拍照。','["杯中加冰，倒入西瓜汁","注入气泡水，挤入青柠汁"]','[{"name":"西瓜汁","amount":"150ml"},{"name":"气泡水","amount":"150ml"},{"name":"青柠","amount":"1块"},{"name":"冰块","amount":"适量"}]','["zero","camping","tea"]',1,4),
  (1006,'伏特加橙汁','Screwdriver','🍊','linear-gradient(135deg,#EFE4D5,#DFC28F)',13,2,'经典','最经典的入门调酒，橙汁选纯果汁口感更好。','["杯中加满冰块","倒入伏特加和橙汁搅匀，放橙片装饰"]','[{"name":"伏特加小瓶","amount":"1瓶"},{"name":"橙汁","amount":"1盒"},{"name":"橙片","amount":"1片"},{"name":"冰块","amount":"适量"}]','["tipsy","camping"]',1,5),
  (1007,'椰奶冰咖','Coconut Iced Coffee','🥥','linear-gradient(135deg,#EDEEE9,#CFD3CC)',9,2,'下午茶','椰汁的甜刚好中和咖啡的苦，搅拌后更香。','["杯中加满冰块","先倒椰汁再倒入咖啡，分层也好看"]','[{"name":"椰汁","amount":"100ml"},{"name":"罐装咖啡","amount":"1罐"},{"name":"冰块","amount":"适量"}]','["zero","tea"]',1,6),
  (1008,'葡萄气泡','Grape Fizz','🍇','linear-gradient(135deg,#E8E1E6,#CDBCC8)',7,2,'2分钟','用紫葡萄汁颜色最漂亮，白葡萄汁更清爽。','["杯中加冰，倒入葡萄汁","注满苏打水，放柠檬片"]','[{"name":"葡萄汁","amount":"150ml"},{"name":"苏打水","amount":"150ml"},{"name":"柠檬","amount":"1片"},{"name":"冰块","amount":"适量"}]','["zero","dorm","tea"]',1,7),
  (1009,'奶香咖啡冰','Coffee Milk','☕','linear-gradient(135deg,#E7E2DA,#CDBFB4)',8,2,'提神','全脂牛奶更香浓，脱脂更清爽，按喜好选。','["杯中加冰，倒入牛奶","缓缓倒入咖啡，搅匀即可"]','[{"name":"牛奶","amount":"150ml"},{"name":"罐装咖啡","amount":"1罐"},{"name":"冰块","amount":"适量"}]','["zero","tea","dorm"]',1,8),
  (1010,'蜜桃乌龙气泡','Peach Oolong Fizz','🍑','linear-gradient(135deg,#EFDFE2,#DDB9C1)',8,3,'清新','三种液体等量，茶香和果香平衡得刚好。','["杯中加冰，倒入蜜桃汁和乌龙茶","注满气泡水","轻轻搅拌"]','[{"name":"蜜桃汁","amount":"100ml"},{"name":"乌龙茶","amount":"100ml"},{"name":"气泡水","amount":"100ml"},{"name":"冰块","amount":"适量"}]','["zero","tea","dorm"]',1,9),
  (1011,'梅子苏打','Plum Soda','🍶','linear-gradient(135deg,#E8E1E6,#BCA0BC)',12,2,'微醺','梅子酒甜度高，苏打水可以多放一点解腻。','["杯中加冰，倒入梅子酒","注满苏打水搅匀"]','[{"name":"梅子酒","amount":"45ml"},{"name":"苏打水","amount":"150ml"},{"name":"冰块","amount":"适量"}]','["tipsy","tea"]',1,10),
  (1012,'话梅可乐','Plum Cola','🥤','linear-gradient(135deg,#E7E2DA,#B3A297)',6,2,'怀旧','话梅泡久一点会更入味，咸甜交织很上头。','["话梅放入杯底，加冰块","倒入可乐，放柠檬片"]','[{"name":"可乐","amount":"1罐"},{"name":"话梅","amount":"2颗"},{"name":"柠檬","amount":"1片"},{"name":"冰块","amount":"适量"}]','["zero","dorm","camping"]',1,11),
  (1013,'青柠梳打','Lime Soda','🍋','linear-gradient(135deg,#E4EBDD,#BFD0A8)',5,2,'最省钱','五块钱搞定，清爽程度不输任何气泡酒。','["青柠切块挤汁入杯，加少许盐","加冰，倒满苏打水"]','[{"name":"青柠","amount":"1个"},{"name":"苏打水","amount":"1罐"},{"name":"盐","amount":"少许"},{"name":"冰块","amount":"适量"}]','["zero","dorm","camping"]',1,12),
  (1014,'酸奶水果杯','Yogurt Fruit Cup','🍓','linear-gradient(135deg,#EFDFE2,#DDB9C1)',9,2,'健康','选浓稠的老酸奶口感更好，像甜品一样。','["酸奶倒入杯中","淋上蜜桃汁，放柠檬片"]','[{"name":"酸奶","amount":"1杯"},{"name":"蜜桃汁","amount":"50ml"},{"name":"柠檬","amount":"1片"}]','["zero","tea"]',1,13),
  (1015,'预调果酒气泡','RTD Fizz','🍸','linear-gradient(135deg,#EFE4D5,#E0C3B4)',11,2,'超简单','预调酒兑气泡水能降低甜度，喝起来更清爽。','["杯中加冰，倒入预调酒","兑入气泡水，放柠檬片"]','[{"name":"预调酒","amount":"1罐"},{"name":"气泡水","amount":"100ml"},{"name":"柠檬","amount":"1片"},{"name":"冰块","amount":"适量"}]','["tipsy","camping"]',1,14),
  (1016,'蜂蜜柠檬水','Honey Lemon','🍯','linear-gradient(135deg,#F2EBD4,#E7D9A0)',5,3,'零失败','蜂蜜先用温水化开，和柠檬更搭。','["柠檬切片，加蜂蜜腌5分钟","加冰和苏打水","搅匀即可"]','[{"name":"柠檬","amount":"1个"},{"name":"蜂蜜","amount":"2勺"},{"name":"苏打水","amount":"1罐"},{"name":"冰块","amount":"适量"}]','["zero","dorm","camping"]',1,15),
  (1017,'咸味番茄杯','Salty Tomato','🍅','linear-gradient(135deg,#EFDFD9,#E3C4BD)',7,3,'开胃','无酒精版血腥玛丽，露营配餐很开胃。','["番茄汁倒入杯中","挤入柠檬汁，加盐和黑胡椒","加冰搅匀"]','[{"name":"番茄汁","amount":"1盒"},{"name":"柠檬","amount":"1块"},{"name":"盐","amount":"少许"},{"name":"黑胡椒","amount":"少许"},{"name":"冰块","amount":"适量"}]','["zero","camping"]',1,16),
  (1018,'桂花米酿气泡','Osmanthus Fizz','🌼','linear-gradient(135deg,#F2EBD4,#DFC28F)',9,2,'国风','米酒温润，气泡轻盈，适合慢慢喝。','["杯中加冰，倒入米酒和蜂蜜","注满气泡水搅匀"]','[{"name":"米酒","amount":"60ml"},{"name":"气泡水","amount":"150ml"},{"name":"蜂蜜","amount":"1勺"},{"name":"冰块","amount":"适量"}]','["tipsy","tea"]',1,17),
  (1019,'柠檬茶炸弹','Vita Vodka Tea','🍋','linear-gradient(135deg,#F0E6D2,#DFC28F)',14,3,'人气','便利店最火的懒人组合，柠檬茶的微涩和伏特加特别搭。','["杯中加满冰块","倒入伏特加和维他柠檬茶","放上柠檬片，搅匀即可"]','[{"name":"伏特加小瓶","amount":"1瓶"},{"name":"维他柠檬茶","amount":"1瓶"},{"name":"柠檬","amount":"1片"},{"name":"冰块","amount":"适量"}]','["tipsy","dorm","camping"]',1,18),
  (1020,'威士忌柠檬茶','Whisky Lemon Tea','🥃','linear-gradient(135deg,#EFE4D5,#DCB88A)',15,2,'简单','想更清爽就多加点冰，威士忌选入门款就够。','["杯中加冰，倒入威士忌","倒满维他柠檬茶，搅匀"]','[{"name":"威士忌小瓶","amount":"1瓶"},{"name":"维他柠檬茶","amount":"1瓶"},{"name":"冰块","amount":"适量"}]','["tipsy","camping"]',1,19),
  (1021,'野格红牛','Jägermeister & Red Bull','⚡','linear-gradient(135deg,#E6D2A8,#D3AC77)',16,2,'提神','咖啡因会掩盖醉意，一杯就好，千万别贪杯。','["杯中加满冰块","倒入野格和红牛，搅匀"]','[{"name":"野格","amount":"1瓶"},{"name":"红牛","amount":"1罐"},{"name":"冰块","amount":"适量"}]','["tipsy","camping"]',1,20),
  (1022,'野格魔爪','Jäger Monster','🐉','linear-gradient(135deg,#E1E4EA,#A7AEC0)',16,2,'劲爽','比野格红牛更冲，适合露营熬夜局，量力而行。','["杯中加满冰块","倒入野格和魔爪"]','[{"name":"野格","amount":"1瓶"},{"name":"魔爪","amount":"1罐"},{"name":"冰块","amount":"适量"}]','["tipsy","camping"]',1,21),
  (1023,'百利旺仔','Baileys Wangzai','🥛','linear-gradient(135deg,#EFE4D5,#E3C9A6)',15,2,'甜党','像在喝奶昔，甜甜的很好入口，后劲可不小。','["杯中加冰，倒入百利甜","倒满旺仔牛奶，搅匀"]','[{"name":"百利甜","amount":"1瓶"},{"name":"旺仔牛奶","amount":"1盒"},{"name":"冰块","amount":"适量"}]','["tipsy","tea","dorm"]',1,22),
  (1024,'百利奶茶','Baileys Milk Tea','🧋','linear-gradient(135deg,#E7E2DA,#CDBFB4)',14,2,'丝滑','选无糖奶茶不会太腻，百利甜的奶油香很突出。','["杯中加满冰块","倒入百利甜和奶茶，摇匀"]','[{"name":"百利甜","amount":"1瓶"},{"name":"奶茶","amount":"1瓶"},{"name":"冰块","amount":"适量"}]','["tipsy","tea"]',1,23),
  (1025,'百利阿华田','Baileys Ovaltine','🍫','linear-gradient(135deg,#E7E2DA,#A8988A)',15,3,'巧克力','像一杯大人版的可可牛奶，冬天常温喝也很好。','["阿华田粉用少量温水化开","杯中加冰，倒入牛奶和阿华田","缓缓倒入百利甜"]','[{"name":"百利甜","amount":"1瓶"},{"name":"阿华田","amount":"1份"},{"name":"牛奶","amount":"100ml"},{"name":"冰块","amount":"适量"}]','["tipsy","tea"]',1,24),
  (1026,'金汤力','Gin & Tonic','🍸','linear-gradient(135deg,#E2EADF,#B6D0C4)',14,3,'经典','汤力水的奎宁微苦配金酒最经典，别用苏打水代替。','["杯中加满冰块","倒入金酒和汤力水","挤入青柠汁，放青柠块"]','[{"name":"金酒小瓶","amount":"1瓶"},{"name":"汤力水","amount":"1罐"},{"name":"青柠","amount":"1块"},{"name":"冰块","amount":"适量"}]','["tipsy","camping"]',1,25),
  (1027,'金橙菲兹','Orange Gin Fizz','🍊','linear-gradient(135deg,#EFE4D5,#D3AC77)',13,2,'清爽','金酒的植物香配橙汁特别清新，比例 1:3 最顺口。','["杯中加冰，倒入金酒","倒满橙汁，放橙片"]','[{"name":"金酒小瓶","amount":"1瓶"},{"name":"橙汁","amount":"1盒"},{"name":"橙片","amount":"1片"},{"name":"冰块","amount":"适量"}]','["tipsy","camping"]',1,26),
  (1028,'葡萄茉莉金','Grape Jasmine Gin','🍇','linear-gradient(135deg,#E8E1E6,#BCA0BC)',14,3,'国风','茶香能解酒气，喝起来像高级果茶。','["杯中加冰，倒入葡萄汁和茉莉茶","倒入金酒","轻轻搅匀"]','[{"name":"金酒小瓶","amount":"1瓶"},{"name":"葡萄汁","amount":"100ml"},{"name":"茉莉茶","amount":"100ml"},{"name":"冰块","amount":"适量"}]','["tipsy","tea"]',1,27),
  (1029,'薄荷朗姆','Mint Rum','🌿','linear-gradient(135deg,#E2EADF,#AFC9AE)',13,3,'莫吉托平替','没有新鲜薄荷也能做，薄荷糖就是便利店版莫吉托的灵魂。','["薄荷糖放杯底捣碎","加冰，倒入朗姆酒和雪碧","挤入青柠汁"]','[{"name":"朗姆酒小瓶","amount":"1瓶"},{"name":"雪碧","amount":"1罐"},{"name":"薄荷糖","amount":"2颗"},{"name":"青柠","amount":"1块"},{"name":"冰块","amount":"适量"}]','["tipsy","camping"]',1,28),
  (1030,'椰林漫步','Coconut Rum','🥥','linear-gradient(135deg,#E4EBDD,#B6D0C4)',14,2,'海岛风','比椰汁版更清爽，喝一口仿佛在海边。','["杯中加满冰块","倒入朗姆酒和椰子水，挤青柠汁"]','[{"name":"朗姆酒小瓶","amount":"1瓶"},{"name":"椰子水","amount":"1瓶"},{"name":"青柠","amount":"1块"},{"name":"冰块","amount":"适量"}]','["tipsy","camping"]',1,29),
  (1031,'烧酒雪碧','Soju & Sprite','🍶','linear-gradient(135deg,#F2EBD4,#E7D9A0)',12,2,'韩剧同款','韩国经典喝法，冰透了才好喝。','["杯中加满冰块","倒入烧酒和雪碧，1:1 兑匀"]','[{"name":"烧酒","amount":"1瓶"},{"name":"雪碧","amount":"1罐"},{"name":"冰块","amount":"适量"}]','["tipsy","dorm","camping"]',1,30),
  (1032,'果冻烧酒','Jelly Soju','🍮','linear-gradient(135deg,#EFDFE2,#CE9FAC)',13,2,'趣味','别用吸管，吸不上来还容易呛到。','["果冻切块放入杯中","倒入烧酒，加冰，用勺子吃"]','[{"name":"烧酒","amount":"1瓶"},{"name":"果冻","amount":"1盒"},{"name":"冰块","amount":"适量"}]','["tipsy","dorm"]',1,31),
  (1033,'西柚盐边','Grapefruit Rim','🍊','linear-gradient(135deg,#EFDFD9,#DDAE9B)',13,3,'微苦','盐边能带出西柚的微苦，30 秒做出鸡尾酒的仪式感。','["杯口抹一圈盐","杯中加冰，倒入伏特加和西柚汁","搅匀"]','[{"name":"伏特加小瓶","amount":"1瓶"},{"name":"西柚汁","amount":"1盒"},{"name":"盐","amount":"少许"},{"name":"冰块","amount":"适量"}]','["tipsy","camping"]',1,32),
  (1034,'日落橙','Sunset Orange','🌅','linear-gradient(135deg,#EFE4D5,#CE9C82)',14,3,'分层','红石榴汁密度大，会沉在底部形成日落渐变。','["杯中加冰，倒入橙汁和伏特加","缓缓沿杯壁倒入红石榴汁","不搅拌，看它沉底渐变"]','[{"name":"伏特加小瓶","amount":"1瓶"},{"name":"红石榴汁","amount":"50ml"},{"name":"橙汁","amount":"100ml"},{"name":"冰块","amount":"适量"}]','["tipsy","camping"]',1,33),
  (1035,'话梅柠檬茶酒','Plum Vodka Tea','🫒','linear-gradient(135deg,#F0E6D2,#DCB88A)',12,3,'上头','话梅越泡越有味，咸甜酸一起上，很容易一杯接一杯。','["话梅放杯底，加冰","倒入伏特加","倒满维他柠檬茶，摇匀"]','[{"name":"伏特加小瓶","amount":"1瓶"},{"name":"维他柠檬茶","amount":"1瓶"},{"name":"话梅","amount":"2颗"},{"name":"冰块","amount":"适量"}]','["tipsy","dorm"]',1,34),
  (1036,'威士忌可乐','Whisky & Coke','🥃','linear-gradient(135deg,#E7E2DA,#9C8577)',13,2,'零失败','最不会出错的组合，比例随口味调，1:3 比较稳。','["杯中加满冰块","倒入威士忌和可乐"]','[{"name":"威士忌小瓶","amount":"1瓶"},{"name":"可乐","amount":"1罐"},{"name":"冰块","amount":"适量"}]','["tipsy","camping"]',1,35),
  (1037,'威士忌冰茶','Whisky Iced Tea','🧋','linear-gradient(135deg,#EFE4D5,#B3A297)',13,3,'清爽','茶味能压住酒的烈，喝起来像升级版冰红茶。','["杯中加冰，倒入威士忌","倒满冰红茶","放柠檬片"]','[{"name":"威士忌小瓶","amount":"1瓶"},{"name":"冰红茶","amount":"1瓶"},{"name":"柠檬","amount":"1片"},{"name":"冰块","amount":"适量"}]','["tipsy","camping"]',1,36),
  (1038,'百利咖啡','Baileys Coffee','☕','linear-gradient(135deg,#E7E2DA,#8A7466)',14,2,'提神','爱尔兰咖啡的便利店版，甜苦平衡，下午喝刚好。','["杯中加满冰块","倒入百利甜和咖啡，搅匀"]','[{"name":"百利甜","amount":"1瓶"},{"name":"罐装咖啡","amount":"1罐"},{"name":"冰块","amount":"适量"}]','["tipsy","tea","dorm"]',1,37),
  (1039,'野格阿华田','Jäger Ovaltine','🍫','linear-gradient(135deg,#E7E2DA,#7E685C)',15,3,'巧克力','野格的草药味被巧克力盖住，只剩温暖的甜香。','["阿华田用温水化开","杯中加冰，倒入牛奶和阿华田","缓缓倒入野格"]','[{"name":"野格","amount":"1瓶"},{"name":"阿华田","amount":"1份"},{"name":"牛奶","amount":"100ml"},{"name":"冰块","amount":"适量"}]','["tipsy","tea"]',1,38),
  (1040,'蜜桃乌龙金','Peach Oolong Gin','🍑','linear-gradient(135deg,#EFDFE2,#CE9FAC)',14,3,'果茶','像带酒感的蜜桃乌龙茶，很适合下午茶时间。','["杯中加冰，倒入蜜桃汁和乌龙茶","倒入金酒","摇匀即可"]','[{"name":"金酒小瓶","amount":"1瓶"},{"name":"蜜桃汁","amount":"100ml"},{"name":"乌龙茶","amount":"100ml"},{"name":"冰块","amount":"适量"}]','["tipsy","tea"]',1,39);

-- 避坑指南
INSERT IGNORE INTO `convenience_pitfalls` (`emoji`,`title`,`desc`,`sort_order`) VALUES
  ('⚠️','牛奶别配碳酸饮料','牛奶遇到可乐、苏打水会凝结成絮状，口感很差也影响观感。想加奶就用咖啡或果汁。',0),
  ('🍶','别混着喝不同基酒','伏特加+朗姆+金酒一起兑，容易上头且味道混乱。一杯酒只用一种基酒就好。',1),
  ('🧊','冰块要加够','便利店调酒成败的关键是冰够不够。冰少了味道寡淡，先把杯子加满冰再倒饮料。',2),
  ('🍋','果汁选纯的不选饮料','100% 果汁调出来清爽自然，果味饮料糖分太高会盖过酒香，看配料表第一位是不是水。',3),
  ('🥤','碳酸饮料最后倒','先倒果汁和酒，最后缓缓注入碳酸，能保留气泡；先倒气泡再搅会让气跑光。',4),
  ('🚫','这些组合请避开','能量饮料配酒精容易心跳加速；酸奶配碳酸会分层结块。不确定的组合，先少量试。',5),
  ('⚡','野格红牛别贪杯','咖啡因会掩盖醉意，感觉不到醉其实已经喝多了。野格配红牛或魔爪，一杯就够了。',6),
  ('🥛','百利甜别配碳酸','百利甜含奶油，遇碳酸会结絮。和旺仔、奶茶、咖啡、牛奶搭配才顺滑。',7),
  ('🍮','果冻酒别用吸管','果冻烧酒要用勺子挖着吃，吸管吸不上来，还容易把果冻呛进气管。',8),
  ('🍸','小瓶酒别一次全倒','便利店小瓶酒度数不低，先倒一半试口味。兑饮料时酒和饮料按 1:3 起步最稳。',9);
