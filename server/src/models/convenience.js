/**
 * 便利店调酒模型（Sequelize）
 */

// 便利店材料库
const ConvenienceMaterial = (sequelize, DataTypes) => {
  const Material = sequelize.define('ConvenienceMaterial', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '材料名称'
    },
    emoji: {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment: 'emoji表情'
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '材料分类'
    },
    image: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: '材料图片URL'
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '排序',
      field: 'sort_order'
    }
  }, {
    tableName: 'convenience_materials',
    timestamps: false
  });

  return Material;
};

// 便利店配方
const ConvenienceDrink = (sequelize, DataTypes) => {
  const Drink = sequelize.define('ConvenienceDrink', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '配方名称'
    },
    nameEn: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '英文名',
      field: 'name_en'
    },
    emoji: {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment: 'emoji表情'
    },
    gradient: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: '渐变CSS'
    },
    image: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: '配方图片URL'
    },
    cost: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '成本（元）'
    },
    steps: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '步骤数'
    },
    tag: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '标签'
    },
    scenes: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '适用场景（JSON数组）',
      defaultValue: []
    },
    materials: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '材料清单（JSON数组）',
      defaultValue: []
    },
    instructions: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: '制作步骤（JSON数组）',
      defaultValue: []
    },
    tips: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '小贴士'
    },
    isActive: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      comment: '是否启用：1-是 0-否',
      field: 'status'
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '排序',
      field: 'sort_order'
    }
  }, {
    tableName: 'convenience_drinks',
    timestamps: false
  });

  return Drink;
};

// 便利店避坑指南
const ConveniencePitfall = (sequelize, DataTypes) => {
  const Pitfall = sequelize.define('ConveniencePitfall', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    emoji: {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment: 'emoji表情'
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '标题'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '详细说明',
      field: 'desc'
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '排序',
      field: 'sort_order'
    }
  }, {
    tableName: 'convenience_pitfalls',
    timestamps: false
  });

  return Pitfall;
};

module.exports = {
  ConvenienceMaterial,
  ConvenienceDrink,
  ConveniencePitfall
};
