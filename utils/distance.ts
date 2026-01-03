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
    // Houston areas
    'houston': { latitude: 29.7604, longitude: -95.3698 },
    'downtown': { latitude: 29.7589, longitude: -95.3677 },
    'midtown': { latitude: 29.7425, longitude: -95.3889 },
    'uptown': { latitude: 29.7508, longitude: -95.4617 },
    'galleria': { latitude: 29.7389, longitude: -95.4619 },
    'rice village': { latitude: 29.7181, longitude: -95.4212 },
    'montrose': { latitude: 29.7396, longitude: -95.3929 },
    'heights': { latitude: 29.7997, longitude: -95.4056 },
    'memorial': { latitude: 29.7628, longitude: -95.5342 },
    'bellaire': { latitude: 29.7058, longitude: -95.4672 },
    'chinatown': { latitude: 29.7067, longitude: -95.5067 },
    'hillcroft': { latitude: 29.7119, longitude: -95.5136 },
    'westheimer': { latitude: 29.7386, longitude: -95.4617 },
    // Houston zip codes
    '77002': { latitude: 29.7589, longitude: -95.3677 },
    '77004': { latitude: 29.7244, longitude: -95.3592 },
    '77006': { latitude: 29.7425, longitude: -95.3889 },
    '77019': { latitude: 29.7481, longitude: -95.4194 },
    '77027': { latitude: 29.7508, longitude: -95.4617 },
    '77036': { latitude: 29.7119, longitude: -95.5136 },
    '77057': { latitude: 29.7389, longitude: -95.4619 },
    '77063': { latitude: 29.7419, longitude: -95.5203 },
    '77074': { latitude: 29.6964, longitude: -95.5294 },
    '77081': { latitude: 29.7028, longitude: -95.4983 },
    '77098': { latitude: 29.7344, longitude: -95.4161 },
    '77099': { latitude: 29.6619, longitude: -95.6075 },
    // San Francisco (legacy support)
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

  // Default to Houston city center if no match
  return DEFAULT_COORDINATES;
}
