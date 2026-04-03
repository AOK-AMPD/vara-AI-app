'use client';

import dynamic from 'next/dynamic';

const IPOCenter = dynamic(() => import('../../views/IPOCenter'), {
  ssr: false
});

export default function Page() {
  return <IPOCenter />;
}
