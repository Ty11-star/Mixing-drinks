// utils/storage.js
// 本地缓存封装（自动 JSON 序列化）

function get(key, defaultValue) {
  try {
    const val = wx.getStorageSync(key);
    return val === '' || val === undefined || val === null ? defaultValue : val;
  } catch (e) {
    return defaultValue;
  }
}

function set(key, value) {
  try {
    wx.setStorageSync(key, value);
  } catch (e) {
    console.error('storage set error', e);
  }
}

function remove(key) {
  try {
    wx.removeStorageSync(key);
  } catch (e) {
    // ignore
  }
}

module.exports = { get, set, remove };
