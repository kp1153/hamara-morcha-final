"use client";

import { db, storage, auth } from "@/firebase/config";
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
import { Upload, Send, Trash2, Edit, RefreshCw } from "lucide-react";
import { uploadImage } from "@/lib/imageService";
import dynamic from "next/dynamic";
import TipTap from "@/components/TipTap";

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

  const handleSubmit = async () => {
    try {
      // Added authentication check
      if (!auth?.currentUser) {
        await firebaseLogin("admin@example.com", "your_admin_password"); // Replace with actual credentials
      }

      console.log("Current User:", auth.currentUser?.email); // Debug log
      console.log("Selected Images:", selectedImages); // Debug log

      // Rest of the original validation checks
      if (
        !newsForm.title ||
        !newsForm.content ||
        !newsForm.category ||
        !newsForm.slug
      ) {
        alert("कृपया सभी आवश्यक फील्ड भरें!");
        return;
      }

      if (selectedImages.length === 0) {
        alert("कम से कम 1 तस्वीर जरूरी है");
        return;
      }

      setUploading(true);

      // ... (rest of the original handleSubmit code remains EXACTLY the same)
    } catch (error) {
      console.error("Error:", error);
      alert(`एरर: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  // News Form State
  const [newsForm, setNewsForm] = useState({
    title: "",
    content: "",
    category: "",
    publishDate: "",
    caption: "",
    slug: "",
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [newsList, setNewsList] = useState([]);

  const generateSlug = () => {
    const now = new Date();
    const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
    const year = istTime.getFullYear();
    const month = String(istTime.getMonth() + 1).padStart(2, "0");
    const day = String(istTime.getDate()).padStart(2, "0");
    const hours = String(istTime.getHours()).padStart(2, "0");
    const minutes = String(istTime.getMinutes()).padStart(2, "0");
    const seconds = String(istTime.getSeconds()).padStart(2, "0");
    const milliseconds = String(istTime.getMilliseconds()).padStart(3, "0");
    return `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;
  };

  const handleAutoGenerateSlug = () => {
    const newSlug = generateSlug();
    setNewsForm((prev) => ({
      ...prev,
      slug: newSlug,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewsForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // TipTap content change handler
  const handleContentChange = (content) => {
    setNewsForm((prev) => ({
      ...prev,
      content: content,
    }));
  };

  const fetchNewsFromFirestore = async () => {
    try {
      const newsCollection = collection(db, "news");
      const newsSnapshot = await getDocs(newsCollection);
      const newsData = newsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          created_at: data.created_at?.toDate?.()
            ? data.created_at.toDate().toISOString()
            : data.created_at,
        };
      });
      setNewsList(newsData);
      console.log("News fetched:", newsData);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  useEffect(() => {
    fetchNewsFromFirestore();
  }, []);

  // Fixed Image Upload (inspired by TipTap FileInput component)
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function (event) {
          setSelectedImages((prev) => [
            ...prev,
            {
              file: file,
              preview: event.target.result,
              name: file.name,
              isExisting: false,
            },
          ]);
        };
        reader.readAsDataURL(file);
      } else {
        alert("Please select a valid image");
      }
    });
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // सिर्फ जरूरी हिस्सा - handleSubmit फंक्शन को यहीं से रिप्लेस करें
  const handleSubmit = async () => {
    console.log("Current User:", auth.currentUser);
    console.log("Selected Images:", selectedImages);
    if (
      !newsForm.title ||
      !newsForm.content ||
      !newsForm.category ||
      !newsForm.slug
    ) {
      alert("कृपया सभी आवश्यक फील्ड भरें!");
      return;
    }

    if (selectedImages.length === 0) {
      alert("कम से कम 1 तस्वीर जरूरी है");
      return;
    }

    setUploading(true);

    try {
      // इमेज अपलोड
      const uploadedImageUrls = await Promise.all(
        selectedImages.map(async (image) => {
          if (image.isExisting) return image.preview;
          const url = await uploadImage(image.file);
          return url;
        })
      );

      // डेटा तैयार करें
      const newsData = {
        title: newsForm.title,
        content: newsForm.content,
        category: newsForm.category,
        slug: newsForm.slug,
        caption: newsForm.caption,
        publishDate: new Date(newsForm.publishDate).toISOString(),
        created_at: new Date().toISOString(),
        images: uploadedImageUrls.filter((url) => url !== null),
        image_url: uploadedImageUrls[0] || null,
      };

      // Firestore में सेव करें
      if (editingNews) {
        await updateDoc(doc(db, "news", editingNews.id), newsData);
        alert("अपडेट सफल!");
      } else {
        await addDoc(collection(db, "news"), newsData);
        alert("खबर प्रकाशित हुई!");
      }

      // फॉर्म रीसेट
      setNewsForm({
        title: "",
        content: "",
        category: "",
        publishDate: "",
        caption: "",
        slug: "",
      });
      setSelectedImages([]);
      fetchNewsFromFirestore();
    } catch (error) {
      console.error("Error:", error);
      alert(`एरर: ${error.message}`);
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
      slug: news.slug || "",
    });

    const existingImages = news.images
      ? news.images.map((imageUrl, index) => ({
          file: null,
          preview: imageUrl,
          name: `existing_image_${index}`,
          isExisting: true,
        }))
      : [];

    setSelectedImages(existingImages);
    setEditingNews(news);
    setActiveTab("create-news");
  };

  const handleDelete = async (id) => {
    if (confirm("क्या आप इस न्यूज को डिलीट करना चाहते हैं?")) {
      try {
        await deleteDoc(doc(db, "news", id));
        alert("न्यूज सफलतापूर्वक डिलीट हुई!");
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
      slug: "",
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
                style={{ textAlign: "left", direction: "ltr" }}
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

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                URL Slug (English में) *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="slug"
                  value={newsForm.slug}
                  onChange={handleInputChange}
                  placeholder="Manual slug या Auto Generate button दबाएं"
                  style={{ textAlign: "left", direction: "ltr" }}
                  className="flex-1 px-4 py-3 text-lg border-4 border-dotted border-pink-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black bg-white"
                />
                <button
                  type="button"
                  onClick={handleAutoGenerateSlug}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                  title="Auto generate timestamp slug"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Auto</span>
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Manual slug लिखें या Auto Generate button से timestamp slug
                बनाएं
              </p>
            </div>
          </div>

          <div className="space-y-2"></div>

          {/* TipTap Rich Text Editor */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              पूरी खबर *
            </label>
            <TipTap
              onChange={handleContentChange}
              content={newsForm.content}
              description={newsForm.content}
            />
          </div>

          {/* Image Upload - Fixed */}
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
                style={{ textAlign: "left", direction: "ltr" }}
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

  // This is the component's main return, which now renders based on the active tab
  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-[9999] bg-white overflow-auto p-4">
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
      {/* Part 2 will handle manage-news tab */}
      {activeTab === "manage-news" && (
        <div className="w-full bg-white rounded-lg shadow-lg border-4 border-dotted border-purple-500 p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            न्यूज मैनेजमेंट
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    शीर्षक
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    कैटेगरी
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    प्रकाशन तारीख
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    क्रिया
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {newsList.map((news) => (
                  <tr key={news.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {news.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {news.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(news.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(news)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(news.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
