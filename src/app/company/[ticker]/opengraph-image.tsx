import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

const CIK_MAP: Record<string, string> = {
  'AAPL': '0000320193',
  'MSFT': '0000789019',
  'GOOGL': '0001652044',
  'TSLA': '0001318605',
  'JPM': '0000019617',
  'AMZN': '0001018724',
  'META': '0001326801',
  'NVDA': '0001045810',
};

async function fetchCompanyName(cik: string): Promise<{ name: string; sector: string }> {
  try {
    const res = await fetch(`https://data.sec.gov/submissions/CIK${cik}.json`, {
      headers: { 'User-Agent': 'Uniqus Research Center contact@uniqus.com' },
    });
    if (!res.ok) return { name: 'Unknown Company', sector: '' };
    const data = await res.json();
    return { name: data.name ?? 'Unknown Company', sector: data.sicDescription ?? '' };
  } catch {
    return { name: 'Unknown Company', sector: '' };
  }
}

export default async function OGImage({
  params,
}: {
  params: { ticker: string };
}) {
  const ticker = params.ticker.toUpperCase();
  const cik = CIK_MAP[ticker];

  let companyName = ticker;
  let sector = '';

  if (cik) {
    const info = await fetchCompanyName(cik);
    companyName = info.name;
    sector = info.sector;
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          backgroundColor: '#050A1F',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top: Branding */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#4ade80',
              borderRadius: '4px',
              marginRight: '24px',
            }}
          />
          <span
            style={{
              fontSize: 32,
              color: '#94a3b8',
              letterSpacing: '0.05em',
              textTransform: 'uppercase' as const,
            }}
          >
            Uniqus Research Center
          </span>
        </div>

        {/* Middle: Company info */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 'auto',
            marginBottom: 'auto',
          }}
        >
          <span
            style={{
              fontSize: 40,
              color: '#4ade80',
              marginBottom: '12px',
              fontWeight: 600,
              letterSpacing: '0.08em',
            }}
          >
            {ticker}
          </span>
          <h1
            style={{
              fontSize: 80,
              color: 'white',
              fontWeight: 800,
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            {companyName}
          </h1>
          {sector && (
            <span style={{ fontSize: 36, color: '#cbd5e1', marginTop: '24px' }}>
              {sector}
            </span>
          )}
        </div>

        {/* Bottom Row */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            borderTop: '2px solid #1e293b',
            paddingTop: '40px',
          }}
        >
          <span style={{ fontSize: 24, color: '#64748b' }}>
            SEC Filings &amp; Benchmarking
          </span>
          <span style={{ fontSize: 24, color: '#64748b' }}>
            uniqus.com/research
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
