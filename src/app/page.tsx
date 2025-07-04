'use client';
import dynamic from 'next/dynamic';

const NewsList = dynamic(() => import('./NewsList'), { ssr: false });

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <NewsList />
    </main>
  );
}
