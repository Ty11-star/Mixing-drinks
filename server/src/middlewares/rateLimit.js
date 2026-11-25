/**
 * 简单内存限流中间件（按 IP，滑动窗口）
 * 用于登录等敏感接口，防止暴力破解与滥用。
 * 生产环境建议替换为 express-rate-limit 或接入 Redis。
 */

function rateLimit({ windowMs = 60 * 1000, max = 30, message = '请求过于频繁，请稍后再试' } = {}) {
  const hits = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const ip = req.ip || (req.connection && req.connection.remoteAddress) || 'unknown';
    const list = (hits.get(ip) || []).filter((t) => now - t < windowMs);

    if (list.length >= max) {
      hits.set(ip, list);
      return res.status(200).json({ code: 429, message, data: null, timestamp: Date.now() });
    }

    list.push(now);
    hits.set(ip, list);

    // 定期清理，避免内存无限增长
    if (hits.size > 10000) {
      for (const [k, arr] of hits) {
        const filtered = arr.filter((t) => now - t < windowMs);
        if (filtered.length === 0) hits.delete(k);
        else hits.set(k, filtered);
      }
    }

    next();
  };
}

module.exports = { rateLimit };
