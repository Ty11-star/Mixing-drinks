// pages/knowledge/knowledge.js
const app = getApp();

const TABS = [
  { key: 'spirit', label: '基酒' },
  { key: 'method', label: '方法' },
  { key: 'tool', label: '工具' },
  { key: 'term', label: '术语' },
  { key: 'unit', label: '换算' }
];

const DATA = {
  spirit: [
    { name: '伏特加 Vodka', desc: '无色中性烈酒，几乎无味，是鸡尾酒的百搭基酒，适合突出其他材料风味。' },
    { name: '金酒 Gin', desc: '以杜松子为主调香，植物香气突出，金汤力、马天尼的灵魂。' },
    { name: '朗姆酒 Rum', desc: '甘蔗蒸馏酒，分白/金/黑，带来甜润热带气息，莫吉托必备。' },
    { name: '龙舌兰 Tequila', desc: '墨西哥特产，蓝龙舌兰酿造，带独特植物辛辣，玛格丽特、日出常用。' },
    { name: '威士忌 Whisky', desc: '谷物发酵蒸馏，橡木桶陈年，醇厚回甘，老式、酸酒常用。' },
    { name: '白兰地 Brandy', desc: '葡萄等水果蒸馏烈酒，圆润果香，适合餐后热饮鸡尾酒。' }
  ],
  method: [
    { name: '摇和法 Shake', desc: '将材料与冰块放入雪克壶用力摇匀，使酒体冰凉、口感顺滑并轻微稀释，适合含果汁/蛋白的酒。' },
    { name: '搅拌法 Stir', desc: '在搅拌杯中用吧匙轻轻搅拌，保持酒体清澈、口感醇厚，常用于威士忌类（如内格罗尼）。' },
    { name: '兑和法 Build', desc: '直接在杯中依次加入材料与冰块，轻轻搅拌，最简单家常，如金汤力、莫吉托。' }
  ],
  tool: [
    { name: '雪克壶 Shaker', desc: '摇酒用，分波士顿壶（两件套）与日式壶（三件套带滤盖）。' },
    { name: '吧匙 Bar Spoon', desc: '长柄带螺旋，用于搅拌与分层，螺旋处可辅助旋转。' },
    { name: '量酒器 Jigger', desc: '标准双头量杯（常见 30/15ml），保证配方比例精准。' },
    { name: '滤冰器 Strainer', desc: '配合雪克壶过滤冰块，避免碎冰进入成品。' },
    { name: '捣棒 Muddler', desc: '捣压薄荷、水果释放香气，莫吉托的关键工具。' }
  ],
  term: [
    { name: '基酒 Base Spirit', desc: '鸡尾酒中提供酒精与主体风味的烈酒，决定酒的类型。' },
    { name: '装饰 Garnish', desc: '提升视觉与香气的点缀物，如柠檬片、薄荷、樱桃。' },
    { name: '苦精 Bitters', desc: '高浓度草本萃取液，几滴即可增加层次与复杂度。' },
    { name: '糖浆 Syrup', desc: '糖与水的混合物，比砂糖更易溶解，平衡酸味。' },
    { name: '酒精度 ABV', desc: '酒液中酒精体积占比，影响口感强度与饮用量。' }
  ],
  unit: [
    { name: '1 oz（盎司）', desc: '≈ 30 ml' },
    { name: '1 dash（滴）', desc: '≈ 1 ml，常用于苦精' },
    { name: '1 tsp（茶匙）', desc: '≈ 5 ml' },
    { name: '1 tbsp（汤匙）', desc: '≈ 15 ml' },
    { name: '1 cup（杯）', desc: '≈ 240 ml' }
  ]
};

Page({
  data: {
    tabs: TABS,
    active: 'spirit',
    items: DATA.spirit
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 });
    }
  },

  switchTab(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ active: key, items: DATA[key] });
  }
});
