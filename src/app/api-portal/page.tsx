'use client';

import dynamic from 'next/dynamic';

const APIPortal = dynamic(() => import('../../views/APIPortal'), {
  ssr: false
});

export default function Page() {
  return <APIPortal />;
}
