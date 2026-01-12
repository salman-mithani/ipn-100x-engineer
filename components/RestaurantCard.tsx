import { Restaurant } from '@/types/restaurant';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  // console.log('Rendering restaurant:', restaurant.name); // Dead code - should be removed

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <span className="text-yellow-400">
        {'★'.repeat(fullStars)}
        {hasHalfStar && '½'}
        {'☆'.repeat(emptyStars)}
      </span>
    );
  };

  const getPriceColor = (priceRange: string) => {
    switch (priceRange) {
      case '$':
        return 'text-green-600';
      case '$$':
        return 'text-yellow-600';
      case '$$$':
        return 'text-orange-600';
      case '$$$$':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Placeholder image area */}
      <div className="h-40 bg-gradient-to-r from-red-400 to-orange-400 flex items-center justify-center">
        <span className="text-6xl">{getCuisineEmoji(restaurant.cuisine)}</span>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
            {restaurant.name}
          </h3>
          <span className={`font-medium ml-2 ${getPriceColor(restaurant.priceRange)}`}>
            {restaurant.priceRange}
          </span>
        </div>

        <p className="text-sm text-gray-500 mb-2">{restaurant.cuisine}</p>

        <div className="flex items-center mb-2">
          {renderStars(restaurant.rating)}
          <span className="ml-2 text-sm text-gray-600">{restaurant.rating.toFixed(1)}</span>
        </div>

        <p className="text-sm text-gray-600 mb-2 truncate" title={restaurant.address}>
          📍 {restaurant.address}
        </p>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm">🕐</span>
          {restaurant.operatingHours ? (
            <span className="text-sm text-gray-600">{restaurant.operatingHours}</span>
          ) : (
            <span className="text-sm text-gray-600">
              {formatTime(restaurant.openingHours)} - {formatTime(restaurant.closingHours)}
            </span>
          )}
        </div>
        <div className="mb-2">
          {isOpenNow(restaurant.openingHours, restaurant.closingHours) ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              Open Now
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
              Closed
            </span>
          )}
        </div>

        <p className="text-sm text-gray-500 line-clamp-2">{restaurant.description}</p>

        <div className="mt-4 flex gap-2">
          <button className="flex-1 px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
            View Details
          </button>
          <button className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
            📞
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper function to format time from 24h to 12h format
function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

// Helper function to check if restaurant is currently open
function isOpenNow(openingHours: string, closingHours: string): boolean {
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTime = currentHours * 60 + currentMinutes;

  const [openH, openM] = openingHours.split(':').map(Number);
  const [closeH, closeM] = closingHours.split(':').map(Number);

  const openTime = openH * 60 + openM;
  let closeTime = closeH * 60 + closeM;

  // Handle closing time past midnight (e.g., closes at 2:00 AM)
  if (closeTime < openTime) {
    // Restaurant closes after midnight
    if (currentTime >= openTime || currentTime < closeTime) {
      return true;
    }
    return false;
  }

  return currentTime >= openTime && currentTime < closeTime;
}

// Helper function to get cuisine emoji
function getCuisineEmoji(cuisine: string): string {
  const cuisineEmojis: Record<string, string> = {
    Chinese: '🥡',
    Italian: '🍝',
    Mexican: '🌮',
    Japanese: '🍣',
    American: '🍔',
    Indian: '🍛',
    Vietnamese: '🍜',
    Mediterranean: '🥙',
    Korean: '🍲',
    French: '🥐',
    Thai: '🍜',
    Vegan: '🥗',
    Seafood: '🦐',
    Greek: '🥙',
    Ethiopian: '🍲',
    Brazilian: '🥩',
    Peruvian: '🐟',
    Spanish: '🥘',
    'Andhra/Telugu': '🍛',
    'Tamil/South Indian': '🍛',
    'Modern South Indian': '🍛',
    'Pakistani/South Indian': '🍛',
    'Pakistani/Punjabi': '🍛',
    'South Indian': '🍛',
    'Karnataka/Udupi': '🍛',
    'Indo-Pakistani': '🍛',
    'Gujarati/South Indian': '🍛',
    'North/South Indian': '🍛',
    'Gujarati/Rajasthani': '🍛',
    'Pakistani/Indian': '🍛',
  };

  return cuisineEmojis[cuisine] || '🍽️';
}
