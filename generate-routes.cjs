const fs = require('fs');
const path = require('path');

const routes = {
  'Dashboard': 'dashboard',
  'SearchPage': 'search',
  'FilingDetail': 'filing/[...slug]',
  'Benchmarking': 'compare',
  'AccountingHub': 'accounting',
  'ESGResearch': 'esg',
  'BoardProfiles': 'boards',
  'InsiderTrading': 'insiders',
  'AccountingAnalytics': 'accounting-analytics',
  'EarningsTranscripts': 'earnings',
  'SecRegulation': 'regulation',
  'CommentLetters': 'comment-letters',
  'NoActionLetters': 'no-action-letters',
  'SECEnforcement': 'enforcement',
  'IPOCenter': 'ipo',
  'MAResearch': 'mna',
  'ExhibitSearch': 'exhibits',
  'ExemptOfferings': 'exempt-offerings',
  'ADVRegistrations': 'adv-registrations',
  'APIPortal': 'api-portal',
  'SupportCenter': 'support',
};

Object.entries(routes).forEach(([componentName, routePath]) => {
  const dirPath = path.join(__dirname, 'src', 'app', routePath);
  fs.mkdirSync(dirPath, { recursive: true });
  
  const relativeDepth = routePath.split('/').length;
  const relativePrefix = '../'.repeat(relativeDepth + 1);
  
  // We disable SSR for everything except the ones we explicitly want to SSR
  // But for safety of the build migration, let's disable SSR for all view components,
  // we can re-enable SSR for `SearchPage/FilingDetail` manually if needed later.
  
  const content = `'use client';\n\nimport dynamic from 'next/dynamic';\n\nconst ${componentName} = dynamic(() => import('${relativePrefix}views/${componentName}'), {\n  ssr: false\n});\n\nexport default function Page() {\n  return <${componentName} />;\n}\n`;
  
  fs.writeFileSync(path.join(dirPath, 'page.tsx'), content);
});

console.log('Routes generated with next/dynamic!');
