/**
 * 文件上传控制器
 */
const { success, error } = require('../utils/response');

exports.uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(error('未接收到文件', 400));
    }

    // 返回相对路径，由前端 / 小程序按各自域名拼接
    const url = '/uploads/' + req.file.filename;

    res.json(
      success(
        {
          url,
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
        },
        '上传成功'
      )
    );
  } catch (err) {
    console.error('文件上传失败:', err);
    res.status(500).json(error(err.message || '上传失败'));
  }
};
