/**
 * Unit tests for distance calculation utilities
 */

import {
  calculateDistance,
  formatDistance,
  mockGeocode,
  DEFAULT_COORDINATES,
} from '@/utils/distance';

describe('Distance Utilities', () => {
  describe('calculateDistance', () => {
    it('calculates distance between two points correctly', () => {
      // San Francisco to Los Angeles is approximately 559 km
      const distance = calculateDistance(37.7749, -122.4194, 34.0522, -118.2437);
      expect(distance).toBeGreaterThan(550);
      expect(distance).toBeLessThan(570);
    });

    it('returns 0 for the same point', () => {
      const distance = calculateDistance(37.7749, -122.4194, 37.7749, -122.4194);
      expect(distance).toBe(0);
    });

    it('calculates Houston to Dallas distance correctly', () => {
      // Houston to Dallas is approximately 362 km
      const distance = calculateDistance(29.7604, -95.3698, 32.7767, -96.7970);
      expect(distance).toBeGreaterThan(350);
      expect(distance).toBeLessThan(380);
    });

    it('calculates short distances accurately', () => {
      // Two points roughly 1 km apart in Houston
      const distance = calculateDistance(29.7604, -95.3698, 29.7694, -95.3698);
      expect(distance).toBeGreaterThan(0.9);
      expect(distance).toBeLessThan(1.1);
    });

    it('handles international date line correctly', () => {
      // Point in Japan to point in Alaska (crossing international date line)
      const distance = calculateDistance(35.6762, 139.6503, 61.2181, -149.9003);
      expect(distance).toBeGreaterThan(5000);
      expect(distance).toBeLessThan(6000);
    });

    it('handles coordinates near the equator', () => {
      // Two points on the equator
      const distance = calculateDistance(0, 0, 0, 1);
      // 1 degree of longitude at equator is approximately 111 km
      expect(distance).toBeGreaterThan(100);
      expect(distance).toBeLessThan(120);
    });

    it('handles coordinates near the poles', () => {
      // Two points near the North Pole
      const distance = calculateDistance(89, 0, 89, 90);
      // Should be a relatively short distance due to convergence at poles
      expect(distance).toBeLessThan(200);
    });

    it('is symmetric - distance A to B equals distance B to A', () => {
      const distanceAB = calculateDistance(29.7604, -95.3698, 32.7767, -96.7970);
      const distanceBA = calculateDistance(32.7767, -96.7970, 29.7604, -95.3698);
      expect(distanceAB).toBeCloseTo(distanceBA, 10);
    });
  });

  describe('formatDistance', () => {
    it('formats distances under 1km in meters', () => {
      expect(formatDistance(0.5)).toBe('500m');
    });

    it('formats distances over 1km in kilometers', () => {
      expect(formatDistance(5.5)).toBe('5.5 km');
    });

    it('rounds meters to whole numbers', () => {
      expect(formatDistance(0.123)).toBe('123m');
    });

    it('formats 1km boundary correctly', () => {
      expect(formatDistance(1)).toBe('1.0 km');
    });

    it('formats very small distances', () => {
      expect(formatDistance(0.05)).toBe('50m');
    });

    it('formats large distances correctly', () => {
      expect(formatDistance(100.789)).toBe('100.8 km');
    });

    it('handles zero distance', () => {
      expect(formatDistance(0)).toBe('0m');
    });

    it('formats distances just under 1km', () => {
      expect(formatDistance(0.999)).toBe('999m');
    });
  });

  describe('mockGeocode', () => {
    it('returns coordinates for Houston (default)', () => {
      const result = mockGeocode('Houston');
      expect(result).toEqual({
        latitude: 29.7604,
        longitude: -95.3698,
      });
    });

    it('returns coordinates for San Francisco (legacy support)', () => {
      const result = mockGeocode('San Francisco');
      expect(result).toEqual({
        latitude: 37.7749,
        longitude: -122.4194,
      });
    });

    it('returns default Houston coordinates for unknown locations', () => {
      const result = mockGeocode('Unknown City XYZ');
      expect(result).toEqual({
        latitude: 29.7604,
        longitude: -95.3698,
      });
    });

    it('returns coordinates for Houston zip codes', () => {
      const result = mockGeocode('77036');
      expect(result).toEqual({
        latitude: 29.7119,
        longitude: -95.5136,
      });
    });

    it('returns coordinates for Houston neighborhoods', () => {
      const result = mockGeocode('Hillcroft');
      expect(result).toEqual({
        latitude: 29.7119,
        longitude: -95.5136,
      });
    });

    it('is case insensitive', () => {
      const result = mockGeocode('DOWNTOWN');
      expect(result).toEqual({
        latitude: 29.7589,
        longitude: -95.3677,
      });
    });

    it('returns coordinates for Midtown', () => {
      const result = mockGeocode('midtown');
      expect(result).toEqual({
        latitude: 29.7425,
        longitude: -95.3889,
      });
    });

    it('returns coordinates for Galleria', () => {
      const result = mockGeocode('galleria');
      expect(result).toEqual({
        latitude: 29.7389,
        longitude: -95.4619,
      });
    });

    it('returns coordinates for Rice Village', () => {
      const result = mockGeocode('rice village');
      expect(result).toEqual({
        latitude: 29.7181,
        longitude: -95.4212,
      });
    });

    it('returns coordinates for Montrose', () => {
      const result = mockGeocode('montrose');
      expect(result).toEqual({
        latitude: 29.7396,
        longitude: -95.3929,
      });
    });

    it('returns coordinates for Chinatown', () => {
      const result = mockGeocode('chinatown');
      expect(result).toEqual({
        latitude: 29.7067,
        longitude: -95.5067,
      });
    });

    it('handles addresses containing known locations', () => {
      // Note: "houston" is matched before "downtown" due to order in location map
      const result = mockGeocode('123 Main St, Downtown Houston');
      expect(result).toEqual({
        latitude: 29.7604,
        longitude: -95.3698,
      });
    });

    it('prioritizes more specific location matches', () => {
      // When address only contains "downtown", it should match downtown coordinates
      const result = mockGeocode('downtown area');
      expect(result).toEqual({
        latitude: 29.7589,
        longitude: -95.3677,
      });
    });
  });

  describe('DEFAULT_COORDINATES', () => {
    it('has correct Houston coordinates', () => {
      expect(DEFAULT_COORDINATES).toEqual({
        latitude: 29.7604,
        longitude: -95.3698,
      });
    });
  });
});
