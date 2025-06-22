// src/app/news/page.tsx

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function NewsPage() {
  const { data: news, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <div>❌ Error loading news: {error.message}</div>
  }

  if (!news || news.length === 0) {
    return <div>हमारा मोर्चा<br /><strong>No news found.</strong></div>
  }

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">📰 हमारा मोर्चा</h1>
      {news.map((item) => (
        <div key={item.id} className="mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold">{item.title}</h2>
          <p className="text-gray-700">{item.content}</p>
          {item.image_url && (
            <img
              src={item.image_url}
              alt={item.title}
              className="mt-2 rounded-md max-w-full"
            />
          )}
          <p className="text-sm text-gray-500 mt-1">
            🕓 {new Date(item.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </main>
  )
}
