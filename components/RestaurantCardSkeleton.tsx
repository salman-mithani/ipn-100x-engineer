'use client';

import React, { memo } from 'react';

/**
 * Skeleton loading component for RestaurantCard
 * Displays animated placeholder while restaurant data is loading
 */
function RestaurantCardSkeleton() {
  return (
    <article
      className="bg-white rounded-lg shadow-md overflow-hidden"
      aria-busy="true"
      aria-label="Loading restaurant"
    >
      {/* Image placeholder */}
      <div className="h-40 bg-gray-200 animate-pulse" />

      <div className="p-4">
        {/* Title and price row */}
        <div className="flex justify-between items-start mb-2">
          <div className="h-6 bg-gray-200 rounded animate-pulse flex-1 mr-2" />
          <div className="h-6 w-8 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Cuisine */}
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />

        {/* Rating */}
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2" />

        {/* Address */}
        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />

        {/* Hours */}
        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mb-2" />

        {/* Description */}
        <div className="space-y-1 mb-4">
          <div className="h-3 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6" />
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <div className="h-10 flex-1 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-12 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </article>
  );
}

export default memo(RestaurantCardSkeleton);
