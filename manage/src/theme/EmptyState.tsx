import type { ReactNode } from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  /** 自定义插图，默认使用调酒器具线稿 */
  illustration?: ReactNode;
  action?: ReactNode;
}

/**
 * 空状态插图 — 简约线稿调酒器具（摇壶 + 杯垫 + 搅拌棒 + 薄荷叶）
 */
const DefaultIllustration = () => (
  <svg
    width={120}
    height={120}
    viewBox="0 0 120 120"
    fill="none"
    stroke="#C7BBA8"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="暂无数据"
    role="img"
  >
    {/* 摇壶 */}
    <path d="M40 30h40l-5 18v34a6 6 0 0 1-6 6H51a6 6 0 0 1-6-6V48L40 30z" />
    <path d="M40 30h6M74 30h6" opacity={0.6} />
    <path d="M44 60h32" opacity={0.5} />
    {/* 杯垫 */}
    <ellipse cx="60" cy="104" rx="30" ry="6" opacity={0.6} />
    {/* 螺旋搅拌棒 */}
    <path d="M86 22c4 6 4 12 0 18" opacity={0.7} />
    <path d="M82 22c4 6 4 12 0 18" opacity={0.4} />
    {/* 薄荷叶 */}
    <path d="M22 38c8-4 16 0 16 9 0 10-13 16-16 24-3-8-16-14-16-24 0-9 8-13 16-9z" opacity={0.6} />
  </svg>
);

export const EmptyState = ({
  title = '暂无数据',
  description,
  illustration,
  action,
}: EmptyStateProps) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 16px',
      gap: 12,
      textAlign: 'center',
    }}
  >
    {illustration || <DefaultIllustration />}
    <div style={{ fontSize: 15, fontWeight: 600, color: '#8a8276' }}>{title}</div>
    {description && <div style={{ fontSize: 13, color: '#b3ab9e', maxWidth: 280 }}>{description}</div>}
    {action && <div style={{ marginTop: 4 }}>{action}</div>}
  </div>
);

export default EmptyState;
