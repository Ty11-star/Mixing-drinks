/**
 * 参数校验中间件
 */

const { validationResult } = require('express-validator');
const Response = require('../utils/response');

/**
 * 验证结果处理中间件
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    return res.status(200).json(Response.error(errorMessages, 400));
  }

  next();
};

module.exports = validate;
