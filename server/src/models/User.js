/**
 * 小程序用户模型
 */

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      comment: '主键ID'
    },
    openid: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: '微信openid'
    },
    nickname: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '昵称'
    },
    avatar: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: '头像URL'
    },
    lastLoginTime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '最后登录时间',
      field: 'last_login_time'
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'create_time',
    updatedAt: false
  });

  return User;
};
