'use client';

import dynamic from 'next/dynamic';

const Benchmarking = dynamic(() => import('../../views/Benchmarking'), {
  ssr: false
});

export default function Page() {
  return <Benchmarking />;
}
