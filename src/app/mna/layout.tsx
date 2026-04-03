import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'M&A Research - Uniqus Research Center',
  description: 'Merger and acquisition filings analysis, deal extraction, and agreement review.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
