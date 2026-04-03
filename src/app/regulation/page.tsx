'use client';

import dynamic from 'next/dynamic';

const SecRegulation = dynamic(() => import('../../views/SecRegulation'), {
  ssr: false
});

export default function Page() {
  return <SecRegulation />;
}
