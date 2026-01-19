'use client';

import Link from 'next/link';
import { useBlogs } from '@/hooks';
import BlogCardSkeleton from '@/components/BlogCardSkeleton';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function BlogPage() {
  const { blogs, loading, error } = useBlogs();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📝 Restaurant Blog</h1>
              <p className="mt-1 text-sm text-gray-500">
                Discover stories and insights about our featured restaurants
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
            >
              ← Back to Search
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {loading && (
          <div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            role="status"
            aria-label="Loading blog posts"
          >
            {[...Array(6)].map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        )}

        {error && (
          <div
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
            role="alert"
          >
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && blogs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500 text-lg">
              No blog posts yet. Check back soon!
            </p>
          </div>
        )}

        {!loading && !error && blogs.length > 0 && (
          <ErrorBoundary>
            <div
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              role="feed"
              aria-label="Blog posts"
            >
              {blogs.map((blog) => (
                <article key={blog.id} aria-labelledby={`blog-title-${blog.id}`}>
                  <Link
                    href={`/blog/${blog.id}`}
                    className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    aria-label={`Read ${blog.title} - ${blog.restaurantName}`}
                  >
                    <div className="p-6">
                      <div className="text-sm text-red-600 font-medium mb-2">
                        {blog.restaurantName}
                      </div>
                      <h2
                        id={`blog-title-${blog.id}`}
                        className="text-xl font-bold text-gray-900 mb-2 line-clamp-2"
                      >
                        {blog.title}
                      </h2>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {blog.content.substring(0, 150)}...
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          <span className="sr-only">Author: </span>
                          {blog.author}
                        </span>
                        <time dateTime={blog.publishDate}>
                          <span className="sr-only">Published: </span>
                          {new Date(blog.publishDate).toLocaleDateString()}
                        </time>
                      </div>
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2" aria-label="Tags">
                          {blog.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </ErrorBoundary>
        )}
      </div>
    </main>
  );
}
