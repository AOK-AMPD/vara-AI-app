'use client';

import dynamic from 'next/dynamic';

const ExemptOfferings = dynamic(() => import('../../views/ExemptOfferings'), {
  ssr: false
});

export default function Page() {
  return <ExemptOfferings />;
}
