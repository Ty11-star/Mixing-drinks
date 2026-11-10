import type { SVGProps } from 'react';

/**
 * 调酒主题线性图标集
 * 统一规范：24×24 viewBox，2px 描边（strokeWidth=2），使用 currentColor 着色，可动态切换颜色。
 * 不使用 fill 填充（除极少量液面/细节点缀），保持轻量矢量风格。
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number, props: SVGProps<SVGSVGElement>) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props,
});

/** 朗姆酒 — 高瘦直筒瓶 */
export const RumIcon = ({ size = 20, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M9 3h6" />
    <path d="M10 3v3l-1 2v11a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V8l-1-2V3" />
    <path d="M9 11h6" opacity={0.5} />
  </svg>
);

/** 伏特加 — 极简圆柱瓶 */
export const VodkaIcon = ({ size = 20, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M10 3h4" />
    <path d="M11 3v4l-2 2v9a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-9l-2-2V3" />
    <path d="M10 13h8" opacity={0.5} />
  </svg>
);

/** 金酒 — 圆鼓身配三角顶 */
export const GinIcon = ({ size = 20, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M10 3h4" />
    <path d="M10 3v4c0 3-3 3-3 6v4a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-4c0-3-3-3-3-6V3" />
    <path d="M11 15h2" opacity={0.5} />
  </svg>
);

/** 龙舌兰 — 宽肩短颈瓶 */
export const TequilaIcon = ({ size = 20, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M9 3h6" />
    <path d="M11 3v3l-3 3v9a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-9l-3-3V3" />
    <path d="M8 12h8" opacity={0.5} />
    <path d="M10 12v3h4v-3" opacity={0.5} />
  </svg>
);

/** 威士忌 — 方肩短瓶 */
export const WhiskeyIcon = ({ size = 20, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M10 3h4" />
    <path d="M11 3v3h-2l-1 2v8a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-8l-1-2h-2V3" />
    <path d="M9 13h6" opacity={0.5} />
  </svg>
);

/** 白兰地 — 球腹瓶 */
export const BrandyIcon = ({ size = 20, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M10 3h4" />
    <path d="M11 3v3l-3 2a5 5 0 0 0 1 9h6a5 5 0 0 0 1-9l-3-2V3" />
    <path d="M9.5 13h5" opacity={0.5} />
  </svg>
);

/** 调酒摇壶 — 仪表板/首页图标 */
export const ShakerIcon = ({ size = 20, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M8 3h8l-1 4v12a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V7L8 3z" />
    <path d="M8 3l1.5 0M14.5 3H16" opacity={0.6} />
    <path d="M9 10h6" opacity={0.5} />
  </svg>
);

/** 鸡尾酒杯 — 酒谱管理 */
export const CocktailGlassIcon = ({ size = 20, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M4 4h16l-7 8v5" />
    <path d="M12 4v8" opacity={0.4} />
    <path d="M9 20h6" />
    <path d="M17 5l-2 2" opacity={0.6} />
  </svg>
);

/** 量酒器 — 材料管理 */
export const JiggerIcon = ({ size = 20, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M8 3h8l-1 5a3 3 0 0 1-6 0L8 3z" />
    <path d="M12 11v4" />
    <path d="M9 15h6l-1 5a2 2 0 0 1-4 0l-1-5z" />
  </svg>
);

/** 杯垫/分类 — 分类管理 */
export const CoasterIcon = ({ size = 20, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3.5" opacity={0.5} />
  </svg>
);

/** 品牌 Logo — 摇壶 + 薄荷叶点缀 */
export const BrandLogo = ({ size = 28, ...props }: IconProps) => (
  <svg {...base(size, props)}>
    <path d="M7 5h10l-1.2 4.5v9a2 2 0 0 1-2 2h-3.6a2 2 0 0 1-2-2v-9L7 5z" />
    <path d="M7 5l1.4 0M15.6 5H17" opacity={0.6} />
    <path d="M16.5 3.5c1.2-.6 2.5 0 2.5 1.4 0 1.5-2 2.4-2.5 3.6-.5-1.2-2.5-2.1-2.5-3.6 0-1.4 1.3-2 2.5-1.4z" opacity={0.7} />
  </svg>
);

/** 导出基酒名称 → 图标 映射（供分类/菜单动态取用） */
export const spiritIconMap = {
  朗姆酒: RumIcon,
  伏特加: VodkaIcon,
  金酒: GinIcon,
  龙舌兰: TequilaIcon,
  威士忌: WhiskeyIcon,
  白兰地: BrandyIcon,
} as const;

export type SpiritName = keyof typeof spiritIconMap;
