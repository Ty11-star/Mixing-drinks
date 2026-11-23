// utils/imageCache.js
// 图片双层缓存：内存 Map + 本地文件持久化
// 解决：列表滑动/页面来回切换时，远程图片反复走网络、加载不出来、闪烁的问题
//
// 用法：
//   const imageCache = require('../../utils/imageCache');
//   // 同步取：已缓存返回本地路径（秒开），否则返回原始 url，同时后台下载
//   const src = imageCache.resolve(url);
//   // 想在下完成后拿到本地路径并刷新视图：
//   imageCache.resolve(url, { onReady: localPath => this.setData({ src: localPath }) });

const storage = require('./storage');

const MAP_KEY = 'image_cache_map_v2';
const MAX_MEMORY = 200;
const fs = wx.getFileSystemManager();

// url -> 本地文件路径（内存层，避免每次读 storage）
let cacheMap = storage.get(MAP_KEY, {});
// url -> true（正在下载，去重）
let downloading = {};
// url -> [回调]（下载完成后通知视图刷新）
let waiters = {};
// LRU 简易计数
let hits = {};

function persist() {
  try { storage.set(MAP_KEY, cacheMap); } catch (e) {}
}

function exists(local) {
  try { fs.accessSync(local); return true; } catch (e) { return false; }
}

function touch(url) {
  hits[url] = Date.now();
  // 超过上限时删除最旧的本地文件与记录（LRU），避免占用过多存储
  const keys = Object.keys(cacheMap);
  if (keys.length > MAX_MEMORY) {
    keys.sort((a, b) => (hits[a] || 0) - (hits[b] || 0));
    keys.slice(0, keys.length - MAX_MEMORY).forEach(k => {
      const p = cacheMap[k];
      if (p && !/^https?:\/\//.test(p)) {
        try { fs.unlinkSync(p); } catch (e) {}
      }
      delete cacheMap[k];
      delete hits[k];
    });
    persist();
  }
}

/**
 * 触发下载（内部去重）。下载完成后：
 * 1) 保存到本地文件并持久化映射
 * 2) 通知所有 waiters 用本地路径刷新视图
 */
function download(url) {
  if (!url || downloading[url]) return;
  // 网络图才需要下载
  if (!/^https?:\/\//.test(url)) return;
  downloading[url] = true;

  wx.downloadFile({
    url,
    success(res) {
      if (res.statusCode !== 200 || !res.tempFilePath) {
        downloading[url] = false;
        return;
      }
      const finish = (path) => {
        cacheMap[url] = path;
        touch(url);
        persist();
        downloading[url] = false;
        const list = waiters[url] || [];
        delete waiters[url];
        list.forEach(cb => { try { cb(path); } catch (e) {} });
      };
      fs.saveFile({
        tempFilePath: res.tempFilePath,
        success(saved) { finish(saved.savedFilePath); },
        fail() {
          // 可能是同名文件已存在：删除后重试一次
          const old = cacheMap[url];
          if (old) {
            try { fs.unlinkSync(old); } catch (e) {}
            fs.saveFile({
              tempFilePath: res.tempFilePath,
              success(saved) { finish(saved.savedFilePath); },
              fail() { finish(res.tempFilePath); }
            });
          } else {
            // 兜底用临时路径（本次会话有效）
            finish(res.tempFilePath);
          }
        }
      });
    },
    fail() {
      downloading[url] = false;
    }
  });
}

/**
 * 解析图片地址
 * @param {string} url 原始网络地址
 * @param {Object|Function} opts 传 {onReady} 回调或回调函数，下载完成后拿到本地路径刷新视图
 * @returns {string} 立即可用的显示地址（本地路径或原始 url）
 */
function resolve(url, opts) {
  if (!url) return '';

  const cb = typeof opts === 'function' ? opts : (opts && opts.onReady);

  // 已是本地路径，直接用
  if (!/^https?:\/\//.test(url)) return url;

  const local = cacheMap[url];
  if (local && exists(local)) {
    touch(url);
    return local;
  }
  // 记录失效
  if (local) { delete cacheMap[url]; persist(); }

  // 注册回调
  if (cb) {
    if (!waiters[url]) waiters[url] = [];
    waiters[url].push(cb);
  }
  // 后台下载
  download(url);

  // 首次返回网络地址，保证有图可显示；下载完成后回调会替换为本地路径
  return url;
}

/** 预加载一批图片（不阻塞） */
function preload(urls) {
  (urls || []).forEach(u => { if (u) resolve(u); });
}

/** 清除缓存 */
function clear() {
  cacheMap = {};
  downloading = {};
  waiters = {};
  hits = {};
  persist();
}

module.exports = { resolve, preload, clear };
