import supabase from './supabaseClient';
import { generateSimpleSlug } from './slugGenerator';

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  content: string;
  image_url?: string;
  caption?: string;
  created_at: string;
  category: string;
  author?: string;
  published: boolean;
  views?: number;
}

export async function createNews(newsData: {
  title: string;
  content: string;
  category: string;
  image_url?: string;
  caption?: string;
  author?: string;
  published?: boolean;
}): Promise<{ data: NewsItem | null; error: Error | null }> {
  
  try {
    // Generate unique slug from title - NOW WITH AWAIT
    const slug = await generateSimpleSlug(newsData.title);
    
    const { data, error } = await supabase
      .from('news')
      .insert([{
        ...newsData,
        slug,
        published: newsData.published ?? false
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating news:', error.message);
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in createNews:', error);
    return { data: null, error: error as Error };
  }
}

export async function getNewsByCategory(category: string): Promise<NewsItem[]> {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('category', category)
      // .eq('published', true)  // <-- यह भी comment कर दो
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching news by category:', error.message);
      return [];
    }

    return data ?? [];
  } catch (error) {
    console.error('Unexpected error in getNewsByCategory:', error);
    return [];
  }
}

export async function getAllNews(): Promise<NewsItem[]> {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      // .eq('published', true)  // <-- यह line comment कर दो
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all news:', error.message);
      return [];
    }

    return data ?? [];
  } catch (error) {
    console.error('Unexpected error in getAllNews:', error);
    return [];
  }
}

export async function deleteNews(id: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);
    
    if (error) {
      return { error: new Error(error.message) };
    }
    
    return { error: null };
  } catch (error) {
    console.error('Unexpected error in deleteNews:', error);
    return { error: error as Error };
  }
}

export async function fetchNewsBySlugAndCategory(
  slug: string,
  category: string
): Promise<NewsItem | null> {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('slug', slug)
      .eq('category', category)
      // .eq('published', true)  // <-- यह भी comment कर दो
      .maybeSingle();

    if (error) {
      console.error('Error fetching news by slug and category:', error.message);
      return null;
    }

    return data ?? null;
  } catch (error) {
    console.error('Unexpected error in fetchNewsBySlugAndCategory:', error);
    return null;
  }
}