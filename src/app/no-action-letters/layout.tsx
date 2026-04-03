import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'No-Action Letter Search - Uniqus Research Center',
  description: 'SEC no-action letters and interpretive guidance database.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
