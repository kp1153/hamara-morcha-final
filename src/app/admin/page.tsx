'use client';
import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { createNews, getAllNews, deleteNews, NewsItem } from '@/lib/newsService';
import { uploadImageAndGetURL } from '@/lib/uploadImage';
import Image from 'next/image';


const ADMIN_EMAIL = 'prasad.kamta@gmail.com';

const CATEGORIES = [
  { value: 'कोडिंग की दुनिया', label: 'कोडिंग की दुनिया' },
  { value: 'देश-विदेश', label: 'देश-विदेश' },
  { value: 'जीवन के रंग', label: 'जीवन के रंग' },
  { value: 'प्रतिरोध', label: 'प्रतिरोध' }
];

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  
  // Form States
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  
  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState<NewsItem[]>([]);
  const [showPostsList, setShowPostsList] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Load posts
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const allPosts = await getAllNews();
    setPosts(allPosts);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      let finalImageUrl = imageUrl;
      
      // Upload image if file selected
      if (imageFile) {
        const uploadedUrl = await uploadImageAndGetURL(imageFile);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        } else {
          throw new Error('Image upload failed');
        }
      }

      const { error } = await createNews({
        title,
        content,
        category,
        image_url: finalImageUrl,
        caption,
        published: isPublished
      });

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('✅ Post published successfully!');
        // Reset form
        setTitle('');
        setContent('');
        setCategory('');
        setImageUrl('');
        setCaption('');
        setImageFile(null);
        setIsPublished(true);
        // Reload posts
        loadPosts();
      }
    } catch (err) {
      if (err instanceof Error) {
        setMessage(`Error: ${err.message}`);
      } else {
        setMessage('An unknown error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    const { error } = await deleteNews(id);
    if (!error) {
      setMessage('✅ Post deleted successfully!');
      loadPosts();
    } else {
      setMessage(`Error: ${error.message}`);
    }
  };

  if (!isLoaded) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-2xl font-bold mb-6">एडमिन लॉगिन</h2>
          <SignInButton mode="modal">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
              लॉगिन करें
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  if (user.emailAddresses[0]?.emailAddress !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">केवल एडमिन ही इस पेज को access कर सकते हैं।</p>
          <SignOutButton>
            <button className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700">
              लॉगआउट करें
            </button>
          </SignOutButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">News Admin Dashboard</h1>
              <p className="text-gray-600">Welcome, {user.emailAddresses[0]?.emailAddress}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowPostsList(!showPostsList)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                {showPostsList ? 'Hide Posts' : 'View All Posts'} ({posts.length})
              </button>
              <SignOutButton>
                <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                  लॉगआउट
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}

        {/* Posts List */}
        {showPostsList && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">All Posts</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Title</th>
                    <th className="text-left py-2">Category</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(post => (
                    <tr key={post.id} className="border-b hover:bg-gray-50">
                      <td className="py-2">{post.title}</td>
                      <td className="py-2">{post.category}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 text-xs rounded ${
                          post.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="py-2">{new Date(post.created_at).toLocaleDateString('hi-IN')}</td>
                      <td className="py-2">
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Create Post Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-6">Create New Post</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">शीर्षक *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">कैटेगरी *</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">-- कैटेगरी चुनें --</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">खबर की सामग्री *</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {imageUrl && (
                  <Image src={imageUrl} alt="Preview" className="mt-2 h-32 object-cover rounded" />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Caption</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Optional caption for image"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Publish immediately</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Post'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
