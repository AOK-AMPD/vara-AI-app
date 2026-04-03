'use client';

import dynamic from 'next/dynamic';

const CommentLetters = dynamic(() => import('../../views/CommentLetters'), {
  ssr: false
});

export default function Page() {
  return <CommentLetters />;
}
