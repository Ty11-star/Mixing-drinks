const { Admin, User } = require('../models');
const { generateToken } = require('../config/jwt');
const { hashPassword, isHashed, verifyPassword } = require('../utils/password');
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

    // 校验密码（兼容旧明文，登录成功后自动迁移为哈希）
    if (!verifyPassword(password, admin.password)) {
      throw new Error('用户名或密码错误');
    }

    // 旧明文密码迁移为哈希
    if (!isHashed(admin.password)) {
      await admin.update({ password: hashPassword(password) });
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
  async wechatLogin(code, profile = {}) {
    const { appid, secret } = this.getWechatConfig();

    // 未配置真实微信凭据时一律拒绝，避免被无凭证绕过
    if (!appid || !secret || appid === 'your-wechat-appid') {
      throw new Error('服务端未配置微信小程序凭据');
    }

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

    const { openid, errcode, errmsg } = response.data;
    if (errcode) {
      throw new Error(errmsg || '微信登录失败');
    }

    return await this.findOrCreateUser(openid, profile);
  }

  /**
   * 按 openid 查找或创建用户并签发 token
   */
  async findOrCreateUser(openid, defaults = {}) {
    let user = await User.findOne({ where: { openid } });

    if (!user) {
      user = await User.create(Object.assign({ openid }, defaults, { lastLoginTime: new Date() }));
    } else {
      // 每次登录同步用户在授权弹窗里填写的资料
      const updateData = { lastLoginTime: new Date() };
      if (defaults.nickname) updateData.nickname = defaults.nickname;
      if (defaults.avatar) updateData.avatar = defaults.avatar;
      await user.update(updateData);
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
