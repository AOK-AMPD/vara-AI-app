import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Earnings Transcripts - Uniqus Research Center',
  description: 'Earnings call transcripts with AI-powered key takeaway extraction.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
