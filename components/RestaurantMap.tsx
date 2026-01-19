'use client';

import React, { memo } from 'react';
import { Restaurant } from '@/types/restaurant';

// Extended type that includes optional distance property from API response
type RestaurantWithDistance = Restaurant & { distance?: number };

interface RestaurantMapProps {
  restaurants: RestaurantWithDistance[];
  center?: { lat: number; lng: number };
}

/**
 * Simple map component showing restaurant locations
 * Uses OpenStreetMap embed as a lightweight solution (no API key required)
 */
function RestaurantMap({ restaurants, center }: RestaurantMapProps) {
  if (restaurants.length === 0) {
    return null;
  }

  // Calculate center from restaurants if not provided
  const mapCenter = center || {
    lat: restaurants.reduce((sum, r) => sum + r.latitude, 0) / restaurants.length,
    lng: restaurants.reduce((sum, r) => sum + r.longitude, 0) / restaurants.length,
  };

  // Create OpenStreetMap embed URL with markers
  const bbox = calculateBoundingBox(restaurants);
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox.minLng}%2C${bbox.minLat}%2C${bbox.maxLng}%2C${bbox.maxLat}&layer=mapnik&marker=${mapCenter.lat}%2C${mapCenter.lng}`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Restaurant Locations</h3>
        <p className="text-sm text-gray-500">
          Showing {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} on the map
        </p>
      </div>

      <div className="relative">
        <iframe
          title="Restaurant locations map"
          src={osmUrl}
          className="w-full h-64 md:h-80 border-0"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Restaurant list overlay */}
        <div className="absolute top-2 right-2 bg-white rounded-lg shadow-lg max-h-48 overflow-y-auto w-48 hidden md:block">
          <ul className="divide-y divide-gray-100">
            {restaurants.slice(0, 5).map((restaurant, index) => (
              <li key={restaurant.id} className="p-2 hover:bg-gray-50">
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center font-medium">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {restaurant.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {restaurant.distance ? `${restaurant.distance.toFixed(1)} km` : restaurant.cuisine}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile-friendly list */}
      <div className="md:hidden p-4 border-t">
        <ul className="space-y-2">
          {restaurants.slice(0, 5).map((restaurant, index) => (
            <li key={restaurant.id} className="flex items-center gap-2">
              <span className="flex-shrink-0 w-6 h-6 bg-red-500 text-white rounded-full text-sm flex items-center justify-center font-medium">
                {index + 1}
              </span>
              <span className="text-sm text-gray-900 truncate">{restaurant.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Calculate bounding box for a set of restaurants
 */
function calculateBoundingBox(restaurants: Restaurant[]) {
  const lats = restaurants.map(r => r.latitude);
  const lngs = restaurants.map(r => r.longitude);

  const padding = 0.02; // Add some padding around markers

  return {
    minLat: Math.min(...lats) - padding,
    maxLat: Math.max(...lats) + padding,
    minLng: Math.min(...lngs) - padding,
    maxLng: Math.max(...lngs) + padding,
  };
}

export default memo(RestaurantMap);
