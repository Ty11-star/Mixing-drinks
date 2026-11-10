// utils/mock.js
// 本地模拟数据与接口路由（离线预览用）
// 数据结构与 server 端保持一致（camelCase 字段名）

const INGREDIENTS = [
  { id: 1, name: '伏特加', nameEn: 'Vodka', category: 'base_spirit', commonUnit: 'ml', description: '无色中性烈酒，几乎无味，是鸡尾酒的百搭基酒。' },
  { id: 2, name: '白朗姆酒', nameEn: 'White Rum', category: 'base_spirit', commonUnit: 'ml', description: '清爽带甜味的甘蔗蒸馏酒，莫吉托的的灵魂。' },
  { id: 5, name: '金酒', nameEn: 'Gin', category: 'base_spirit', commonUnit: 'ml', description: '以杜松子为主调香的烈酒，植物香气突出。' },
  { id: 6, name: '龙舌兰', nameEn: 'Tequila', category: 'base_spirit', commonUnit: 'ml', description: '墨西哥特产，以蓝龙舌兰为原料的烈酒。' },
  { id: 8, name: '波本威士忌', nameEn: 'Bourbon', category: 'base_spirit', commonUnit: 'ml', description: '美国产玉米威士忌，带香草与焦糖甜香。' },
  { id: 9, name: '橙味利口酒', nameEn: 'Triple Sec', category: 'liqueur', commonUnit: 'ml', description: '清爽的橙皮风味利口酒，常作调和。' },
  { id: 10, name: '君度', nameEn: 'Cointreau', category: 'liqueur', commonUnit: 'ml', description: '高端橙味利口酒，香气优雅。' },
  { id: 11, name: '蓝橙利口酒', nameEn: 'Blue Curaçao', category: 'liqueur', commonUnit: 'ml', description: '蓝色橙味利口酒，提供标志性蓝色。' },
  { id: 13, name: '青柠汁', nameEn: 'Lime Juice', category: 'juice', commonUnit: 'ml', description: '酸度明亮的柑橘汁，鸡尾酒常用。' },
  { id: 14, name: '柠檬汁', nameEn: 'Lemon Juice', category: 'juice', commonUnit: 'ml', description: '酸爽解腻，酸酒系列基础。' },
  { id: 15, name: '橙汁', nameEn: 'Orange Juice', category: 'juice', commonUnit: 'ml', description: '新鲜甜美，适合果香型饮品。' },
  { id: 16, name: '蔓越莓汁', nameEn: 'Cranberry Juice', category: 'juice', commonUnit: 'ml', description: '微酸带涩的红色果汁，大都会必备。' },
  { id: 17, name: '菠萝汁', nameEn: 'Pineapple Juice', category: 'juice', commonUnit: 'ml', description: '热带甜香，蓝色夏威夷常用。' },
  { id: 19, name: '番茄汁', nameEn: 'Tomato Juice', category: 'juice', commonUnit: 'ml', description: '咸鲜风味，血腥玛丽基底。' },
  { id: 20, name: '苏打水', nameEn: 'Soda Water', category: 'other', commonUnit: 'ml', description: '气泡矿泉水，提供清爽口感。' },
  { id: 21, name: '汤力水', nameEn: 'Tonic Water', category: 'other', commonUnit: 'ml', description: '含奎宁的苦甜气泡水。' },
  { id: 22, name: '可乐', nameEn: 'Cola', category: 'other', commonUnit: 'ml', description: '焦糖色碳酸饮料。' },
  { id: 23, name: '雪碧', nameEn: 'Sprite', category: 'other', commonUnit: 'ml', description: '柠檬味碳酸饮料。' },
  { id: 24, name: '姜汁汽水', nameEn: 'Ginger Ale', category: 'other', commonUnit: 'ml', description: '带辛辣姜味的碳酸饮料。' },
  { id: 38, name: '糖浆', nameEn: 'Sugar Syrup', category: 'syrup', commonUnit: 'ml', description: '糖水混合物，平衡酸味。' },
  { id: 39, name: '石榴糖浆', nameEn: 'Grenadine', category: 'syrup', commonUnit: 'ml', description: '红色甜糖浆，用于渐层上色。' },
  { id: 43, name: '白糖', nameEn: 'Sugar', category: 'other', commonUnit: '勺', description: '基础甜味剂。' },
  { id: 44, name: '盐', nameEn: 'Salt', category: 'other', commonUnit: '少许', description: '提升风味层次。' },
  { id: 45, name: '黑胡椒', nameEn: 'Black Pepper', category: 'other', commonUnit: '少许', description: '增加辛香。' },
  { id: 46, name: '辣椒酱', nameEn: 'Hot Sauce', category: 'other', commonUnit: '滴', description: '提供微辣刺激。' },
  { id: 47, name: '伍斯特沙司', nameEn: 'Worcestershire', category: 'other', commonUnit: '滴', description: '咸鲜复合酱料。' },
  { id: 48, name: '苦精', nameEn: 'Bitters', category: 'other', commonUnit: '滴', description: '几滴即可带来复杂香气。' },
  { id: 49, name: '冰块', nameEn: 'Ice', category: 'other', commonUnit: '适量', description: '降温与稀释，调酒必备。' },
  { id: 54, name: '薄荷叶', nameEn: 'Mint', category: 'garnish', commonUnit: '片', description: '清新香气，装饰与调味兼用。' },
  { id: 55, name: '青柠片', nameEn: 'Lime Wedge', category: 'garnish', commonUnit: '片', description: '装饰与挤汁两用。' },
  { id: 56, name: '柠檬片', nameEn: 'Lemon Slice', category: 'garnish', commonUnit: '片', description: '经典装饰。' },
  { id: 57, name: '橙片', nameEn: 'Orange Slice', category: 'garnish', commonUnit: '片', description: '果香装饰。' },
  { id: 58, name: '樱桃', nameEn: 'Cherry', category: 'garnish', commonUnit: '颗', description: '经典甜点式装饰。' },
  { id: 60, name: '芹菜杆', nameEn: 'Celery', category: 'garnish', commonUnit: '根', description: '咸鲜饮品的特色装饰。' }
];

const ING = {};
INGREDIENTS.forEach(i => { ING[i.id] = i; });

// 便捷构造材料项
function ing(id, amount, isOptional = 0) {
  const base = ING[id];
  return { id, name: base.name, amount, isOptional, category: base.category, commonUnit: base.commonUnit };
}

const COCKTAILS = [
  {
    id: 1, name: '莫吉托', nameEn: 'Mojito', difficulty: 1, baseSpirit: '朗姆酒',
    tasteTags: '清爽,薄荷,微甜', glassType: '高球杯', method: 'build',
    description: '源自古巴的经典鸡尾酒，清爽的薄荷香气搭配朗姆酒的甜润，是夏日最受欢迎的饮品之一。',
    tips: '不要过度捣碎薄荷叶，轻轻按压即可，否则会产生苦味。',
    iceType: '碎冰', garnish: '薄荷叶,青柠片', alcoholContent: '低度', origin: '古巴', sortOrder: 100,
    ingredients: [ing(2, '45ml'), ing(13, '20ml'), ing(20, '适量'), ing(43, '2勺'), ing(54, '8-10片'), ing(49, '适量')],
    steps: [
      { stepNumber: 1, description: '在高球杯中放入薄荷叶和白糖，用捣棒轻轻按压薄荷叶释放香气' },
      { stepNumber: 2, description: '加入新鲜青柠汁，轻轻搅拌使糖溶解' },
      { stepNumber: 3, description: '加入碎冰至杯子八分满' },
      { stepNumber: 4, description: '倒入白朗姆酒，轻轻搅拌均匀' },
      { stepNumber: 5, description: '加满苏打水，用薄荷叶和青柠片装饰即可' }
    ]
  },
  {
    id: 2, name: '金汤力', nameEn: 'Gin & Tonic', difficulty: 1, baseSpirit: '金酒',
    tasteTags: '清爽,微苦', glassType: '高球杯', method: 'build',
    description: '简单优雅的经典鸡尾酒，金酒的植物香气与汤力水的奎宁苦味完美结合，清爽宜人。',
    tips: '使用优质汤力水能大幅提升口感，加入青柠片可增加清新感。',
    iceType: '冰块', garnish: '青柠片', alcoholContent: '中度', origin: '英国', sortOrder: 99,
    ingredients: [ing(5, '50ml'), ing(21, '150ml'), ing(55, '1片'), ing(49, '适量')],
    steps: [
      { stepNumber: 1, description: '在高球杯中加入冰块至七分满' },
      { stepNumber: 2, description: '倒入金酒' },
      { stepNumber: 3, description: '加满汤力水，轻轻搅拌' },
      { stepNumber: 4, description: '放入青柠片装饰即可' }
    ]
  },
  {
    id: 3, name: '玛格丽特', nameEn: 'Margarita', difficulty: 2, baseSpirit: '龙舌兰',
    tasteTags: '清爽,酸甜', glassType: '玛格丽特杯', method: 'shake',
    description: '最经典的龙舌兰鸡尾酒，酸甜平衡，杯口的盐边是其标志性特征。',
    tips: '盐边制作：用青柠片擦拭杯口，然后蘸取细盐。摇酒时要充分摇匀至冰凉。',
    iceType: '冰块', garnish: '青柠片,盐边', alcoholContent: '中度', origin: '墨西哥', sortOrder: 98,
    ingredients: [ing(6, '45ml'), ing(9, '20ml'), ing(13, '20ml'), ing(44, '适量'), ing(49, '适量')],
    steps: [
      { stepNumber: 1, description: '用青柠片擦拭玛格丽特杯口，然后将杯口蘸取细盐制作盐边' },
      { stepNumber: 2, description: '在调酒壶中加入冰块、龙舌兰、橙味利口酒和青柠汁' },
      { stepNumber: 3, description: '充分摇匀约15秒，直至调酒壶外壁结霜' },
      { stepNumber: 4, description: '滤掉冰块，将酒液倒入准备好的杯中' },
      { stepNumber: 5, description: '用青柠片装饰杯口' }
    ]
  },
  {
    id: 4, name: '血腥玛丽', nameEn: 'Bloody Mary', difficulty: 1, baseSpirit: '伏特加',
    tasteTags: '咸鲜,微辣', glassType: '高球杯', method: 'build',
    description: '以番茄汁为基底的咸鲜口味鸡尾酒，常作为早午餐饮品，被誉为“能喝的沙拉”。',
    tips: '调味料可根据个人口味调整，喜欢辣可多加辣椒酱。番茄汁要选用优质产品。',
    iceType: '冰块', garnish: '芹菜杆,柠檬片', alcoholContent: '低度', origin: '美国', sortOrder: 97,
    ingredients: [ing(1, '45ml'), ing(19, '120ml'), ing(14, '15ml'), ing(46, '2滴'), ing(47, '2滴'), ing(44, '少许'), ing(45, '少许'), ing(60, '1根'), ing(49, '适量')],
    steps: [
      { stepNumber: 1, description: '在高球杯中加入冰块' },
      { stepNumber: 2, description: '依次加入伏特加、柠檬汁、番茄汁' },
      { stepNumber: 3, description: '加入辣椒酱、伍斯特沙司、盐和黑胡椒' },
      { stepNumber: 4, description: '用吧匙轻轻搅拌均匀' },
      { stepNumber: 5, description: '放入芹菜杆和柠檬片装饰' }
    ]
  },
  {
    id: 5, name: '戴吉里', nameEn: 'Daiquiri', difficulty: 2, baseSpirit: '朗姆酒',
    tasteTags: '清爽,酸甜', glassType: '鸡尾酒杯', method: 'shake',
    description: '海明威最爱的经典鸡尾酒，只用朗姆酒、青柠汁和糖浆三种材料，简单却完美平衡。',
    tips: '关键在于酸甜平衡，可根据个人口味调整糖浆用量。一定要充分摇匀。',
    iceType: '冰块', garnish: '青柠片', alcoholContent: '中度', origin: '古巴', sortOrder: 96,
    ingredients: [ing(2, '60ml'), ing(13, '25ml'), ing(38, '15ml'), ing(49, '适量')],
    steps: [
      { stepNumber: 1, description: '在调酒壶中加入冰块' },
      { stepNumber: 2, description: '倒入白朗姆酒、青柠汁和糖浆' },
      { stepNumber: 3, description: '用力摇匀约15秒，直至调酒壶外壁结霜' },
      { stepNumber: 4, description: '双重过滤倒入冰镇的鸡尾酒杯中' },
      { stepNumber: 5, description: '用青柠片装饰杯口' }
    ]
  },
  {
    id: 6, name: '长岛冰茶', nameEn: 'Long Island Iced Tea', difficulty: 3, baseSpirit: '混合基酒',
    tasteTags: '浓烈,香甜', glassType: '高球杯', method: 'build',
    description: '混合五种基酒的强力鸡尾酒，虽然名叫冰茶但不含茶叶，口感却很像冰红茶。',
    tips: '酒精度很高，需要提醒客人慢慢品尝。各种基酒的比例要准确。',
    iceType: '冰块', garnish: '柠檬片', alcoholContent: '高度', origin: '美国', sortOrder: 95,
    ingredients: [ing(1, '15ml'), ing(2, '15ml'), ing(5, '15ml'), ing(6, '15ml'), ing(9, '15ml'), ing(14, '25ml'), ing(38, '15ml'), ing(22, '适量'), ing(49, '适量')],
    steps: [
      { stepNumber: 1, description: '在高球杯中加入冰块' },
      { stepNumber: 2, description: '依次倒入伏特加、白朗姆酒、金酒、龙舌兰和橙味利口酒' },
      { stepNumber: 3, description: '加入柠檬汁和糖浆' },
      { stepNumber: 4, description: '轻轻搅拌均匀' },
      { stepNumber: 5, description: '加入少许可乐至颜色如冰红茶，用柠檬片装饰' }
    ]
  },
  {
    id: 7, name: '螺丝起子', nameEn: 'Screwdriver', difficulty: 1, baseSpirit: '伏特加',
    tasteTags: '果香,香甜', glassType: '高球杯', method: 'build',
    description: '最简单的鸡尾酒之一，只需伏特加和橙汁，清新果香，适合初学者。',
    tips: '使用新鲜橙汁效果最佳，可根据口味调整伏特加用量。',
    iceType: '冰块', garnish: '橙片', alcoholContent: '低度', origin: '美国', sortOrder: 94,
    ingredients: [ing(1, '45ml'), ing(15, '120ml'), ing(57, '1片', 1), ing(49, '适量')],
    steps: [
      { stepNumber: 1, description: '在高球杯中加入冰块' },
      { stepNumber: 2, description: '倒入伏特加' },
      { stepNumber: 3, description: '加满新鲜橙汁' },
      { stepNumber: 4, description: '轻轻搅拌均匀，用橙片装饰' }
    ]
  },
  {
    id: 8, name: '莫斯科骡子', nameEn: 'Moscow Mule', difficulty: 1, baseSpirit: '伏特加',
    tasteTags: '清爽,辛辣', glassType: '铜杯/高球杯', method: 'build',
    description: '传统上用铜杯盛装的经典鸡尾酒，姜汁汽水的辛辣和青柠的清爽完美结合。',
    tips: '传统用铜杯能保持冰凉口感更佳，姜汁汽水的品质很重要。',
    iceType: '冰块', garnish: '青柠片,薄荷叶', alcoholContent: '低度', origin: '美国', sortOrder: 93,
    ingredients: [ing(1, '45ml'), ing(24, '120ml'), ing(13, '15ml'), ing(55, '1片'), ing(49, '适量')],
    steps: [
      { stepNumber: 1, description: '在铜杯或高球杯中加入冰块' },
      { stepNumber: 2, description: '倒入伏特加和青柠汁' },
      { stepNumber: 3, description: '加满姜汁汽水' },
      { stepNumber: 4, description: '轻轻搅拌，用青柠片和薄荷叶装饰' }
    ]
  },
  {
    id: 9, name: '大都会', nameEn: 'Cosmopolitan', difficulty: 2, baseSpirit: '伏特加',
    tasteTags: '果香,酸甜', glassType: '马天尼杯', method: 'shake',
    description: '《欲望都市》让这款粉红色鸡尾酒风靡全球，优雅时尚，酸甜平衡。',
    tips: '蔓越莓汁不宜过多，否则会过甜。摇匀后要双重过滤。',
    iceType: '冰块', garnish: '橙皮', alcoholContent: '中度', origin: '美国', sortOrder: 92,
    ingredients: [ing(1, '40ml'), ing(10, '15ml'), ing(14, '15ml'), ing(16, '30ml'), ing(49, '适量')],
    steps: [
      { stepNumber: 1, description: '在调酒壶中加入冰块' },
      { stepNumber: 2, description: '倒入伏特加、君度、柠檬汁和蔓越莓汁' },
      { stepNumber: 3, description: '用力摇匀约15秒' },
      { stepNumber: 4, description: '双重过滤倒入冰镇的马天尼杯中' },
      { stepNumber: 5, description: '用橙皮拧出精油，擦拭杯口后投入杯中装饰' }
    ]
  },
  {
    id: 10, name: '威士忌酸', nameEn: 'Whiskey Sour', difficulty: 2, baseSpirit: '威士忌',
    tasteTags: '酸甜,醇厚', glassType: '古典杯', method: 'shake',
    description: '经典的酸酒系列代表作，威士忌的醇厚与柠檬的酸爽完美融合。',
    tips: '可选择性加入蛋清，能产生细腻的泡沫层。柠檬汁一定要用新鲜的。',
    iceType: '冰块', garnish: '柠檬片,樱桃', alcoholContent: '中度', origin: '美国', sortOrder: 91,
    ingredients: [ing(8, '50ml'), ing(14, '25ml'), ing(38, '15ml'), ing(56, '1片'), ing(58, '1颗', 1), ing(49, '适量')],
    steps: [
      { stepNumber: 1, description: '在调酒壶中加入冰块' },
      { stepNumber: 2, description: '倒入波本威士忌、柠檬汁和糖浆' },
      { stepNumber: 3, description: '用力摇匀约15秒' },
      { stepNumber: 4, description: '滤冰倒入装有冰块的古典杯中' },
      { stepNumber: 5, description: '用柠檬片和樱桃装饰' }
    ]
  },
  {
    id: 11, name: '老式鸡尾酒', nameEn: 'Old Fashioned', difficulty: 2, baseSpirit: '威士忌',
    tasteTags: '醇厚,微苦', glassType: '古典杯', method: 'build',
    description: '最古老的鸡尾酒之一，简单却经典，展现威士忌的本真风味。',
    tips: '使用大块冰球能减缓融化速度。橙皮精油是关键，一定要拧出精油。',
    iceType: '冰球', garnish: '橙皮,樱桃', alcoholContent: '高度', origin: '美国', sortOrder: 90,
    ingredients: [ing(8, '60ml'), ing(38, '10ml'), ing(48, '2滴'), ing(57, '1片'), ing(58, '1颗', 1), ing(49, '适量')],
    steps: [
      { stepNumber: 1, description: '在古典杯中加入糖浆和苦精' },
      { stepNumber: 2, description: '加入少量冰块，轻轻搅拌' },
      { stepNumber: 3, description: '倒入威士忌' },
      { stepNumber: 4, description: '加入大冰球，继续搅拌至冰凉' },
      { stepNumber: 5, description: '拧出橙皮精油擦拭杯口，将橙皮和樱桃投入杯中装饰' }
    ]
  },
  {
    id: 12, name: '内格罗尼', nameEn: 'Negroni', difficulty: 2, baseSpirit: '金酒',
    tasteTags: '微苦,浓烈', glassType: '古典杯', method: 'build',
    description: '意大利经典鸡尾酒，苦甜平衡，层次丰富，适合餐前饮用。',
    tips: '三种酒的比例是1:1:1，搅拌而非摇和，保持酒体清澈。',
    iceType: '冰块', garnish: '橙片', alcoholContent: '高度', origin: '意大利', sortOrder: 89,
    ingredients: [ing(5, '30ml'), ing(57, '1片'), ing(49, '适量')],
    steps: [
      { stepNumber: 1, description: '在古典杯中加入冰块' },
      { stepNumber: 2, description: '依次倒入金酒、甜味美思和金巴利各30ml' },
      { stepNumber: 3, description: '用吧匙搅拌约30秒至冰凉' },
      { stepNumber: 4, description: '用橙片装饰' }
    ]
  },
  {
    id: 13, name: '龙舌兰日出', nameEn: 'Tequila Sunrise', difficulty: 1, baseSpirit: '龙舌兰',
    tasteTags: '果香,香甜', glassType: '高球杯', method: 'build',
    description: '如日出般渐变色彩的美丽鸡尾酒，视觉和味觉的双重享受。',
    tips: '石榴糖浆要最后沿杯壁慢慢倒入，让其自然沉底形成渐变效果。',
    iceType: '冰块', garnish: '橙片,樱桃', alcoholContent: '低度', origin: '墨西哥', sortOrder: 88,
    ingredients: [ing(6, '45ml'), ing(15, '120ml'), ing(39, '15ml'), ing(57, '1片'), ing(58, '1颗', 1), ing(49, '适量')],
    steps: [
      { stepNumber: 1, description: '在高球杯中加入冰块' },
      { stepNumber: 2, description: '倒入龙舌兰和橙汁，轻轻搅拌' },
      { stepNumber: 3, description: '沿杯壁慢慢倒入石榴糖浆，让其自然沉底' },
      { stepNumber: 4, description: '不要搅拌，保持渐变效果' },
      { stepNumber: 5, description: '用橙片和樱桃装饰' }
    ]
  },
  {
    id: 14, name: '自由古巴', nameEn: 'Cuba Libre', difficulty: 1, baseSpirit: '朗姆酒',
    tasteTags: '清爽,香甜', glassType: '高球杯', method: 'build',
    description: '升级版的朗姆可乐，加入青柠汁后层次更丰富，是古巴独立的象征。',
    tips: '一定要加青柠汁，这是与普通朗姆可乐的区别。用新鲜青柠效果最好。',
    iceType: '冰块', garnish: '青柠片', alcoholContent: '低度', origin: '古巴', sortOrder: 87,
    ingredients: [ing(2, '50ml'), ing(13, '10ml'), ing(22, '120ml'), ing(55, '1片'), ing(49, '适量')],
    steps: [
      { stepNumber: 1, description: '在高球杯中加入冰块' },
      { stepNumber: 2, description: '倒入白朗姆酒和青柠汁' },
      { stepNumber: 3, description: '加满可乐' },
      { stepNumber: 4, description: '轻轻搅拌，用青柠片装饰' }
    ]
  },
  {
    id: 15, name: '蓝色夏威夷', nameEn: 'Blue Hawaiian', difficulty: 2, baseSpirit: '朗姆酒',
    tasteTags: '果香,香甜', glassType: '飓风杯', method: 'shake',
    description: '蓝色浪漫的热带鸡尾酒，椰香浓郁，果味十足，如同海滩度假。',
    tips: '可以用碎冰增加冰沙口感。蓝橙利口酒是标志性的蓝色来源。',
    iceType: '碎冰', garnish: '菠萝片,樱桃', alcoholContent: '低度', origin: '美国', sortOrder: 86,
    ingredients: [ing(2, '40ml'), ing(11, '20ml'), ing(17, '60ml'), ing(49, '适量')],
    steps: [
      { stepNumber: 1, description: '在调酒壶中加入冰块' },
      { stepNumber: 2, description: '倒入白朗姆酒、蓝橙利口酒和菠萝汁' },
      { stepNumber: 3, description: '用力摇匀约15秒' },
      { stepNumber: 4, description: '倒入装有碎冰的飓风杯中' },
      { stepNumber: 5, description: '用菠萝片和樱桃装饰' }
    ]
  },
  {
    id: 16, name: '维珍莫吉托', nameEn: 'Virgin Mojito', difficulty: 1, baseSpirit: '无酒精',
    tasteTags: '清爽,薄荷', glassType: '高球杯', method: 'build',
    description: '无酒精版莫吉托，保留薄荷和青柠的清爽，适合不喝酒的人群。',
    tips: '制作方法与莫吉托相同，只是省去了朗姆酒，同样美味清爽。',
    iceType: '碎冰', garnish: '薄荷叶,青柠片', alcoholContent: '无酒精', origin: '古巴', sortOrder: 85,
    ingredients: [ing(13, '20ml'), ing(20, '适量'), ing(43, '2勺'), ing(54, '8-10片'), ing(49, '适量')],
    steps: [
      { stepNumber: 1, description: '在高球杯中放入薄荷叶和白糖，轻轻捣碎' },
      { stepNumber: 2, description: '加入青柠汁，搅拌使糖溶解' },
      { stepNumber: 3, description: '加入碎冰至八分满' },
      { stepNumber: 4, description: '加满苏打水' },
      { stepNumber: 5, description: '用薄荷叶和青柠片装饰' }
    ]
  },
  {
    id: 17, name: '雪碧青柠', nameEn: 'Sprite Lime', difficulty: 1, baseSpirit: '无酒精',
    tasteTags: '清爽,香甜', glassType: '高球杯', method: 'build',
    description: '最简单的无酒精饮品，清凉解渴，适合任何场合。',
    tips: '使用新鲜青柠是关键，瓶装青柠汁效果会打折扣。',
    iceType: '冰块', garnish: '青柠片,薄荷叶', alcoholContent: '无酒精', origin: '现代', sortOrder: 84,
    ingredients: [ing(23, '200ml'), ing(13, '15ml'), ing(55, '2片'), ing(54, '2片', 1), ing(49, '适量')],
    steps: [
      { stepNumber: 1, description: '在高球杯中加入冰块' },
      { stepNumber: 2, description: '倒入新鲜青柠汁' },
      { stepNumber: 3, description: '加满雪碧' },
      { stepNumber: 4, description: '轻轻搅拌，用青柠片和薄荷叶装饰' }
    ]
  }
];

// 分类（基酒 + 口味），cocktailCount 动态计算
const CATEGORY_DEFS = [
  { id: 1, name: '伏特加', type: 'base_spirit', sortOrder: 100 },
  { id: 2, name: '朗姆酒', type: 'base_spirit', sortOrder: 99 },
  { id: 3, name: '金酒', type: 'base_spirit', sortOrder: 98 },
  { id: 4, name: '龙舌兰', type: 'base_spirit', sortOrder: 97 },
  { id: 5, name: '威士忌', type: 'base_spirit', sortOrder: 96 },
  { id: 6, name: '混合基酒', type: 'base_spirit', sortOrder: 95 },
  { id: 7, name: '无酒精', type: 'base_spirit', sortOrder: 94 },
  { id: 8, name: '清爽', type: 'taste', sortOrder: 100 },
  { id: 9, name: '果香', type: 'taste', sortOrder: 99 },
  { id: 10, name: '微苦', type: 'taste', sortOrder: 98 },
  { id: 11, name: '咸鲜', type: 'taste', sortOrder: 97 },
  { id: 12, name: '浓烈', type: 'taste', sortOrder: 96 },
  { id: 13, name: '酸甜', type: 'taste', sortOrder: 95 },
  { id: 14, name: '香甜', type: 'taste', sortOrder: 94 },
  { id: 15, name: '薄荷', type: 'taste', sortOrder: 93 }
];

function countByBase(name) {
  return COCKTAILS.filter(c => c.baseSpirit === name).length;
}
function countByTaste(name) {
  return COCKTAILS.filter(c => String(c.tasteTags).split(/[,，]/).includes(name)).length;
}

// —— 接口实现 ——
function getCocktails(query = {}) {
  const { page = 1, pageSize = 10, difficulty, baseSpirit, keyword } = query;
  let list = COCKTAILS.slice();
  if (difficulty) list = list.filter(c => String(c.difficulty) === String(difficulty));
  if (baseSpirit) list = list.filter(c => c.baseSpirit === baseSpirit);
  if (keyword) {
    const k = String(keyword).toLowerCase();
    list = list.filter(c =>
      c.name.toLowerCase().includes(k) ||
      (c.nameEn || '').toLowerCase().includes(k) ||
      (c.baseSpirit || '').toLowerCase().includes(k) ||
      (c.tasteTags || '').toLowerCase().includes(k)
    );
  }
  list.sort((a, b) => b.sortOrder - a.sortOrder);
  const total = list.length;
  const start = (page - 1) * pageSize;
  const paged = list.slice(start, start + pageSize).map(stripSteps);
  return { list: paged, total, page: Number(page), pageSize: Number(pageSize), totalPages: Math.ceil(total / pageSize) };
}

function stripSteps(c) {
  const { steps, ...rest } = c;
  return rest;
}

function getCocktailById(id) {
  return COCKTAILS.find(c => c.id === Number(id)) || null;
}

function searchCocktails(keyword, params = {}) {
  if (!keyword) throw new Error('请提供搜索关键词');
  return getCocktails({ ...params, keyword });
}

function getIngredients(query = {}) {
  const { category } = query;
  let list = INGREDIENTS.slice();
  if (category) list = list.filter(i => i.category === category);
  return list;
}

function getIngredientsByCategory() {
  const grouped = {};
  INGREDIENTS.forEach(i => {
    if (!grouped[i.category]) grouped[i.category] = [];
    grouped[i.category].push(i);
  });
  return grouped;
}

function getCategories(type) {
  let defs = CATEGORY_DEFS.slice();
  if (type) defs = defs.filter(d => d.type === type);
  return defs.map(d => ({
    ...d,
    cocktailCount: d.type === 'base_spirit' ? countByBase(d.name) : countByTaste(d.name)
  })).sort((a, b) => b.sortOrder - a.sortOrder);
}

function matchByIngredients(ingredientIds) {
  if (!ingredientIds || !Array.isArray(ingredientIds) || ingredientIds.length === 0) {
    throw new Error('请提供材料ID列表');
  }
  const userSet = new Set(ingredientIds.map(id => Number(id)));
  const results = [];
  COCKTAILS.forEach(c => {
    const required = c.ingredients.filter(i => i.isOptional === 0);
    if (required.length === 0) return;
    const requiredIds = required.map(i => i.id);
    const matched = requiredIds.filter(id => userSet.has(id));
    const matchRate = Math.round((matched.length / required.length) * 100);
    if (matchRate <= 0) return;
    const missingIngredients = required
      .filter(i => !userSet.has(i.id))
      .map(i => ({ id: i.id, name: i.name, amount: i.amount }));
    results.push({
      cocktail: {
        id: c.id, name: c.name, nameEn: c.nameEn, difficulty: c.difficulty,
        baseSpirit: c.baseSpirit, tasteTags: c.tasteTags, glassType: c.glassType
      },
      matchRate,
      missingIngredients
    });
  });
  results.sort((a, b) => b.matchRate - a.matchRate);
  return results;
}

function wechatLogin() {
  // 模拟微信登录：返回假 token 与用户信息
  return {
    token: 'mock-jwt-token-' + Date.now(),
    userInfo: {
      id: 1,
      nickname: '调酒新手',
      avatar: ''
    }
  };
}

// AI 推荐（离线兜底）：根据勾选材料拼一杯简单的兑和法饮品
function mockAiRecommend(ingredients) {
  const list = (ingredients || []).map(i => String(i));
  const spirit = list.find(n => /伏特加|朗姆|金酒|威士忌|龙舌兰|白兰地/.test(n)) || '无酒精';
  const sour = list.find(n => /柠檬汁|青柠汁/.test(n)) || '柠檬汁';
  const sweet = list.find(n => /糖浆|可乐|雪碧|橙汁/.test(n)) || '糖浆';
  const bubbly = list.find(n => /苏打水|汤力水|汽水|姜汁/.test(n));
  return {
    recommendation: {
      name: spirit === '无酒精' ? '清爽特调（离线版）' : '吧台即兴（离线版）',
      nameEn: 'Bar Improv (Offline)',
      baseSpirit: spirit,
      glassType: '高球杯',
      difficulty: 1,
      alcoholLevel: spirit === '无酒精' ? '无酒精' : '低度',
      ingredients: [
        { name: spirit, amount: '45ml' },
        { name: sour, amount: '20ml' },
        { name: sweet, amount: '适量' }
      ].concat(bubbly ? [{ name: bubbly, amount: '加满' }] : []),
      steps: [
        '在高球杯中加满冰块',
        '依次倒入 ' + spirit + ' 和 ' + sour,
        '加入 ' + sweet + (bubbly ? '，再加满 ' + bubbly : '') + '，轻轻搅拌均匀',
        '用手头的材料简单装饰即可'
      ],
      tips: '当前为离线演示配方。启动后端并配置 DeepSeek 后可获得真正的 AI 定制配方。',
      usedIngredients: list.slice(0, 6),
      missingIngredients: []
    },
    alternatives: [],
    summary: '离线模式：根据你勾选的材料快速拼了一杯简单特调。'
  };
}

// 模拟网络延迟
function delay(data) {
  return new Promise(resolve => setTimeout(() => resolve(data), 180));
}

// 离线抽卡：随机取一款酒谱库饮品
function mockDaily() {
  const c = COCKTAILS[Math.floor(Math.random() * COCKTAILS.length)];
  return {
    source: 'official',
    id: c.id,
    name: c.name,
    nameEn: c.nameEn,
    baseSpirit: c.baseSpirit,
    glassType: c.glassType,
    difficulty: c.difficulty,
    description: c.description,
    tips: c.tips,
    tasteTags: String(c.tasteTags).split(/[,，]/),
    ingredients: c.ingredients.map(i => ({ name: i.name, amount: i.amount })),
    steps: c.steps.map(s => s.description),
    image: ''
  };
}

// 路由分发
function request(method, path, query = {}, body = {}) {
  const clean = path.replace(/^\/api\/v1/, '').replace(/\/+$/, '');
  const m = method.toUpperCase();

  try {
    if (m === 'GET' && clean === '/cocktails') return delay(getCocktails(query));
    if (m === 'GET' && clean === '/cocktails/search') {
      if (!query.keyword) return Promise.reject(new Error('请提供搜索关键词'));
      return delay(searchCocktails(query.keyword, query));
    }
    if (m === 'GET' && clean === '/ingredients') return delay(getIngredients(query));
    if (m === 'GET' && clean === '/ingredients/by-category') return delay(getIngredientsByCategory());
    if (m === 'GET' && clean === '/categories') return delay(getCategories(query.type));
    if (m === 'POST' && clean === '/cocktails/match') return delay(matchByIngredients(body.ingredientIds));
    if (m === 'POST' && clean === '/ai/recommend') return delay(mockAiRecommend(body.ingredients));
    if (m === 'GET' && clean === '/ai/daily') return delay(mockDaily());
    if (m === 'POST' && clean === '/auth/wechat/login') return delay(wechatLogin());

    const detailMatch = clean.match(/^\/cocktails\/(\d+)$/);
    if (m === 'GET' && detailMatch) {
      const c = getCocktailById(detailMatch[1]);
      if (!c) return Promise.reject(new Error('酒谱不存在'));
      return delay(c);
    }

    return Promise.reject(new Error('接口不存在: ' + method + ' ' + path));
  } catch (e) {
    return Promise.reject(e);
  }
}

module.exports = { request };
