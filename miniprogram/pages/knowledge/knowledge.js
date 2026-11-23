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
    { name: '白兰地 Brandy', desc: '葡萄等水果蒸馏烈酒，圆润果香，适合餐后热饮鸡尾酒。' },
    { name: '波本威士忌 Bourbon', desc: '美国玉米为主的威士忌，带有 vanilla 与焦糖甜香，薄荷朱利普的灵魂。' },
    { name: '黑麦威士忌 Rye', desc: '黑麦为主的美国威士忌，辛香辛辣，古典与曼哈顿的经典基酒。' },
    { name: '梅斯卡尔 Mezcal', desc: '龙舌兰经烟熏烘烤后蒸馏，带独特烟熏气息，可纯饮或调制烟熏风格酒。' },
    { name: '利口酒 Liqueur', desc: '在烈酒中加入水果、草本、糖等风味的甜酒，如蓝橙、君度、百利甜。' },
    { name: '味美思 Vermouth', desc: '加香型加强葡萄酒，分红/干两类，是马天尼、曼哈顿的关键配料。' },
    { name: '金巴利 Campari', desc: '意大利深红色苦味利口酒，内格罗尼与美国佬的核心，苦甜开胃。' }
  ],
  method: [
    { name: '摇和法 Shake', desc: '将材料与冰块放入雪克壶用力摇匀，使酒体冰凉、口感顺滑并轻微稀释，适合含果汁/蛋白的酒。' },
    { name: '搅拌法 Stir', desc: '在搅拌杯中用吧匙轻轻搅拌，保持酒体清澈、口感醇厚，常用于威士忌类（如内格罗尼）。' },
    { name: '兑和法 Build', desc: '直接在杯中依次加入材料与冰块，轻轻搅拌，最简单家常，如金汤力、莫吉托。' },
    { name: '捣和法 Muddle', desc: '用捣棒在杯中压碎薄荷或水果释放风味，再加入其他材料，如莫吉托、朱利普。' },
    { name: '搅打法 Blend', desc: '将所有材料与碎冰放入搅拌机打至浓稠，适合椰林飘香等冰沙类饮品。' },
    { name: '干摇 Dry Shake', desc: '不加冰先摇含蛋清的酒，打出绵密泡沫后再加冰摇，如金菲兹。' },
    { name: '漂浮法 Float', desc: '沿吧匙缓慢倒入不同密度的酒液形成分层，如龙舌兰日出。' }
  ],
  tool: [
    { name: '雪克壶 Shaker', desc: '摇酒用，分波士顿壶（两件套）与日式壶（三件套带滤盖）。' },
    { name: '吧匙 Bar Spoon', desc: '长柄带螺旋，用于搅拌与分层，螺旋处可辅助旋转。' },
    { name: '量酒器 Jigger', desc: '标准双头量杯（常见 30/15ml），保证配方比例精准。' },
    { name: '滤冰器 Strainer', desc: '配合雪克壶过滤冰块，避免碎冰进入成品。' },
    { name: '捣棒 Muddler', desc: '捣压薄荷、水果释放香气，莫吉托的关键工具。' },
    { name: '搅拌杯 Mixing Glass', desc: '大容量厚底玻璃杯，配合吧匙搅拌清澈型鸡尾酒，如马天尼、曼哈顿。' },
    { name: '冰球模 Ice Ball Mold', desc: '制作大冰球，融化慢、稀释少，适合古典、老式等纯饮型酒。' },
    { name: '柑橘削皮器 Peeler', desc: '削出完整柠檬皮/橙皮，挤出精油香气并作装饰。' },
    { name: '搅打机 Blender', desc: '制作冰沙、冻饮类鸡尾酒，如椰林飘香、草莓代基里。' },
    { name: '滴管 Dropper', desc: '精准控制苦精、精油等少量液体的用量。' }
  ],
  term: [
    { name: '基酒 Base Spirit', desc: '鸡尾酒中提供酒精与主体风味的烈酒，决定酒的类型。' },
    { name: '装饰 Garnish', desc: '提升视觉与香气的点缀物，如柠檬片、薄荷、樱桃。' },
    { name: '苦精 Bitters', desc: '高浓度草本萃取液，几滴即可增加层次与复杂度。' },
    { name: '糖浆 Syrup', desc: '糖与水的混合物，比砂糖更易溶解，平衡酸味。' },
    { name: '酒精度 ABV', desc: '酒液中酒精体积占比，影响口感强度与饮用量。' },
    { name: '干型 Dry', desc: '几乎不含糖的风格，如干味美思、干马天尼，口感清爽利落。' },
    { name: '酸酒 Sour', desc: '基酒+柑橘汁+糖浆的经典结构，如威士忌酸、得其利。' },
    { name: '短饮 Short Drink', desc: '用小杯盛装、 quickly 饮尽的酒，如马天尼、曼哈顿，通常不加冰或少量冰。' },
    { name: '长饮 Long Drink', desc: '高球杯盛装、加大量冰块与苏打/果汁的酒，如金汤力、莫吉托，适合慢饮。' },
    { name: '盐边 Salt Rim', desc: '用青柠擦湿杯口再沾盐，玛格丽特的标志，突出酸甜对比。' },
    { name: '纯饮 Neat', desc: '不加冰、不稀释直接饮用烈酒，体会原始风味。' },
    { name: '加冰 On the Rocks', desc: '在大冰块上饮用，常见于威士忌、内格罗尼。' }
  ],
  unit: [
    { name: '1 oz（盎司）', desc: '≈ 30 ml' },
    { name: '1 dash（滴）', desc: '≈ 1 ml，常用于苦精' },
    { name: '1 tsp（茶匙）', desc: '≈ 5 ml' },
    { name: '1 tbsp（汤匙）', desc: '≈ 15 ml' },
    { name: '1 cup（杯）', desc: '≈ 240 ml' },
    { name: '1 cl（厘升）', desc: '= 10 ml，欧洲配方常用' },
    { name: '1 shot（份）', desc: '≈ 30-45 ml，酒吧常用基准' },
    { name: '冰块用量', desc: '摇壶一般为壶身 2/3 满，搅拌杯加至 2/3' },
    { name: '糖浆比例', desc: '糖:水 = 1:1 为简单糖浆，2:1 为浓糖浆' }
  ]
};

Page({
  data: {
    isDark: false,

    tabs: TABS,
    active: 'spirit',
    items: DATA.spirit
  },

  onShow() {
    try { const app = getApp(); this.setData({ isDark: app.globalData.theme === 'dark' }); } catch (e) {}
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ isDark: (getApp().globalData.theme === "dark"), selected: 3 });
    }
  },

  switchTab(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ active: key, items: DATA[key] });
  }
});
