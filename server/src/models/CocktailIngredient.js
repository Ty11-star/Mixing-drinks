/**
 * 酒谱材料关联模型
 */

module.exports = (sequelize, DataTypes) => {
  const CocktailIngredient = sequelize.define('CocktailIngredient', {
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
    ingredientId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: '材料ID',
      field: 'ingredient_id',
      references: {
        model: 'ingredients',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '用量，如"45ml"、"1片"、"适量"'
    },
    isOptional: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
      comment: '是否可选：1-可选 0-必需',
      field: 'is_optional'
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '排序',
      field: 'sort_order'
    }
  }, {
    tableName: 'cocktail_ingredients',
    timestamps: false,
    indexes: [
      { fields: ['cocktail_id'] },
      { fields: ['ingredient_id'] }
    ]
  });

  return CocktailIngredient;
};
