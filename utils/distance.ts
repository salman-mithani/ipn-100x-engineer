/**
 * Distance calculation utilities
 * Uses the Haversine formula to calculate distance between two points
 */

// Earth's radius in kilometers
const EARTH_RADIUS_KM = 6371;

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

/**
 * Format distance for display
 * @param distanceKm Distance in kilometers
 * @returns Formatted distance string
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

// Default coordinates for Houston (used when no location is provided)
export const DEFAULT_COORDINATES = {
  latitude: 29.7604,
  longitude: -95.3698,
};

/**
 * Simple geocoding mock - in production, use a real geocoding API
 * This provides approximate coordinates for common search terms
 */
export function mockGeocode(address: string): { latitude: number; longitude: number } | null {
  const addressLower = address.toLowerCase();

  // Simple keyword matching for demo purposes
  const locationMap: Record<string, { latitude: number; longitude: number }> = {
    // Houston locations
    'houston': { latitude: 29.7604, longitude: -95.3698 },
    'downtown houston': { latitude: 29.7604, longitude: -95.3698 },
    'hillcroft': { latitude: 29.7220, longitude: -95.4997 },
    'bellaire': { latitude: 29.7058, longitude: -95.4588 },
    'westheimer': { latitude: 29.7406, longitude: -95.4571 },
    'kirby': { latitude: 29.7322, longitude: -95.4210 },
    'rice village': { latitude: 29.7163, longitude: -95.4148 },
    'montrose': { latitude: 29.7448, longitude: -95.3902 },
    'galleria': { latitude: 29.7380, longitude: -95.4633 },
    'memorial': { latitude: 29.7759, longitude: -95.4960 },
    'heights': { latitude: 29.7946, longitude: -95.3986 },
    'midtown': { latitude: 29.7439, longitude: -95.3808 },
    // Houston zip codes
    '77002': { latitude: 29.7565, longitude: -95.3596 },
    '77006': { latitude: 29.7420, longitude: -95.3933 },
    '77027': { latitude: 29.7350, longitude: -95.4376 },
    '77036': { latitude: 29.6997, longitude: -95.5366 },
    '77057': { latitude: 29.7450, longitude: -95.4759 },
    '77063': { latitude: 29.7340, longitude: -95.5000 },
    '77074': { latitude: 29.6869, longitude: -95.5177 },
    '77081': { latitude: 29.7115, longitude: -95.4848 },
    '77098': { latitude: 29.7349, longitude: -95.4148 },
    '77099': { latitude: 29.6788, longitude: -95.5756 },
    // San Francisco locations (keep for backward compatibility)
    'san francisco': { latitude: 37.7749, longitude: -122.4194 },
    '94102': { latitude: 37.7813, longitude: -122.4167 },
    '94103': { latitude: 37.7726, longitude: -122.4119 },
  };

  // Check for exact matches first
  for (const [key, coords] of Object.entries(locationMap)) {
    if (addressLower.includes(key)) {
      return coords;
    }
  }

  // Default to San Francisco city center if no match
  return DEFAULT_COORDINATES;
}
