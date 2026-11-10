const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * 生成JWT token
 * @param {Object} payload - 载荷数据
 * @returns {String} token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * 验证JWT token
 * @param {String} token
 * @returns {Object} 解码后的数据
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Token验证失败');
  }
};

module.exports = { generateToken, verifyToken, jwtSecret: JWT_SECRET };
