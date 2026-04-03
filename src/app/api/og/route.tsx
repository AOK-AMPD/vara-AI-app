import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Dynamic params
    const title = searchParams.get('title') || 'Uniqus Research Center';
    const form = searchParams.get('form') || 'SEC Intelligence Platform';
    const company = searchParams.get('company') || '';

    // Bold minimalist brutalist design matching Uniqus brand
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
            backgroundColor: '#050A1F', // Deep navy
            padding: '80px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Top: Branding */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div 
                style={{ 
                  width: '48px', 
                  height: '48px', 
                  backgroundColor: '#4ade80', // Mint green highlight
                  borderRadius: '4px',
                  marginRight: '24px' 
                }} 
              />
              <span style={{ fontSize: 32, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Uniqus Research Center
              </span>
            </div>
          </div>
          
          {/* Middle: Content */}
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto', marginBottom: 'auto' }}>
            {company && (
              <span style={{ fontSize: 40, color: '#38bdf8', marginBottom: '16px', fontWeight: 600 }}>
                {company}
              </span>
            )}
            <h1 style={{ fontSize: company ? 80 : 96, color: 'white', fontWeight: 800, lineHeight: 1.1, margin: 0 }}>
              {title}
            </h1>
            <span style={{ fontSize: 36, color: '#cbd5e1', marginTop: '32px' }}>
              {form}
            </span>
          </div>

          {/* Bottom Row */}
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', borderTop: '2px solid #1e293b', paddingTop: '40px' }}>
            <span style={{ fontSize: 24, color: '#64748b' }}>SEC Filings & Benchmarking</span>
            <span style={{ fontSize: 24, color: '#64748b' }}>uniqus.com/research</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error('OG Image Generation Error', e);
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
