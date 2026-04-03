'use client';

import dynamic from 'next/dynamic';

const EarningsTranscripts = dynamic(() => import('../../views/EarningsTranscripts'), {
  ssr: false
});

export default function Page() {
  return <EarningsTranscripts />;
}
