'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useSearchParams, usePathname } from 'next/navigation'

interface NewsArticle {
  id: number
  title: string
  content: string
  category: string
  image_url: string | null
  image_caption: string | null
  created_at: string
}

export default function NewsDisplay() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    category: '',
    image_caption: ''
  })
  
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const categoryFromUrl = searchParams.get('category')



  // Category को URL से directly निकालने का function
  const getCurrentCategory = () => {
    // Browser का current URL check करें
    const currentPath = window.location.pathname
    console.log('Current URL path:', currentPath)
    
    if (currentPath === '/desh-videsh') {
      return 'desh-videsh'
    } else if (currentPath === '/vividha') {
      return 'vividha'
    } else if (currentPath === '/aalekh') {
      return 'aalekh'
    } else if (currentPath === '/pratirodh') {
      return 'pratirodh'
    } else if (currentPath === '/lifestyle') {
      return 'lifestyle'
    } else if (currentPath === '/tech-world') {
      return 'tech-world'
    } else if (categoryFromUrl) {
      return categoryFromUrl
    } else {
      return 'all'
    }
  }

  useEffect(() => {
    checkAdminStatus()
    
    const newCategory = getCurrentCategory()
    console.log('Next.js Pathname:', pathname)
    console.log('Browser URL:', window.location.pathname)
    console.log('Setting category to:', newCategory)
    setSelectedCategory(newCategory)
  }, [categoryFromUrl, pathname])

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setIsAdmin(!!user)
  }

  const fetchNews = async () => {
    try {
      setLoading(true) // हर बार loading true करें
      
      let query = supabase
        .from('news_articles')
        .select('*')
        .order('created_at', { ascending: false })

      // Category filter apply करें - यहाँ था मुख्य समस्या
      if (selectedCategory && selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory)
      }

      const { data, error } = await query

      if (error) {
        console.error('Database error:', error)
        setError('न्यूज़ लोड करने में समस्या: ' + error.message)
      } else {
        console.log('Fetched news:', data) // Debug के लिए
        console.log('Selected category:', selectedCategory) // Debug के लिए
        setNews(data || [])
        setError(null) // Error clear करें
      }
    } catch (err) {
      console.error('Error fetching news:', err)
      setError('कुछ गलत हुआ है')
    } finally {
      setLoading(false)
    }
  }

  // Category change होने पर news फिर से fetch करें
  useEffect(() => {
    console.log('Fetch useEffect triggered with selectedCategory:', selectedCategory)
    if (selectedCategory) { // selectedCategory set होने का इंतज़ार करें
      fetchNews()
    }
  }, [selectedCategory])

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

  const getCategoryName = (category: string) => {
    const categories: { [key: string]: string } = {
      'desh-videsh': 'देश-विदेश',
      'vividha': 'विविध',
      'aalekh': 'आलेख',
      'pratirodh': 'प्रतिरोध',
      'lifestyle': 'लाइफ-स्टाइल',
      'tech-world': 'टेक-वर्ल्ड'
    }
    return categories[category] || category
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

  const handleEdit = (article: NewsArticle) => {
    setEditingId(article.id)
    setEditForm({
      title: article.title,
      content: article.content,
      category: article.category,
      image_caption: article.image_caption || ''
    })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({
      title: '',
      content: '',
      category: '',
      image_caption: ''
    })
  }

  const handleSaveEdit = async (id: number) => {
    const { error } = await supabase
      .from('news_articles')
      .update({
        title: editForm.title,
        content: editForm.content,
        category: editForm.category,
        image_caption: editForm.image_caption || null
      })
      .eq('id', id)

    if (error) {
      alert('अपडेट में समस्या: ' + error.message)
    } else {
      alert('खबर अपडेट हो गई!')
      setEditingId(null)
      fetchNews() // Refresh the list
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'desh-videsh': 'bg-red-100 text-red-800',
      'vividha': 'bg-blue-100 text-blue-800',
      'aalekh': 'bg-green-100 text-green-800',
      'pratirodh': 'bg-purple-100 text-purple-800',
      'lifestyle': 'bg-pink-100 text-pink-800',
      'tech-world': 'bg-orange-100 text-orange-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-xl">⏳ समाचार लोड हो रहे हैं...</div>
        <div className="text-sm text-gray-500 mt-2">
          Category: {selectedCategory}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
        <div className="text-sm mt-2">
          Current Category: {selectedCategory}
        </div>
      </div>
    )
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-xl text-gray-600">📰 इस कैटेगरी में अभी तक कोई समाचार नहीं है</div>
        <div className="text-sm text-gray-500 mt-2">
          Selected Category: {getCategoryName(selectedCategory)}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          🗞️ {selectedCategory === 'all' ? 'ताज़ा समाचार' : getCategoryName(selectedCategory)}
        </h2>
        {isAdmin && (
          <div className="text-sm text-green-600 font-semibold mb-4">
            ✅ Admin Mode Active
          </div>
        )}
        <div className="text-sm text-gray-500">
          Total Articles: {news.length} | Category: {selectedCategory}
        </div>
      </div>
      
      <div className="space-y-8">
        {news.map((article) => (
          <article key={article.id} className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
            {/* Category Badge */}
            <div className="p-4 pb-2">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(article.category)}`}>
                {getCategoryName(article.category)}
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
              {editingId === article.id ? (
                // Edit Mode
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    className="w-full text-2xl font-bold border-2 border-blue-300 rounded p-2"
                  />
                  
                  <textarea
                    value={editForm.content}
                    onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                    rows={6}
                    className="w-full text-lg border-2 border-blue-300 rounded p-2"
                  />
                  
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                    className="border-2 border-blue-300 rounded p-2"
                  >
                    <option value="desh-videsh">देश-विदेश</option>
                    <option value="vividha">विविध</option>
                    <option value="aalekh">आलेख</option>
                    <option value="pratirodh">प्रतिरोध</option>
                    <option value="lifestyle">लाइफ-स्टाइल</option>
                    <option value="tech-world">टेक-वर्ल्ड</option>
                  </select>
                  
                  {article.image_url && (
                    <input
                      type="text"
                      placeholder="Image Caption"
                      value={editForm.image_caption}
                      onChange={(e) => setEditForm({...editForm, image_caption: e.target.value})}
                      className="w-full border-2 border-blue-300 rounded p-2"
                    />
                  )}
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(article.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      ✅ सेव करें
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      ❌ कैंसल
                    </button>
                  </div>
                </div>
              ) : (
                // Display Mode
                <>
                  <h3 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
                    {article.title}
                  </h3>
                  
                  <div className="text-lg text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
                    {article.content}
                  </div>
                </>
              )}

              {/* Date and Admin Controls */}
              <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-3">
                <span>📅 {formatDate(article.created_at)}</span>
                <div className="flex items-center gap-2">
                  <span>ID: {article.id}</span>
                  {isAdmin && editingId !== article.id && (
                    <div className="flex gap-1 ml-2">
                      <button
                        onClick={() => handleEdit(article)}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                      >
                        🗑️ Delete
                      </button>
                    </div>
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