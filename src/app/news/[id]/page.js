"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/utils/api";

export default function NewsDetail({ params }) {
  const { id } = use(params);

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadArticle() {
      try {
        const data = await api.getNewsById(id);

        if (data) {
          setArticle(data);
        } else {
          setError("Article not found");
        }
      } catch (err) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [id]);


  if (loading) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl">Loading...</h2>
      </div>
    );
  }


  if (error || !article) {
    return (
      <div className="p-10">
        <div className="bg-red-100 p-5 rounded">
          <h2 className="text-xl font-bold text-red-600">
            Error
          </h2>

          <p className="mt-2">
            {error}
          </p>

          <Link 
            href="/"
            className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }


  return (
    <div className="max-w-4xl mx-auto p-5">

      <Link 
        href="/"
        className="text-blue-600 hover:underline"
      >
        ← Back
      </Link>


      <div className="mt-5 bg-white shadow rounded p-6">

        {/* Categories */}
        <div className="flex gap-2 mb-4">
          {
            article.categories?.map((cat)=>(
              <span
                key={cat.id}
                className="bg-black text-white px-3 py-1 rounded text-sm"
              >
                {cat.name}
              </span>
            ))
          }
        </div>


        {/* Title */}
        <h1 className="text-3xl font-bold mb-3">
          {article.title}
        </h1>


        {/* Description */}
        <p className="text-gray-600 mb-5">
          {article.description}
        </p>


        {/* Content */}
        <div className="text-gray-800 leading-7">
          {article.content}
        </div>


      </div>

    </div>
  );
}