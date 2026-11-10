/**
 * 材料模型
 */

module.exports = (sequelize, DataTypes) => {
  const Ingredient = sequelize.define('Ingredient', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      comment: '主键ID'
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: '材料名称'
    },
    nameEn: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '英文名称',
      field: 'name_en'
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '分类：base_spirit/liqueur/juice/syrup/garnish/other'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '材料说明'
    },
    commonUnit: {
      type: DataTypes.STRING(20),
      defaultValue: 'ml',
      comment: '常用单位',
      field: 'common_unit'
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      comment: '状态：1-启用 0-禁用'
    }
  }, {
    tableName: 'ingredients',
    timestamps: true,
    createdAt: 'create_time',
    updatedAt: false,
    indexes: [
      { fields: ['category'] }
    ]
  });

  return Ingredient;
};
