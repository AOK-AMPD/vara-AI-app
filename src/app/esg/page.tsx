'use client';

import dynamic from 'next/dynamic';

const ESGResearch = dynamic(() => import('../../views/ESGResearch'), {
  ssr: false
});

export default function Page() {
  return <ESGResearch />;
}
