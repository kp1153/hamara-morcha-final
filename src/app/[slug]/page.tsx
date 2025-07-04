import { supabase } from '@/lib/supabase-browser';

export default async function NewsDetail({ params }: { params: { slug: string } }) {
  const { data, error } = await supabase
    .from('news_articles')
    .select('id, title, content, slug, created_at')
    .eq('slug', params.slug)
    .single();

  if (error || !data) {
    return <div className="text-center text-red-500 mt-10">खबर नहीं मिली</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
      <p className="text-gray-600 text-sm mb-6">{new Date(data.created_at).toLocaleString()}</p>
      <div className="text-lg leading-relaxed text-gray-800 whitespace-pre-line">
        {data.content}
      </div>
    </div>
  );
}
