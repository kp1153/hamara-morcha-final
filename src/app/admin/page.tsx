'use client';
import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import {
  createNews,
  getAllNews,
  deleteNews,
  updateNews, // ✅ जोड़ा गया
  NewsItem
} from '@/lib/newsService';
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

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState<NewsItem[]>([]);
  const [showPostsList, setShowPostsList] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null); // ✅ एडिट ID ट्रैक

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

      if (imageFile) {
        const uploadedUrl = await uploadImageAndGetURL(imageFile);
        if (uploadedUrl) finalImageUrl = uploadedUrl;
        else throw new Error('Image upload failed');
      }

      if (editingPostId) {
        const { error } = await updateNews(editingPostId, {
          title,
          content,
          category,
          image_url: finalImageUrl,
          caption,
          published: isPublished
        });
        if (error) setMessage(`Error: ${error.message}`);
        else setMessage('✅ Post updated successfully!');
      } else {
        const { error } = await createNews({
          title,
          content,
          category,
          image_url: finalImageUrl,
          caption,
          published: isPublished
        });
        if (error) setMessage(`Error: ${error.message}`);
        else setMessage('✅ Post published successfully!');
      }

      setTitle('');
      setContent('');
      setCategory('');
      setImageUrl('');
      setCaption('');
      setImageFile(null);
      setIsPublished(true);
      setEditingPostId(null); // ✅ reset edit mode
      loadPosts();
    } catch (err) {
      if (err instanceof Error) setMessage(`Error: ${err.message}`);
      else setMessage('An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (post: NewsItem) => {
    setTitle(post.title);
    setContent(post.content);
    setCategory(post.category);
    setImageUrl(post.image_url || '');
    setCaption(post.caption || '');
    setIsPublished(post.published);
    setEditingPostId(post.id);
    setShowPostsList(false);
    setMessage('✏️ Editing existing post...');
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

  if (!isLoaded) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md bg-white p-6 rounded shadow text-center">
          <h2 className="text-2xl font-bold mb-4">एडमिन लॉगिन</h2>
          <SignInButton mode="modal">
            <button className="bg-blue-600 text-white px-4 py-2 rounded">लॉगिन करें</button>
          </SignInButton>
        </div>
      </div>
    );

  if (user.emailAddresses[0]?.emailAddress !== ADMIN_EMAIL)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md bg-white p-6 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600">केवल एडमिन ही इस पेज को access कर सकते हैं।</p>
          <SignOutButton>
            <button className="bg-red-600 text-white px-4 py-2 rounded">लॉगआउट करें</button>
          </SignOutButton>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white shadow rounded p-6">
          <h1 className="text-2xl font-bold mb-2">News Admin Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome, {user.emailAddresses[0]?.emailAddress}</p>
        </div>

        {message && (
          <div className={`p-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        <div className="flex justify-between items-center">
          <button onClick={() => setShowPostsList(!showPostsList)} className="bg-gray-700 text-white px-4 py-2 rounded">
            {showPostsList ? 'Hide Posts' : 'View All Posts'} ({posts.length})
          </button>
          <SignOutButton>
            <button className="bg-red-600 text-white px-4 py-2 rounded">लॉगआउट</button>
          </SignOutButton>
        </div>

        {showPostsList && (
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-bold mb-4">All Posts</h2>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Title</th>
                  <th className="text-left">Category</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Date</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-t hover:bg-gray-50">
                    <td>{post.title}</td>
                    <td>{post.category}</td>
                    <td>
                      <span className={`px-2 py-1 text-xs rounded ${post.published ? 'bg-green-200' : 'bg-yellow-200'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>{new Date(post.created_at).toLocaleDateString('hi-IN')}</td>
                    <td className="space-x-2">
                      <button onClick={() => handleEdit(post)} className="text-blue-600 hover:underline">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Form */}
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-xl font-bold mb-4">{editingPostId ? 'Edit Post' : 'Create New Post'}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full border p-2 rounded" />
            <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required className="w-full border p-2 rounded min-h-[150px]" />
            <select value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full border p-2 rounded">
              <option value="">-- कैटेगरी चुनें --</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
            {imageUrl && <Image src={imageUrl} alt="Preview" className="mt-2 h-32 object-cover rounded" width={300} height={200} />}
            <input type="text" placeholder="Image Caption" value={caption} onChange={(e) => setCaption(e.target.value)} className="w-full border p-2 rounded" />
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
              <span>Publish immediately</span>
            </label>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : editingPostId ? 'Update Post' : 'Publish Post'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
