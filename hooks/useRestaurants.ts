'use client';

import { useState, useCallback } from 'react';
import { Restaurant } from '@/types/restaurant';

interface UseRestaurantsResult {
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  searchByLocation: (location: string) => Promise<void>;
  searchByCoordinates: (lat: number, lng: number) => Promise<void>;
  reset: () => void;
}

/**
 * Custom hook for fetching and managing restaurant data
 * Provides search by location or coordinates with loading and error states
 */
export function useRestaurants(): UseRestaurantsResult {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const searchByLocation = useCallback(async (location: string) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await fetch(
        `/api/restaurants?address=${encodeURIComponent(location)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch restaurants');
      }

      setRestaurants(data.restaurants);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchByCoordinates = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/restaurants?lat=${lat}&lng=${lng}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch restaurants');
      }

      setRestaurants(data.restaurants);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setRestaurants([]);
    setLoading(false);
    setError(null);
    setHasSearched(false);
  }, []);

  return {
    restaurants,
    loading,
    error,
    hasSearched,
    searchByLocation,
    searchByCoordinates,
    reset,
  };
}
