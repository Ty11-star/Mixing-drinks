/**
 * 用户管理控制器（小程序端顾客 / 会员）
 */
const { User } = require('../models');
const { success, error } = require('../utils/response');

// 用户列表（分页 + 昵称/微信openid 模糊搜索）
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, keyword = '' } = req.query;
    const offset = (Number(page) - 1) * Number(pageSize);

    const where = {};
    if (keyword) {
      where[User.sequelize.Op.or] = [
        { nickname: { [User.sequelize.Op.like]: `%${keyword}%` } },
        { openid: { [User.sequelize.Op.like]: `%${keyword}%` } },
      ];
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['openid'] },
      order: [['create_time', 'DESC']],
      offset,
      limit: Number(pageSize),
    });

    res.json(success({ list: rows, total: count }));
  } catch (err) {
    console.error('获取用户列表失败:', err);
    res.status(500).json(error('获取用户列表失败'));
  }
};

// 删除用户
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json(error('用户不存在', 404));
    }

    await user.destroy();
    res.json(success(null, '删除成功'));
  } catch (err) {
    console.error('删除用户失败:', err);
    res.status(500).json(error('删除失败'));
  }
};
