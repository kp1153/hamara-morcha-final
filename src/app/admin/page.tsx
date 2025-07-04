// app/admin/page.tsx

'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-browser';
import NewsForm from '@/components/NewsForm';

export default function AdminPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email === 'kamta_tiwari@yahoo.com') {
        setUser(data.user);
      } else {
        alert('⛔ Unauthorized access');
        window.location.href = '/';
      }
    });
  }, []);

  if (!user) {
    return <div className="text-center mt-10">⏳ लॉगिन जांच हो रही है...</div>;
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-700 mb-4">
        🎯 Welcome Admin
      </h1>
      <p className="mb-6 text-gray-600">Logged in as: {user.email}</p>
      <NewsForm />
    </main>
  );
}
