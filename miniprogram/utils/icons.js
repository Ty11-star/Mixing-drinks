// utils/icons.js
// 线性图标（base64 SVG），随系统主题自动切换配色
// 浅色=晨光微醺（暖褐/灰绿），深色=深夜蓝调（香槟金/雾蓝）
// 用法：<image class="ico" src="{{icons.home}}" />  页面 JS: const { icons } = require('../../utils/icons')

function svg(paths, stroke, strokeWidth) {
  const raw = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="' + stroke + '" stroke-width="' + (strokeWidth || 1.5) + '" stroke-linecap="round" stroke-linejoin="round">' + paths + '</svg>';
  return 'data:image/svg+xml;base64,' + base64Encode(raw);
}

function base64Encode(str) {
  if (typeof wx !== 'undefined' && wx.arrayBufferToBase64) {
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
      let c = str.charCodeAt(i);
      if (c < 128) bytes.push(c);
      else if (c < 2048) { bytes.push(192 | (c >> 6), 128 | (c & 63)); }
      else { bytes.push(224 | (c >> 12), 128 | ((c >> 6) & 63), 128 | (c & 63)); }
    }
    return wx.arrayBufferToBase64(new Uint8Array(bytes).buffer);
  }
  return Buffer.from(str, 'utf8').toString('base64');
}

const P = {
  home: '<path d="M4 11.2 12 4l8 7.2V20H4v-8.8Z"/><path d="M9.5 20v-5h5v5"/>',
  shaker: '<path d="M8 3h8l-1.1 5.2H9.1L8 3Z"/><path d="M9.1 8.2h5.8l2 9.4a2 2 0 0 1-2 2.4H9.1a2 2 0 0 1-2-2.4l2-9.4Z"/><path d="M7.4 14.6h9.2"/>',
  card: '<rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="m12 7.4 1.25 2.6 2.85.4-2.05 2 .5 2.85L12 13.9l-2.55 1.35.5-2.85-2.05-2 2.85-.4L12 7.4Z"/>',
  user: '<circle cx="12" cy="8" r="3.4"/><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 4 4"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  back: '<path d="M15 5 8 12l7 7"/>',
  heart: '<path d="M12 20s-7-4.5-7-9.4A4.4 4.4 0 0 1 12 7.2a4.4 4.4 0 0 1 7 3.4C19 15.5 12 20 12 20Z"/>',
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3.2 2"/>',
  basket: '<path d="M4 9h16l-1.6 11H5.6L4 9Z"/><path d="M8.5 9 12 3.5 15.5 9"/>',
  warn: '<path d="M12 4 3 20h18L12 4Z"/><path d="M12 10v4.5M12 17.2v.2"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
  sparkle: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m18.5 16 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z"/>',
  book: '<path d="M5 4.5h11a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3V4.5Z"/><path d="M5 17h14"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  list: '<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
  shield: '<path d="M12 3.5 20 7v5c0 5-3.5 8-8 9.5C7.5 20 4 17 4 12V7l8-3.5Z"/><path d="m9 12 2 2 4-4"/>',
  share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.3 10.8 7.4-4.3M8.3 13.2l7.4 4.3"/>',
  coin: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v10M9.5 9.5h5M9.5 14.5h5"/>'
};

const PALETTE = {
  light: { ink: '#475652', accent: '#96662F', soft: '#6B7873', white: '#FFFFFF' },
  dark:  { ink: '#A6B5BF', accent: '#D9AE7C', soft: '#96A6B2', white: '#FFFFFF' }
};

function getSystemTheme() {
  try {
    if (typeof wx !== 'undefined' && wx.getSystemInfoSync) {
      return wx.getSystemInfoSync().theme === 'dark' ? 'dark' : 'light';
    }
  } catch (e) {}
  return 'light';
}

// 图标对象（内容会被 refreshIcons 原地替换，保持引用不变）
const icons = {};

function buildIcons(theme) {
  const C = PALETTE[theme] || PALETTE.light;
  Object.keys(P).forEach(function (k) {
    icons[k] = svg(P[k], C.ink);
    icons[k + 'Accent'] = svg(P[k], C.accent);
    icons[k + 'White'] = svg(P[k], C.white);
    icons[k + 'Soft'] = svg(P[k], C.soft);
  });
  // 收藏图标：未收藏=深色描边空心，已收藏=红色实心
  const HEART_PATH = 'M12 20s-7-4.5-7-9.4A4.4 4.4 0 0 1 12 7.2a4.4 4.4 0 0 1 7 3.4C19 15.5 12 20 12 20Z';
  icons.heartOutline = 'data:image/svg+xml;base64,' + base64Encode(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#3A4542" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="' + HEART_PATH + '"/></svg>'
  );
  icons.heartFilled = 'data:image/svg+xml;base64,' + base64Encode(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#E0483C"><path d="' + HEART_PATH + '"/></svg>'
  );
  return icons;
}

let currentTheme = getSystemTheme();
buildIcons(currentTheme);

// 主题变化时重新生成图标内容，并刷新所有持有 icons 的页面
function refreshIcons(theme) {
  const next = (theme === 'dark' || theme === 'light') ? theme : getSystemTheme();
  if (next === currentTheme) return;
  currentTheme = next;
  buildIcons(next);
  try {
    const pages = (typeof getCurrentPages === 'function') ? getCurrentPages() : [];
    pages.forEach(function (page) {
      if (page && page.data && page.data.icons) {
        page.setData({ icons: icons });
      }
    });
  } catch (e) {}
}

module.exports = { icons: icons, refreshIcons: refreshIcons, getTheme: function () { return currentTheme; } };
