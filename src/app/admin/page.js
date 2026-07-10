"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("news");
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  const [news, setNews] = useState([]);
  const [newsTitle, setNewsTitle] = useState("");
  const [newsDescription, setNewsDescription] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [editingNews, setEditingNews] = useState(null);

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [newsData, categoriesData] = await Promise.all([
          api.getAllNews(),
          api.getAllCategories(),
        ]);
        setNews(newsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error(err);
        showFeedback("Failed to load backend data.", "error");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const showFeedback = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      if (editingCategory) {
        const payload = { ...editingCategory, name: categoryName };
        const res = await api.updateCategory(payload);
        if (res.code === 200) {
          showFeedback("Category updated!", "success");
          setCategories(categories.map((c) => (c.id === editingCategory.id ? payload : c)));
          setEditingCategory(null);
        } else {
          showFeedback(res.message, "error");
        }
      } else {
        const payload = { name: categoryName };
        const res = await api.saveCategory(payload);
        if (res.code === 201) {
          showFeedback("Category created!", "success");
          const updated = await api.getAllCategories();
          setCategories(updated);
        } else {
          showFeedback(res.message || "Failed to create", "error");
        }
      }
      setCategoryName("");
    } catch (err) {
      console.error(err);
      showFeedback("Error saving category.", "error");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("Delete category?")) return;
    try {
      const res = await api.deleteCategory(id);
      if (res.code === 200) {
        showFeedback("Category deleted!", "success");
        setCategories(categories.filter((c) => c.id !== id));
      } else {
        showFeedback(res.message, "error");
      }
    } catch (err) {
      console.error(err);
      showFeedback("Error deleting.", "error");
    }
  };

  const handleCategoryCheckboxChange = (id) => {
    if (selectedCategoryIds.includes(id)) {
      setSelectedCategoryIds(selectedCategoryIds.filter((x) => x !== id));
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, id]);
    }
  };

  const handleSaveNews = async (e) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsDescription.trim() || !newsContent.trim()) {
      showFeedback("Please fill out all fields.", "error");
      return;
    }

    const assignedCategories = categories.filter((c) => selectedCategoryIds.includes(c.id));

    try {
      if (editingNews) {
        const payload = {
          ...editingNews,
          title: newsTitle,
          description: newsDescription,
          content: newsContent,
          categories: assignedCategories,
        };
        const res = await api.updateNews(payload);
        if (res.code === 200) {
          showFeedback("Article updated!", "success");
          setNews(news.map((n) => (n.id === editingNews.id ? payload : n)));
          clearNewsForm();
        } else {
          showFeedback(res.message, "error");
        }
      } else {
        const payload = {
          title: newsTitle,
          description: newsDescription,
          content: newsContent,
          categories: assignedCategories,
        };
        const res = await api.saveNews(payload);
        if (res.code === 201) {
          showFeedback("Article created!", "success");
          const updated = await api.getAllNews();
          setNews(updated);
          clearNewsForm();
        } else {
          showFeedback(res.message || "Failed to save", "error");
        }
      }
    } catch (err) {
      console.error(err);
      showFeedback("Error saving news.", "error");
    }
  };

  const handleEditNewsClick = (article) => {
    setEditingNews(article);
    setNewsTitle(article.title);
    setNewsDescription(article.description);
    setNewsContent(article.content);
    setSelectedCategoryIds(article.categories.map((c) => c.id));
  };

  const handleDeleteNews = async (id) => {
    if (!confirm("Delete article?")) return;
    try {
      const res = await api.deleteNews(id);
      if (res.code === 200) {
        showFeedback("Article deleted!", "success");
        setNews(news.filter((n) => n.id !== id));
      } else {
        showFeedback(res.message, "error");
      }
    } catch (err) {
      console.error(err);
      showFeedback("Error deleting news.", "error");
    }
  };

  const clearNewsForm = () => {
    setEditingNews(null);
    setNewsTitle("");
    setNewsDescription("");
    setNewsContent("");
    setSelectedCategoryIds([]);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">ADMIN CONTROL</h1>
        <p className="text-gray-600">Manage news publications and taxonomy</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.type === "success" 
            ? "bg-green-100 text-green-800 border border-green-300"
            : "bg-red-100 text-red-800 border border-red-300"
        }`}>
          {message.text}
        </div>
      )}

      <div className="flex gap-4 mb-6 border-b-2 border-gray-900">
        <button
          className={`px-4 py-2 font-semibold transition ${
            activeTab === "news"
              ? "text-gray-900 border-b-2 border-gray-900 mb-[-2px]"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("news")}
        >
          Manage News
        </button>
        <button
          className={`px-4 py-2 font-semibold transition ${
            activeTab === "categories"
              ? "text-gray-900 border-b-2 border-gray-900 mb-[-2px]"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("categories")}
        >
          Manage Categories
        </button>
      </div>

      {activeTab === "categories" ? (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Categories Editor</h2>
          <form onSubmit={handleSaveCategory} className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Category Name</label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div className="flex gap-3">
              <button 
                type="submit" 
                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition font-semibold"
              >
                {editingCategory ? "Update Category" : "Add Category"}
              </button>
              {editingCategory && (
                <button 
                  type="button" 
                  className="bg-gray-300 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
                  onClick={() => { setEditingCategory(null); setCategoryName(""); }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="overflow-x-auto border border-gray-300 rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Category Name</th>
                  <th className="px-6 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-3">{cat.name}</td>
                    <td className="px-6 py-3">
                      <button 
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                        onClick={() => { setEditingCategory(cat); setCategoryName(cat.name); }}
                      >
                        Edit
                      </button>
                      {" | "}
                      <button 
                        className="text-red-600 hover:text-red-800 font-semibold"
                        onClick={() => handleDeleteCategory(cat.id)}
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
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">News Editor</h2>
          <form onSubmit={handleSaveNews} className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Article Title</label>
              <input
                type="text"
                value={newsTitle}
                onChange={(e) => setNewsTitle(e.target.value)}
                placeholder="Enter title..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Short Description</label>
              <input
                type="text"
                value={newsDescription}
                onChange={(e) => setNewsDescription(e.target.value)}
                placeholder="Brief summary..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Content Body</label>
              <textarea
                rows={6}
                value={newsContent}
                onChange={(e) => setNewsContent(e.target.value)}
                placeholder="Full news text..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">Select Categories</label>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategoryIds.includes(cat.id)}
                      onChange={() => handleCategoryCheckboxChange(cat.id)}
                      className="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900"
                    />
                    <span className="text-gray-700">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                type="submit" 
                className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition font-semibold"
              >
                {editingNews ? "Update Article" : "Publish Article"}
              </button>
              {editingNews && (
                <button 
                  type="button" 
                  className="bg-gray-300 text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-400 transition font-semibold"
                  onClick={clearNewsForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="overflow-x-auto border border-gray-300 rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Title</th>
                  <th className="px-6 py-3 text-left font-semibold">Categories</th>
                  <th className="px-6 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {news.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-3 font-semibold">{item.title}</td>
                    <td className="px-6 py-3 text-gray-700">{item.categories.map((c) => c.name).join(", ") || "(None)"}</td>
                    <td className="px-6 py-3">
                      <button 
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                        onClick={() => handleEditNewsClick(item)}
                      >
                        Edit
                      </button>
                      {" | "}
                      <button 
                        className="text-red-600 hover:text-red-800 font-semibold"
                        onClick={() => handleDeleteNews(item.id)}
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
    </div>
  );
}
