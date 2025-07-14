'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getAllNews, NewsItem } from '@/lib/newsService';

export default function HomePage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hindi category name को English folder name में convert करने के लिए
  const getCategoryPath = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'देश-विदेश': 'desh-videsh',
      'जीवन के रंग': 'jeevan-ke-rang',
      'कोडिंग की दुनिया': 'coding-ki-duniya',
      'प्रतिरोध': 'pratirodh'
    };
    return categoryMap[category] || category;
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getAllNews();
        console.log('News data:', data); // Debug के लिए
        setNews(data);
        setError(null);
      } catch (err) {
        console.error('Error loading news:', err);
        setError('Error loading news: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <p className="p-4 text-gray-600">लोड हो रहा है...</p>;
  if (error) return <p className="p-4 text-red-600">❌ {error}</p>;

  return (
    <main className="p-4 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">हमारा मोर्चा</h1>
      
      {news.length === 0 ? (
        <p className="p-4 text-gray-500">कोई खबर नहीं मिली</p>
      ) : (
        news.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded shadow border border-gray-200">
            <div className="flex items-center mb-3">
              <span className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full text-sm font-medium">
                {item.category}
              </span>
              <span className="ml-4 text-sm text-gray-600">
                🕐 {new Date(item.created_at).toLocaleString('hi-IN')}
              </span>
            </div>

            <Link href={`/${getCategoryPath(item.category)}/${item.slug}`}>
              <h2 className="text-xl font-bold text-blue-800 hover:underline mb-3">{item.title}</h2>
            </Link>

            {item.image_url && (
              <div className="mb-4">
                <Image
                  src={item.image_url}
                  alt={item.title}
                  width={400}
                  height={200}
                  className="rounded-lg object-cover"
                />
              </div>
            )}

            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {item.content.substring(0, 200)}...
            </p>
          </div>
        ))
      )}
    </main>
  );
}