// utils/imageCache.js
// 图片本地缓存：下载过的图片保存到小程序本地，下次直接从本地读取，避免每次重新联网加载

const storage = require('./storage');

const MAP_KEY = 'image_cache_map';
const fs = wx.getFileSystemManager();

// url -> 本地临时/永久文件路径
let cacheMap = storage.get(MAP_KEY, {});

function persist() {
  storage.set(MAP_KEY, cacheMap);
}

/**
 * 获取图片显示地址：
 * - 已缓存且文件存在 -> 返回本地路径（秒开）
 * - 否则返回原始网络地址，并在后台下载缓存，供下次使用
 */
function resolve(url) {
  if (!url) return '';
  const local = cacheMap[url];
  if (local) {
    try {
      fs.accessSync(local);
      return local;
    } catch (e) {
      // 文件已被系统清理，移除记录
      delete cacheMap[url];
      persist();
    }
  }
  cacheAsync(url);
  return url;
}

/**
 * 后台下载并缓存图片，不阻塞当前显示
 */
function cacheAsync(url) {
  if (!url || cacheMap[url]) return;
  wx.downloadFile({
    url,
    success(res) {
      if (res.statusCode !== 200 || !res.tempFilePath) return;
      // saveFile 持久化，避免临时文件被清理
      fs.saveFile({
        tempFilePath: res.tempFilePath,
        success(saved) {
          cacheMap[url] = saved.savedFilePath;
          persist();
        },
        fail() {}
      });
    },
    fail() {}
  });
}

module.exports = { resolve, cacheAsync };
