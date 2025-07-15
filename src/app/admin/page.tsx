'use client'
import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs'
import { useState, useEffect, useRef } from 'react'
import { createNews, getAllNews, deleteNews, updateNews } from '@/lib/newsService'
import { uploadImageAndGetURL } from '@/lib/uploadImage'
import { generateSlug } from '@/lib/slugGenerator'
import Image from 'next/image'
import { X, Loader2, Save, Edit, Trash2, ImagePlus } from 'lucide-react'

const ADMIN_EMAIL = 'prasad.kamta@gmail.com'

const CATEGORIES = [
  { value: 'coding', label: 'कोडिंग की दुनिया' },
  { value: 'world', label: 'देश-विदेश' },
  { value: 'lifestyle', label: 'जीवन के रंग' },
]

export default function AdminDashboardPage() {
  const { user } = useUser()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [news, setNews] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
    category: CATEGORIES[0].value,
    status: 'draft',
    metaTitle: '',
    metaDescription: ''
  })

  useEffect(() => {
    getAllNews().then(setNews)
  }, [])

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      image: null,
      category: CATEGORIES[0].value,
      status: 'draft',
      metaTitle: '',
      metaDescription: ''
    })
    setEditingId(null)
  }


  
  const handleSubmit = async (e) => {
  e.preventDefault()
  setIsLoading(true)
  try {
    const imageUrl = formData.image ? await uploadImageAndGetURL(formData.image) : null
    const slug = await generateSlug(formData.title) // ✅ यहीं fix है

    const newsItem = {
      ...formData,
      image_url: imageUrl,
      slug, // ✅ अब ये string है, Promise नहीं
      published_at: formData.status === 'published' ? new Date() : null,
     published: formData.status === 'published'      
    }

    if (editingId) {
      await updateNews(editingId, newsItem)
    } else {
      await createNews(newsItem)
    }

    setNews(await getAllNews())
    resetForm()
  } catch (err) {
    console.error('Error:', err)
  } finally {
    setIsLoading(false)
  }
}



  const handleEdit = (post) => {
    setFormData({
      title: post.title,
      content: post.content,
      image: null,
      category: post.category,
      status: post.status,
      metaTitle: post.meta_title || '',
      metaDescription: post.meta_description || ''
    })
    setEditingId(post.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleImageDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file?.type?.startsWith('image/')) {
      setFormData({ ...formData, image: file })
    }
  }

  if (!user || user.primaryEmailAddress?.emailAddress !== ADMIN_EMAIL) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Admin Access Required</h2>
          <SignInButton mode="modal">
            <button className="bg-blue-600 text-white px-6 py-2 rounded">Sign In</button>
          </SignInButton>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-10 max-w-5xl mx-auto">
      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        <h2 className="text-2xl font-semibold">{editingId ? 'Edit Post' : 'Create New Post'}</h2>
        <input
          type="text"
          placeholder="Title"
          className="w-full border p-2 rounded"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <textarea
          placeholder="Content"
          className="w-full border p-2 rounded"
          rows={5}
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        />

        <div
          className="border-2 border-dashed p-4 text-center rounded"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleImageDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {formData.image ? (
            <div className="relative inline-block">
              <Image
                src={URL.createObjectURL(formData.image)}
                alt="Preview"
                width={300}
                height={200}
                className="rounded"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setFormData({ ...formData, image: null })
                }}
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
              <ImagePlus className="mx-auto mb-2" />
              <p>Click or drag image here</p>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setFormData({ ...formData, image: e.target.files[0] })
              }
            }}
            accept="image/*"
          />
        </div>

        <div className="space-y-2">
          <input
            type="text"
            placeholder="Meta Title"
            className="w-full border p-2 rounded"
            value={formData.metaTitle}
            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
          />
          <textarea
            placeholder="Meta Description"
            className="w-full border p-2 rounded"
            rows={3}
            value={formData.metaDescription}
            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
          />
        </div>

        <div className="flex justify-between items-center">
          <select
            className="border p-2 rounded"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
            {editingId ? 'Update' : 'Publish'}
          </button>
        </div>
      </form>

      {/* RECENT POSTS */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Recent Posts</h3>
        <ul className="space-y-3">
          {news.map((post) => (
            <li key={post.id} className="flex justify-between items-center border-b pb-2">
              <span className="truncate">{post.title}</span>
              <div className="space-x-2">
                <button onClick={() => handleEdit(post)} className="text-blue-600 hover:underline">
                  <Edit size={16} />
                </button>
                <button
                  onClick={async () => {
                    await deleteNews(post.id)
                    setNews(news.filter((n) => n.id !== post.id))
                  }}
                  className="text-red-600 hover:underline"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
