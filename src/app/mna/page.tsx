'use client';

import dynamic from 'next/dynamic';

const MAResearch = dynamic(() => import('../../views/MAResearch'), {
  ssr: false
});

export default function Page() {
  return <MAResearch />;
}
