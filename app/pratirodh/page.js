export const dynamic = "force-dynamic";
import Link from "next/link";
import Image from "next/image";
import { getNewsByCategory } from "@/lib/newsService";

export default async function PratirodhPage() {
  const posts = await getNewsByCategory("प्रतिरोध");

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">प्रतिरोध</h1>
      <ul className="space-y-4">
        {posts.map((item) => (
          <li key={item.id} className="bg-white p-4 rounded shadow">
            <Link href={`/pratirodh/${encodeURIComponent(item.slug)}`}>
              <h2 className="text-xl font-semibold text-red-600 hover:underline cursor-pointer">
                {item.title}
              </h2>
            </Link>

            {/* ✅ Fixed image display */}
            {item.images && item.images.length > 0 && (
              <div className="my-3">
                <Image
                  src={item.images[0]}
                  alt={item.title}
                  width={600}
                  height={300}
                  className="rounded-lg object-contain w-full"
                />
                {/* ✅ Caption only if exists */}
                {item.caption && (
                  <p className="text-sm text-gray-600 mt-1 text-center italic">
                    {item.caption}
                  </p>
                )}
              </div>
            )}

            <div
              className="mt-2 text-blue-700"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
