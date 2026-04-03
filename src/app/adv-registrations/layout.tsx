import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ADV Registrations - Uniqus Research Center',
  description: 'Investment adviser ADV registration filings and disclosure tracking.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
