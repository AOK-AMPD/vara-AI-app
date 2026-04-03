'use client';

import dynamic from 'next/dynamic';

const AccountingAnalytics = dynamic(() => import('../../views/AccountingAnalytics'), {
  ssr: false
});

export default function Page() {
  return <AccountingAnalytics />;
}
