"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/utils/api";

export default function Home() {
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError("Could not load content from the backend.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredNews = news.filter((article) => {
    const matchesCategory =
      selectedCategory === "All" ||
      article.categories.some((cat) => cat.name.toLowerCase() === selectedCategory.toLowerCase());

    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading latest stories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
        <h2 className="text-lg font-bold text-red-900 mb-2">Backend Connection Error</h2>
        <p className="text-red-700 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">News Articles</h1>
        <p className="text-gray-600">Latest news and updates</p>
      </div>

      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded transition ${
              selectedCategory === "All"
                ? "bg-gray-900 text-white"
                : "bg-gray-200 text-gray-900 hover:bg-gray-300"
            }`}
            onClick={() => setSelectedCategory("All")}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`px-4 py-2 rounded transition ${
                selectedCategory === cat.name
                  ? "bg-gray-900 text-white"
                  : "bg-gray-200 text-gray-900 hover:bg-gray-300"
              }`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t-2 border-gray-900 pt-6">
        {filteredNews.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">Adjust your filters or search query.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredNews.map((article) => (
              <div key={article.id} className="pb-6 border-b border-gray-300 last:border-b-0">
                <div className="flex gap-2 mb-2">
                  {article.categories.map((cat) => (
                    <span 
                      key={cat.id} 
                      className="text-xs font-bold bg-gray-900 text-white px-2 py-1"
                    >
                      {cat.name.toUpperCase()}
                    </span>
                  ))}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-gray-700">
                  <Link href={`/news/${article.id}`}>
                    {article.title}
                  </Link>
                </h2>
                <p className="text-gray-700 mb-3">{article.description}</p>
                <Link href={`/news/${article.id}`} className="text-blue-600 hover:text-blue-800 font-semibold">
                  Read Full Story →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
