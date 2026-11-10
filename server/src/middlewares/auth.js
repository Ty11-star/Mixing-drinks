/**
 * JWT 认证中间件
 */

const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/jwt');
const Response = require('../utils/response');

/**
 * 验证 JWT Token
 */
const authenticateToken = (req, res, next) => {
  try {
    // 从请求头获取 token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(200).json(Response.error('未提供认证令牌', 401));
    }

    // 验证 token
    jwt.verify(token, jwtSecret, (err, user) => {
      if (err) {
        return res.status(200).json(Response.error('Token无效或已过期', 401));
      }

      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(200).json(Response.error('认证失败', 401));
  }
};

/**
 * 可选的 Token 验证（即使没有 token 也能通过）
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      jwt.verify(token, jwtSecret, (err, user) => {
        if (!err) {
          req.user = user;
        }
      });
    }

    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth
};
