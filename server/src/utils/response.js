/**
 * 统一响应结构
 */

class Response {
  /**
   * 成功响应
   * @param {*} data 数据
   * @param {string} message 消息
   * @returns
   */
  static success(data = null, message = 'success') {
    return {
      code: 200,
      message,
      data,
      timestamp: Date.now()
    };
  }

  /**
   * 失败响应
   * @param {string} message 错误消息
   * @param {number} code 错误码
   * @param {*} data 附加数据
   * @returns
   */
  static error(message = 'error', code = 500, data = null) {
    return {
      code,
      message,
      data,
      timestamp: Date.now()
    };
  }

  /**
   * 分页响应
   * @param {Array} list 数据列表
   * @param {number} total 总数
   * @param {number} page 当前页
   * @param {number} pageSize 每页数量
   * @returns
   */
  static page(list, total, page, pageSize) {
    return this.success({
      list,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    });
  }
}

module.exports = Response;
