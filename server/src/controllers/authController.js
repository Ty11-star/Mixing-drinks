const authService = require('../services/authService');
const Response = require('../utils/response');

class AuthController {
  /**
   * 管理员登录
   */
  async adminLogin(req, res, next) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.json(Response.error('用户名和密码不能为空', 400));
      }

      const result = await authService.adminLogin(username, password);
      res.json(Response.success(result, '登录成功'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * 微信小程序登录
   */
  async wechatLogin(req, res, next) {
    try {
      const { code } = req.body;

      if (!code) {
        return res.json(Response.error('code不能为空', 400));
      }

      const result = await authService.wechatLogin(code);
      res.json(Response.success(result, '登录成功'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * 更新用户信息
   */
  async updateUserInfo(req, res, next) {
    try {
      const userId = req.user.id;
      const { nickname, avatar } = req.body;

      const user = await authService.updateUserInfo(userId, { nickname, avatar });
      res.json(Response.success(user, '更新成功'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(req, res, next) {
    try {
      res.json(Response.success(req.user));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
