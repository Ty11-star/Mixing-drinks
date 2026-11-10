/**
 * 分类模型
 */

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      comment: '主键ID'
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '分类名称'
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '分类类型：base_spirit/taste/occasion'
    },
    icon: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: '图标URL'
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '排序',
      field: 'sort_order'
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      comment: '状态：1-启用 0-禁用'
    }
  }, {
    tableName: 'categories',
    timestamps: true,
    createdAt: 'create_time',
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ['name', 'type']
      }
    ]
  });

  return Category;
};
