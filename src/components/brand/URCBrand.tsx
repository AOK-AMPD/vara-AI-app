import { useId } from 'react';
import { BRAND } from '../../config/brand';

type Tone = 'light' | 'dark';

interface BrandMarkProps {
  size?: number;
  className?: string;
}

interface BrandLockupProps extends BrandMarkProps {
  compact?: boolean;
  tone?: Tone;
  showParent?: boolean;
}

export function URCBrandMark({ size = 24, className }: BrandMarkProps) {
  const gradientId = useId().replace(/:/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#482A7A" />
          <stop offset="58%" stopColor="#B31F7E" />
          <stop offset="100%" stopColor="#D66CAE" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="28" height="28" rx="9" fill={`url(#${gradientId})`} />
      <path
        d="M9.5 10v6.35C9.5 20.05 11.7 22.3 16 22.3C20.3 22.3 22.5 20.05 22.5 16.35V10"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M19.3 22.6L23.6 26.2" stroke="rgba(255,255,255,0.42)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24.5" cy="25.4" r="1.35" fill="#F7E7F1" />
    </svg>
  );
}

export function URCBrandLockup({
  size = 24,
  compact = false,
  tone = 'light',
  showParent = false,
  className,
}: BrandLockupProps) {
  const textColor = tone === 'light' ? '#FFFFFF' : '#413F42';
  const subColor = tone === 'light' ? 'rgba(255,255,255,0.72)' : '#7A6C7B';

  return (
    <span
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', minWidth: 0 }}
    >
      <URCBrandMark size={size} />
      <span style={{ display: 'inline-flex', flexDirection: 'column', minWidth: 0, lineHeight: 1.1 }}>
        <span
          style={{
            color: textColor,
            fontWeight: 700,
            fontSize: compact ? '1.02rem' : '1.08rem',
            letterSpacing: compact ? '0.12em' : '-0.01em',
            textTransform: compact ? 'uppercase' : 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {compact ? BRAND.shortName : BRAND.productName}
        </span>
        {showParent && (
          <span style={{ color: subColor, fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {BRAND.parentName}
          </span>
        )}
      </span>
    </span>
  );
}
