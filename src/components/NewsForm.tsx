'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-browser';

type Category = {
  id: number;
  title: string;
};

export default function NewsForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<number | ''>('');
  const [image, setImage] = useState<File | null>(null);
  const [imageCaption, setImageCaption] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, title')
        .order('title', { ascending: true });

      if (error) {
        alert('कैटेगरी लोड नहीं हो रही: ' + error.message);
      } else {
        setCategories(data || []);
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!title || !content || category === '') {
      alert('शीर्षक, सामग्री और श्रेणी भरना जरूरी है');
      setLoading(false);
      return;
    }

    try {
      const { data: categoryCheck } = await supabase
        .from('categories')
        .select('id')
        .eq('id', Number(category))
        .single();

      if (!categoryCheck) {
        alert('चुनी गई श्रेणी मौजूद नहीं है');
        setLoading(false);
        return;
      }

      let imageUrl = null;

      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, image);

        if (uploadError) {
          alert('तस्वीर अपलोड में समस्या: ' + uploadError.message);
          setLoading(false);
          return;
        }

        const { data: publicData } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        imageUrl = publicData.publicUrl;
      }

      const slug = (
        title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9\-]/g, '')
        + '-' + Date.now()
      );

      const currentDate = new Date().toISOString();

      const { error } = await supabase.from('news_articles').insert([
        {
          title,
          content,
          category_id: Number(category),
          image_url: imageUrl,
          image_caption: imageCaption || null,
          slug,
          created_at: currentDate,
          published_at: currentDate, // ✅ यह लाइन जोड़ दी गई है
        },
      ]);

      if (error) {
        throw error;
      }

      alert('✅ खबर सफलतापूर्वक सेव हो गई!');
      setTitle('');
      setContent('');
      setCategory('');
      setImage(null);
      setImageCaption('');
      const fileInput = document.getElementById('image-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error: any) {
      alert('खबर अपलोड में समस्या: ' + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        📰 नई खबर जोड़ें
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-semibold mb-2">शीर्षक</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-semibold mb-2">सामग्री</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-lg font-semibold mb-2">श्रेणी</label>
          <select
            value={category}
            onChange={(e) => setCategory(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded"
            required
          >
            <option value="">श्रेणी चुनें</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-lg font-semibold mb-2">तस्वीर (वैकल्पिक)</label>
          <input
            id="image-input"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        {image && (
          <div>
            <label className="block text-lg font-semibold mb-2">तस्वीर का कैप्शन</label>
            <input
              type="text"
              value={imageCaption}
              onChange={(e) => setImageCaption(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded text-white font-semibold transition ${
            loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'अपलोड हो रहा है...' : '📤 खबर अपलोड करें'}
        </button>
      </form>
    </div>
  );
}
