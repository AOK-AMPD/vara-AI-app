'use client';

import dynamic from 'next/dynamic';

const InsiderTrading = dynamic(() => import('../../views/InsiderTrading'), {
  ssr: false
});

export default function Page() {
  return <InsiderTrading />;
}
