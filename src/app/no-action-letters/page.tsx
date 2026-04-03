'use client';

import dynamic from 'next/dynamic';

const NoActionLetters = dynamic(() => import('../../views/NoActionLetters'), {
  ssr: false
});

export default function Page() {
  return <NoActionLetters />;
}
