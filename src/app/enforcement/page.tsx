'use client';

import dynamic from 'next/dynamic';

const SECEnforcement = dynamic(() => import('../../views/SECEnforcement'), {
  ssr: false
});

export default function Page() {
  return <SECEnforcement />;
}
