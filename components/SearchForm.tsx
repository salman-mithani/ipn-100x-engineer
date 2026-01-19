'use client';

import { useState, FormEvent } from 'react';

interface SearchFormProps {
  onSearch: (location: string) => void;
  onSearchByCoordinates?: (lat: number, lng: number) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, onSearchByCoordinates, isLoading }: SearchFormProps) {
  const [location, setLocation] = useState('');
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      onSearch(location.trim());
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser');
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoLoading(false);
        const { latitude, longitude } = position.coords;
        if (onSearchByCoordinates) {
          onSearchByCoordinates(latitude, longitude);
        } else {
          // Fallback: use coordinates as search string
          onSearch(`${latitude},${longitude}`);
        }
      },
      (error) => {
        setGeoLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeoError('Location permission denied. Please enable location access.');
            break;
          case error.POSITION_UNAVAILABLE:
            setGeoError('Location information unavailable.');
            break;
          case error.TIMEOUT:
            setGeoError('Location request timed out.');
            break;
          default:
            setGeoError('An error occurred getting your location.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6"
      role="search"
      aria-label="Search for restaurants"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Enter your location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter address, city, or zip code..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white placeholder-gray-400"
            disabled={isLoading || geoLoading}
            aria-describedby="location-hint"
            autoComplete="street-address"
          />
        </div>
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={isLoading || geoLoading}
            className="px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-label="Use my current location"
            title="Use my current location"
          >
            {geoLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full" />
                <span className="sr-only">Getting location...</span>
              </span>
            ) : (
              <span aria-hidden="true">📍</span>
            )}
          </button>
          <button
            type="submit"
            disabled={isLoading || geoLoading || !location.trim()}
            className="w-full sm:w-auto px-6 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-label={isLoading ? 'Searching for restaurants' : 'Find restaurants near you'}
          >
            {isLoading ? 'Searching...' : 'Find Restaurants'}
          </button>
        </div>
      </div>
      {geoError && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <p className="text-sm text-red-700">{geoError}</p>
        </div>
      )}
      <p id="location-hint" className="mt-3 text-sm text-gray-500">
        <span aria-hidden="true">💡 </span>
        Tip: Try searching for &quot;Houston&quot;, &quot;Hillcroft&quot;, or a zip code like &quot;77036&quot;, or use the location button
      </p>
    </form>
  );
}
