"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getAllNews } from "../lib/newsService";

export default function HomePage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCategoryPath = (category) => {
    const categoryMap = {
      "देश-विदेश": "desh-videsh",
      "जीवन के रंग": "jeevan-ke-rang",
      "कोडिंग की दुनिया": "coding-ki-duniya",
      प्रतिरोध: "pratirodh",
    };
    return categoryMap[category] || category;
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getAllNews();
        setNews(data);
        setError(null);
      } catch (err) {
        setError("Error loading news: " + (err?.message || "Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return null;
  if (error) return null;

  return (
    <main className="p-4 max-w-3xl mx-auto space-y-6">
      {news.map((item) => (
        <div
          key={item.id}
          className="bg-white p-4 rounded shadow border border-gray-200"
        >
          <div className="flex items-center mb-3">
            <span className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full text-sm font-medium">
              {item.category}
            </span>
            {console.log("Item data:", JSON.stringify(item))}

            <span className="ml-4 text-sm text-gray-600">
              🕐 {new Date(item.created_at).toLocaleString("hi-IN")}
            </span>
          </div>

          <Link href={`/${getCategoryPath(item.category)}/${item.slug}`}>
            <h2 className="text-xl font-bold text-blue-800 hover:underline mb-3">
              {item.title}
            </h2>
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

          {item.content && (
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {item.content.substring(0, 200)}...
            </p>
          )}
        </div>
      ))}
    </main>
  );
}
