import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accounting Analytics - Uniqus Research Center',
  description: 'Data-driven accounting policy analysis and disclosure benchmarking.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
