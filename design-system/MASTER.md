# 调酒·酒吧风 后台管理系统 — 设计规范（Design System）

> 主题：调酒酒吧风格 · 现代简约 Web 端后台（适配 Vben Admin 风格，可无缝接入 React + antd 项目）
> 品味约束：以「轻量、矢量、干净、专业」为最高标准；拒绝廉价卡通风、高饱和荧光、复古油腻酒吧风。
> 本规范已落地到 `manage/src/theme/`，详见文末「配套组件清单 / 交付状态」。

---

## 0. 设计原则（Design Principles）

1. **矢量优先**：所有视觉元素均为 2px 线性描边 SVG，无写实贴图、无厚重投影。
2. **克制用色**：白底为主，威士忌棕作主色、冰透浅蓝作辅助，仅状态/强调处用色。
3. **留白与层级**：8pt 间距基准，卡片间距 16–24px，标题与正文层级清晰。
4. **有意义的动效**：动效模拟调酒动作（摇晃、倒入、反光），且尊重 `prefers-reduced-motion`。
5. **可访问性**：正文 ≥14px，对比度 ≥4.5:1，聚焦环可见，图标按钮带 aria-label。

---

## 1. 界面线框图描述（Wireframes）

### 1.1 总体布局（标准后台）
```
┌──────────────┬───────────────────────────────────────────────┐
│  [Logo] 调酒  │   ☰      顶部导航：面包屑 · 搜索 · 用户下拉      │
│  管理         │ ───────────────────────────────────────────── │
│ ───────────  │                                               │
│  🍸 仪表板    │   内容区（白底卡片，24px 圆角留白）              │
│  🍹 酒谱管理  │   ┌────────┐┌────────┐┌────────┐┌────────┐  │
│  🧪 材料管理  │   │ 酒谱 10 ││ 材料36 ││ 分类12 ││ 新增 3 │  │
│  ◎ 分类管理   │   └────────┘└────────┘└────────┘└────────┘  │
│               │   ┌─ 基酒分布饼图 ─┐┌─ 难度柱状图 ─┐          │
│  ───────────  │   └───────────────┘└──────────────┘          │
│   用户 · 退出 │   ┌─ 最新酒谱表格（行选中=酒渍光晕）──────────┐│
└──────────────┴───┴────────────────────────────────────────┘│
```
- **侧边栏**：深咖底（`#241C14`），菜单项浅米色，选中项威士忌棕高亮 + 柔光环；可折叠，折叠态仅留图标。
- **顶栏**：白底，左侧折叠按钮，右侧全局搜索 + 用户头像下拉（退出登录）。

### 1.2 仪表板（Dashboard）
- 顶部 4–5 张统计卡（图标 + 数值，卡片圆角 12px，阴影克制）。
- 中部 2×2 图表区：基酒分布（环形）、难度分布（柱）、调制方法（环形）、材料分类（环形）。
- 底部「最新酒谱」表格：基酒 Tag、难度 Tag、状态 Tag、时间。

### 1.3 列表页（酒谱 / 材料 / 分类）
```
搜索栏[输入] [筛选Select] [重置]          [+ 新增]
┌──┬──────┬──────┬──────┬──────┬─────┐
│☐ │ 名称 │ 基酒 │ 难度 │ 状态 │ 操作│   <- 表头威士忌米色底
│☐ │ 莫吉托│朗姆酒│简单  │启用  │编辑│   <- 选中行→酒渍光晕+左描边
│☐ │ …                                    │
└──┴──────┴──────┴──────┴──────┴─────┘
分页 · 批量操作
空状态 → 线稿调酒器具插图 + 「暂无数据」
```
- 搜索栏、筛选表单、批量选择、分页、详情/编辑弹窗齐备。

### 1.4 详情 / 编辑弹窗（Modal / Drawer）
- 遮罩：`backdrop-filter: blur(3px)` + 微弱冰粒点阵（见 §4.4）。
- 表单：可见标签、内联校验、错误靠近字段；滑块用「量酒器刻度」样式（见 §4.3）。

### 1.5 空状态（Empty State）
- 居中：线稿摇壶 + 杯垫 + 螺旋搅拌棒 + 薄荷叶插图，标题「暂无数据」+ 可选操作按钮。

---

## 2. Figma 可用设计规范（Tokens）

### 2.1 色彩（Color）— 低饱和清透
| 角色 | 名称 | HEX | 用途 |
|---|---|---|---|
| 主色 | Whisky 300 | `#D4A574` | 强调、主按钮、选中 |
| 主色深 | Whisky 600 | `#8A5A2C` | 侧栏选中、标题点缀 |
| 辅助 | Ice 500 | `#4A98C0` | 信息、链接、辅助图表 |
| 辅助浅 | Ice 100 | `#E3F1F7` | 浅蓝底、hover |
| 成功 | `#4CAF7D` | 状态绿 | 启用/成功 |
| 警告 | `#D9A441` | 状态黄 | 提醒 |
| 错误 | `#D9655F` | 状态红 | 禁用/失败 |
| 侧栏底 | `#241C14` | Espresso | 深咖侧边栏 |
| 中性 | Gray 50–900 | `#FAFAFA`→`#1C1C22` | 背景/文字/边框 |
| 背景 | `#FFFFFF` / `#F4F4F5` | 内容区 / 布局底 |

> 禁止：荧光色、高饱和橙红、油腻金。

### 2.2 字体（Typography）
- 字体族：系统无衬线（PingFang SC / Microsoft YaHei / Segoe UI）。
- 字号：正文 14px / 行高 1.5；标题 16–20px；数值卡 26px；页面 H1 20–24px。
- 字重：正文 400，标题 600，数值 700。

### 2.3 间距（Spacing，8pt 基准）
`4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 px` → 对应 `--space-1…12`。

### 2.4 圆角 / 阴影 / 动效
- 圆角：SM 6 / MD 8 / LG 12 / XL 16。
- 阴影：SM `0 1px 2px rgba(43,33,22,.06)`；MD `0 4px 14px rgba(43,33,22,.08)`（克制，无重投影）。
- 动效：fast 150ms、base 240ms，`cubic-bezier(.4,0,.2,1)`。

### 2.5 图标规范
- 24×24 viewBox，strokeWidth=2，stroke=`currentColor`，圆角端点。
- 可随 `color` 动态变色；不使用 emoji 作图标。

---

## 3. 配套组件清单（Component Inventory）

| 组件 | 文件 | 说明 | 状态 |
|---|---|---|---|
| `SpiritIcons` | `theme/icons/SpiritIcons.tsx` | 6 种基酒 + 摇壶/酒杯/量酒器/杯垫/Logo，2px 线性 | ✅ 已落地 |
| `ShakerLoader` | `theme/ShakerLoader.tsx` | 摇酒壶旋转加载，已接入 antd 全局 Spin | ✅ 已落地 |
| `EmptyState` | `theme/EmptyState.tsx` | 线稿调酒器具空状态 | ✅ 已落地 |
| `tokens.css` | `theme/tokens.css` | 设计令牌 + 酒渍光晕/按钮hover/冰粒遮罩/量酒器滑块/倒入动画/减弱动效 | ✅ 已落地 |
| 主题接入 | `App.tsx` `Layout.tsx` | ConfigProvider token + 侧栏改色 + 菜单图标替换 | ✅ 已落地 |
| 量酒器滑块 | `tokens.css .ant-slider-*` | 滑块/进度条刻度样式（CSS，无需组件） | ✅ 已落地 |
| 冰粒弹窗遮罩 | `tokens.css .ant-modal-mask` | 虚化 + 冰粒点阵（CSS） | ✅ 已落地 |
| 倒入 Tab | `tokens.css .ant-tabs-*` | liquid-pour 过渡（CSS） | ✅ 已落地 |

**使用示例（React）：**
```tsx
import { SpiritIcons, ShakerLoader, EmptyState } from '@/theme';

<SpiritIcons.RumIcon size={20} style={{ color: '#8A5A2C' }} />
<ShakerLoader size={28} tip="调酒中…" />
<EmptyState title="暂无酒谱" description="先去添加一款鸡尾酒吧" />
```

---

## 4. 可直接使用的 SVG / 动效代码

### 4.1 摇酒壶 Loading（关键帧）
```css
@keyframes shaker-shake { 0%{transform:rotate(-12deg)} 50%{transform:rotate(12deg)} 100%{transform:rotate(-12deg)} }
@keyframes shaker-drip  { 0%,100%{transform:translateY(0);opacity:.7} 50%{transform:translateY(3px);opacity:.3} }
```
SVG 见 `theme/ShakerLoader.tsx`（线性摇壶，绕底部 78% 轴心摇晃，两侧酒滴同步）。

### 4.2 选中高亮 — 酒渍渐变光晕
```css
[data-selected='true']::after{
  content:''; position:absolute; inset:-1px; border-radius:inherit;
  background: radial-gradient(120% 120% at 50% 0%, rgba(212,165,116,.22), rgba(212,165,116,.05) 55%, transparent 80%);
  box-shadow:0 0 0 3px rgba(212,165,116,.28); animation:spirit-glow 400ms cubic-bezier(.4,0,.2,1);
}
```

### 4.3 量酒器刻度滑块 / 进度条
```css
.ant-slider-rail{ background:#E9E9EC !important;
  background-image:repeating-linear-gradient(90deg,transparent 0 9px,rgba(160,116,61,.18) 9px 10px)!important;}
.ant-slider-track{ background:linear-gradient(90deg,#E6D2B8,#D4A574)!important;}
.ant-progress-bg{ background:linear-gradient(90deg,#E6D2B8,#D4A574)!important;}
```

### 4.4 弹窗冰粒虚化遮罩
```css
.ant-modal-mask{ backdrop-filter:blur(3px); background-color:rgba(36,28,20,.28)!important;
  background-image:
   radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,.5), transparent),
   radial-gradient(2px 2px at 70% 60%, rgba(255,255,255,.35), transparent),
   radial-gradient(1.5px 1.5px at 45% 80%, rgba(255,255,255,.4), transparent),
   radial-gradient(1.5px 1.5px at 85% 20%, rgba(255,255,255,.3), transparent);}
```

### 4.5 切换 Tab — 液体缓缓倒入
```css
@keyframes liquid-pour{ from{clip-path:inset(100% 0 0 0);opacity:.4} to{clip-path:inset(0 0 0 0);opacity:1} }
.ant-tabs-content-holder .ant-tabs-content{ animation:liquid-pour 240ms cubic-bezier(.4,0,.2,1); }
```

### 4.6 按钮 hover — 冰块反光提亮
```css
.ant-btn:not(.ant-btn-primary):not([disabled]):hover{
  border-color:#D4A574; color:#8A5A2C; background:linear-gradient(180deg,#fff,#F2F8FB);
  transition:background .15s, border-color .15s, color .15s;}
```

### 4.7 空状态线稿插图（节选）
```svg
<svg viewBox="0 0 120 120" fill="none" stroke="#C7BBA8" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round">
  <path d="M40 30h40l-5 18v34a6 6 0 0 1-6 6H51a6 6 0 0 1-6-6V48L40 30z"/>
  <ellipse cx="60" cy="104" rx="30" ry="6" opacity=".6"/>
  <path d="M86 22c4 6 4 12 0 18" opacity=".7"/>
  <path d="M22 38c8-4 16 0 16 9 0 10-13 16-16 24-3-8-16-14-16-24 0-9 8-13 16-9z" opacity=".6"/>
</svg>
```
完整版见 `theme/EmptyState.tsx`。

### 4.8 减弱动效（可访问性，必带）
```css
@media (prefers-reduced-motion: reduce){
  *,*::before,*::after{ animation-duration:.001ms!important; animation-iteration-count:1!important;
    transition-duration:.001ms!important;}
}
```

---

## 5. 交付与验证
- 已通过 `oxlint`（`0 errors`）。
- 接入方式：`App.tsx` 引入 `./theme/tokens.css` 并设置 `ConfigProvider` token；`Layout.tsx` 使用 `SpiritIcons` 替换菜单图标、深咖侧栏。
- 全局 Loading 已替换为摇酒壶动画；表格选中、按钮 hover、弹窗遮罩、滑块、Tab 均带调酒语义动效。
- 启动：`cd manage && npm run dev` → 访问 `http://localhost:3001`。
