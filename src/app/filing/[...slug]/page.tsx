'use client';

import dynamic from 'next/dynamic';

const FilingDetail = dynamic(() => import('../../../views/FilingDetail'), {
  ssr: false
});

export default function Page() {
  return <FilingDetail />;
}
