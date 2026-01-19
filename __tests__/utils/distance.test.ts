/**
 * TODO: Workshop Exercise 4 - Add unit tests
 *
 * This test file is a skeleton for distance utility tests.
 * Add meaningful tests for:
 * - calculateDistance function
 * - formatDistance function
 * - mockGeocode function
 */

import { calculateDistance, formatDistance, mockGeocode } from '@/utils/distance';

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

    // TODO: Add more tests
    // - Test with different coordinate pairs
    // - Test edge cases (international date line, poles)
  });

  describe('formatDistance', () => {
    it('formats distances under 1km in meters', () => {
      expect(formatDistance(0.5)).toBe('500m');
    });

    it('formats distances over 1km in kilometers', () => {
      expect(formatDistance(5.5)).toBe('5.5 km');
    });

    // TODO: Add more tests
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
  });
});
