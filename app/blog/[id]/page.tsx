'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BlogPost } from '@/types/blog';

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blogs/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setBlog(data.blog);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-red-600 hover:text-red-700 mb-4"
          >
            ← Back to Blog
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            <span className="ml-3 text-gray-600">Loading blog post...</span>
          </div>
        )}

        {!loading && !blog && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😕</div>
            <p className="text-gray-500 text-lg">Blog post not found</p>
          </div>
        )}

        {!loading && blog && (
          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              {/* Restaurant Badge */}
              <div className="inline-block px-4 py-2 bg-red-50 text-red-700 rounded-full text-sm font-medium mb-4">
                {blog.restaurantName}
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {blog.title}
              </h1>

              {/* Meta */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b">
                <span className="flex items-center gap-2">
                  <span className="font-medium">By {blog.author}</span>
                </span>
                <span>•</span>
                <span>{new Date(blog.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {blog.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                {blog.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-gray-700 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </article>
        )}
      </div>
    </main>
  );
}
