"use client";
import { db, storage } from "@/firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import React, { useState, useEffect } from "react";
import { Upload, Send, Trash2, Edit } from "lucide-react";
import { uploadImage } from "@/lib/imageService";
import RichTextEditor from '@/components/RichTextEditor';

const categories = [
  { href: "/desh-videsh", label: "देश-विदेश" },
  { href: "/jeevan-ke-rang", label: "जीवन के रंग" },
  { href: "/coding-ki-duniya", label: "कोडिंग की दुनिया" },
  { href: "/pratirodh", label: "प्रतिरोध" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("create-news");
  const [editingNews, setEditingNews] = useState(null);
  const [uploading, setUploading] = useState(false);

  // News Form State
  const [newsForm, setNewsForm] = useState({
    title: "",
    content: "",
    category: "",
    publishDate: "",
    caption: "",
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewsForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // useState के बाद यह function add करें
  const fetchNewsFromFirestore = async () => {
    try {
      const newsCollection = collection(db, "news");
      const newsSnapshot = await getDocs(newsCollection);
      const newsData = newsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNewsList(newsData);
      console.log("News fetched:", newsData);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  // fetchNewsFromFirestore function के बाद
  useEffect(() => {
    fetchNewsFromFirestore();
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve({
            file: file,
            preview: event.target.result,
            name: file.name,
          });
        };
        reader.readAsDataURL(file);
      });
    });
    Promise.all(imagePromises).then((images) => {
      setSelectedImages((prev) => [...prev, ...images]);
    });
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!newsForm.title || !newsForm.content || !newsForm.category) {
      alert("कृपया सभी आवश्यक फील्ड भरें!");
      return;
    }

    setUploading(true);

    // Slug generate करें
    // Fixed generateSlug function - Line 107 को replace करो
    const generateSlug = (title) => {
      return (
        title
          .toLowerCase()
          .replace(/[^\u0900-\u097F\w\s-]/g, "") // ✅ Hindi characters को preserve करता है
          .replace(/\s+/g, "-")
          .trim() || Date.now().toString()
      ); // ✅ Fallback अगर slug empty हो
    };

    let uploadedImageUrls = [];

    if (selectedImages.length > 0) {
      const uploadPromises = selectedImages.map((image) =>
        uploadImage(image.file)
      );
      uploadedImageUrls = await Promise.all(uploadPromises);
    }

    try {
      const newsData = {
        title: newsForm.title,
        slug: generateSlug(newsForm.title),
        content: newsForm.content,
        category: newsForm.category,
        caption: newsForm.caption,
        publishDate:
          newsForm.publishDate || new Date().toISOString().split("T")[0],
        status: "published",
        // IST में current time
        createdAt: (() => {
          const istTime = new Date();
          istTime.setHours(istTime.getHours() + 5);
          istTime.setMinutes(istTime.getMinutes() + 30);
          return istTime.toISOString();
        })(),
        images: uploadedImageUrls,
        image_url: uploadedImageUrls.length > 0 ? uploadedImageUrls[0] : null,
      };

      if (editingNews) {
        // Update existing news in Firestore
        const newsDoc = doc(db, "news", editingNews.id);
        await updateDoc(newsDoc, newsData);
        alert("न्यूज सफलतापूर्वक अपडेट हुई!");
      } else {
        // Add new news to Firestore
        await addDoc(collection(db, "news"), newsData);
        alert("न्यूज सफलतापूर्वक प्रकाशित हुई!");
      }

      // Reset form और refresh data
      setNewsForm({
        title: "",
        content: "",
        category: "",
        publishDate: "",
        caption: "",
      });
      setSelectedImages([]);
      setEditingNews(null);
      setActiveTab("manage-news");

      // Fresh data fetch करें
      fetchNewsFromFirestore();
    } catch (error) {
      console.error("Error:", error);
      alert("न्यूज पोस्ट करने में एरर आई!");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (news) => {
    setNewsForm({
      title: news.title,
      content: news.content,
      category: news.category,
      publishDate: news.publishDate,
      caption: news.caption || "",
    });
    setSelectedImages(news.images || []);
    setEditingNews(news);
    setActiveTab("create-news");
  };

  const handleDelete = async (id) => {
    if (confirm("क्या आप इस न्यूज को डिलीट करना चाहते हैं?")) {
      try {
        // Firestore से delete करें
        await deleteDoc(doc(db, "news", id));
        alert("न्यूज सफलतापूर्वक डिलीट हुई!");

        // Fresh data fetch करें
        fetchNewsFromFirestore();
      } catch (error) {
        console.error("Error deleting news:", error);
        alert("न्यूज डिलीट करने में एरर आई!");
      }
    }
  };

  const cancelEdit = () => {
    setEditingNews(null);
    setNewsForm({
      title: "",
      content: "",
      category: "",
      publishDate: "",
      caption: "",
    });
    setSelectedImages([]);
  };

  const renderCreateNews = () => (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-lg border-4 border-dotted border-blue-500 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {editingNews ? "न्यूज एडिट करें" : "नई खबर पोस्ट करें"}
          </h2>
          {editingNews && (
            <button
              onClick={cancelEdit}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="space-y-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                खबर का शीर्षक *
              </label>
              <input
                type="text"
                name="title"
                value={newsForm.title}
                onChange={handleInputChange}
                placeholder="यहाँ शीर्षक लिखें..."
                className="w-full px-4 py-3 text-lg border-4 border-dotted border-pink-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                कैटेगरी *
              </label>
              <select
                name="category"
                value={newsForm.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-lg border-4 border-dotted border-pink-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black bg-white"
              >
                <option value="" className="text-gray-500">
                  कैटेगरी चुनें
                </option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat.label} className="text-black">
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Content */}

    {/* Content - Rich Text Editor */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              पूरी खबर *
            </label>
            <RichTextEditor
              value={newsForm.content}
              onChange={(content) => setNewsForm(prev => ({ ...prev, content }))}
              placeholder="यहाँ पूरी खबर लिखें..."
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">
              फोटो अपलोड करें
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer block">
                <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-lg text-gray-600 mb-2 font-medium">
                  फोटो अपलोड करने के लिए क्लिक करें
                </p>
                <p className="text-sm text-gray-500">JPG, PNG, GIF (Max 5MB)</p>
              </label>
            </div>

            {selectedImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Caption and Publish Date */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                फोटो कैप्शन
              </label>
              <input
                type="text"
                name="caption"
                value={newsForm.caption}
                onChange={handleInputChange}
                placeholder="फोटो के लिए कैप्शन लिखें..."
                className="w-full px-4 py-3 text-lg border-4 border-dotted border-pink-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                प्रकाशन तारीख
              </label>
              <input
                type="datetime-local"
                name="publishDate"
                value={newsForm.publishDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 text-lg border-4 border-dotted border-pink-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black bg-white"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={uploading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-12 py-4 rounded-lg font-bold text-lg transition-colors flex items-center space-x-3 disabled:cursor-not-allowed"
            >
              <Send className="w-6 h-6" />
              <span>
                {uploading
                  ? "प्रकाशित हो रहा है..."
                  : editingNews
                  ? "अपडेट करें"
                  : "प्रकाशित करें"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderManageNews = () => (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <h2 className="text-3xl font-bold text-gray-900">न्यूज मैनेजमेंट</h2>
        <button
          onClick={() => setActiveTab("create-news")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          नई न्यूज जोड़ें
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg border-4 border-dotted border-blue-500 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  शीर्षक
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  कैटेगरी
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  प्रकाशन तारीख
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  एक्शन
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {newsList.map((news) => (
                <tr
                  key={news.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-900 max-w-xs truncate">
                      {news.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                    {news.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {news.publishDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleEdit(news)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(news.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    

 <div className="fixed top-0 left-0 w-screen h-screen z-[9999] bg-white overflow-auto p-4"></div>


      {/* Navigation Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-1 bg-gray-200 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("create-news")}
            className={`px-6 py-3 rounded-md font-bold text-base transition-colors ${
              activeTab === "create-news"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {editingNews ? "न्यूज एडिट करें" : "नई न्यूज पोस्ट करें"}
          </button>
          <button
            onClick={() => setActiveTab("manage-news")}
            className={`px-6 py-3 rounded-md font-bold text-base transition-colors ${
              activeTab === "manage-news"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            न्यूज मैनेजमेंट
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === "create-news" && renderCreateNews()}
      {activeTab === "manage-news" && renderManageNews()}
    </div>
  );
}
