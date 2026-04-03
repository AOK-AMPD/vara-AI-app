import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Benchmarking Matrix - Uniqus Research Center',
  description: 'AI-powered peer disclosure comparison across companies and filing sections.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
