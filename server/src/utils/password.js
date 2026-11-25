/**
 * 密码哈希工具（基于 Node 内置 crypto.scrypt，避免额外依赖）
 * 存储格式：<16字节盐 hex>:<64字节哈希 hex>
 */
const crypto = require('crypto');

const HASH_REGEX = /^[0-9a-f]{32}:[0-9a-f]{128}$/;

/**
 * 哈希密码
 * @param {string} password
 * @returns {string}
 */
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

/**
 * 判断存储值是否为哈希格式（用于识别旧版明文密码）
 */
function isHashed(stored) {
  return typeof stored === 'string' && HASH_REGEX.test(stored);
}

/**
 * 校验密码；兼容旧版明文密码（登录成功后由调用方迁移为哈希）
 */
function verifyPassword(password, stored) {
  if (!stored) return false;
  if (!isHashed(stored)) {
    return password === stored;
  }
  const [salt, hash] = stored.split(':');
  const candidate = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, 'hex');
  return candidate.length === expected.length && crypto.timingSafeEqual(candidate, expected);
}

module.exports = { hashPassword, isHashed, verifyPassword };
