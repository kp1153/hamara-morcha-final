'use client';

import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import {
  createNews,
  getAllNews,
  deleteNews,
  updateNews,
  NewsItem
} from '@/lib/newsService';
import { uploadImageAndGetURL } from '@/lib/uploadImage';
import { generateSimpleSlug } from '@/lib/slugGenerator';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  Settings, 
  PlusCircle,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  User,
  BarChart3
} from 'lucide-react';

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
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

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
        else {
          setMessage('✅ Post updated successfully!');
          setActiveTab('posts');
        }
        setEditingPostId(null);
      } else {
        const slug = await generateSimpleSlug(title);

        const { error } = await createNews({
          title,
          content,
          category,
          image_url: finalImageUrl,
          caption,
          published: isPublished,
          slug
        });

        if (error) setMessage(`Error: ${error.message}`);
        else {
          setMessage('✅ Post published successfully!');
          setActiveTab('posts');
        }
      }

      resetForm();
      loadPosts();
    } catch (err) {
      if (err instanceof Error) setMessage(`Error: ${err.message}`);
      else setMessage('An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('');
    setImageUrl('');
    setCaption('');
    setImageFile(null);
    setIsPublished(true);
    setEditingPostId(null);
  };

  const handleEdit = (post: NewsItem) => {
    setTitle(post.title);
    setContent(post.content);
    setCategory(post.category);
    setImageUrl(post.image_url || '');
    setCaption(post.caption || '');
    setIsPublished(post.published);
    setEditingPostId(post.id);
    setActiveTab('create');
    setMessage('');
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
    setShowActionMenu(null);
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || post.category === filterCategory;
    const matchesStatus = !filterStatus || 
                         (filterStatus === 'published' && post.published) ||
                         (filterStatus === 'draft' && !post.published);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.published).length,
    drafts: posts.filter(p => !p.published).length,
    categories: CATEGORIES.map(cat => ({
      name: cat.label,
      count: posts.filter(p => p.category === cat.value).length
    }))
  };

  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl text-center">
        <h2 className="text-3xl font-bold mb-4 text-white">Admin Login</h2>
        <SignInButton mode="modal">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Sign In
          </button>
        </SignInButton>
      </div>
    </div>
  );

  if (user.emailAddresses[0]?.emailAddress !== ADMIN_EMAIL) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-500">Access Denied</h2>
        <p className="text-gray-300 mb-4">You don't have permission to access this page.</p>
        <SignOutButton>
          <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors">
            Sign Out
          </button>
        </SignOutButton>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold">News Admin</h1>
          <p className="text-sm text-gray-400 mt-1">{user.emailAddresses[0]?.emailAddress}</p>
        </div>
        
        <nav className="flex-1 p-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-800'
            }`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>
          
          <button
            onClick={() => setActiveTab('posts')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === 'posts' ? 'bg-blue-600' : 'hover:bg-gray-800'
            }`}
          >
            <FileText size={20} />
            All Posts
          </button>
          
          <button
            onClick={() => {
              resetForm();
              setActiveTab('create');
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === 'create' ? 'bg-blue-600' : 'hover:bg-gray-800'
            }`}
          >
            <PlusCircle size={20} />
            Add New
          </button>
          
          <button
            onClick={() => setActiveTab('media')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === 'media' ? 'bg-blue-600' : 'hover:bg-gray-800'
            }`}
          >
            <ImageIcon size={20} />
            Media Library
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === 'settings' ? 'bg-blue-600' : 'hover:bg-gray-800'
            }`}
          >
            <Settings size={20} />
            Settings
          </button>
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <SignOutButton>
            <button className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'posts' && 'All Posts'}
            {activeTab === 'create' && (editingPostId ? 'Edit Post' : 'Add New Post')}
            {activeTab === 'media' && 'Media Library'}
            {activeTab === 'settings' && 'Settings'}
          </h2>
          
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <User size={20} />
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mx-8 mt-4 p-4 rounded-lg ${
            message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 p-8">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-600">Total Posts</h3>
                  <FileText className="text-blue-500" size={24} />
                </div>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-600">Published</h3>
                  <Eye className="text-green-500" size={24} />
                </div>
                <p className="text-3xl font-bold">{stats.published}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-600">Drafts</h3>
                  <Edit className="text-yellow-500" size={24} />
                </div>
                <p className="text-3xl font-bold">{stats.drafts}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-600">Categories</h3>
                  <BarChart3 className="text-purple-500" size={24} />
                </div>
                <p className="text-3xl font-bold">{CATEGORIES.length}</p>
              </div>
              
              <div className="col-span-full bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Posts by Category</h3>
                <div className="space-y-4">
                  {stats.categories.map(cat => (
                    <div key={cat.name} className="flex items-center justify-between">
                      <span className="text-gray-600">{cat.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-48 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(cat.count / stats.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{cat.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* All Posts */}
          {activeTab === 'posts' && (
            <div>
              {/* Filters */}
              <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">All Categories</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                  
                  <button
                    onClick={() => {
                      resetForm();
                      setActiveTab('create');
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <PlusCircle size={20} />
                    Add New
                  </button>
                </div>
              </div>

              {/* Posts Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{post.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                              <User size={16} />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">Admin</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            {post.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            post.published 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(post.created_at).toLocaleDateString('hi-IN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="relative">
                            <button
                              onClick={() => setShowActionMenu(showActionMenu === post.id ? null : post.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <MoreVertical size={20} />
                            </button>
                            
                            {showActionMenu === post.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                                <button
                                  onClick={() => handleEdit(post)}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Edit size={16} className="inline mr-2" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(post.id)}
                                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                  <Trash2 size={16} className="inline mr-2" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing{' '}
                          <span className="font-medium">{indexOfFirstPost + 1}</span>
                          {' '}to{' '}
                          <span className="font-medium">
                            {Math.min(indexOfLastPost, filteredPosts.length)}
                          </span>
                          {' '}of{' '}
                          <span className="font-medium">{filteredPosts.length}</span>
                          {' '}results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          {Array.from({ length: totalPages }, (_, i) => (
                            <button
                              key={i + 1}
                              onClick={() => setCurrentPage(i + 1)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === i + 1
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Create/Edit Post */}
          {activeTab === 'create' && (
            <div className="max-w-4xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Enter post title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content
                      </label>
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows={10}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Write your content here..."
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium mb-4">Post Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      >
                        <option value="">Select a category</option>
                        {CATEGORIES.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Featured Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full"
                      />
                      {imageUrl && (
                        <div className="mt-4">
                          <Image 
                            src={imageUrl} 
                            alt="Preview" 
                            width={300} 
                            height={200}
                            className="rounded-lg object-cover"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image Caption
                      </label>
                      <input
                        type="text"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Enter image caption (optional)"
                      />
                    </div>
                    
                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isPublished}
                          onChange={(e) => setIsPublished(e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Publish immediately
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  >
                    {isSubmitting ? 'Saving...' : editingPostId ? 'Update Post' : 'Publish Post'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setActiveTab('posts');
                    }}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Media Library */}
          {activeTab === 'media' && (
            <div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium mb-4">Media Library</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {posts
                    .filter(post => post.image_url)
                    .map(post => (
                      <div key={post.id} className="relative group">
                        <Image
                          src={post.image_url!}
                          alt={post.caption || post.title}
                          width={150}
                          height={150}
                          className="rounded-lg object-cover w-full h-32"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity rounded-lg flex items-center justify-center">
                          <button className="opacity-0 group-hover:opacity-100 text-white">
                            <Eye size={24} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
                {posts.filter(post => post.image_url).length === 0 && (
                  <p className="text-gray-500 text-center py-8">No media files found</p>
                )}
              </div>
            </div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Title
                    </label>
                    <input
                      type="text"
                      defaultValue="News Portal"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tagline
                    </label>
                    <input
                      type="text"
                      defaultValue="Latest news and updates"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Posts per page
                    </label>
                    <input
                      type="number"
                      defaultValue={10}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium mb-4">User Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      value={ADMIN_EMAIL}
                      disabled
                      className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Zone
                    </label>
                    <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
                      <option>Asia/Kolkata</option>
                      <option>UTC</option>
                      <option>America/New_York</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium mb-4">Category Management</h3>
                <div className="space-y-4">
                  {CATEGORIES.map(cat => (
                    <div key={cat.value} className="flex items-center justify-between py-2 border-b">
                      <span>{cat.label}</span>
                      <div className="space-x-2">
                        <button className="text-blue-600 hover:underline text-sm">Edit</button>
                        <button className="text-red-600 hover:underline text-sm">Delete</button>
                      </div>
                    </div>
                  ))}
                  <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Add New Category
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}