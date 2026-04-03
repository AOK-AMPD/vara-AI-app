'use client';

import dynamic from 'next/dynamic';

const BoardProfiles = dynamic(() => import('../../views/BoardProfiles'), {
  ssr: false
});

export default function Page() {
  return <BoardProfiles />;
}
