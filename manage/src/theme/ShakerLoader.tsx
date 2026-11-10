import type { ReactNode } from 'react';

interface ShakerLoaderProps {
  size?: number;
  /** 自定义颜色，默认跟随 currentColor */
  color?: string;
  tip?: string;
}

/**
 * 极简摇酒壶旋转加载动画（替代默认 loading）
 * 线性 2px 描边，绕底部轴心轻微晃动 + 旋转，符合调酒动作语义。
 * 通过 prefers-reduced-motion 自动降级为静态。
 */
export const ShakerLoader = ({ size = 28, color, tip }: ShakerLoaderProps): ReactNode => (
  <span
    style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: tip ? 8 : 0,
      color: color || 'currentColor',
    }}
  >
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="加载中"
      role="img"
      style={{ transformOrigin: '50% 78%', animation: 'shaker-shake 1s ease-in-out infinite' }}
    >
      <path d="M8 4h8l-1 4v11a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V8L8 4z" />
      <path d="M8 4l1.4 0M14.6 4H16" opacity={0.6} />
      <path d="M9.5 11h5" opacity={0.5} />
      {/* 飞溅的酒滴 */}
      <path d="M5 9l-1.5 2M19 9l1.5 2" opacity={0.7} style={{ animation: 'shaker-drip 1s ease-in-out infinite' }} />
    </svg>
    {tip && <span style={{ fontSize: 13, opacity: 0.7 }}>{tip}</span>}
  </span>
);

export default ShakerLoader;
