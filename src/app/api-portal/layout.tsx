import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Portal - Uniqus Research Center',
  description: 'API integration portal for programmatic access to SEC filing data.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
