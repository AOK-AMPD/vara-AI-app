import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Comment Letter Search - Uniqus Research Center',
  description: 'SEC staff comment letters and issuer responses searchable by topic.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
