import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Regulation Hub - Uniqus Research Center',
  description: 'SEC, FASB, PCAOB, and other regulatory body updates and guidance.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
