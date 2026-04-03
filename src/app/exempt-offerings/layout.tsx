import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Exempt Offerings - Uniqus Research Center',
  description: 'Regulation D, Regulation A, and other exempt offering filings.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
