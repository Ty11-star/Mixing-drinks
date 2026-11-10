-- ============================================
-- 调酒小程序数据库建表脚本
-- 数据库: cocktail_db
-- 版本: v1.0
-- 创建日期: 2026-10-26
-- ============================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS `cocktail_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `cocktail_db`;

-- ============================================
-- 1. 酒谱表 (cocktails)
-- ============================================
DROP TABLE IF EXISTS `cocktails`;
CREATE TABLE `cocktails` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` VARCHAR(100) NOT NULL COMMENT '酒谱名称（中文）',
  `name_en` VARCHAR(100) DEFAULT NULL COMMENT '酒谱名称（英文）',
  `description` TEXT COMMENT '酒谱描述介绍',
  `difficulty` TINYINT NOT NULL DEFAULT 1 COMMENT '难度等级：1-简单 2-中等 3-困难',
  `base_spirit` VARCHAR(50) DEFAULT NULL COMMENT '基酒类型（如：朗姆酒、伏特加等）',
  `taste_tags` VARCHAR(200) DEFAULT NULL COMMENT '口味标签，逗号分隔（如：清爽,薄荷,微甜）',
  `glass_type` VARCHAR(50) DEFAULT NULL COMMENT '使用杯具（如：高球杯、古典杯）',
  `method` VARCHAR(50) DEFAULT NULL COMMENT '调制方法：shake-摇和法/stir-搅拌法/build-兑和法',
  `tips` TEXT COMMENT '小贴士和注意事项',
  `ice_type` VARCHAR(50) DEFAULT NULL COMMENT '冰块类型（如：碎冰、冰块、不加冰）',
  `garnish` VARCHAR(100) DEFAULT NULL COMMENT '装饰物（如：柠檬片、薄荷叶）',
  `alcohol_content` VARCHAR(20) DEFAULT NULL COMMENT '酒精度（如：低度、中度、高度）',
  `origin` VARCHAR(100) DEFAULT NULL COMMENT '起源地（如：古巴、美国）',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序权重，数字越大越靠前',
  `view_count` INT NOT NULL DEFAULT 0 COMMENT '浏览次数',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0-启用 1-禁用',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  INDEX `idx_base_spirit` (`base_spirit`),
  INDEX `idx_difficulty` (`difficulty`),
  INDEX `idx_status` (`status`),
  INDEX `idx_sort_order` (`sort_order` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='酒谱主表';

-- ============================================
-- 2. 材料表 (ingredients)
-- ============================================
DROP TABLE IF EXISTS `ingredients`;
CREATE TABLE `ingredients` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` VARCHAR(100) NOT NULL COMMENT '材料名称',
  `name_en` VARCHAR(100) DEFAULT NULL COMMENT '材料英文名称',
  `category` VARCHAR(50) NOT NULL COMMENT '材料分类：base_spirit-基酒/liqueur-利口酒/juice-果汁/syrup-糖浆/soda-苏打类/garnish-装饰物/other-其他',
  `description` TEXT COMMENT '材料说明和介绍',
  `common_unit` VARCHAR(20) DEFAULT 'ml' COMMENT '常用计量单位（ml/oz/片/滴/适量）',
  `alcohol_degree` DECIMAL(5,2) DEFAULT NULL COMMENT '酒精度数（仅酒类材料）',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序权重',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0-启用 1-禁用',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`),
  INDEX `idx_category` (`category`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='材料库表';

-- ============================================
-- 3. 酒谱材料关联表 (cocktail_ingredients)
-- ============================================
DROP TABLE IF EXISTS `cocktail_ingredients`;
CREATE TABLE `cocktail_ingredients` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `cocktail_id` BIGINT NOT NULL COMMENT '酒谱ID',
  `ingredient_id` BIGINT NOT NULL COMMENT '材料ID',
  `amount` VARCHAR(50) NOT NULL COMMENT '用量（如：45ml、1片、适量、2滴）',
  `is_optional` TINYINT NOT NULL DEFAULT 0 COMMENT '是否可选：0-必需材料 1-可选材料',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '材料展示顺序',
  `remark` VARCHAR(200) DEFAULT NULL COMMENT '备注说明（如：可用其他材料替代）',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  INDEX `idx_cocktail` (`cocktail_id`),
  INDEX `idx_ingredient` (`ingredient_id`),
  INDEX `idx_cocktail_sort` (`cocktail_id`, `sort_order`),
  CONSTRAINT `fk_cocktail_ingredient_cocktail` FOREIGN KEY (`cocktail_id`) REFERENCES `cocktails`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cocktail_ingredient_ingredient` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='酒谱材料关联表';

-- ============================================
-- 4. 调制步骤表 (cocktail_steps)
-- ============================================
DROP TABLE IF EXISTS `cocktail_steps`;
CREATE TABLE `cocktail_steps` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `cocktail_id` BIGINT NOT NULL COMMENT '酒谱ID',
  `step_number` INT NOT NULL COMMENT '步骤序号（从1开始）',
  `description` TEXT NOT NULL COMMENT '步骤详细描述',
  `image_url` VARCHAR(500) DEFAULT NULL COMMENT '步骤配图URL（预留字段）',
  `duration` VARCHAR(50) DEFAULT NULL COMMENT '预计耗时（如：30秒、1分钟）',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  INDEX `idx_cocktail` (`cocktail_id`),
  INDEX `idx_cocktail_step` (`cocktail_id`, `step_number`),
  CONSTRAINT `fk_cocktail_step_cocktail` FOREIGN KEY (`cocktail_id`) REFERENCES `cocktails`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='调制步骤表';

-- ============================================
-- 5. 分类表 (categories)
-- ============================================
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `type` VARCHAR(50) NOT NULL COMMENT '分类类型：base_spirit-基酒分类/taste-口味分类/occasion-场合分类/difficulty-难度分类',
  `icon` VARCHAR(200) DEFAULT NULL COMMENT '分类图标URL',
  `color` VARCHAR(20) DEFAULT NULL COMMENT '分类主题色（hex格式，如：#5B4B8A）',
  `description` VARCHAR(500) DEFAULT NULL COMMENT '分类描述',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序权重',
  `status` TINYINT NOT NULL DEFAULT 0 comment '状态：0-启用 1-禁用',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name_type` (`name`, `type`),
  INDEX `idx_type` (`type`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类表';

-- ============================================
-- 6. 酒谱分类关联表 (cocktail_categories)
-- ============================================
DROP TABLE IF EXISTS `cocktail_categories`;
CREATE TABLE `cocktail_categories` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `cocktail_id` BIGINT NOT NULL COMMENT '酒谱ID',
  `category_id` BIGINT NOT NULL COMMENT '分类ID',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_cocktail_category` (`cocktail_id`, `category_id`),
  INDEX `idx_cocktail` (`cocktail_id`),
  INDEX `idx_category` (`category_id`),
  CONSTRAINT `fk_cocktail_category_cocktail` FOREIGN KEY (`cocktail_id`) REFERENCES `cocktails`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cocktail_category_category` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='酒谱分类关联表';

-- ============================================
-- 7. 用户表 (users)
-- ============================================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `openid` VARCHAR(100) NOT NULL COMMENT '微信openid',
  `session_key` VARCHAR(100) DEFAULT NULL COMMENT '微信session_key（加密存储）',
  `unionid` VARCHAR(100) DEFAULT NULL COMMENT '微信unionid',
  `nickname` VARCHAR(100) DEFAULT NULL COMMENT '用户昵称',
  `avatar` VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
  `gender` TINYINT DEFAULT 0 COMMENT '性别：0-未知 1-男 2-女',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号（预留）',
  `last_login_time` DATETIME DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` VARCHAR(50) DEFAULT NULL COMMENT '最后登录IP',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0-正常 1-禁用',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_openid` (`openid`),
  INDEX `idx_unionid` (`unionid`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- ============================================
-- 8. 管理员表 (admins)
-- ============================================
DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `username` VARCHAR(50) NOT NULL COMMENT '管理员账号',
  `password` VARCHAR(255) NOT NULL COMMENT '密码',
  `real_name` VARCHAR(50) DEFAULT NULL COMMENT '真实姓名',
  `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  `avatar` VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
  `role` VARCHAR(50) NOT NULL DEFAULT 'admin' COMMENT '角色：super_admin-超级管理员/admin-普通管理员',
  `last_login_time` DATETIME DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` VARCHAR(50) DEFAULT NULL COMMENT '最后登录IP',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0-正常 1-禁用',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员表';

-- ============================================
-- 9. 知识百科表 (knowledge_articles)
-- ============================================
DROP TABLE IF EXISTS `knowledge_articles`;
CREATE TABLE `knowledge_articles` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `title` VARCHAR(200) NOT NULL COMMENT '文章标题',
  `category` VARCHAR(50) NOT NULL COMMENT '分类：base_spirit-基酒知识/tool-器具介绍/technique-调酒技法/term-术语解释',
  `content` TEXT NOT NULL COMMENT '文章内容（支持富文本HTML）',
  `cover_image` VARCHAR(500) DEFAULT NULL COMMENT '封面图URL',
  `author` VARCHAR(50) DEFAULT '系统' COMMENT '作者',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序权重',
  `view_count` INT NOT NULL DEFAULT 0 COMMENT '浏览次数',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0-已发布 1-草稿',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  INDEX `idx_category` (`category`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='知识百科表';

-- ============================================
-- 10. 操作日志表 (operation_logs)
-- ============================================
DROP TABLE IF EXISTS `operation_logs`;
CREATE TABLE `operation_logs` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `admin_id` BIGINT NOT NULL COMMENT '管理员ID',
  `admin_username` VARCHAR(50) NOT NULL COMMENT '管理员账号（冗余字段，便于查询）',
  `module` VARCHAR(50) NOT NULL COMMENT '操作模块（如：cocktail、ingredient、user）',
  `action` VARCHAR(50) NOT NULL COMMENT '操作类型（如：create、update、delete）',
  `description` VARCHAR(500) NOT NULL COMMENT '操作描述',
  `request_uri` VARCHAR(200) DEFAULT NULL COMMENT '请求URI',
  `request_method` VARCHAR(10) DEFAULT NULL COMMENT '请求方法（GET/POST/PUT/DELETE）',
  `request_params` TEXT COMMENT '请求参数（JSON格式）',
  `ip_address` VARCHAR(50) DEFAULT NULL COMMENT '操作IP',
  `user_agent` VARCHAR(500) DEFAULT NULL COMMENT '用户代理',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '操作结果：0-成功 1-失败',
  `error_message` TEXT COMMENT '错误信息（失败时记录）',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  PRIMARY KEY (`id`),
  INDEX `idx_admin_id` (`admin_id`),
  INDEX `idx_module` (`module`),
  INDEX `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='操作日志表';

-- ============================================
-- 初始化数据
-- ============================================

-- 插入默认管理员账号（用户名：admin，密码：admin123，明文存储）
-- 注意：生产环境需要改为BCrypt加密存储
INSERT INTO `admins` (`username`, `password`, `real_name`, `role`, `status`) VALUES
('admin', 'admin123', '系统管理员', 'super_admin', 0);

-- ============================================
-- 插入分类数据
-- ============================================

-- 基酒分类
INSERT INTO `categories` (`name`, `type`, `icon`, `color`, `description`, `sort_order`, `status`) VALUES
('伏特加', 'base_spirit', '/images/伏特加.png', '#E8F5E9', '源自俄罗斯的透明烈酒，口感纯净', 10, 0),
('朗姆酒', 'base_spirit', '/images/朗姆酒.png', '#FFF3E0', '来自加勒比的甘蔗酒，香甜浓郁', 9, 0),
('金酒', 'base_spirit', '/images/金酒.png', '#E3F2FD', '以杜松子为主要香料的烈酒', 8, 0),
('龙舌兰', 'base_spirit', '/images/龙舌兰.png', '#FFF9C4', '墨西哥特产，龙舌兰植物酿造', 7, 0),
('威士忌', 'base_spirit', '/images/威士忌.png', '#EFEBE9', '谷物发酵蒸馏，橡木桶陈年', 6, 0),
('白兰地', 'base_spirit', '/images/白兰地.png', '#FCE4EC', '水果蒸馏酒，多以葡萄为原料', 5, 0);

-- 口味分类
INSERT INTO `categories` (`name`, `type`, `color`, `description`, `sort_order`, `status`) VALUES
('清爽', 'taste', '#B2DFDB', '口感清爽，适合夏日', 10, 0),
('香甜', 'taste', '#F8BBD0', '口感甜美，易于入口', 9, 0),
('浓烈', 'taste', '#FFCCBC', '酒精感强，适合老手', 8, 0),
('果香', 'taste', '#FFECB3', '果汁丰富，果香浓郁', 7, 0),
('微苦', 'taste', '#D7CCC8', '带有苦味，层次丰富', 6, 0);

-- 难度分类
INSERT INTO `categories` (`name`, `type`, `color`, `description`, `sort_order`, `status`) VALUES
('简单', 'difficulty', '#C8E6C9', '新手友好，易于上手', 10, 0),
('中等', 'difficulty', '#FFE082', '需要一定技巧', 9, 0),
('困难', 'difficulty', '#FFAB91', '需要专业技法', 8, 0);

-- ============================================
-- 插入材料数据
-- ============================================

-- 基酒类
INSERT INTO `ingredients` (`name`, `name_en`, `category`, `description`, `common_unit`, `alcohol_degree`, `sort_order`, `status`) VALUES
('伏特加', 'Vodka', 'base_spirit', '无色透明的烈性酒，口感纯净', 'ml', 40.00, 100, 0),
('白朗姆酒', 'White Rum', 'base_spirit', '透明或浅色的朗姆酒，口感清淡', 'ml', 40.00, 99, 0),
('金朗姆酒', 'Gold Rum', 'base_spirit', '经橡木桶陈年的朗姆酒，呈金黄色', 'ml', 40.00, 98, 0),
('黑朗姆酒', 'Dark Rum', 'base_spirit', '深色朗姆酒，口感浓郁', 'ml', 40.00, 97, 0),
('金酒', 'Gin', 'base_spirit', '以杜松子为主要香料的烈酒', 'ml', 40.00, 96, 0),
('龙舌兰', 'Tequila', 'base_spirit', '墨西哥特产烈酒', 'ml', 40.00, 95, 0),
('威士忌', 'Whiskey', 'base_spirit', '谷物蒸馏酒，橡木桶陈年', 'ml', 40.00, 94, 0),
('波本威士忌', 'Bourbon', 'base_spirit', '美国威士忌，玉米含量高', 'ml', 40.00, 93, 0);

-- 利口酒类
INSERT INTO `ingredients` (`name`, `name_en`, `category`, `description`, `common_unit`, `alcohol_degree`, `sort_order`, `status`) VALUES
('橙味利口酒', 'Triple Sec', 'liqueur', '橙皮香味的甜酒', 'ml', 20.00, 80, 0),
('君度', 'Cointreau', 'liqueur', '法国橙味利口酒品牌', 'ml', 40.00, 79, 0),
('蓝橙利口酒', 'Blue Curacao', 'liqueur', '蓝色橙味利口酒', 'ml', 20.00, 78, 0),
('薄荷利口酒', 'Creme de Menthe', 'liqueur', '薄荷味甜酒', 'ml', 20.00, 77, 0),
('咖啡利口酒', 'Kahlua', 'liqueur', '咖啡味甜酒', 'ml', 20.00, 76, 0);

-- 果汁/饮料类
INSERT INTO `ingredients` (`name`, `name_en`, `category`, `description`, `common_unit`, `sort_order`, `status`) VALUES
('青柠汁', 'Lime Juice', 'juice', '新鲜青柠榨汁', 'ml', 60, 0),
('柠檬汁', 'Lemon Juice', 'juice', '新鲜柠檬榨汁', 'ml', 59, 0),
('橙汁', 'Orange Juice', 'juice', '新鲜橙子榨汁', 'ml', 58, 0),
('蔓越莓汁', 'Cranberry Juice', 'juice', '蔓越莓果汁', 'ml', 57, 0),
('菠萝汁', 'Pineapple Juice', 'juice', '新鲜菠萝榨汁', 'ml', 56, 0),
('西柚汁', 'Grapefruit Juice', 'juice', '新鲜西柚榨汁', 'ml', 55, 0),
('番茄汁', 'Tomato Juice', 'juice', '新鲜番茄榨汁', 'ml', 54, 0),
('苏打水', 'Soda Water', 'soda', '碳酸水', 'ml', 53, 0),
('汤力水', 'Tonic Water', 'soda', '含奎宁的碳酸水', 'ml', 52, 0),
('可乐', 'Coca Cola', 'soda', '可口可乐', 'ml', 51, 0),
('雪碧', 'Sprite', 'soda', '柠檬味汽水', 'ml', 50, 0),
('姜汁汽水', 'Ginger Beer', 'soda', '姜味碳酸饮料', 'ml', 49, 0);

-- 糖浆类
INSERT INTO `ingredients` (`name`, `name_en`, `category`, `description`, `common_unit`, `sort_order`, `status`) VALUES
('糖浆', 'Simple Syrup', 'syrup', '白糖和水1:1熬制', 'ml', 40, 0),
('石榴糖浆', 'Grenadine', 'syrup', '石榴风味糖浆', 'ml', 39, 0),
('蜂蜜糖浆', 'Honey Syrup', 'syrup', '蜂蜜和水混合', 'ml', 38, 0);

-- 其他辅料
INSERT INTO `ingredients` (`name`, `name_en`, `category`, `description`, `common_unit`, `sort_order`, `status`) VALUES
('白糖', 'Sugar', 'other', '白砂糖', '勺', 30, 0),
('盐', 'Salt', 'other', '食用盐', '适量', 29, 0),
('黑胡椒', 'Black Pepper', 'other', '黑胡椒粉', '适量', 28, 0),
('辣椒酱', 'Hot Sauce', 'other', '塔巴斯科辣椒酱', '滴', 27, 0),
('伍斯特沙司', 'Worcestershire Sauce', 'other', '英国调味酱', '滴', 26, 0),
('苦精', 'Angostura Bitters', 'other', '安格斯图拉苦精', '滴', 25, 0),
('冰块', 'Ice', 'other', '纯净水冻制', '适量', 24, 0);

-- 装饰物
INSERT INTO `ingredients` (`name`, `name_en`, `category`, `description`, `common_unit`, `sort_order`, `status`) VALUES
('薄荷叶', 'Mint Leaves', 'garnish', '新鲜薄荷', '片', 20, 0),
('青柠片', 'Lime Wedge', 'garnish', '切片青柠', '片', 19, 0),
('柠檬片', 'Lemon Wedge', 'garnish', '切片柠檬', '片', 18, 0),
('橙片', 'Orange Slice', 'garnish', '切片橙子', '片', 17, 0),
('樱桃', 'Maraschino Cherry', 'garnish', '鸡尾酒樱桃', '颗', 16, 0),
('黄瓜片', 'Cucumber Slice', 'garnish', '切片黄瓜', '片', 15, 0),
('芹菜杆', 'Celery Stalk', 'garnish', '新鲜芹菜', '根', 14, 0);

-- ============================================
-- 数据库脚本执行说明
-- ============================================
-- 1. 执行本脚本创建数据库和表结构
-- 2. 默认管理员账号：admin / admin123（请在生产环境修改密码）
-- 3. 已初始化基础分类和材料数据
-- 4. 酒谱数据请执行 data.sql 文件导入
