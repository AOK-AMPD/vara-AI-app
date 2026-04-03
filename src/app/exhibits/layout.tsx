import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Exhibit Search - Uniqus Research Center',
  description: 'Search SEC filing exhibits including material agreements and contracts.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
