// utils/convenience.js
// 便利店调酒数据：材料库、配方、场景分类、避坑指南
// 纯前端静态数据，不依赖后端；配方 id 从 1001 起，避免与数据库酒谱冲突

const SCENES = [
  { key: 'all', label: '全部', emoji: '🏪' },
  { key: 'tipsy', label: '微醺', emoji: '🍶' },
  { key: 'zero', label: '无酒精', emoji: '🧃' },
  { key: 'dorm', label: '宿舍', emoji: '🏠' },
  { key: 'camping', label: '露营', emoji: '⛺' },
  { key: 'tea', label: '下午茶', emoji: '🍰' }
];

// 便利店常见材料库
const MATERIALS = [
  { name: '可乐', emoji: '🥤', category: '碳酸饮料' },
  { name: '雪碧', emoji: '🥤', category: '碳酸饮料' },
  { name: '七喜', emoji: '🍋', category: '碳酸饮料' },
  { name: '苏打水', emoji: '💧', category: '碳酸饮料' },
  { name: '气泡水', emoji: '🫧', category: '碳酸饮料' },
  { name: '橙汁', emoji: '🍊', category: '果汁' },
  { name: '葡萄汁', emoji: '🍇', category: '果汁' },
  { name: '西瓜汁', emoji: '🍉', category: '果汁' },
  { name: '蜜桃汁', emoji: '🍑', category: '果汁' },
  { name: '番茄汁', emoji: '🍅', category: '果汁' },
  { name: '柠檬', emoji: '🍋', category: '水果' },
  { name: '青柠', emoji: '🍋', category: '水果' },
  { name: '薄荷', emoji: '🌿', category: '水果' },
  { name: '牛奶', emoji: '🥛', category: '乳品' },
  { name: '酸奶', emoji: '🥛', category: '乳品' },
  { name: '养乐多', emoji: '🧫', category: '乳品' },
  { name: '椰汁', emoji: '🥥', category: '乳品' },
  { name: '淡奶油', emoji: '🥛', category: '乳品' },
  { name: '罐装咖啡', emoji: '☕', category: '茶饮咖啡' },
  { name: '冰红茶', emoji: '🧋', category: '茶饮咖啡' },
  { name: '乌龙茶', emoji: '🍵', category: '茶饮咖啡' },
  { name: '橙片', emoji: '🍊', category: '水果' },
  { name: '话梅', emoji: '🫒', category: '调味' },
  { name: '蜂蜜', emoji: '🍯', category: '调味' },
  { name: '盐', emoji: '🧂', category: '调味' },
  { name: '黑胡椒', emoji: '🌶️', category: '调味' },
  { name: '冰块', emoji: '🧊', category: '其他' },
  { name: '伏特加小瓶', emoji: '🍶', category: '酒类' },
  { name: '朗姆酒小瓶', emoji: '🍶', category: '酒类' },
  { name: '梅子酒', emoji: '🍶', category: '酒类' },
  { name: '预调酒', emoji: '🍸', category: '酒类' },
  { name: '米酒', emoji: '🍶', category: '酒类' },
  { name: '百利甜', emoji: '🥃', category: '酒类' },
  { name: '野格', emoji: '🌿', category: '酒类' },
  { name: '金酒小瓶', emoji: '🍸', category: '酒类' },
  { name: '威士忌小瓶', emoji: '🥃', category: '酒类' },
  { name: '烧酒', emoji: '🍶', category: '酒类' },
  { name: '维他柠檬茶', emoji: '🍋', category: '茶饮咖啡' },
  { name: '汤力水', emoji: '🥤', category: '碳酸饮料' },
  { name: '椰子水', emoji: '🥥', category: '果汁' },
  { name: '旺仔牛奶', emoji: '🥛', category: '乳品' },
  { name: '阿华田', emoji: '☕', category: '茶饮咖啡' },
  { name: '奶茶', emoji: '🧋', category: '茶饮咖啡' },
  { name: '茉莉茶', emoji: '🍵', category: '茶饮咖啡' },
  { name: '红牛', emoji: '🥫', category: '功能饮料' },
  { name: '魔爪', emoji: '🥫', category: '功能饮料' },
  { name: '西柚汁', emoji: '🍊', category: '果汁' },
  { name: '红石榴汁', emoji: '🍒', category: '果汁' },
  { name: '薄荷糖', emoji: '🍬', category: '调味' },
  { name: '果冻', emoji: '🍮', category: '其他' }
];

// 便利店配方（40 款）
const DRINKS = [
  {
    id: 1001, name: '咸柠七', nameEn: 'Salted Lemon Seven', emoji: '🍋',
    gradient: 'linear-gradient(135deg,#F0E6D2,#E6D2A8)',
    cost: 6, steps: 3, tag: '3分钟', scenes: ['zero', 'dorm', 'camping'],
    materials: [{ name: '七喜', amount: '1罐' }, { name: '柠檬', amount: '1个' }, { name: '盐', amount: '少许' }, { name: '冰块', amount: '适量' }],
    instructions: ['柠檬切半，挤汁入杯，留一片装饰', '加少许盐和冰块', '倒入七喜，轻轻搅拌即可'],
    tips: '咸味能把气泡的清爽放大，夏天喝一杯特别解渴。'
  },
  {
    id: 1002, name: '自由古巴', nameEn: 'Cuba Libre', emoji: '🥤',
    gradient: 'linear-gradient(135deg,#E6D2A8,#DCB88A)',
    cost: 12, steps: 3, tag: '经典', scenes: ['tipsy', 'camping'],
    materials: [{ name: '朗姆酒小瓶', amount: '1瓶' }, { name: '可乐', amount: '1罐' }, { name: '青柠', amount: '1块' }, { name: '冰块', amount: '适量' }],
    instructions: ['杯中加满冰块', '倒入朗姆酒和可乐', '挤入青柠汁，放一块青柠装饰'],
    tips: '便利店买小瓶朗姆就够，青柠是灵魂，别省。'
  },
  {
    id: 1003, name: '乳酸气泡', nameEn: 'Yogurt Fizz', emoji: '🧫',
    gradient: 'linear-gradient(135deg,#E4EBDD,#CFDCC0)',
    cost: 7, steps: 2, tag: '2分钟', scenes: ['zero', 'tea', 'dorm'],
    materials: [{ name: '养乐多', amount: '1瓶' }, { name: '气泡水', amount: '1罐' }, { name: '冰块', amount: '适量' }],
    instructions: ['杯中加冰，倒入养乐多', '缓缓注入气泡水，轻轻搅匀'],
    tips: '养乐多和气泡水的比例约 1:2，酸甜又轻盈。'
  },
  {
    id: 1004, name: '柠檬红茶', nameEn: 'Lemon Tea', emoji: '🍋',
    gradient: 'linear-gradient(135deg,#EFE4D5,#E3C9A6)',
    cost: 6, steps: 3, tag: '零失败', scenes: ['zero', 'tea', 'dorm'],
    materials: [{ name: '冰红茶', amount: '1瓶' }, { name: '柠檬', amount: '1片' }, { name: '蜂蜜', amount: '1勺' }, { name: '冰块', amount: '适量' }],
    instructions: ['柠檬切片放入杯中', '加蜂蜜和冰块', '倒入冰红茶摇匀'],
    tips: '蜂蜜先用少量温水化开更好融合。'
  },
  {
    id: 1005, name: '西瓜气泡', nameEn: 'Watermelon Fizz', emoji: '🍉',
    gradient: 'linear-gradient(135deg,#EFDFD9,#E3C4BD)',
    cost: 8, steps: 2, tag: '3分钟', scenes: ['zero', 'camping', 'tea'],
    materials: [{ name: '西瓜汁', amount: '150ml' }, { name: '气泡水', amount: '150ml' }, { name: '青柠', amount: '1块' }, { name: '冰块', amount: '适量' }],
    instructions: ['杯中加冰，倒入西瓜汁', '注入气泡水，挤入青柠汁'],
    tips: '西瓜汁和气泡水 1:1，颜色粉嫩特别适合拍照。'
  },
  {
    id: 1006, name: '伏特加橙汁', nameEn: 'Screwdriver', emoji: '🍊',
    gradient: 'linear-gradient(135deg,#EFE4D5,#DFC28F)',
    cost: 13, steps: 2, tag: '经典', scenes: ['tipsy', 'camping'],
    materials: [{ name: '伏特加小瓶', amount: '1瓶' }, { name: '橙汁', amount: '1盒' }, { name: '橙片', amount: '1片' }, { name: '冰块', amount: '适量' }],
    instructions: ['杯中加满冰块', '倒入伏特加和橙汁搅匀，放橙片装饰'],
    tips: '最经典的入门调酒，橙汁选纯果汁口感更好。'
  },
  {
    id: 1007, name: '椰奶冰咖', nameEn: 'Coconut Iced Coffee', emoji: '🥥',
    gradient: 'linear-gradient(135deg,#EDEEE9,#CFD3CC)',
    cost: 9, steps: 2, tag: '下午茶', scenes: ['zero', 'tea'],
    materials: [{ name: '椰汁', amount: '100ml' }, { name: '罐装咖啡', amount: '1罐' }, { name: '冰块', amount: '适量' }],
    instructions: ['杯中加满冰块', '先倒椰汁再倒入咖啡，分层也好看'],
    tips: '椰汁的甜刚好中和咖啡的苦，搅拌后更香。'
  },
  {
    id: 1008, name: '葡萄气泡', nameEn: 'Grape Fizz', emoji: '🍇',
    gradient: 'linear-gradient(135deg,#E8E1E6,#CDBCC8)',
    cost: 7, steps: 2, tag: '2分钟', scenes: ['zero', 'dorm', 'tea'],
    materials: [{ name: '葡萄汁', amount: '150ml' }, { name: '苏打水', amount: '150ml' }, { name: '柠檬', amount: '1片' }, { name: '冰块', amount: '适量' }],
    instructions: ['杯中加冰，倒入葡萄汁', '注满苏打水，放柠檬片'],
    tips: '用紫葡萄汁颜色最漂亮，白葡萄汁更清爽。'
  },
  {
    id: 1009, name: '奶香咖啡冰', nameEn: 'Coffee Milk', emoji: '☕',
    gradient: 'linear-gradient(135deg,#E7E2DA,#CDBFB4)',
    cost: 8, steps: 2, tag: '提神', scenes: ['zero', 'tea', 'dorm'],
    materials: [{ name: '牛奶', amount: '150ml' }, { name: '罐装咖啡', amount: '1罐' }, { name: '冰块', amount: '适量' }],
    instructions: ['杯中加冰，倒入牛奶', '缓缓倒入咖啡，搅匀即可'],
    tips: '全脂牛奶更香浓，脱脂更清爽，按喜好选。'
  },
  {
    id: 1010, name: '蜜桃乌龙气泡', nameEn: 'Peach Oolong Fizz', emoji: '🍑',
    gradient: 'linear-gradient(135deg,#EFDFE2,#DDB9C1)',
    cost: 8, steps: 3, tag: '清新', scenes: ['zero', 'tea', 'dorm'],
    materials: [{ name: '蜜桃汁', amount: '100ml' }, { name: '乌龙茶', amount: '100ml' }, { name: '气泡水', amount: '100ml' }, { name: '冰块', amount: '适量' }],
    instructions: ['杯中加冰，倒入蜜桃汁和乌龙茶', '注满气泡水', '轻轻搅拌'],
    tips: '三种液体等量，茶香和果香平衡得刚好。'
  },
  {
    id: 1011, name: '梅子苏打', nameEn: 'Plum Soda', emoji: '🍶',
    gradient: 'linear-gradient(135deg,#E8E1E6,#BCA0BC)',
    cost: 12, steps: 2, tag: '微醺', scenes: ['tipsy', 'tea'],
    materials: [{ name: '梅子酒', amount: '45ml' }, { name: '苏打水', amount: '150ml' }, { name: '冰块', amount: '适量' }],
    instructions: ['杯中加冰，倒入梅子酒', '注满苏打水搅匀'],
    tips: '梅子酒甜度高，苏打水可以多放一点解腻。'
  },
  {
    id: 1012, name: '话梅可乐', nameEn: 'Plum Cola', emoji: '🥤',
    gradient: 'linear-gradient(135deg,#E7E2DA,#B3A297)',
    cost: 6, steps: 2, tag: '怀旧', scenes: ['zero', 'dorm', 'camping'],
    materials: [{ name: '可乐', amount: '1罐' }, { name: '话梅', amount: '2颗' }, { name: '柠檬', amount: '1片' }, { name: '冰块', amount: '适量' }],
    instructions: ['话梅放入杯底，加冰块', '倒入可乐，放柠檬片'],
    tips: '话梅泡久一点会更入味，咸甜交织很上头。'
  },
  {
    id: 1013, name: '青柠梳打', nameEn: 'Lime Soda', emoji: '🍋',
    gradient: 'linear-gradient(135deg,#E4EBDD,#BFD0A8)',
    cost: 5, steps: 2, tag: '最省钱', scenes: ['zero', 'dorm', 'camping'],
    materials: [{ name: '青柠', amount: '1个' }, { name: '苏打水', amount: '1罐' }, { name: '盐', amount: '少许' }, { name: '冰块', amount: '适量' }],
    instructions: ['青柠切块挤汁入杯，加少许盐', '加冰，倒满苏打水'],
    tips: '五块钱搞定，清爽程度不输任何气泡酒。'
  },
  {
    id: 1014, name: '酸奶水果杯', nameEn: 'Yogurt Fruit Cup', emoji: '🍓',
    gradient: 'linear-gradient(135deg,#EFDFE2,#DDB9C1)',
    cost: 9, steps: 2, tag: '健康', scenes: ['zero', 'tea'],
    materials: [{ name: '酸奶', amount: '1杯' }, { name: '蜜桃汁', amount: '50ml' }, { name: '柠檬', amount: '1片' }],
    instructions: ['酸奶倒入杯中', '淋上蜜桃汁，放柠檬片'],
    tips: '选浓稠的老酸奶口感更好，像甜品一样。'
  },
  {
    id: 1015, name: '预调果酒气泡', nameEn: 'RTD Fizz', emoji: '🍸',
    gradient: 'linear-gradient(135deg,#EFE4D5,#E0C3B4)',
    cost: 11, steps: 2, tag: '超简单', scenes: ['tipsy', 'camping'],
    materials: [{ name: '预调酒', amount: '1罐' }, { name: '气泡水', amount: '100ml' }, { name: '柠檬', amount: '1片' }, { name: '冰块', amount: '适量' }],
    instructions: ['杯中加冰，倒入预调酒', '兑入气泡水，放柠檬片'],
    tips: '预调酒兑气泡水能降低甜度，喝起来更清爽。'
  },
  {
    id: 1016, name: '蜂蜜柠檬水', nameEn: 'Honey Lemon', emoji: '🍯',
    gradient: 'linear-gradient(135deg,#F2EBD4,#E7D9A0)',
    cost: 5, steps: 3, tag: '零失败', scenes: ['zero', 'dorm', 'camping'],
    materials: [{ name: '柠檬', amount: '1个' }, { name: '蜂蜜', amount: '2勺' }, { name: '苏打水', amount: '1罐' }, { name: '冰块', amount: '适量' }],
    instructions: ['柠檬切片，加蜂蜜腌5分钟', '加冰和苏打水', '搅匀即可'],
    tips: '蜂蜜先用温水化开，和柠檬更搭。'
  },
  {
    id: 1017, name: '咸味番茄杯', nameEn: 'Salty Tomato', emoji: '🍅',
    gradient: 'linear-gradient(135deg,#EFDFD9,#E3C4BD)',
    cost: 7, steps: 3, tag: '开胃', scenes: ['zero', 'camping'],
    materials: [{ name: '番茄汁', amount: '1盒' }, { name: '柠檬', amount: '1块' }, { name: '盐', amount: '少许' }, { name: '黑胡椒', amount: '少许' }, { name: '冰块', amount: '适量' }],
    instructions: ['番茄汁倒入杯中', '挤入柠檬汁，加盐和黑胡椒', '加冰搅匀'],
    tips: '无酒精版血腥玛丽，露营配餐很开胃。'
  },
  {
    id: 1018, name: '桂花米酿气泡', nameEn: 'Osmanthus Fizz', emoji: '🌼',
    gradient: 'linear-gradient(135deg,#F2EBD4,#DFC28F)',
    cost: 9, steps: 2, tag: '国风', scenes: ['tipsy', 'tea'],
    materials: [{ name: '米酒', amount: '60ml' }, { name: '气泡水', amount: '150ml' }, { name: '蜂蜜', amount: '1勺' }, { name: '冰块', amount: '适量' }],
    instructions: ['杯中加冰，倒入米酒和蜂蜜', '注满气泡水搅匀'],
    tips: '米酒温润，气泡轻盈，适合慢慢喝。'
  },
  {
    id: 1019, name: '柠檬茶炸弹', nameEn: 'Vita Vodka Tea', emoji: '🍋',
    gradient: 'linear-gradient(135deg,#F0E6D2,#DFC28F)',
    cost: 14, steps: 3, tag: '人气', scenes: ['tipsy', 'dorm', 'camping'],
    materials: [{ name: '伏特加小瓶', amount: '1瓶' }, { name: '维他柠檬茶', amount: '1瓶' }, { name: '柠檬', amount: '1片' }, { name: '冰块', amount: '适量' }],
    instructions: ['杯中加满冰块', '倒入伏特加和维他柠檬茶', '放上柠檬片，搅匀即可'],
    tips: '便利店最火的懒人组合，柠檬茶的微涩和伏特加特别搭。'
  },
  {
    id: 1020, name: '威士忌柠檬茶', nameEn: 'Whisky Lemon Tea', emoji: '🥃',
    gradient: 'linear-gradient(135deg,#EFE4D5,#DCB88A)',
    cost: 15, steps: 2, tag: '简单', scenes: ['tipsy', 'camping'],
    materials: [{ name: '威士忌小瓶', amount: '1瓶' }, { name: '维他柠檬茶', amount: '1瓶' }, { name: '冰块', amount: '适量' }],
    instructions: ['杯中加冰，倒入威士忌', '倒满维他柠檬茶，搅匀'],
    tips: '想更清爽就多加点冰，威士忌选入门款就够。'
  },
  {
    id: 1021, name: '野格红牛', nameEn: 'Jägermeister & Red Bull', emoji: '⚡',
    gradient: 'linear-gradient(135deg,#E6D2A8,#D3AC77)',
    cost: 16, steps: 2, tag: '提神', scenes: ['tipsy', 'camping'],
    materials: [{ name: '野格', amount: '1瓶' }, { name: '红牛', amount: '1罐' }, { name: '冰块', amount: '适量' }],
    instructions: ['杯中加满冰块', '倒入野格和红牛，搅匀'],
    tips: '咖啡因会掩盖醉意，一杯就好，千万别贪杯。'
  },
  {
    id: 1022, name: '野格魔爪', nameEn: 'Jäger Monster', emoji: '🐉',
    gradient: 'linear-gradient(135deg,#E1E4EA,#A7AEC0)',
    cost: 16, steps: 2, tag: '劲爽', scenes: ['tipsy', 'camping'],
    materials: [{ name: '野格', amount: '1瓶' }, { name: '魔爪', amount: '1罐' }, { name: '冰块', amount: '适量' }],
    instructions: ['杯中加满冰块', '倒入野格和魔爪'],
    tips: '比野格红牛更冲，适合露营熬夜局，量力而行。'
  },
  {
    id: 1023, name: '百利旺仔', nameEn: 'Baileys Wangzai', emoji: '🥛',
    gradient: 'linear-gradient(135deg,#EFE4D5,#E3C9A6)',
    cost: 15, steps: 2, tag: '甜党', scenes: ['tipsy', 'tea', 'dorm'],
    materials: [{ name: '百利甜', amount: '1瓶' }, { name: '旺仔牛奶', amount: '1盒' }, { name: '冰块', amount: '适量' }],
    instructions: ['杯中加冰，倒入百利甜', '倒满旺仔牛奶，搅匀'],
    tips: '像在喝奶昔，甜甜的很好入口，后劲可不小。'
  },
  {
    id: 1024, name: '百利奶茶', nameEn: 'Baileys Milk Tea', emoji: '🧋',
    gradient: 'linear-gradient(135deg,#E7E2DA,#CDBFB4)',
    cost: 14, steps: 2, tag: '丝滑', scenes: ['tipsy', 'tea'],
    materials: [{ name: '百利甜', amount: '1瓶' }, { name: '奶茶', amount: '1瓶' }, { name: '冰块', amount: '适量' }],
    instructions: ['杯中加满冰块', '倒入百利甜和奶茶，摇匀'],
    tips: '选无糖奶茶不会太腻，百利甜的奶油香很突出。'
  },
  {
    id: 1025, name: '百利阿华田', nameEn: 'Baileys Ovaltine', emoji: '🍫',
    gradient: 'linear-gradient(135deg,#E7E2DA,#A8988A)',
    cost: 15, steps: 3, tag: '巧克力', scenes: ['tipsy', 'tea'],
    materials: [{ name: '百利甜', amount: '1瓶' }, { name: '阿华田', amount: '1份' }, { name: '牛奶', amount: '100ml' }, { name: '冰块', amount: '适量' }],
    instructions: ['阿华田粉用少量温水化开', '杯中加冰，倒入牛奶和阿华田', '缓缓倒入百利甜'],
    tips: '像一杯大人版的可可牛奶，冬天常温喝也很好。'
  },
  {
    id: 1026, name: '金汤力', nameEn: 'Gin & Tonic', emoji: '🍸',
    gradient: 'linear-gradient(135deg,#E2EADF,#B6D0C4)',
    cost: 14, steps: 3, tag: '经典', scenes: ['tipsy', 'camping'],
    materials: [{ name: '金酒小瓶', amount: '1瓶' }, { name: '汤力水', amount: '1罐' }, { name: '青柠', amount: '1块' }, { name: '冰块', amount: '适量' }],
    instructions: ['杯中加满冰块', '倒入金酒和汤力水', '挤入青柠汁，放青柠块'],
    tips: '汤力水的奎宁微苦配金酒最经典，别用苏打水代替。'
  },
  {
    id: 1027, name: '金橙菲兹', nameEn: 'Orange Gin Fizz', emoji: '🍊',
    gradient: 'linear-gradient(135deg,#EFE4D5,#D3AC77)',
    cost: 13, steps: 2, tag: '清爽', scenes: ['tipsy', 'camping'],
    materials: [{ name: '金酒小瓶', amount: '1瓶' }, { name: '橙汁', amount: '1盒' }, { name: '橙片', amount: '1片' }, { name: '冰块', amount: '适量' }],
    instructions: ['杯中加冰，倒入金酒', '倒满橙汁，放橙片'],
    tips: '金酒的植物香配橙汁特别清新，比例 1:3 最顺口。'
  },
  {
    id: 1028, name: '葡萄茉莉金', nameEn: 'Grape Jasmine Gin', emoji: '🍇',
    gradient: 'linear-gradient(135deg,#E8E1E6,#BCA0BC)',
    cost: 14, steps: 3, tag: '国风', scenes: ['tipsy', 'tea'],
    materials: [{ name: '金酒小瓶', amount: '1瓶' }, { name: '葡萄汁', amount: '100ml' }, { name: '茉莉茶', amount: '100ml' }, { name: '冰块', amount: '适量' }],
    instructions: ['杯中加冰，倒入葡萄汁和茉莉茶', '倒入金酒', '轻轻搅匀'],
    tips: '茶香能解酒气，喝起来像高级果茶。'
  },
  {
    id: 1029, name: '薄荷朗姆', nameEn: 'Mint Rum', emoji: '🌿',
    gradient: 'linear-gradient(135deg,#E2EADF,#AFC9AE)',
    cost: 13, steps: 3, tag: '莫吉托平替', scenes: ['tipsy', 'camping'],
    materials: [{ name: '朗姆酒小瓶', amount: '1瓶' }, { name: '雪碧', amount: '1罐' }, { name: '薄荷糖', amount: '2颗' }, { name: '青柠', amount: '1块' }, { name: '冰块', amount: '适量' }],
    instructions: ['薄荷糖放杯底捣碎', '加冰，倒入朗姆酒和雪碧', '挤入青柠汁'],
    tips: '没有新鲜薄荷也能做，薄荷糖就是便利店版莫吉托的灵魂。'
  },
  {
    id: 1030, name: '椰林漫步', nameEn: 'Coconut Rum', emoji: '🥥',
    gradient: 'linear-gradient(135deg,#E4EBDD,#B6D0C4)',
    cost: 14, steps: 2, tag: '海岛风', scenes: ['tipsy', 'camping'],
    materials: [{ name: '朗姆酒小瓶', amount: '1瓶' }, { name: '椰子水', amount: '1瓶' }, { name: '青柠', amount: '1块' }, { name: '冰块', amount: '适量' }],
    instructions: ['杯中加满冰块', '倒入朗姆酒和椰子水，挤青柠汁'],
    tips: '比椰汁版更清爽，喝一口仿佛在海边。'
  },
  {
    id: 1031, name: '烧酒雪碧', nameEn: 'Soju & Sprite', emoji: '🍶',
    gradient: 'linear-gradient(135deg,#F2EBD4,#E7D9A0)',
    cost: 12, steps: 2, tag: '韩剧同款', scenes: ['tipsy', 'dorm', 'camping'],
    materials: [{ name: '烧酒', amount: '1瓶' }, { name: '雪碧', amount: '1罐' }, { name: '冰块', amount: '适量' }],
    instructions: ['杯中加满冰块', '倒入烧酒和雪碧，1:1 兑匀'],
    tips: '韩国经典喝法，冰透了才好喝。'
  },
  {
    id: 1032, name: '果冻烧酒', nameEn: 'Jelly Soju', emoji: '🍮',
    gradient: 'linear-gradient(135deg,#EFDFE2,#CE9FAC)',
    cost: 13, steps: 2, tag: '趣味', scenes: ['tipsy', 'dorm'],
    materials: [{ name: '烧酒', amount: '1瓶' }, { name: '果冻', amount: '1盒' }, { name: '冰块', amount: '适量' }],
    instructions: ['果冻切块放入杯中', '倒入烧酒，加冰，用勺子吃'],
    tips: '别用吸管，吸不上来还容易呛到。'
  },
  {
    id: 1033, name: '西柚盐边', nameEn: 'Grapefruit Rim', emoji: '🍊',
    gradient: 'linear-gradient(135deg,#EFDFD9,#DDAE9B)',
    cost: 13, steps: 3, tag: '微苦', scenes: ['tipsy', 'camping'],
    materials: [{ name: '伏特加小瓶', amount: '1瓶' }, { name: '西柚汁', amount: '1盒' }, { name: '盐', amount: '少许' }, { name: '冰块', amount: '适量' }],
    instructions: ['杯口抹一圈盐', '杯中加冰，倒入伏特加和西柚汁', '搅匀'],
    tips: '盐边能带出西柚的微苦，30 秒做出鸡尾酒的仪式感。'
  },
  {
    id: 1034, name: '日落橙', nameEn: 'Sunset Orange', emoji: '🌅',
    gradient: 'linear-gradient(135deg,#EFE4D5,#CE9C82)',
    cost: 14, steps: 3, tag: '分层', scenes: ['tipsy', 'camping'],
    materials: [{ name: '伏特加小瓶', amount: '1瓶' }, { name: '红石榴汁', amount: '50ml' }, { name: '橙汁', amount: '100ml' }, { name: '冰块', amount: '适量' }],
    instructions: ['杯中加冰，倒入橙汁和伏特加', '缓缓沿杯壁倒入红石榴汁', '不搅拌，看它沉底渐变'],
    tips: '红石榴汁密度大，会沉在底部形成日落渐变。'
  },
  {
    id: 1035, name: '话梅柠檬茶酒', nameEn: 'Plum Vodka Tea', emoji: '🫒',
    gradient: 'linear-gradient(135deg,#F0E6D2,#DCB88A)',
    cost: 12, steps: 3, tag: '上头', scenes: ['tipsy', 'dorm'],
    materials: [{ name: '伏特加小瓶', amount: '1瓶' }, { name: '维他柠檬茶', amount: '1瓶' }, { name: '话梅', amount: '2颗' }, { name: '冰块', amount: '适量' }],
    instructions: ['话梅放杯底，加冰', '倒入伏特加', '倒满维他柠檬茶，摇匀'],
    tips: '话梅越泡越有味，咸甜酸一起上，很容易一杯接一杯。'
  },
  {
    id: 1036, name: '威士忌可乐', nameEn: 'Whisky & Coke', emoji: '🥃',
    gradient: 'linear-gradient(135deg,#E7E2DA,#9C8577)',
    cost: 13, steps: 2, tag: '零失败', scenes: ['tipsy', 'camping'],
    materials: [{ name: '威士忌小瓶', amount: '1瓶' }, { name: '可乐', amount: '1罐' }, { name: '冰块', amount: '适量' }],
    instructions: ['杯中加满冰块', '倒入威士忌和可乐'],
    tips: '最不会出错的组合，比例随口味调，1:3 比较稳。'
  },
  {
    id: 1037, name: '威士忌冰茶', nameEn: 'Whisky Iced Tea', emoji: '🧋',
    gradient: 'linear-gradient(135deg,#EFE4D5,#B3A297)',
    cost: 13, steps: 3, tag: '清爽', scenes: ['tipsy', 'camping'],
    materials: [{ name: '威士忌小瓶', amount: '1瓶' }, { name: '冰红茶', amount: '1瓶' }, { name: '柠檬', amount: '1片' }, { name: '冰块', amount: '适量' }],
    instructions: ['杯中加冰，倒入威士忌', '倒满冰红茶', '放柠檬片'],
    tips: '茶味能压住酒的烈，喝起来像升级版冰红茶。'
  },
  {
    id: 1038, name: '百利咖啡', nameEn: 'Baileys Coffee', emoji: '☕',
    gradient: 'linear-gradient(135deg,#E7E2DA,#8A7466)',
    cost: 14, steps: 2, tag: '提神', scenes: ['tipsy', 'tea', 'dorm'],
    materials: [{ name: '百利甜', amount: '1瓶' }, { name: '罐装咖啡', amount: '1罐' }, { name: '冰块', amount: '适量' }],
    instructions: ['杯中加满冰块', '倒入百利甜和咖啡，搅匀'],
    tips: '爱尔兰咖啡的便利店版，甜苦平衡，下午喝刚好。'
  },
  {
    id: 1039, name: '野格阿华田', nameEn: 'Jäger Ovaltine', emoji: '🍫',
    gradient: 'linear-gradient(135deg,#E7E2DA,#7E685C)',
    cost: 15, steps: 3, tag: '巧克力', scenes: ['tipsy', 'tea'],
    materials: [{ name: '野格', amount: '1瓶' }, { name: '阿华田', amount: '1份' }, { name: '牛奶', amount: '100ml' }, { name: '冰块', amount: '适量' }],
    instructions: ['阿华田用温水化开', '杯中加冰，倒入牛奶和阿华田', '缓缓倒入野格'],
    tips: '野格的草药味被巧克力盖住，只剩温暖的甜香。'
  },
  {
    id: 1040, name: '蜜桃乌龙金', nameEn: 'Peach Oolong Gin', emoji: '🍑',
    gradient: 'linear-gradient(135deg,#EFDFE2,#CE9FAC)',
    cost: 14, steps: 3, tag: '果茶', scenes: ['tipsy', 'tea'],
    materials: [{ name: '金酒小瓶', amount: '1瓶' }, { name: '蜜桃汁', amount: '100ml' }, { name: '乌龙茶', amount: '100ml' }, { name: '冰块', amount: '适量' }],
    instructions: ['杯中加冰，倒入蜜桃汁和乌龙茶', '倒入金酒', '摇匀即可'],
    tips: '像带酒感的蜜桃乌龙茶，很适合下午茶时间。'
  }
];

// 避坑指南
const PITFALLS = [
  { emoji: '⚠️', title: '牛奶别配碳酸饮料', desc: '牛奶遇到可乐、苏打水会凝结成絮状，口感很差也影响观感。想加奶就用咖啡或果汁。' },
  { emoji: '🍶', title: '别混着喝不同基酒', desc: '伏特加+朗姆+金酒一起兑，容易上头且味道混乱。一杯酒只用一种基酒就好。' },
  { emoji: '🧊', title: '冰块要加够', desc: '便利店调酒成败的关键是冰够不够。冰少了味道寡淡，先把杯子加满冰再倒饮料。' },
  { emoji: '🍋', title: '果汁选纯的不选饮料', desc: '100% 果汁调出来清爽自然，果味饮料糖分太高会盖过酒香，看配料表第一位是不是水。' },
  { emoji: '🥤', title: '碳酸饮料最后倒', desc: '先倒果汁和酒，最后缓缓注入碳酸，能保留气泡；先倒气泡再搅会让气跑光。' },
  { emoji: '🚫', title: '这些组合请避开', desc: '能量饮料配酒精容易心跳加速；酸奶配碳酸会分层结块。不确定的组合，先少量试。' },
  { emoji: '⚡', title: '野格红牛别贪杯', desc: '咖啡因会掩盖醉意，感觉不到醉其实已经喝多了。野格配红牛或魔爪，一杯就够了。' },
  { emoji: '🥛', title: '百利甜别配碳酸', desc: '百利甜含奶油，遇碳酸会结絮。和旺仔、奶茶、咖啡、牛奶搭配才顺滑。' },
  { emoji: '🍮', title: '果冻酒别用吸管', desc: '果冻烧酒要用勺子挖着吃，吸管吸不上来，还容易把果冻呛进气管。' },
  { emoji: '🍸', title: '小瓶酒别一次全倒', desc: '便利店小瓶酒度数不低，先倒一半试口味。兑饮料时酒和饮料按 1:3 起步最稳。' }
];

// ========== 运行时数据：优先使用后端内容，失败时回退到本地静态数据 ==========
const request = require('./request');

let state = {
  materials: MATERIALS.slice(),
  drinks: DRINKS.slice(),
  pitfalls: PITFALLS.slice()
};
let lastLoadAt = 0;
let loadingPromise = null;

function getMaterials() { return state.materials; }
function getDrinks() { return state.drinks; }
function getPitfalls() { return state.pitfalls; }

/**
 * 从后端拉取便利店内容；失败或数据为空时自动使用本地数据
 * @param {boolean} force true 时忽略 1 分钟内的缓存
 */
function loadRemote(force) {
  const now = Date.now();
  if (!force && loadingPromise) return loadingPromise;
  if (!force && now - lastLoadAt < 60000) return Promise.resolve(state);

  lastLoadAt = now;
  loadingPromise = request({ url: '/convenience', silent: true })
    .then(data => {
      if (data && Array.isArray(data.drinks) && data.drinks.length) {
        state = {
          drinks: data.drinks,
          materials: Array.isArray(data.materials) ? data.materials : state.materials,
          pitfalls: Array.isArray(data.pitfalls) ? data.pitfalls : state.pitfalls
        };
      }
      loadingPromise = null;
      return state;
    })
    .catch(() => {
      loadingPromise = null;
      return state;
    });
  return loadingPromise;
}

function getDrinksByScene(scene) {
  if (scene === 'all') return getDrinks();
  return getDrinks().filter(d => (d.scenes || []).indexOf(scene) >= 0);
}

function getMaterialsByNames(names) {
  return names.map(n => {
    const found = getMaterials().find(m => m.name === n.name);
    return Object.assign({}, n, { emoji: found ? found.emoji : '🥤' });
  });
}

// 根据手头材料匹配能做的配方（有任一交集即推荐，按匹配度排序）
function matchByMaterials(selected) {
  const set = {};
  selected.forEach(n => { set[n] = true; });
  return getDrinks().map(d => {
    const need = (d.materials || []).map(m => m.name);
    const matched = need.filter(n => set[n]);
    return { drink: d, matched: matched.length, total: need.length, missing: need.filter(n => !set[n]) };
  })
    .filter(r => r.matched > 0)
    .sort((a, b) => (b.matched / b.total) - (a.matched / a.total));
}

module.exports = {
  SCENES, MATERIALS, DRINKS, PITFALLS,
  getMaterials, getDrinks, getPitfalls, loadRemote,
  getDrinksByScene, getMaterialsByNames, matchByMaterials
};
