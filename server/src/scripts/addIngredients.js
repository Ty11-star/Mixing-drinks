/**
 * 扩充材料库种子脚本（幂等：已存在的材料按名称跳过，可重复执行）
 * 用法: node src/scripts/addIngredients.js
 */
const { sequelize, testConnection } = require('../config/database');
const { Ingredient } = require('../models');

const NEW_INGREDIENTS = [
  // —— 利口酒 ——
  { name: '金巴利', nameEn: 'Campari', category: 'liqueur', commonUnit: 'ml', description: '意大利苦味利口酒，深红色，内格罗尼的灵魂。' },
  { name: '甜味美思', nameEn: 'Sweet Vermouth', category: 'liqueur', commonUnit: 'ml', description: '红色草本加强葡萄酒，曼哈顿必备。' },
  { name: '干味美思', nameEn: 'Dry Vermouth', category: 'liqueur', commonUnit: 'ml', description: '干型草本加强葡萄酒，马天尼的灵魂。' },
  { name: '百利甜', nameEn: 'Baileys', category: 'liqueur', commonUnit: 'ml', description: '爱尔兰奶油利口酒，香甜丝滑。' },
  { name: '椰子朗姆酒', nameEn: 'Malibu', category: 'liqueur', commonUnit: 'ml', description: '椰子风味朗姆利口酒，热带风情。' },
  { name: '杏子白兰地', nameEn: 'Apricot Brandy', category: 'liqueur', commonUnit: 'ml', description: '杏果风味利口酒，酸甜适口。' },
  { name: '桃味利口酒', nameEn: 'Peach Schnapps', category: 'liqueur', commonUnit: 'ml', description: '蜜桃风味利口酒，性安德鲁斯等经典配料。' },

  // —— 果汁 / 饮料 ——
  { name: '椰浆', nameEn: 'Coconut Cream', category: 'juice', commonUnit: 'ml', description: '浓稠椰子奶油，椰林飘香的灵魂。' },
  { name: '椰子水', nameEn: 'Coconut Water', category: 'juice', commonUnit: 'ml', description: '清爽天然的椰子清汁。' },
  { name: '苹果汁', nameEn: 'Apple Juice', category: 'juice', commonUnit: 'ml', description: '清甜的苹果汁，适配金酒与威士忌。' },
  { name: '蜜桃汁', nameEn: 'Peach Juice', category: 'juice', commonUnit: 'ml', description: '香甜的蜜桃果汁。' },
  { name: '牛奶', nameEn: 'Milk', category: 'juice', commonUnit: 'ml', description: '全脂牛奶，白兰地亚历山大等经典原料。' },
  { name: '淡奶油', nameEn: 'Heavy Cream', category: 'juice', commonUnit: 'ml', description: '打发或直接使用，增添丝滑口感。' },
  { name: '冷萃咖啡', nameEn: 'Cold Brew Coffee', category: 'juice', commonUnit: 'ml', description: '低酸顺滑的冷萃咖啡，黑俄罗斯人伴侣。' },
  { name: '柠檬汽水', nameEn: 'Lemon Soda', category: 'juice', commonUnit: 'ml', description: '柠檬味碳酸饮料，清爽气泡。' },
  { name: '干姜水', nameEn: 'Ginger Ale', category: 'juice', commonUnit: 'ml', description: '温和姜味气泡水，高架类经典。' },
  { name: '冰绿茶', nameEn: 'Iced Green Tea', category: 'juice', commonUnit: 'ml', description: '清爽茶底，适合低度长饮。' },

  // —— 糖浆 ——
  { name: '蜂蜜糖浆', nameEn: 'Honey Syrup', category: 'syrup', commonUnit: 'ml', description: '蜂蜜与水 3:1 调和，口感圆润。' },
  { name: '香草糖浆', nameEn: 'Vanilla Syrup', category: 'syrup', commonUnit: 'ml', description: '香草风味糖浆，甜香柔和。' },
  { name: '焦糖糖浆', nameEn: 'Caramel Syrup', category: 'syrup', commonUnit: 'ml', description: '焦糖风味糖浆，适合咖啡类与威士忌类。' },
  { name: '青柠糖浆', nameEn: 'Lime Cordial', category: 'syrup', commonUnit: 'ml', description: '青柠风味浓缩糖浆，吉姆雷特常用。' },
  { name: '肉桂糖浆', nameEn: 'Cinnamon Syrup', category: 'syrup', commonUnit: 'ml', description: '辛香甜润，秋冬饮品佳配。' },

  // —— 装饰 / 辅料 ——
  { name: '蛋清', nameEn: 'Egg White', category: 'garnish', commonUnit: '个', description: '一个蛋清可打出绵密泡沫层，酸酒经典。' },
  { name: '肉豆蔻粉', nameEn: 'Nutmeg', category: 'garnish', commonUnit: '少许', description: '现磨肉豆蔻粉，蛋奶类饮品的经典点缀。' },
  { name: '迷迭香', nameEn: 'Rosemary', category: 'garnish', commonUnit: '枝', description: '香气浓郁的香草装饰，可炙烤增香。' },
  { name: '姜片', nameEn: 'Ginger Slice', category: 'garnish', commonUnit: '片', description: '辛香姜片，捣压出味。' },

  // —— 其他 ——
  { name: '冰块', nameEn: 'Ice', category: 'other', commonUnit: '适量', description: '降温与稀释，调酒必备。' },
  { name: '苦精', nameEn: 'Bitters', category: 'other', commonUnit: '滴', description: '几滴即可带来复杂香气。' },
  { name: '盐', nameEn: 'Salt', category: 'other', commonUnit: '少许', description: '盐边或少许调味，提升风味层次。' },
  { name: '白糖', nameEn: 'Sugar', category: 'other', commonUnit: '勺', description: '基础甜味剂。' }
];

(async () => {
  try {
    await testConnection();

    let added = 0;
    let skipped = 0;

    for (const item of NEW_INGREDIENTS) {
      const existing = await Ingredient.findOne({ where: { name: item.name } });
      if (existing) {
        skipped++;
        continue;
      }
      await Ingredient.create(Object.assign({ status: 1 }, item));
      added++;
      console.log('✅ 新增材料:', item.name);
    }

    console.log(`\n完成：新增 ${added} 种，跳过 ${skipped} 种（已存在）`);
    process.exit(0);
  } catch (error) {
    console.error('❌ 执行失败:', error.message);
    process.exit(1);
  }
})();
