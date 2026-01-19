'use client';

import React, { memo } from 'react';

/**
 * Skeleton loading component for blog cards
 * Displays animated placeholder while blog data is loading
 */
function BlogCardSkeleton() {
  return (
    <article
      className="bg-white rounded-lg shadow-md overflow-hidden"
      aria-busy="true"
      aria-label="Loading blog post"
    >
      <div className="p-6">
        {/* Restaurant name */}
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2" />

        {/* Title */}
        <div className="space-y-2 mb-4">
          <div className="h-6 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Content preview */}
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-4/5 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Author and date */}
        <div className="flex justify-between mb-3">
          <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Tags */}
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-14 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </article>
  );
}

export default memo(BlogCardSkeleton);
