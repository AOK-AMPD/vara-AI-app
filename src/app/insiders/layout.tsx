import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Insider Trading - Uniqus Research Center',
  description: 'Track SEC Form 4 insider trading activity and ownership changes.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
