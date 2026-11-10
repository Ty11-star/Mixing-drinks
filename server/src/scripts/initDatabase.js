/**
 * 数据库初始化脚本
 * 自动创建数据库（若不存在）、建表并插入初始数据
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const { sequelize } = require('../models');
const { Admin, Category, Ingredient } = require('../models');

/**
 * 如果数据库不存在则自动创建（解决手动在宝塔建库、库名含空格等问题）
 */
async function ensureDatabase() {
  const dbName = process.env.DB_NAME;
  if (!dbName) {
    throw new Error('缺少环境变量 DB_NAME，请在 .env 中配置数据库名（建议使用下划线命名，如 mixing_drinks）');
  }
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`✅ 数据库 "${dbName}" 已就绪（不存在则已自动创建）\n`);
  } catch (err) {
    // 宝塔等环境的数据库用户通常没有全局 CREATE DATABASE 权限，
    // 此时假设数据库已在面板中手动创建，仅给出提示后继续。
    console.warn(`⚠️ 自动创建数据库失败（可忽略，若已在宝塔创建过 "${dbName}"）：${err.message}\n`);
  }
  await connection.end();
}

async function initDatabase() {
  try {
    console.log('开始初始化数据库...\n');

    // 0. 确保数据库存在
    console.log('0. 检查/创建数据库...');
    await ensureDatabase();

    // 同步所有模型（创建表）
    console.log('1. 创建数据库表...');
    await sequelize.sync({ force: true }); // force: true 会删除已存在的表并重新创建
    console.log('✅ 数据库表创建完成\n');

    // 创建默认管理员账号
    console.log('2. 创建默认管理员账号...');
    await Admin.create({
      username: 'admin',
      password: '123456',
      nickname: '系统管理员',
      email: 'admin@mixingdrinks.com',
      status: 1
    });
    console.log('✅ 管理员账号创建完成');
    console.log('   用户名: admin');
    console.log('   密码: 123456\n');

    // 创建分类数据
    console.log('3. 创建分类数据...');
    const categories = [
      // 基酒分类
      { name: '朗姆酒', type: 'base_spirit', sortOrder: 1, icon: '/images/朗姆酒.png' },
      { name: '伏特加', type: 'base_spirit', sortOrder: 2, icon: '/images/伏特加.png' },
      { name: '金酒', type: 'base_spirit', sortOrder: 3, icon: '/images/金酒.png' },
      { name: '威士忌', type: 'base_spirit', sortOrder: 4, icon: '/images/威士忌.png' },
      { name: '龙舌兰', type: 'base_spirit', sortOrder: 5, icon: '/images/龙舌兰.png' },
      { name: '白兰地', type: 'base_spirit', sortOrder: 6, icon: '/images/白兰地.png' },

      // 口味分类
      { name: '清爽', type: 'taste', sortOrder: 1 },
      { name: '甜味', type: 'taste', sortOrder: 2 },
      { name: '酸味', type: 'taste', sortOrder: 3 },
      { name: '苦味', type: 'taste', sortOrder: 4 },
      { name: '果香', type: 'taste', sortOrder: 5 },
      { name: '浓烈', type: 'taste', sortOrder: 6 }
    ];

    await Category.bulkCreate(categories);
    console.log(`✅ 创建了 ${categories.length} 个分类\n`);

    // 创建材料数据
    console.log('4. 创建材料数据...');
    const ingredients = [
      // 基酒
      { name: '白朗姆酒', nameEn: 'White Rum', category: 'base_spirit', commonUnit: 'ml' },
      { name: '金朗姆酒', nameEn: 'Gold Rum', category: 'base_spirit', commonUnit: 'ml' },
      { name: '黑朗姆酒', nameEn: 'Dark Rum', category: 'base_spirit', commonUnit: 'ml' },
      { name: '伏特加', nameEn: 'Vodka', category: 'base_spirit', commonUnit: 'ml' },
      { name: '金酒', nameEn: 'Gin', category: 'base_spirit', commonUnit: 'ml' },
      { name: '龙舌兰', nameEn: 'Tequila', category: 'base_spirit', commonUnit: 'ml' },
      { name: '威士忌', nameEn: 'Whiskey', category: 'base_spirit', commonUnit: 'ml' },
      { name: '白兰地', nameEn: 'Brandy', category: 'base_spirit', commonUnit: 'ml' },

      // 利口酒
      { name: '橙味利口酒', nameEn: 'Triple Sec', category: 'liqueur', commonUnit: 'ml' },
      { name: '薄荷利口酒', nameEn: 'Creme de Menthe', category: 'liqueur', commonUnit: 'ml' },
      { name: '咖啡利口酒', nameEn: 'Coffee Liqueur', category: 'liqueur', commonUnit: 'ml' },
      { name: '蓝橙利口酒', nameEn: 'Blue Curacao', category: 'liqueur', commonUnit: 'ml' },

      // 果汁和饮料
      { name: '青柠汁', nameEn: 'Lime Juice', category: 'juice', commonUnit: 'ml' },
      { name: '柠檬汁', nameEn: 'Lemon Juice', category: 'juice', commonUnit: 'ml' },
      { name: '橙汁', nameEn: 'Orange Juice', category: 'juice', commonUnit: 'ml' },
      { name: '蔓越莓汁', nameEn: 'Cranberry Juice', category: 'juice', commonUnit: 'ml' },
      { name: '菠萝汁', nameEn: 'Pineapple Juice', category: 'juice', commonUnit: 'ml' },
      { name: '西柚汁', nameEn: 'Grapefruit Juice', category: 'juice', commonUnit: 'ml' },
      { name: '番茄汁', nameEn: 'Tomato Juice', category: 'juice', commonUnit: 'ml' },
      { name: '苏打水', nameEn: 'Soda Water', category: 'juice', commonUnit: 'ml' },
      { name: '汤力水', nameEn: 'Tonic Water', category: 'juice', commonUnit: 'ml' },
      { name: '可乐', nameEn: 'Cola', category: 'juice', commonUnit: 'ml' },
      { name: '姜汁啤酒', nameEn: 'Ginger Beer', category: 'juice', commonUnit: 'ml' },

      // 糖浆
      { name: '糖浆', nameEn: 'Simple Syrup', category: 'syrup', commonUnit: 'ml' },
      { name: '石榴糖浆', nameEn: 'Grenadine', category: 'syrup', commonUnit: 'ml' },

      // 装饰和辅料
      { name: '薄荷叶', nameEn: 'Mint Leaves', category: 'garnish', commonUnit: '片' },
      { name: '青柠角', nameEn: 'Lime Wedge', category: 'garnish', commonUnit: '个' },
      { name: '柠檬片', nameEn: 'Lemon Slice', category: 'garnish', commonUnit: '片' },
      { name: '橙片', nameEn: 'Orange Slice', category: 'garnish', commonUnit: '片' },
      { name: '樱桃', nameEn: 'Cherry', category: 'garnish', commonUnit: '个' },
      { name: '盐', nameEn: 'Salt', category: 'other', commonUnit: '适量' },
      { name: '白糖', nameEn: 'Sugar', category: 'other', commonUnit: '茶匙' },
      { name: '黑胡椒', nameEn: 'Black Pepper', category: 'other', commonUnit: '适量' },
      { name: '辣椒酱', nameEn: 'Hot Sauce', category: 'other', commonUnit: '滴' },
      { name: '苦精', nameEn: 'Angostura Bitters', category: 'other', commonUnit: '滴' },
      { name: '冰块', nameEn: 'Ice', category: 'other', commonUnit: '适量' }
    ];

    await Ingredient.bulkCreate(ingredients);
    console.log(`✅ 创建了 ${ingredients.length} 种材料\n`);

    console.log('🎉 数据库初始化完成！\n');
    console.log('你现在可以：');
    console.log('1. 启动服务器: npm run dev');
    console.log('2. 使用管理员账号登录后台');
    console.log('3. 开始添加酒谱数据\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    process.exit(1);
  }
}

// 运行初始化
initDatabase();
