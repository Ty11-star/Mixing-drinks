/**
 * 便利店调酒控制器
 */
const { ConvenienceMaterial, ConvenienceDrink, ConveniencePitfall } = require('../models');
const { success, error } = require('../utils/response');

// 材料库管理
const materials = {
  async list(req, res) {
    try {
      const list = await ConvenienceMaterial.findAll({
        order: [['sortOrder', 'ASC'], ['id', 'ASC']]
      });
      res.json(success(list));
    } catch (err) {
      console.error('获取材料库失败:', err);
      res.status(500).json(error('获取材料库失败'));
    }
  },

  async create(req, res) {
    try {
      const material = await ConvenienceMaterial.create(req.body);
      res.json(success({ id: material.id }, '添加成功'));
    } catch (err) {
      console.error('添加材料失败:', err);
      res.status(500).json(error('添加材料失败'));
    }
  },

  async update(req, res) {
    try {
      const [count] = await ConvenienceMaterial.update(req.body, {
        where: { id: req.params.id }
      });
      if (count > 0) {
        res.json(success(null, '更新成功'));
      } else {
        res.status(404).json(error('材料不存在'));
      }
    } catch (err) {
      console.error('更新材料失败:', err);
      res.status(500).json(error('更新材料失败'));
    }
  },

  async remove(req, res) {
    try {
      const count = await ConvenienceMaterial.destroy({
        where: { id: req.params.id }
      });
      if (count > 0) {
        res.json(success(null, '删除成功'));
      } else {
        res.status(404).json(error('材料不存在'));
      }
    } catch (err) {
      console.error('删除材料失败:', err);
      res.status(500).json(error('删除材料失败'));
    }
  }
};

// 配方管理
const drinks = {
  async list(req, res) {
    try {
      const list = await ConvenienceDrink.findAll({
        order: [['sortOrder', 'ASC'], ['id', 'ASC']]
      });
      res.json(success(list));
    } catch (err) {
      console.error('获取配方失败:', err);
      res.status(500).json(error('获取配方失败'));
    }
  },

  async create(req, res) {
    try {
      const drink = await ConvenienceDrink.create(req.body);
      res.json(success({ id: drink.id }, '添加成功'));
    } catch (err) {
      console.error('添加配方失败:', err);
      res.status(500).json(error('添加配方失败'));
    }
  },

  async update(req, res) {
    try {
      const [count] = await ConvenienceDrink.update(req.body, {
        where: { id: req.params.id }
      });
      if (count > 0) {
        res.json(success(null, '更新成功'));
      } else {
        res.status(404).json(error('配方不存在'));
      }
    } catch (err) {
      console.error('更新配方失败:', err);
      res.status(500).json(error('更新配方失败'));
    }
  },

  async remove(req, res) {
    try {
      const count = await ConvenienceDrink.destroy({
        where: { id: req.params.id }
      });
      if (count > 0) {
        res.json(success(null, '删除成功'));
      } else {
        res.status(404).json(error('配方不存在'));
      }
    } catch (err) {
      console.error('删除配方失败:', err);
      res.status(500).json(error('删除配方失败'));
    }
  }
};

// 避坑指南管理
const pitfalls = {
  async list(req, res) {
    try {
      const list = await ConveniencePitfall.findAll({
        order: [['sortOrder', 'ASC'], ['id', 'ASC']]
      });
      res.json(success(list));
    } catch (err) {
      console.error('获取避坑指南失败:', err);
      res.status(500).json(error('获取避坑指南失败'));
    }
  },

  async create(req, res) {
    try {
      const pitfall = await ConveniencePitfall.create(req.body);
      res.json(success({ id: pitfall.id }, '添加成功'));
    } catch (err) {
      console.error('添加避坑指南失败:', err);
      res.status(500).json(error('添加避坑指南失败'));
    }
  },

  async update(req, res) {
    try {
      const [count] = await ConveniencePitfall.update(req.body, {
        where: { id: req.params.id }
      });
      if (count > 0) {
        res.json(success(null, '更新成功'));
      } else {
        res.status(404).json(error('提示不存在'));
      }
    } catch (err) {
      console.error('更新避坑指南失败:', err);
      res.status(500).json(error('更新避坑指南失败'));
    }
  },

  async remove(req, res) {
    try {
      const count = await ConveniencePitfall.destroy({
        where: { id: req.params.id }
      });
      if (count > 0) {
        res.json(success(null, '删除成功'));
      } else {
        res.status(404).json(error('提示不存在'));
      }
    } catch (err) {
      console.error('删除避坑指南失败:', err);
      res.status(500).json(error('删除避坑指南失败'));
    }
  }
};

// 切换配方启用状态
async function toggleDrinkStatus(req, res) {
  try {
    const drink = await ConvenienceDrink.findByPk(req.params.id);
    if (!drink) {
      return res.status(404).json(error('配方不存在'));
    }

    await drink.update({
      isActive: drink.isActive === 1 ? 0 : 1
    });

    res.json(success(null, '状态更新成功'));
  } catch (err) {
    console.error('更新配方状态失败:', err);
    res.status(500).json(error('更新配方状态失败'));
  }
}

// 公开接口：获取所有便利店数据（小程序调用）
async function getAll(req, res) {
  try {
    const list = await ConvenienceDrink.findAll({
      where: { isActive: 1 },
      order: [['sortOrder', 'ASC'], ['id', 'ASC']]
    });

    const materialList = await ConvenienceMaterial.findAll({
      order: [['sortOrder', 'ASC'], ['id', 'ASC']]
    });

    const pitfallList = await ConveniencePitfall.findAll({
      order: [['sortOrder', 'ASC'], ['id', 'ASC']]
    });

    res.json(success({
      drinks: list,
      materials: materialList,
      pitfalls: pitfallList
    }));
  } catch (err) {
    console.error('获取便利店数据失败:', err);
    res.status(500).json(error('获取便利店数据失败'));
  }
}

module.exports = {
  materials,
  drinks,
  pitfalls,
  toggleDrinkStatus,
  getAll
};
