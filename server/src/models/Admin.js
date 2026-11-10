/**
 * 管理员模型
 */

module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      comment: '主键ID'
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: '用户名'
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '密码（明文存储，一期开发）'
    },
    nickname: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '昵称'
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: '邮箱'
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      comment: '状态：1-启用 0-禁用'
    },
    lastLoginTime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '最后登录时间',
      field: 'last_login_time'
    }
  }, {
    tableName: 'admins',
    timestamps: true,
    createdAt: 'create_time',
    updatedAt: 'update_time'
  });

  return Admin;
};
