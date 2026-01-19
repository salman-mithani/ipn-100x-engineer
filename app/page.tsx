'use client';

import Link from 'next/link';
import SearchForm from '@/components/SearchForm';
import RestaurantCard from '@/components/RestaurantCard';
import RestaurantCardSkeleton from '@/components/RestaurantCardSkeleton';
import RestaurantMap from '@/components/RestaurantMap';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useRestaurants } from '@/hooks';

export default function Home() {
  const {
    restaurants,
    loading,
    error,
    hasSearched,
    searchByLocation,
    searchByCoordinates,
  } = useRestaurants();

  const handleSearch = (location: string) => {
    searchByLocation(location);
  };

  const handleSearchByCoordinates = (lat: number, lng: number) => {
    searchByCoordinates(lat, lng);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🍽️ Restaurant Finder</h1>
              <p className="mt-1 text-sm text-gray-500">
                Find the best restaurants near you
              </p>
            </div>
            <Link
              href="/blog"
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
            >
              📝 Blog
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Section */}
        <section className="mb-8">
          <SearchForm onSearch={handleSearch} onSearchByCoordinates={handleSearchByCoordinates} isLoading={loading} />
        </section>

        {/* Results Section */}
        <section aria-live="polite" aria-busy={loading}>
          {loading && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Finding restaurants...
              </h2>
              <div
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                role="status"
                aria-label="Loading restaurants"
              >
                {[...Array(6)].map((_, i) => (
                  <RestaurantCardSkeleton key={i} />
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {!loading && hasSearched && restaurants.length === 0 && !error && (
            <div className="text-center py-12">
              <p className="text-gray-500">No restaurants found. Try a different location.</p>
            </div>
          )}

          {!loading && restaurants.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Found {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} near you
              </h2>

              {/* Map View */}
              <div className="mb-6">
                <ErrorBoundary>
                  <RestaurantMap restaurants={restaurants} />
                </ErrorBoundary>
              </div>

              {/* Restaurant Cards */}
              <ErrorBoundary>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {restaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                  ))}
                </div>
              </ErrorBoundary>
            </div>
          )}

          {!hasSearched && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500 text-lg">
                Enter your location to find nearby restaurants
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Try searching for &quot;Houston&quot; or &quot;77036&quot;
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            Restaurant Finder - AI Workshop Demo Application
          </p>
        </div>
      </footer>
    </main>
  );
}
