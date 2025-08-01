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
import { Upload, Send, Trash2, Edit, RefreshCw } from "lucide-react";
import { uploadImage } from "@/lib/imageService";

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
    slug: "",
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [newsList, setNewsList] = useState([]);

  const generateSlug = () => {
    const now = new Date();

    // IST में convert करें
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

  const insertHtmlTag = (tag) => {
    const textarea = document.querySelector('textarea[name="content"]');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    let newText = "";
    if (tag === "bold") {
      newText = selectedText ? `<b>${selectedText}</b>` : "<b></b>";
    } else if (tag === "paragraph") {
      newText = selectedText ? `<p>${selectedText}</p>` : "<p></p>";
    } else if (tag === "break") {
      newText = "<br>";
    }

    const newContent =
      textarea.value.substring(0, start) +
      newText +
      textarea.value.substring(end);

    setNewsForm((prev) => ({
      ...prev,
      content: newContent,
    }));

    // Set cursor position after the inserted tag
    setTimeout(() => {
      const cursorPos =
        tag === "break"
          ? start + newText.length
          : start +
            newText.length -
            (selectedText ? 0 : tag === "bold" ? 4 : 4);
      textarea.focus();
      textarea.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

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
            isExisting: false, // Mark as new upload
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
    if (
      !newsForm.title ||
      !newsForm.content ||
      !newsForm.category ||
      !newsForm.slug
    ) {
      alert("कृपया सभी आवश्यक फील्ड भरें (Slug भी)!");
      return;
    }

    setUploading(true);

    try {
      let uploadedImageUrls = [];

      if (selectedImages.length > 0) {
        console.log("Processing images:", selectedImages);

        const uploadPromises = selectedImages.map((image, index) => {
          console.log(`Processing image ${index}:`, image);

          // Skip upload for existing images
          if (image.isExisting) {
            console.log(`Keeping existing image: ${image.preview}`);
            return Promise.resolve(image.preview);
          }

          // Validate file before upload
          if (!image.file) {
            console.error("File is missing for image:", image);
            return Promise.resolve(null);
          }

          // Upload with error handling
          console.log(`Uploading new image: ${image.name}`);
          return uploadImage(image.file).catch((error) => {
            console.error("Upload failed for image:", image.name, error);
            return null;
          });
        });

        const uploadResults = await Promise.all(uploadPromises);
        uploadedImageUrls = uploadResults.filter((url) => url !== null);

        console.log("Final uploaded URLs:", uploadedImageUrls);
      }

      const newsData = {
        title: newsForm.title,
        slug: newsForm.slug,
        content: newsForm.content,
        category: newsForm.category,
        caption: newsForm.caption,
        publishDate:
          newsForm.publishDate || new Date().toISOString().split("T")[0],
        status: "published",
        // IST में current time
        created_at: (() => {
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
        slug: "",
      });
      setSelectedImages([]);
      setEditingNews(null);
      setActiveTab("manage-news");

      // Fresh data fetch करें
      fetchNewsFromFirestore();
    } catch (error) {
      console.error("Submit error:", error);
      alert("न्यूज पोस्ट करने में एरर आई: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (news) => {
    console.log("🔧 Edit button clicked for news:", news);

    setNewsForm({
      title: news.title,
      content: news.content,
      category: news.category,
      publishDate: news.publishDate,
      caption: news.caption || "",
      slug: news.slug || "",
    });

    // Fix existing images structure with proper validation
    const existingImages =
      news.images && Array.isArray(news.images)
        ? news.images
            .map((imageUrl, index) => {
              if (!imageUrl) {
                console.warn(`Empty image URL at index ${index}`);
                return null;
              }
              return {
                file: null,
                preview: imageUrl,
                name: `existing_image_${index}`,
                isExisting: true,
              };
            })
            .filter(Boolean) // Remove null entries
        : [];

    console.log("📝 Setting existing images:", existingImages);
    setSelectedImages(existingImages);
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

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              पूरी खबर *
            </label>

            {/* HTML Formatting Buttons */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => insertHtmlTag("bold")}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm font-bold transition-colors"
                title="Bold text के लिए"
              >
                <b>B</b>
              </button>
              <button
                type="button"
                onClick={() => insertHtmlTag("paragraph")}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                title="Paragraph के लिए"
              >
                P
              </button>
              <button
                type="button"
                onClick={() => insertHtmlTag("break")}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                title="Line break के लिए"
              >
                BR
              </button>
            </div>

            <textarea
              name="content"
              value={newsForm.content}
              onChange={handleInputChange}
              placeholder="यहाँ पूरी खबर लिखें..."
              rows="10"
              style={{
                backgroundColor: "white",
                color: "black",
              }}
              className="w-full px-4 py-3 text-lg border-4 border-dotted border-pink-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black bg-white"
            />
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700 font-medium mb-2">
                HTML Formatting Guide:
              </p>
              <div className="text-xs text-blue-600 space-y-1">
                <p>
                  <code className="bg-blue-100 px-1 rounded">
                    &lt;b&gt;Bold Text&lt;/b&gt;
                  </code>{" "}
                  - Bold के लिए
                </p>
                <p>
                  <code className="bg-blue-100 px-1 rounded">
                    &lt;p&gt;Paragraph&lt;/p&gt;
                  </code>{" "}
                  - नया paragraph के लिए
                </p>
                <p>
                  <code className="bg-blue-100 px-1 rounded">&lt;br&gt;</code> -
                  Line break के लिए
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Tip: Text select करके buttons दबाएं या empty tags के बीच type
                  करें
                </p>
              </div>
            </div>
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
                    {image.isExisting && (
                      <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                        मौजूदा
                      </div>
                    )}
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
      {activeTab === "manage-news" && renderManageNews()}
    </div>
  );
}
