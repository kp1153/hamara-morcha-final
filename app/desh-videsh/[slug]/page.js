import { notFound } from "next/navigation";
import Image from "next/image";
import { fetchNewsBySlugAndCategory } from "@/lib/newsService";
import NewsAnalytics from "@/components/NewsAnalytics";
import ViewsCounter from "@/components/ViewsCounter";

export default async function DeshVideshPage({ params }) {
  const { slug } = params;
  const safeSlug = decodeURIComponent(slug);

  const news = await fetchNewsBySlugAndCategory(safeSlug, "देश-विदेश");
  if (!news) notFound();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("hi-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <NewsAnalytics newsData={news} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center mb-4">
            <span className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full text-sm font-medium">
              {news.category}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {news.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center">
              <span className="mr-1">🕐</span>
              {formatDate(news.created_at)}
            </div>
            <ViewsCounter slug={`/desh-videsh/${safeSlug}`} />
          </div>
          {news.images && news.images.length > 0 && (
            <div className="mb-6">
              <div className="relative w-full h-96 rounded-lg overflow-hidden">
                <Image
                  src={news.images[0].trimEnd()}
                  alt={`${news.title || "Image"}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {news.caption && (
                <p className="text-sm text-gray-600 mt-2 text-center italic">
                  {news.caption}
                </p>
              )}
            </div>
          )}
          <div
            className="text-gray-800 leading-relaxed text-base md:text-lg"
            dangerouslySetInnerHTML={{
              __html:
                (news.content_parts
                  ? news.content_parts.join("")
                  : news.content) || "",
            }}
          />
        </div>
      </div>
    </main>
  );
}
