import { supabase } from './supabaseClient';
import { generateSimpleSlug } from './slugGenerator'; // यह लाइन आपकी फाइल में थी और यह बनी रहेगी ✅

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: string;
  image_url?: string;
  caption?: string;
  published: boolean;
  created_at: string;
}

export async function createNews(news: Omit<NewsItem, 'id' | 'created_at'>) {
  const { data, error } = await supabase.from('news').insert([news]).single();
  return { data, error };
}

export async function getAllNews() {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });

  return data || [];
}

export async function fetchNewsBySlugAndCategory(
  slug: string,
  category: string
) {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('category', category)
    .eq('slug', slug)
    .single();

  return data;
}

export async function getNewsByCategory(category: string) {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  return data || [];
}

export async function deleteNews(id: string) {
  const { error } = await supabase.from('news').delete().eq('id', id);
  return { error };
}

+ export async function updateNews(id: string, updates: Partial<NewsItem>) {
+   const { data, error } = await supabase
+     .from('news')
+     .update(updates)
+     .eq('id', id)
+     .single();
+ 
+   return { data, error };
+ }
