/**
 * 添加测试数据脚本
 * 包含经典鸡尾酒配方
 */

const { sequelize } = require('../models');
const { Cocktail, Ingredient, CocktailIngredient, CocktailStep, Category, CocktailCategory } = require('../models');

async function addTestData() {
  try {
    console.log('开始添加测试数据...\n');

    // 获取材料和分类数据
    const ingredients = await Ingredient.findAll();
    const categories = await Category.findAll();

    // 创建材料映射（方便查找）
    const ingredientMap = {};
    ingredients.forEach(ing => {
      ingredientMap[ing.name] = ing.id;
    });

    // 创建分类映射
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });

    // 定义测试酒谱数据
    const cocktailsData = [
      {
        name: '莫吉托',
        nameEn: 'Mojito',
        description: '莫吉托是最受欢迎的朗姆调酒之一，诞生于古巴。清新的薄荷与青柠完美结合，带来夏日般的清爽体验。',
        difficulty: 1,
        baseSpirit: '朗姆酒',
        tasteTags: '清爽,薄荷,微甜',
        glassType: '高球杯',
        method: 'build',
        tips: '捣碎薄荷时不要过度，否则会产生苦味。使用新鲜青柠效果最佳。',
        sortOrder: 100,
        ingredients: [
          { name: '白朗姆酒', amount: '45ml', isOptional: 0 },
          { name: '青柠汁', amount: '20ml', isOptional: 0 },
          { name: '薄荷叶', amount: '8-10片', isOptional: 0 },
          { name: '白糖', amount: '2茶匙', isOptional: 0 },
          { name: '苏打水', amount: '适量', isOptional: 0 },
          { name: '冰块', amount: '适量', isOptional: 0 }
        ],
        steps: [
          { stepNumber: 1, description: '在高球杯中放入薄荷叶和白糖' },
          { stepNumber: 2, description: '用捣棒轻轻捣碎薄荷叶，释放香气（不要过度）' },
          { stepNumber: 3, description: '挤入新鲜青柠汁' },
          { stepNumber: 4, description: '加入白朗姆酒，搅拌均匀' },
          { stepNumber: 5, description: '加满冰块' },
          { stepNumber: 6, description: '倒入苏打水至杯口' },
          { stepNumber: 7, description: '用薄荷叶和青柠角装饰' }
        ],
        categories: ['朗姆酒', '清爽']
      },
      {
        name: '玛格丽特',
        nameEn: 'Margarita',
        description: '玛格丽特是最著名的龙舌兰鸡尾酒，酸甜平衡，带有独特的盐边装饰。据说是为纪念一位美丽的墨西哥女孩而创作。',
        difficulty: 2,
        baseSpirit: '龙舌兰',
        tasteTags: '酸味,清爽,果香',
        glassType: '玛格丽特杯',
        method: 'shake',
        tips: '使用新鲜青柠汁是关键。盐边可根据个人喜好选择是否添加。',
        sortOrder: 95,
        ingredients: [
          { name: '龙舌兰', amount: '45ml', isOptional: 0 },
          { name: '橙味利口酒', amount: '20ml', isOptional: 0 },
          { name: '青柠汁', amount: '15ml', isOptional: 0 },
          { name: '盐', amount: '适量', isOptional: 1 },
          { name: '冰块', amount: '适量', isOptional: 0 }
        ],
        steps: [
          { stepNumber: 1, description: '用青柠角擦拭杯口' },
          { stepNumber: 2, description: '将杯口在盐盘上滚一圈，制作盐边（可选）' },
          { stepNumber: 3, description: '在调酒壶中加入龙舌兰、橙味利口酒和青柠汁' },
          { stepNumber: 4, description: '加入冰块，用力摇晃15-20秒' },
          { stepNumber: 5, description: '过滤后倒入准备好的杯中' },
          { stepNumber: 6, description: '用青柠角装饰' }
        ],
        categories: ['龙舌兰', '酸味', '清爽']
      },
      {
        name: '金汤力',
        nameEn: 'Gin & Tonic',
        description: '金汤力是最简单也是最经典的金酒调酒，只需金酒和汤力水。清爽的口感和杜松子的香气使其成为永不过时的选择。',
        difficulty: 1,
        baseSpirit: '金酒',
        tasteTags: '清爽,苦味,果香',
        glassType: '高球杯',
        method: 'build',
        tips: '使用高品质的汤力水能显著提升口感。建议使用大量冰块保持冷度。',
        sortOrder: 90,
        ingredients: [
          { name: '金酒', amount: '50ml', isOptional: 0 },
          { name: '汤力水', amount: '150ml', isOptional: 0 },
          { name: '青柠角', amount: '1个', isOptional: 0 },
          { name: '冰块', amount: '适量', isOptional: 0 }
        ],
        steps: [
          { stepNumber: 1, description: '在高球杯中加满冰块' },
          { stepNumber: 2, description: '倒入金酒' },
          { stepNumber: 3, description: '倒入汤力水' },
          { stepNumber: 4, description: '轻轻搅拌' },
          { stepNumber: 5, description: '挤入青柠汁并将青柠角放入杯中装饰' }
        ],
        categories: ['金酒', '清爽']
      },
      {
        name: '血腥玛丽',
        nameEn: 'Bloody Mary',
        description: '血腥玛丽是最著名的早午餐鸡尾酒，以番茄汁为基底，加入伏特加和各种调味料。据说可以缓解宿醉。',
        difficulty: 1,
        baseSpirit: '伏特加',
        tasteTags: '咸味,辣味,浓烈',
        glassType: '高球杯',
        method: 'build',
        tips: '可以根据个人口味调整辣椒酱和黑胡椒的用量。装饰越丰富越好。',
        sortOrder: 85,
        ingredients: [
          { name: '伏特加', amount: '45ml', isOptional: 0 },
          { name: '番茄汁', amount: '90ml', isOptional: 0 },
          { name: '柠檬汁', amount: '15ml', isOptional: 0 },
          { name: '辣椒酱', amount: '3滴', isOptional: 0 },
          { name: '黑胡椒', amount: '适量', isOptional: 0 },
          { name: '盐', amount: '适量', isOptional: 0 },
          { name: '冰块', amount: '适量', isOptional: 0 }
        ],
        steps: [
          { stepNumber: 1, description: '在高球杯中加入冰块' },
          { stepNumber: 2, description: '依次加入伏特加、番茄汁、柠檬汁' },
          { stepNumber: 3, description: '加入辣椒酱、盐、黑胡椒' },
          { stepNumber: 4, description: '用长吧匙充分搅拌均匀' },
          { stepNumber: 5, description: '用柠檬片、芹菜杆等装饰（可选）' }
        ],
        categories: ['伏特加', '浓烈']
      },
      {
        name: '螺丝起子',
        nameEn: 'Screwdriver',
        description: '螺丝起子是最简单的伏特加调酒之一，只需伏特加和橙汁。传说得名于石油工人用螺丝刀搅拌而成。',
        difficulty: 1,
        baseSpirit: '伏特加',
        tasteTags: '甜味,果香,清爽',
        glassType: '高球杯',
        method: 'build',
        tips: '使用鲜榨橙汁口感更佳。可以根据喜好调整伏特加和橙汁的比例。',
        sortOrder: 80,
        ingredients: [
          { name: '伏特加', amount: '50ml', isOptional: 0 },
          { name: '橙汁', amount: '120ml', isOptional: 0 },
          { name: '冰块', amount: '适量', isOptional: 0 },
          { name: '橙片', amount: '1片', isOptional: 1 }
        ],
        steps: [
          { stepNumber: 1, description: '在高球杯中加满冰块' },
          { stepNumber: 2, description: '倒入伏特加' },
          { stepNumber: 3, description: '倒入橙汁' },
          { stepNumber: 4, description: '轻轻搅拌均匀' },
          { stepNumber: 5, description: '用橙片装饰杯口' }
        ],
        categories: ['伏特加', '甜味', '果香']
      },
      {
        name: '威士忌酸',
        nameEn: 'Whiskey Sour',
        description: '威士忌酸是经典的酸味鸡尾酒，完美平衡了威士忌的烈性和柠檬的酸爽。简单却不失优雅。',
        difficulty: 2,
        baseSpirit: '威士忌',
        tasteTags: '酸味,甜味,浓烈',
        glassType: '古典杯',
        method: 'shake',
        tips: '摇晃时要充分，让糖浆完全融合。可以加入蛋清增加口感的丝滑度。',
        sortOrder: 75,
        ingredients: [
          { name: '威士忌', amount: '50ml', isOptional: 0 },
          { name: '柠檬汁', amount: '25ml', isOptional: 0 },
          { name: '糖浆', amount: '15ml', isOptional: 0 },
          { name: '冰块', amount: '适量', isOptional: 0 },
          { name: '樱桃', amount: '1个', isOptional: 1 }
        ],
        steps: [
          { stepNumber: 1, description: '在调酒壶中加入威士忌、柠檬汁和糖浆' },
          { stepNumber: 2, description: '加入冰块，用力摇晃15秒' },
          { stepNumber: 3, description: '过滤后倒入装有冰块的古典杯中' },
          { stepNumber: 4, description: '用樱桃和柠檬片装饰' }
        ],
        categories: ['威士忌', '酸味']
      },
      {
        name: '自由古巴',
        nameEn: 'Cuba Libre',
        description: '自由古巴本质上是朗姆可乐加青柠，但这个名字承载着古巴独立的历史意义。简单却经典的组合。',
        difficulty: 1,
        baseSpirit: '朗姆酒',
        tasteTags: '甜味,清爽',
        glassType: '高球杯',
        method: 'build',
        tips: '青柠汁是关键，它将普通的朗姆可乐提升到鸡尾酒的层次。',
        sortOrder: 70,
        ingredients: [
          { name: '白朗姆酒', amount: '50ml', isOptional: 0 },
          { name: '可乐', amount: '120ml', isOptional: 0 },
          { name: '青柠汁', amount: '10ml', isOptional: 0 },
          { name: '冰块', amount: '适量', isOptional: 0 },
          { name: '青柠角', amount: '1个', isOptional: 0 }
        ],
        steps: [
          { stepNumber: 1, description: '在高球杯中加满冰块' },
          { stepNumber: 2, description: '倒入白朗姆酒' },
          { stepNumber: 3, description: '挤入新鲜青柠汁' },
          { stepNumber: 4, description: '倒入可乐至杯口' },
          { stepNumber: 5, description: '轻轻搅拌，用青柠角装饰' }
        ],
        categories: ['朗姆酒', '甜味']
      },
      {
        name: '莫斯科骡子',
        nameEn: 'Moscow Mule',
        description: '莫斯科骡子是伏特加鸡尾酒中的经典，以铜杯盛装而闻名。姜汁啤酒带来独特的辛辣口感。',
        difficulty: 1,
        baseSpirit: '伏特加',
        tasteTags: '清爽,辣味,果香',
        glassType: '铜杯',
        method: 'build',
        tips: '传统上使用铜杯盛装，能保持饮品冰凉。姜汁啤酒的品质很重要。',
        sortOrder: 65,
        ingredients: [
          { name: '伏特加', amount: '50ml', isOptional: 0 },
          { name: '姜汁啤酒', amount: '120ml', isOptional: 0 },
          { name: '青柠汁', amount: '15ml', isOptional: 0 },
          { name: '冰块', amount: '适量', isOptional: 0 },
          { name: '青柠角', amount: '1个', isOptional: 0 }
        ],
        steps: [
          { stepNumber: 1, description: '在铜杯（或高球杯）中加满冰块' },
          { stepNumber: 2, description: '倒入伏特加' },
          { stepNumber: 3, description: '挤入新鲜青柠汁' },
          { stepNumber: 4, description: '倒入姜汁啤酒' },
          { stepNumber: 5, description: '轻轻搅拌，用青柠角装饰' }
        ],
        categories: ['伏特加', '清爽']
      },
      {
        name: '戴吉里',
        nameEn: 'Daiquiri',
        description: '戴吉里是海明威最爱的鸡尾酒之一，简单的三种原料却能调出完美的平衡。这是朗姆酒的极致展现。',
        difficulty: 2,
        baseSpirit: '朗姆酒',
        tasteTags: '酸味,清爽,果香',
        glassType: '鸡尾酒杯',
        method: 'shake',
        tips: '使用白朗姆酒能突出青柠的风味。摇晃要充分，让酒体变得冰凉。',
        sortOrder: 60,
        ingredients: [
          { name: '白朗姆酒', amount: '60ml', isOptional: 0 },
          { name: '青柠汁', amount: '25ml', isOptional: 0 },
          { name: '糖浆', amount: '15ml', isOptional: 0 },
          { name: '冰块', amount: '适量', isOptional: 0 }
        ],
        steps: [
          { stepNumber: 1, description: '在调酒壶中加入白朗姆酒、青柠汁和糖浆' },
          { stepNumber: 2, description: '加入冰块，用力摇晃15-20秒' },
          { stepNumber: 3, description: '过滤后倒入冰镇的鸡尾酒杯中' },
          { stepNumber: 4, description: '用青柠片装饰杯口' }
        ],
        categories: ['朗姆酒', '酸味', '清爽']
      },
      {
        name: '蓝色夏威夷',
        nameEn: 'Blue Hawaiian',
        description: '蓝色夏威夷是充满热带风情的鸡尾酒，蓝色的视觉冲击和菠萝椰子的香气让人仿佛置身海滩。',
        difficulty: 2,
        baseSpirit: '朗姆酒',
        tasteTags: '甜味,果香,清爽',
        glassType: '飓风杯',
        method: 'shake',
        tips: '蓝橙利口酒赋予了这款酒独特的蓝色。可以用冷冻菠萝制作冰沙版本。',
        sortOrder: 55,
        ingredients: [
          { name: '白朗姆酒', amount: '40ml', isOptional: 0 },
          { name: '蓝橙利口酒', amount: '20ml', isOptional: 0 },
          { name: '菠萝汁', amount: '60ml', isOptional: 0 },
          { name: '青柠汁', amount: '15ml', isOptional: 0 },
          { name: '冰块', amount: '适量', isOptional: 0 },
          { name: '樱桃', amount: '1个', isOptional: 1 }
        ],
        steps: [
          { stepNumber: 1, description: '在调酒壶中加入白朗姆酒、蓝橙利口酒、菠萝汁和青柠汁' },
          { stepNumber: 2, description: '加入冰块，用力摇晃' },
          { stepNumber: 3, description: '倒入装有冰块的飓风杯中' },
          { stepNumber: 4, description: '用菠萝片和樱桃装饰' }
        ],
        categories: ['朗姆酒', '甜味', '果香']
      }
    ];

    // 插入酒谱数据
    console.log('正在创建酒谱...');
    for (const cocktailData of cocktailsData) {
      const { ingredients: ings, steps, categories: cats, ...basicInfo } = cocktailData;

      // 创建酒谱
      const cocktail = await Cocktail.create(basicInfo);
      console.log(`✓ 创建酒谱: ${cocktail.name}`);

      // 添加材料关联
      for (let i = 0; i < ings.length; i++) {
        const ing = ings[i];
        const ingredientId = ingredientMap[ing.name];
        if (ingredientId) {
          await CocktailIngredient.create({
            cocktailId: cocktail.id,
            ingredientId,
            amount: ing.amount,
            isOptional: ing.isOptional,
            sortOrder: i
          });
        }
      }

      // 添加步骤
      for (const step of steps) {
        await CocktailStep.create({
          cocktailId: cocktail.id,
          stepNumber: step.stepNumber,
          description: step.description
        });
      }

      // 添加分类关联
      for (const catName of cats) {
        const categoryId = categoryMap[catName];
        if (categoryId) {
          await CocktailCategory.create({
            cocktailId: cocktail.id,
            categoryId
          });
        }
      }
    }

    console.log(`\n🎉 成功添加 ${cocktailsData.length} 个测试酒谱！`);
    console.log('\n现在可以在后台管理系统中查看这些数据了。');

    process.exit(0);
  } catch (error) {
    console.error('❌ 添加测试数据失败:', error);
    process.exit(1);
  }
}

// 运行脚本
addTestData();
