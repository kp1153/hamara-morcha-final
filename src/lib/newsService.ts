// ✅ फाइल: src/lib/newsService.ts
import supabase from './supabaseClient';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: string;
  image_url?: string;
  caption?: string;
  published: boolean;
  created_at: string;
  slug: string;
}

// ✅ Create
export async function createNews(news: Omit<NewsItem, 'id' | 'created_at'>) {
  const { data, error } = await supabase.from('news').insert([news]).single();
  return { data, error };
}

// ✅ Read All - Return type specified
export async function getAllNews(): Promise<NewsItem[]> {
  const { data } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });

  return data || [];
}

// ✅ Read by Slug & Category - Return type specified
export async function fetchNewsBySlugAndCategory(
  slug: string,
  category: string
): Promise<NewsItem | null> {
  const { data } = await supabase
    .from('news')
    .select('*')
    .eq('category', category)
    .eq('slug', slug)
    .single();

  return data;
}

// ✅ Read by Category - Return type specified
export async function getNewsByCategory(category: string): Promise<NewsItem[]> {
  const { data } = await supabase
    .from('news')
    .select('*')
    .eq('category', category)
    .eq('published', true) // Only published posts
    .order('created_at', { ascending: false });

  return data || [];
}

// ✅ Delete
export async function deleteNews(id: string) {
  const { error } = await supabase.from('news').delete().eq('id', id);
  return { error };
}

// ✅ Update
export async function updateNews(id: string, updates: Partial<NewsItem>) {
  const { data, error } = await supabase
    .from('news')
    .update(updates)
    .eq('id', id)
    .single();

  return { data, error };
}