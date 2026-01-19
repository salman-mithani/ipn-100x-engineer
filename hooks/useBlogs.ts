'use client';

import { useState, useEffect, useCallback } from 'react';
import { BlogPost } from '@/types/blog';

interface UseBlogsResult {
  blogs: BlogPost[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseBlogResult {
  blog: BlogPost | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching all blog posts
 * Automatically fetches on mount
 */
export function useBlogs(): UseBlogsResult {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/blogs');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch blogs');
      }

      setBlogs(data.blogs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return {
    blogs,
    loading,
    error,
    refetch: fetchBlogs,
  };
}

/**
 * Custom hook for fetching a single blog post by ID
 * @param id - The blog post ID to fetch
 */
export function useBlog(id: string | null): UseBlogResult {
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlog = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/blogs/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Blog post not found');
      }

      setBlog(data.blog);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setBlog(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  return {
    blog,
    loading,
    error,
    refetch: fetchBlog,
  };
}
