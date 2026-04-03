import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support Center - Uniqus Research Center',
  description: 'Workflow guides, tutorials, and help resources for the platform.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
