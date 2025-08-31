export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { getNewsByCategory } from "@/lib/newsService";

export default async function JeewanKeRangPage() {
  const posts = await getNewsByCategory("जीवन के रंग"); // ✅ Match with actual category title

  if (!Array.isArray(posts) || posts.length === 0) {
    return (
      <main className="max-w-3xl mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mt-10">
          इस श्रेणी में कोई खबर उपलब्ध नहीं है।
        </h1>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">जीवन के रंग</h1>

      <ul className="space-y-4">
        {posts.map((item) => (
          <li key={item.id} className="bg-white p-4 rounded shadow">
            <Link href={`/jeevan-ke-rang/${encodeURIComponent(item.slug)}`}>
              <h2 className="text-xl font-semibold text-red-600 hover:underline cursor-pointer">
                {item.title}
              </h2>
            </Link>

            {item.images?.[0] && typeof item.images[0] === "string" && (
              <div className="my-3">
                <Image
                  src={item.images[0]}
                  alt={item.title}
                  width={600}
                  height={300}
                  className="rounded-lg object-contain w-full"
                />
                {item.caption && (
                  <p className="text-sm text-gray-600 mt-1 text-center italic">
                    {item.caption}
                  </p>
                )}
              </div>
            )}

            <div
              className="mt-2 text-blue-700"
              dangerouslySetInnerHTML={{
                __html:
                  (item.content_parts
                    ? item.content_parts.join("")
                    : item.content) || "",
              }}
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
