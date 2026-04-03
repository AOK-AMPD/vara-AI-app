import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Uniqus Research Center',
  description: 'Watchlist tracking, filing alerts, and market intelligence dashboard.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
