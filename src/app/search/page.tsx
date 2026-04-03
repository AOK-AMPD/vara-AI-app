'use client';

import dynamic from 'next/dynamic';

const SearchPage = dynamic(() => import('../../views/SearchPage'), {
  ssr: false
});

export default function Page() {
  return <SearchPage />;
}
