"use client"; // ✅ Next.js 15 में client component के लिए जरूरी

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link"; // ✅ Next.js navigation के लिए

export default function NewsList() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // ✅ Error handling added

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        setError(null);

        const snapshot = await getDocs(collection(db, "news"));
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setNews(items);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("खबरें लोड करने में समस्या हुई");
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-gray-500">📡 Loading news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-300 rounded">
        <p className="text-red-700">❌ {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-blue-600 underline"
        >
          🔄 फिर से कोशिश करें
        </button>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-300 rounded">
        😕 कोई खबर नहीं मिली! आप पहली खबर{" "}
        <Link
          href="/admin/create"
          className="text-blue-600 underline hover:text-blue-800"
        >
          यहाँ पोस्ट करें
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {news.map((item) => (
        <article
          key={item.id}
          className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2 text-gray-900">
            {item.title}
          </h2>

          {item.imageUrl?.trim() && (
            <div className="mb-3">
              <img
                src={item.imageUrl}
                alt={item.caption || item.title}
                className="w-full h-48 object-cover rounded-md"
                loading="lazy"
              />
            </div>
          )}

          <p className="text-gray-700 leading-relaxed">{item.caption}</p>

          {item.date && (
            <time className="text-sm text-gray-500 mt-2 block">
              📅 {new Date(item.date.toDate()).toLocaleDateString("hi-IN")}
            </time>
          )}
        </article>
      ))}
    </div>
  );
}
