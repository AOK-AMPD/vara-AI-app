import { BRAND } from '../../config/brand';
import uniqLogoColor from '../../assets/brand/uniqus-logo-color.png';
import uniqLogoMark from '../../assets/brand/uniqus-logo-white.png';

type Tone = 'light' | 'dark';

interface BrandMarkProps {
  size?: number;
  className?: string;
  tone?: Tone;
}

interface BrandLockupProps extends BrandMarkProps {
  compact?: boolean;
  tone?: Tone;
  showParent?: boolean;
}

function resolveLogoSource(tone: Tone) {
  return tone === 'light' ? uniqLogoMark : uniqLogoColor;
}

export function URCBrandMark({ size = 24, className }: BrandMarkProps) {
  return (
    <img
      src={uniqLogoMark}
      alt={BRAND.parentName}
      className={className}
      style={{
        display: 'block',
        height: `${size}px`,
        width: `${size}px`,
        objectFit: 'cover',
        objectPosition: 'left center',
      }}
    />
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
  const logoHeight = size + 10;
  const productLine = BRAND.productName.replace(`${BRAND.parentName} `, '');
  const supportingLine = 'SEC intelligence platform';

  return (
    <span
      className={className}
      aria-label={BRAND.productName}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: compact ? '10px' : '12px',
        minWidth: 0,
        maxWidth: '100%',
      }}
    >
      <img
        src={resolveLogoSource(tone)}
        alt={BRAND.parentName}
        style={{
          display: 'block',
          height: compact ? 'auto' : `${logoHeight}px`,
          width: compact ? '100%' : 'auto',
          maxWidth: compact ? '100%' : '148px',
          objectFit: 'contain',
          flexShrink: 0,
          padding: compact ? '8px 0' : undefined,
          boxSizing: 'border-box',
        }}
      />
      {showParent && !compact && (
        <span
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
            minWidth: 0,
            lineHeight: 1.05,
          }}
        >
          <span
            style={{
              color: textColor,
              fontWeight: 700,
              fontSize: '0.88rem',
              letterSpacing: '0.02em',
              textTransform: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {productLine}
          </span>
          <span
            style={{
              color: subColor,
              fontSize: '0.7rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginTop: '4px',
              whiteSpace: 'nowrap',
            }}
          >
            {supportingLine}
          </span>
        </span>
      )}
    </span>
  );
}
