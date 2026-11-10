const { Admin, User } = require('../models');
const { generateToken } = require('../config/jwt');
const axios = require('axios');

class AuthService {
  /**
   * 管理员登录
   */
  async adminLogin(username, password) {
    const admin = await Admin.findOne({
      where: { username, status: 1 }
    });

    if (!admin) {
      throw new Error('用户名或密码错误');
    }

    // 简单的明文密码比对（一期开发）
    if (admin.password !== password) {
      throw new Error('用户名或密码错误');
    }

    // 更新最后登录时间
    await admin.update({ lastLoginTime: new Date() });

    // 生成 token
    const token = generateToken({
      id: admin.id,
      username: admin.username,
      type: 'admin'
    });

    return {
      token,
      userInfo: {
        id: admin.id,
        username: admin.username,
        nickname: admin.nickname,
        email: admin.email
      }
    };
  }

  /**
   * 微信小程序登录
   */
  async wechatLogin(code) {
    const { appid, secret } = this.getWechatConfig();
    const devMode = process.env.NODE_ENV !== 'production';
    const invalidConfig = !appid || !secret || appid === 'your-wechat-appid';

    // 开发模式且未配置真实 AppID：跳过微信接口，直接创建开发用户
    if (devMode && invalidConfig) {
      return this.devLogin(code);
    }

    try {
      // 调用微信接口获取 openid
      const url = `https://api.weixin.qq.com/sns/jscode2session`;

      const response = await axios.get(url, {
        params: {
          appid,
          secret,
          js_code: code,
          grant_type: 'authorization_code'
        }
      });

      const { openid, session_key, errcode, errmsg } = response.data;

      if (errcode) {
        throw new Error(errmsg || '微信登录失败');
      }

      return await this.findOrCreateUser(openid);
    } catch (error) {
      // 开发环境降级：游客模式/appid 不匹配时保证登录链路可用
      if (devMode) {
        console.warn('[auth] 微信登录失败，开发环境降级为开发用户：', error.message);
        return this.devLogin(code);
      }
      throw new Error('微信登录失败：' + error.message);
    }
  }

  /**
   * 按 openid 查找或创建用户并签发 token
   */
  async findOrCreateUser(openid, defaults = {}) {
    let user = await User.findOne({ where: { openid } });

    if (!user) {
      user = await User.create(Object.assign({ openid }, defaults, { lastLoginTime: new Date() }));
    } else {
      await user.update({ lastLoginTime: new Date() });
    }

    const token = generateToken({
      id: user.id,
      openid: user.openid,
      type: 'user'
    });

    return {
      token,
      userInfo: {
        id: user.id,
        nickname: user.nickname,
        avatar: user.avatar
      }
    };
  }

  /**
   * 开发模式登录：用 code 哈希生成稳定伪 openid，无需真实微信凭据
   */
  async devLogin() {
    // 固定开发身份：同一次开发会话内重复登录对应同一用户，避免每次 wx.login（code 每次都变）都新建用户
    const result = await this.findOrCreateUser('dev_guest', { nickname: '调酒爱好者' });
    result.dev = true;
    return result;
  }

  /**
   * 更新用户信息
   */
  async updateUserInfo(userId, data) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    await user.update(data);
    return user;
  }

  /**
   * 获取微信配置
   */
  getWechatConfig() {
    return {
      appid: process.env.WECHAT_APPID,
      secret: process.env.WECHAT_SECRET
    };
  }

  /**
   * 创建管理员账号
   */
  async createAdmin(data) {
    const existing = await Admin.findOne({
      where: { username: data.username }
    });

    if (existing) {
      throw new Error('用户名已存在');
    }

    return await Admin.create(data);
  }
}

module.exports = new AuthService();
