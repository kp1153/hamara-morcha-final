import Link from "next/link";
import Image from "next/image";
import { getNewsByCategory } from "@/lib/newsService";

export default async function CodingKiDuniyaPage() {
  // "कोडिंग की दुनिया" कैटेगरी वाली पोस्टें सीधे लाओ
  const posts = await getNewsByCategory("कोडिंग की दुनिया");

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">कोडिंग की दुनिया</h1>
      <ul className="space-y-4">
        {posts.map((item) => (
          <li key={item.id} className="bg-white p-4 rounded shadow">
            <Link href={`/coding-ki-duniya/${item.slug}`}>
              <h2 className="text-xl font-semibold text-red-600 hover:underline cursor-pointer">
                {item.title}
              </h2>
            </Link>
            
            {item.image_url && (
              <div className="my-3">
                <Image
                  src={item.image_url}
                  alt={item.title}
                  width={600}
                  height={300}
                  className="rounded-lg object-cover w-full"
                />
                {item.caption && (
                  <p className="text-sm text-gray-600 mt-1 text-center italic">{item.caption}</p>
                )}
              </div>
            )}
            
            <p className="mt-2 text-blue-700">{item.content}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
