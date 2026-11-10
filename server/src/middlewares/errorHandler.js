/**
 * 全局错误处理中间件
 */

const Response = require('../utils/response');

/**
 * 自定义业务错误类
 */
class BusinessError extends Error {
  constructor(message, code = 400) {
    super(message);
    this.code = code;
    this.name = 'BusinessError';
  }
}

/**
 * 错误处理中间件
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // 业务错误
  if (err instanceof BusinessError) {
    return res.status(200).json(Response.error(err.message, err.code));
  }

  // Sequelize 验证错误
  if (err.name === 'SequelizeValidationError') {
    const message = err.errors.map(e => e.message).join(', ');
    return res.status(200).json(Response.error(message, 400));
  }

  // Sequelize 数据库错误
  if (err.name === 'SequelizeDatabaseError') {
    return res.status(200).json(Response.error('数据库操作失败', 500));
  }

  // JWT 错误
  if (err.name === 'JsonWebTokenError') {
    return res.status(200).json(Response.error('Token无效', 401));
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(200).json(Response.error('Token已过期', 401));
  }

  // 默认服务器错误
  res.status(200).json(Response.error(err.message || '服务器内部错误', 500));
};

module.exports = {
  errorHandler,
  BusinessError
};
