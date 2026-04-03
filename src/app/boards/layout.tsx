import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Board Profiles - Uniqus Research Center',
  description: 'Board composition, compensation, and governance data from DEF 14A filings.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
