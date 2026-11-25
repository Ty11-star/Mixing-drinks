const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * 解析 JWT 密钥：生产环境禁止使用默认/占位值，否则拒绝启动。
 */
function resolveSecret() {
  const secret = process.env.JWT_SECRET;
  const unsafeDefaults = [
    'default-secret-key',
    'your-secret-key',
    'your-secret-key-change-this-in-production',
  ];
  if (secret && secret.trim() && !unsafeDefaults.includes(secret)) {
    return secret;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET 未正确配置，服务拒绝启动');
  }
  console.warn('[jwt] 未配置安全的 JWT_SECRET，开发环境使用临时密钥');
  return 'dev-only-temporary-secret';
}

const JWT_SECRET = resolveSecret();

/**
 * 生成 JWT token
 * @param {Object} payload - 载荷数据
 * @returns {String} token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * 验证 JWT token
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
