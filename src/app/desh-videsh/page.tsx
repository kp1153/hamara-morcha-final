'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase-browser';

type Article = {
  id: number;
  title: string;
  content: string;
  slug: string;
  published_at: string;
  image_url?: string;
  image_caption?: string;
};

export default function DeshVideshDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug || typeof slug !== 'string') {
        setError('Slug अमान्य है');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        setError('खबर लोड करने में समस्या: ' + error.message);
        setArticle(null);
      } else {
        setArticle(data);
        setError(null);
      }

      setLoading(false);
    };

    fetchArticle();
  }, [slug]);

  if (loading) return <div className="p-4">⏳ खबर लोड हो रही है...</div>;

  if (error)
    return (
      <div className="text-red-600 font-semibold p-4">
        ❌ {error}
      </div>
    );

  if (!article)
    return (
      <div className="text-gray-600 font-medium p-4">
        ⚠️ कोई खबर नहीं मिली।
      </div>
    );

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

      {article.published_at && (
        <p className="text-sm text-gray-500 mb-2">
          🗓️ {new Date(article.published_at).toLocaleDateString()}
        </p>
      )}

      {article.image_url && (
        <div className="my-4">
          <img src={article.image_url} alt={article.image_caption || 'तस्वीर'} className="w-full rounded-md" />
          {article.image_caption && (
            <p className="text-sm text-gray-500 mt-1">{article.image_caption}</p>
          )}
        </div>
      )}

      <article className="text-lg text-gray-800 leading-relaxed whitespace-pre-line">
        {article.content}
      </article>
    </main>
  );
}
