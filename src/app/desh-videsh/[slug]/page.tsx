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

export default function DeshVideshSlugPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Slug:', slug); // डीबग: slug की वैल्यू चेक करें
    const fetchArticle = async () => {
      if (!slug) {
        setError('❌ Slug नहीं मिला।');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        console.error('Supabase fetch error:', error.message);
        setError('खबर लोड करने में त्रुटि हुई।');
      } else if (!data) {
        setError('❌ Slug अमान्य है या खबर नहीं मिली।');
      } else {
        setArticle(data);
      }

      setLoading(false);
    };

    fetchArticle();
  }, [slug]);

  if (loading) return <div className="p-4">⏳ खबर लोड हो रही है...</div>;

  if (error)
    return <div className="text-red-600 font-bold text-center p-4">{error}</div>;

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{article?.title}</h1>

      {article?.image_url && (
        <div className="mb-4">
          <img
            src={article.image_url}
            alt={article.image_caption || article.title}
            className="w-full rounded shadow"
          />
          {article.image_caption && (
            <div className="text-sm text-gray-500 mt-1">
              {article.image_caption}
            </div>
          )}
        </div>
      )}

      <div className="text-gray-700 leading-relaxed mb-4">
        {article?.content}
      </div>

      <div className="text-sm text-gray-500">
        प्रकाशित: {new Date(article?.published_at).toLocaleDateString('hi-IN')} |{' '}
        {new Date(article?.published_at).toLocaleTimeString('hi-IN')}
      </div>
    </main>
  );
}