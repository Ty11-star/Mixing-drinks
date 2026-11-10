/**
 * 酒谱分类关联模型
 */

module.exports = (sequelize, DataTypes) => {
  const CocktailCategory = sequelize.define('CocktailCategory', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      comment: '主键ID'
    },
    cocktailId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: '酒谱ID',
      field: 'cocktail_id',
      references: {
        model: 'cocktails',
        key: 'id'
      }
    },
    categoryId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: '分类ID',
      field: 'category_id',
      references: {
        model: 'categories',
        key: 'id'
      }
    }
  }, {
    tableName: 'cocktail_categories',
    timestamps: false,
    indexes: [
      { fields: ['cocktail_id'] },
      { fields: ['category_id'] }
    ]
  });

  return CocktailCategory;
};
