import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IPO Center - Uniqus Research Center',
  description: 'S-1 registration statement analysis with AI-powered section breakdowns.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
