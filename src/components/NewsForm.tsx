'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function NewsForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imageCaption, setImageCaption] = useState('')
  const [loading, setLoading] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    if (!title || !content || !category) {
      alert('शीर्षक, सामग्री और श्रेणी भरना जरूरी है')
      setLoading(false)
      return
    }

    try {
      let imageUrl = null
      
      // Upload image if selected
      if (image) {
        const fileExt = image.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `news-images/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('news-images')
          .upload(filePath, image)

        if (uploadError) {
          console.error('Image upload error:', uploadError)
          alert('तस्वीर अपलोड में समस्या: ' + uploadError.message)
          setLoading(false)
          return
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('news-images')
          .getPublicUrl(filePath)
        
        imageUrl = publicUrl
      }

      // Insert news article
      const { data, error } = await supabase
        .from('news_articles')
        .insert([{ 
          title, 
          content, 
          category,
          image_url: imageUrl,
          image_caption: imageCaption || null,
          created_at: new Date().toISOString()
        }])
        
      if (error) {
        console.error('Full Error:', error)
        alert('खबर अपलोड में समस्या: ' + (error.message || 'अज्ञात त्रुटि'))
      } else {
        console.log('Success:', data)
        alert('खबर सफलतापूर्वक अपलोड हो गई!')
        // Clear form
        setTitle('')
        setContent('')
        setCategory('')
        setImage(null)
        setImageCaption('')
        // Reset file input
        const fileInput = document.getElementById('image-input') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      alert('कुछ गलत हुआ है')
    }
    
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        📰 नई खबर अपलोड करें
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            शीर्षक (Headline)
          </label>
          <input
            type="text"
            placeholder="खबर का मुख्य शीर्षक लिखें..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-2xl font-bold"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            सामग्री (Content)
          </label>
          <textarea
            placeholder="पूरी खबर यहाँ लिखें..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg leading-relaxed"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            श्रेणी (Category)
          </label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
          >
            <option value="">श्रेणी चुनें</option>
            <option value="desh-videsh">देश-विदेश</option>
            <option value="vividha">विविध</option>
            <option value="aalekh">आलेख</option>
            <option value="pratirodh">प्रतिरोध</option>
            <option value="lifestyle">लाइफ-स्टाइल</option>
            <option value="tech-world">टेक-वर्ल्ड</option>
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            📸 तस्वीर (Image) - वैकल्पिक
          </label>
          <input
            type="file"
            id="image-input"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
          {image && (
            <p className="text-sm text-green-600 mt-2">
              ✅ चुनी गई फाइल: {image.name}
            </p>
          )}
        </div>

        {/* Image Caption */}
        {image && (
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              तस्वीर का कैप्शन (Image Caption)
            </label>
            <input
              type="text"
              placeholder="तस्वीर के बारे में संक्षिप्त विवरण..."
              value={imageCaption}
              onChange={(e) => setImageCaption(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
        )}

        {/* Submit Button */}
        <button 
          type="submit"
          disabled={loading}
          className={`w-full py-4 px-6 rounded-lg text-white text-lg font-semibold transition-all ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:scale-105'
          }`}
        >
          {loading ? '⏳ अपलोड हो रहा है...' : '📤 खबर अपलोड करें'}
        </button>
      </form>
    </div>
  )
}