/**
 * 便利店调酒内容控制器
 * 公开读取 + 管理端 CRUD
 */

const { ConvenienceDrink, ConvenienceMaterial, ConveniencePitfall } = require('../models');
const { success, error } = require('../utils/response');

function parseJson(value, fallback) {
  if (value == null) return fallback;
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch (e) { return fallback; }
  }
  return value;
}

function sanitize(body) {
  const { id, create_time, update_time, createdAt, updatedAt, ...rest } = body || {};
  return rest;
}

function formatDrink(d) {
  return {
    id: d.id,
    name: d.name,
    nameEn: d.nameEn || '',
    emoji: d.emoji || '',
    gradient: d.gradient || '',
    cost: Number(d.cost) || 0,
    steps: d.steps || 0,
    tag: d.tag || '',
    tips: d.tips || '',
    instructions: parseJson(d.instructions, []),
    materials: parseJson(d.materials, []),
    scenes: parseJson(d.scenes, []),
    status: d.status,
    sortOrder: d.sortOrder
  };
}

function formatMaterial(m) {
  return {
    id: m.id,
    name: m.name,
    emoji: m.emoji || '',
    category: m.category || '',
    sortOrder: m.sortOrder
  };
}

function formatPitfall(p) {
  return {
    id: p.id,
    emoji: p.emoji || '',
    title: p.title,
    desc: p.desc || '',
    sortOrder: p.sortOrder
  };
}

// 小程序端一次性拉取全部公开数据
exports.getPublicData = async (req, res) => {
  try {
    const [drinkRows, materialRows, pitfallRows] = await Promise.all([
      ConvenienceDrink.findAll({
        where: { status: 1 },
        order: [['sortOrder', 'ASC'], ['id', 'ASC']]
      }),
      ConvenienceMaterial.findAll({ order: [['sortOrder', 'ASC'], ['id', 'ASC']] }),
      ConveniencePitfall.findAll({ order: [['sortOrder', 'ASC'], ['id', 'ASC']] })
    ]);

    res.json(success({
      drinks: drinkRows.map(formatDrink),
      materials: materialRows.map(formatMaterial),
      pitfalls: pitfallRows.map(formatPitfall)
    }));
  } catch (err) {
    console.error('获取便利店数据失败:', err);
    res.status(500).json(error('获取便利店数据失败'));
  }
};

function createCrud(Model, formatter, label) {
  return {
    list: async (req, res) => {
      try {
        const rows = await Model.findAll({ order: [['sortOrder', 'ASC'], ['id', 'ASC']] });
        res.json(success(rows.map(formatter)));
      } catch (err) {
        console.error(`获取${label}列表失败:`, err);
        res.status(500).json(error(`获取${label}列表失败`));
      }
    },
    create: async (req, res) => {
      try {
        const row = await Model.create(sanitize(req.body));
        res.json(success(formatter(row), '创建成功'));
      } catch (err) {
        console.error(`创建${label}失败:`, err);
        res.status(500).json(error(err.message || `创建${label}失败`));
      }
    },
    update: async (req, res) => {
      try {
        const row = await Model.findByPk(req.params.id);
        if (!row) return res.status(404).json(error(`${label}不存在`, 404));
        await row.update(sanitize(req.body));
        res.json(success(formatter(row), '更新成功'));
      } catch (err) {
        console.error(`更新${label}失败:`, err);
        res.status(500).json(error(err.message || `更新${label}失败`));
      }
    },
    remove: async (req, res) => {
      try {
        const row = await Model.findByPk(req.params.id);
        if (!row) return res.status(404).json(error(`${label}不存在`, 404));
        await row.destroy();
        res.json(success(null, '删除成功'));
      } catch (err) {
        console.error(`删除${label}失败:`, err);
        res.status(500).json(error(err.message || `删除${label}失败`));
      }
    }
  };
}

exports.drinks = createCrud(ConvenienceDrink, formatDrink, '配方');
exports.materials = createCrud(ConvenienceMaterial, formatMaterial, '材料');
exports.pitfalls = createCrud(ConveniencePitfall, formatPitfall, '避坑指南');

exports.toggleDrinkStatus = async (req, res) => {
  try {
    const row = await ConvenienceDrink.findByPk(req.params.id);
    if (!row) return res.status(404).json(error('配方不存在', 404));
    await row.update({ status: req.body.status === 0 ? 0 : 1 });
    res.json(success(formatDrink(row), '状态已更新'));
  } catch (err) {
    console.error('更新配方状态失败:', err);
    res.status(500).json(error('更新配方状态失败'));
  }
};
