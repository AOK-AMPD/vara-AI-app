'use client';

import dynamic from 'next/dynamic';

const SupportCenter = dynamic(() => import('../../views/SupportCenter'), {
  ssr: false
});

export default function Page() {
  return <SupportCenter />;
}
