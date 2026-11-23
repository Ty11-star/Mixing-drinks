/**
 * 便利店调酒相关模型
 * 材料库 / 配方 / 避坑指南
 */

module.exports = {
  ConvenienceMaterial: (sequelize, DataTypes) => sequelize.define('ConvenienceMaterial', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: '主键'
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '材料名称'
    },
    emoji: {
      type: DataTypes.STRING(20),
      comment: '表情图标'
    },
    category: {
      type: DataTypes.STRING(30),
      comment: '材料分类'
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'sort_order',
      comment: '排序'
    }
  }, {
    tableName: 'convenience_materials',
    timestamps: true,
    createdAt: 'create_time',
    updatedAt: 'update_time'
  }),

  ConvenienceDrink: (sequelize, DataTypes) => sequelize.define('ConvenienceDrink', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: '主键，从1001起'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '配方名称'
    },
    nameEn: {
      type: DataTypes.STRING(100),
      field: 'name_en',
      comment: '英文名'
    },
    emoji: {
      type: DataTypes.STRING(20),
      comment: '表情图标'
    },
    gradient: {
      type: DataTypes.STRING(150),
      comment: '卡片渐变背景'
    },
    cost: {
      type: DataTypes.DECIMAL(6, 1),
      defaultValue: 0,
      comment: '估算成本（元）'
    },
    steps: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '步骤数'
    },
    tag: {
      type: DataTypes.STRING(30),
      comment: '标签'
    },
    tips: {
      type: DataTypes.TEXT,
      comment: '小贴士'
    },
    instructions: {
      type: DataTypes.JSON,
      comment: '步骤数组'
    },
    materials: {
      type: DataTypes.JSON,
      comment: '材料数组 [{name,amount}]'
    },
    scenes: {
      type: DataTypes.JSON,
      comment: '场景数组'
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      comment: '1-启用 0-禁用'
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'sort_order',
      comment: '排序'
    }
  }, {
    tableName: 'convenience_drinks',
    timestamps: true,
    createdAt: 'create_time',
    updatedAt: 'update_time'
  }),

  ConveniencePitfall: (sequelize, DataTypes) => sequelize.define('ConveniencePitfall', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: '主键'
    },
    emoji: {
      type: DataTypes.STRING(20),
      comment: '表情图标'
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '标题'
    },
    desc: {
      type: DataTypes.TEXT,
      comment: '说明'
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'sort_order',
      comment: '排序'
    }
  }, {
    tableName: 'convenience_pitfalls',
    timestamps: true,
    createdAt: 'create_time',
    updatedAt: 'update_time'
  })
};
