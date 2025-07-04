'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-browser';

type NewsArticle = {
  id: number;
  title: string;
  content: string;
  slug: string;
  created_at: string;
};

export default function NewsList() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data, error } = await supabase
          .from('news_articles')
          .select('id, title, content, slug, created_at')
          .order('created_at', { ascending: false });

        if (error) {
          setError(error.message);
          console.error('Supabase fetch error:', error);
        } else if (!data || data.length === 0) {
          setError('कोई खबर नहीं मिली।');
          console.log('Fetched data is empty or null');
        } else {
          setArticles(data);
          setError(null);
          console.log('Fetched articles:', data);
        }
      } catch (err) {
        setError('डेटा लाने में समस्या: ' + (err as Error).message);
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <div>लोड हो रहा है...</div>;

  if (error)
    return (
      <div style={{ color: 'red', fontWeight: 'bold' }}>
        एरर: {error}
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">📰 ताज़ा खबरें</h2>
      <ul className="space-y-4">
        {articles.map((article) => (
          <li key={article.id} className="p-4 border rounded shadow bg-white">
            <h3 className="text-xl font-semibold">{article.title}</h3>
            <div className="text-gray-700 mt-2">{article.content}</div>
            <div className="text-xs text-gray-400 mt-1">
              {new Date(article.created_at).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
