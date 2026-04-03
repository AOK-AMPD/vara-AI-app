import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 86400; // 24h ISR

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

const SEC_USER_AGENT = 'Uniqus Research Center contact@uniqus.com';

interface SECSubmission {
  name: string;
  tickers: string[];
  sicDescription: string;
  sic: string;
  stateOfIncorporation: string;
  filings: {
    recent: {
      accessionNumber: string[];
      filingDate: string[];
      form: string[];
      primaryDocument: string[];
      primaryDocDescription: string[];
    };
  };
}

async function fetchCompanyData(cik: string): Promise<SECSubmission | null> {
  try {
    const res = await fetch(`https://data.sec.gov/submissions/CIK${cik}.json`, {
      headers: { 'User-Agent': SEC_USER_AGENT },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  return ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'JPM', 'AMZN', 'META', 'NVDA'].map(
    (ticker) => ({ ticker })
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ticker: string }>;
}): Promise<Metadata> {
  const { ticker } = await params;
  const upper = ticker.toUpperCase();
  const cik = CIK_MAP[upper];

  if (!cik) {
    return { title: 'Company Not Found | Uniqus Research Center' };
  }

  const data = await fetchCompanyData(cik);
  const companyName = data?.name ?? upper;

  return {
    title: `${companyName} (${upper}) - SEC Filings | Uniqus Research Center`,
    description: `View SEC filings, SIC sector data, and financial benchmarks for ${companyName} (${upper}). Powered by Uniqus Research Center.`,
  };
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;
  const upper = ticker.toUpperCase();
  const cik = CIK_MAP[upper];

  if (!cik) {
    notFound();
  }

  const data = await fetchCompanyData(cik);

  if (!data) {
    notFound();
  }

  const recent = data.filings.recent;
  const filingCount = Math.min(10, recent.accessionNumber.length);

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px', fontFamily: 'system-ui, sans-serif', color: '#e2e8f0' }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: 0, color: '#ffffff' }}>
            {data.name}
          </h1>
          <span style={{ fontSize: 20, fontWeight: 600, color: '#4ade80', letterSpacing: '0.05em' }}>
            {upper}
          </span>
        </div>
        <p style={{ marginTop: 8, color: '#94a3b8', fontSize: 14 }}>
          CIK: {cik}
        </p>
      </div>

      {/* Company Details */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 24,
          marginBottom: 48,
          padding: 24,
          backgroundColor: '#0f172a',
          borderRadius: 12,
          border: '1px solid #1e293b',
        }}
      >
        <div>
          <p style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>
            SIC Code
          </p>
          <p style={{ fontSize: 18, fontWeight: 600, margin: 0, color: '#f1f5f9' }}>
            {data.sic}
          </p>
        </div>
        <div>
          <p style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>
            Sector
          </p>
          <p style={{ fontSize: 18, fontWeight: 600, margin: 0, color: '#f1f5f9' }}>
            {data.sicDescription || 'N/A'}
          </p>
        </div>
        <div>
          <p style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>
            State of Incorporation
          </p>
          <p style={{ fontSize: 18, fontWeight: 600, margin: 0, color: '#f1f5f9' }}>
            {data.stateOfIncorporation || 'N/A'}
          </p>
        </div>
        <div>
          <p style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>
            Tickers
          </p>
          <p style={{ fontSize: 18, fontWeight: 600, margin: 0, color: '#f1f5f9' }}>
            {data.tickers?.join(', ') || upper}
          </p>
        </div>
      </section>

      {/* Latest Filings */}
      <section>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, color: '#ffffff' }}>
          Latest Filings
        </h2>
        <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #1e293b' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ backgroundColor: '#0f172a' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, borderBottom: '1px solid #1e293b' }}>
                  Date
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, borderBottom: '1px solid #1e293b' }}>
                  Form
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, borderBottom: '1px solid #1e293b' }}>
                  Description
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, borderBottom: '1px solid #1e293b' }}>
                  Document
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: filingCount }).map((_, i) => {
                const accession = recent.accessionNumber[i]?.replace(/-/g, '');
                const accessionDash = recent.accessionNumber[i];
                const doc = recent.primaryDocument[i];
                const edgarUrl = `https://www.sec.gov/Archives/edgar/data/${parseInt(cik, 10)}/${accession}/${doc}`;

                return (
                  <tr
                    key={accessionDash}
                    style={{ backgroundColor: i % 2 === 0 ? 'transparent' : '#0f172a' }}
                  >
                    <td style={{ padding: '10px 16px', borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
                      {recent.filingDate[i]}
                    </td>
                    <td style={{ padding: '10px 16px', borderBottom: '1px solid #1e293b' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: 4,
                          backgroundColor: '#1e293b',
                          color: '#4ade80',
                          fontWeight: 600,
                          fontSize: 13,
                        }}
                      >
                        {recent.form[i]}
                      </span>
                    </td>
                    <td style={{ padding: '10px 16px', borderBottom: '1px solid #1e293b', color: '#cbd5e1' }}>
                      {recent.primaryDocDescription[i] || '-'}
                    </td>
                    <td style={{ padding: '10px 16px', borderBottom: '1px solid #1e293b' }}>
                      <a
                        href={edgarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#38bdf8', textDecoration: 'none' }}
                      >
                        View
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Link
            href={`/search?company=${encodeURIComponent(data.name)}`}
            style={{
              display: 'inline-block',
              padding: '10px 24px',
              borderRadius: 8,
              backgroundColor: '#4ade80',
              color: '#050A1F',
              fontWeight: 700,
              fontSize: 14,
              textDecoration: 'none',
            }}
          >
            Search all filings for {data.name}
          </Link>
        </div>
      </section>

      {/* Footer attribution */}
      <footer style={{ marginTop: 64, paddingTop: 24, borderTop: '1px solid #1e293b', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#475569' }}>
          Data sourced from SEC EDGAR. Powered by Uniqus Research Center.
        </p>
      </footer>
    </main>
  );
}
