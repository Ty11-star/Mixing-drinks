/**
 * 调制步骤模型
 */

module.exports = (sequelize, DataTypes) => {
  const CocktailStep = sequelize.define('CocktailStep', {
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
    stepNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '步骤序号',
      field: 'step_number'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '步骤描述'
    }
  }, {
    tableName: 'cocktail_steps',
    timestamps: true,
    createdAt: 'create_time',
    updatedAt: false,
    indexes: [
      { fields: ['cocktail_id'] }
    ]
  });

  return CocktailStep;
};
