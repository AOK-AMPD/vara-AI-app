'use client';

import dynamic from 'next/dynamic';

const AccountingHub = dynamic(() => import('../../views/AccountingHub'), {
  ssr: false
});

export default function Page() {
  return <AccountingHub />;
}
