import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SEC Enforcement Tracking - Uniqus Research Center',
  description: 'Track SEC enforcement actions, administrative proceedings, and penalties.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
