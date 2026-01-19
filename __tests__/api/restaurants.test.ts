/**
 * Unit tests for the Restaurants API logic
 * Tests the core business logic without requiring Next.js server components
 */

import { calculateDistance, mockGeocode, DEFAULT_COORDINATES } from '@/utils/distance';
import restaurantData from '@/data/restaurants.json';
import { Restaurant } from '@/types/restaurant';

const RESULTS_LIMIT = 5;

// Helper function that mirrors the API logic
function getRestaurantsByLocation(
  userLat: number,
  userLng: number,
  limit: number = RESULTS_LIMIT
) {
  const restaurantsWithDistance = restaurantData.restaurants.map((restaurant: Restaurant) => ({
    ...restaurant,
    distance: calculateDistance(
      userLat,
      userLng,
      restaurant.latitude,
      restaurant.longitude
    ),
  }));

  return restaurantsWithDistance
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}

// Helper function for filtering (mirrors POST logic)
function getRestaurantsWithFilters(
  latitude: number,
  longitude: number,
  filters?: {
    cuisine?: string;
    minRating?: number;
    priceRange?: string;
  }
) {
  let restaurants = restaurantData.restaurants as Restaurant[];

  if (filters) {
    if (filters.cuisine) {
      restaurants = restaurants.filter(
        (r) => r.cuisine.toLowerCase() === filters.cuisine!.toLowerCase()
      );
    }
    if (filters.minRating) {
      restaurants = restaurants.filter((r) => r.rating >= filters.minRating!);
    }
    if (filters.priceRange) {
      restaurants = restaurants.filter((r) => r.priceRange === filters.priceRange);
    }
  }

  const restaurantsWithDistance = restaurants.map((restaurant) => ({
    ...restaurant,
    distance: calculateDistance(
      latitude,
      longitude,
      restaurant.latitude,
      restaurant.longitude
    ),
  }));

  return restaurantsWithDistance
    .sort((a, b) => a.distance - b.distance)
    .slice(0, RESULTS_LIMIT);
}

describe('Restaurants API Logic', () => {
  describe('GET /api/restaurants behavior', () => {
    it('should return restaurants for a valid address', () => {
      const coords = mockGeocode('Houston');
      const restaurants = getRestaurantsByLocation(coords!.latitude, coords!.longitude);

      expect(restaurants).toBeDefined();
      expect(Array.isArray(restaurants)).toBe(true);
      expect(restaurants.length).toBeGreaterThan(0);
    });

    it('should return restaurants for valid coordinates', () => {
      const restaurants = getRestaurantsByLocation(29.7604, -95.3698);

      expect(restaurants).toBeDefined();
      expect(Array.isArray(restaurants)).toBe(true);
      expect(restaurants.length).toBeGreaterThan(0);
    });

    it('should use default coordinates when no location provided', () => {
      const restaurants = getRestaurantsByLocation(
        DEFAULT_COORDINATES.latitude,
        DEFAULT_COORDINATES.longitude
      );

      expect(restaurants).toBeDefined();
      expect(restaurants.length).toBeGreaterThan(0);
    });

    it('should limit results to 5 restaurants', () => {
      const restaurants = getRestaurantsByLocation(29.7604, -95.3698);

      expect(restaurants.length).toBeLessThanOrEqual(5);
    });

    it('should sort results by distance', () => {
      const restaurants = getRestaurantsByLocation(29.7604, -95.3698);

      const distances = restaurants.map((r) => r.distance);
      const sortedDistances = [...distances].sort((a, b) => a - b);

      expect(distances).toEqual(sortedDistances);
    });

    it('should include distance in response', () => {
      const restaurants = getRestaurantsByLocation(29.7604, -95.3698);

      restaurants.forEach((restaurant) => {
        expect(typeof restaurant.distance).toBe('number');
        expect(restaurant.distance).toBeGreaterThanOrEqual(0);
      });
    });

    it('should return different results for different locations', () => {
      const houstonRestaurants = getRestaurantsByLocation(29.7604, -95.3698);
      const galleriaRestaurants = getRestaurantsByLocation(29.7389, -95.4619);

      // While the same restaurants may be returned, the distances should differ
      const houstonFirstDistance = houstonRestaurants[0].distance;
      const galleriaFirstDistance = galleriaRestaurants[0].distance;

      // At least one distance should be different
      expect(houstonFirstDistance).not.toBe(galleriaFirstDistance);
    });
  });

  describe('POST /api/restaurants behavior (filtering)', () => {
    it('should return restaurants for valid coordinates', () => {
      const restaurants = getRestaurantsWithFilters(29.7604, -95.3698);

      expect(restaurants).toBeDefined();
      expect(Array.isArray(restaurants)).toBe(true);
      expect(restaurants.length).toBeGreaterThan(0);
    });

    it('should filter by cuisine', () => {
      const restaurants = getRestaurantsWithFilters(29.7604, -95.3698, {
        cuisine: 'Modern South Indian',
      });

      expect(restaurants.length).toBeGreaterThan(0);
      restaurants.forEach((restaurant) => {
        expect(restaurant.cuisine.toLowerCase()).toBe('modern south indian');
      });
    });

    it('should filter by minimum rating', () => {
      const restaurants = getRestaurantsWithFilters(29.7604, -95.3698, {
        minRating: 4.3,
      });

      restaurants.forEach((restaurant) => {
        expect(restaurant.rating).toBeGreaterThanOrEqual(4.3);
      });
    });

    it('should filter by price range', () => {
      const restaurants = getRestaurantsWithFilters(29.7604, -95.3698, {
        priceRange: '$',
      });

      restaurants.forEach((restaurant) => {
        expect(restaurant.priceRange).toBe('$');
      });
    });

    it('should combine multiple filters', () => {
      const restaurants = getRestaurantsWithFilters(29.7604, -95.3698, {
        minRating: 4.0,
        priceRange: '$$',
      });

      restaurants.forEach((restaurant) => {
        expect(restaurant.rating).toBeGreaterThanOrEqual(4.0);
        expect(restaurant.priceRange).toBe('$$');
      });
    });

    it('should limit results to 5 restaurants', () => {
      const restaurants = getRestaurantsWithFilters(29.7604, -95.3698);

      expect(restaurants.length).toBeLessThanOrEqual(5);
    });

    it('should return empty array when no restaurants match filters', () => {
      const restaurants = getRestaurantsWithFilters(29.7604, -95.3698, {
        cuisine: 'NonExistentCuisine',
      });

      expect(restaurants).toEqual([]);
    });
  });

  describe('Geocoding integration', () => {
    it('should geocode Houston correctly', () => {
      const coords = mockGeocode('Houston');
      expect(coords).toEqual({
        latitude: 29.7604,
        longitude: -95.3698,
      });
    });

    it('should geocode zip codes correctly', () => {
      const coords = mockGeocode('77036');
      expect(coords).toEqual({
        latitude: 29.7119,
        longitude: -95.5136,
      });
    });

    it('should geocode neighborhoods correctly', () => {
      const coords = mockGeocode('Galleria');
      expect(coords).toEqual({
        latitude: 29.7389,
        longitude: -95.4619,
      });
    });

    it('should fall back to default for unknown locations', () => {
      const coords = mockGeocode('Unknown Location XYZ');
      expect(coords).toEqual(DEFAULT_COORDINATES);
    });
  });
});
