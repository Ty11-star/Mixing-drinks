/**
 * 用户收藏模型
 */

module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      comment: '主键ID'
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: '用户ID',
      field: 'user_id'
    },
    cocktailId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: '酒谱ID',
      field: 'cocktail_id'
    }
  }, {
    tableName: 'favorites',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'cocktail_id']
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['cocktail_id']
      }
    ]
  });

  return Favorite;
};

