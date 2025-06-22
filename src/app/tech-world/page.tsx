'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface NewsArticle {
  id: number
  title: string
  content: string
  category: string
  image_url: string | null
  image_caption: string | null
  created_at: string
}

export default function TechWorldPage() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    checkAdminStatus()
    fetchNews()
  }, [])

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setIsAdmin(!!user)
  }

  const fetchNews = async () => {
    try {
      console.log('Fetching tech-world news...')
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('category', 'tech-world')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Database error:', error)
        setError('न्यूज़ लोड करने में समस्या: ' + error.message)
      } else {
        console.log('Tech-world news fetched:', data)
        setNews(data || [])
        setError(null)
      }
    } catch (err) {
      console.error('Error fetching tech-world news:', err)
      setError('कुछ गलत हुआ है')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('hi-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('क्या आप वाकई इस खबर को हटाना चाहते हैं?')) return

    const { error } = await supabase
      .from('news_articles')
      .delete()
      .eq('id', id)

    if (error) {
      alert('हटाने में समस्या: ' + error.message)
    } else {
      alert('खबर हटा दी गई!')
      fetchNews() // Refresh the list
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-xl">⏳ टेक-वर्ल्ड की खबरें लोड हो रही हैं...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    )
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">💻 टेक-वर्ल्ड</h1>
        <div className="text-xl text-gray-600">इस कैटेगरी में अभी तक कोई समाचार नहीं है</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">💻 टेक-वर्ल्ड</h1>
        {isAdmin && (
          <div className="text-sm text-green-600 font-semibold mb-4">
            ✅ Admin Mode Active
          </div>
        )}
        <div className="text-sm text-gray-500">
          Total Articles: {news.length}
        </div>
      </div>
      
      <div className="space-y-8">
        {news.map((article) => (
          <article key={article.id} className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
            {/* Category Badge */}
            <div className="p-4 pb-2">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-800">
                टेक-वर्ल्ड
              </span>
            </div>

            {/* Image */}
            {article.image_url && (
              <div className="px-4">
                <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={article.image_url} 
                    alt={article.image_caption || article.title}
                    className="w-full h-full object-contain"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                {article.image_caption && (
                  <p className="text-sm text-gray-600 mt-2 italic">
                    📸 {article.image_caption}
                  </p>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
                {article.title}
              </h2>
              
              <div className="text-lg text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
                {article.content}
              </div>

              {/* Date and Admin Controls */}
              <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-3">
                <span>📅 {formatDate(article.created_at)}</span>
                <div className="flex items-center gap-2">
                  <span>ID: {article.id}</span>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 ml-2"
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}