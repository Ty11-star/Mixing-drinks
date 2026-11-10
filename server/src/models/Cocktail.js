/**
 * 酒谱模型
 */

module.exports = (sequelize, DataTypes) => {
  const Cocktail = sequelize.define('Cocktail', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      comment: '主键ID'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '酒谱名称'
    },
    nameEn: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '英文名称',
      field: 'name_en'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '描述介绍'
    },
    difficulty: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      comment: '难度：1-简单 2-中等 3-困难'
    },
    baseSpirit: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '基酒类型',
      field: 'base_spirit'
    },
    tasteTags: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: '口味标签，逗号分隔',
      field: 'taste_tags'
    },
    glassType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '杯具类型',
      field: 'glass_type'
    },
    method: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '调制方法：shake/stir/build'
    },
    tips: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '小贴士'
    },
    source: {
      type: DataTypes.STRING(20),
      defaultValue: 'official',
      comment: '来源：official-官方 ai-AI生成 user-用户收藏',
      field: 'source'
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '排序权重',
      field: 'sort_order'
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      comment: '状态：1-启用 0-禁用'
    },
    cover: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '封面图地址（相对路径，如 /uploads/xxx.jpg）',
      field: 'cover'
    }
  }, {
    tableName: 'cocktails',
    timestamps: true,
    createdAt: 'create_time',
    updatedAt: 'update_time',
    indexes: [
      { fields: ['base_spirit'] },
      { fields: ['difficulty'] },
      { fields: ['status'] }
    ]
  });

  return Cocktail;
};
