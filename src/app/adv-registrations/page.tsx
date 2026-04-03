'use client';

import dynamic from 'next/dynamic';

const ADVRegistrations = dynamic(() => import('../../views/ADVRegistrations'), {
  ssr: false
});

export default function Page() {
  return <ADVRegistrations />;
}
