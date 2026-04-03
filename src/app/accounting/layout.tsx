import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accounting Standards Hub - Uniqus Research Center',
  description: 'US GAAP, IFRS, and Ind AS standards reference with AI lookup.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
