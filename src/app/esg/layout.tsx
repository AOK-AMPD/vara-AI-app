import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ESG Research Center - Uniqus Research Center',
  description: 'ESG disclosure quality analysis and sustainability reporting benchmarks.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
