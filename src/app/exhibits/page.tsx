'use client';

import dynamic from 'next/dynamic';

const ExhibitSearch = dynamic(() => import('../../views/ExhibitSearch'), {
  ssr: false
});

export default function Page() {
  return <ExhibitSearch />;
}
