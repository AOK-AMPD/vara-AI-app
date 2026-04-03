import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Research Workbench - Uniqus Research Center',
  description: 'Full-text semantic and boolean search across 500K+ SEC filings with AI-powered analysis.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
