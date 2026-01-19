/**
 * Unit tests for the RestaurantCard component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import RestaurantCard from '@/components/RestaurantCard';
import { Restaurant } from '@/types/restaurant';

const mockRestaurant: Restaurant = {
  id: '1',
  name: 'Test Restaurant',
  address: '123 Test Street, Test City, TX 77001',
  cuisine: 'Italian',
  rating: 4.5,
  priceRange: '$$',
  openingHours: '11:00',
  closingHours: '22:00',
  latitude: 29.7604,
  longitude: -95.3698,
  phone: '(555) 123-4567',
  description: 'A test restaurant for unit testing',
};

// Mock window.location
const originalLocation = window.location;

beforeAll(() => {
  // @ts-expect-error - mocking window.location
  delete window.location;
  window.location = { ...originalLocation, href: '' };
});

afterAll(() => {
  window.location = originalLocation;
});

describe('RestaurantCard', () => {
  describe('Rendering', () => {
    it('renders restaurant name', () => {
      render(<RestaurantCard restaurant={mockRestaurant} />);
      expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
    });

    it('displays the cuisine type', () => {
      render(<RestaurantCard restaurant={mockRestaurant} />);
      expect(screen.getByText('Italian')).toBeInTheDocument();
    });

    it('shows the rating', () => {
      render(<RestaurantCard restaurant={mockRestaurant} />);
      expect(screen.getByText('4.5')).toBeInTheDocument();
    });

    it('displays the address', () => {
      render(<RestaurantCard restaurant={mockRestaurant} />);
      expect(screen.getByText('123 Test Street, Test City, TX 77001')).toBeInTheDocument();
    });

    it('displays the description', () => {
      render(<RestaurantCard restaurant={mockRestaurant} />);
      expect(screen.getByText('A test restaurant for unit testing')).toBeInTheDocument();
    });

    it('renders as an article element', () => {
      render(<RestaurantCard restaurant={mockRestaurant} />);
      expect(screen.getByRole('article')).toBeInTheDocument();
    });
  });

  describe('Price Range Display', () => {
    it('displays budget-friendly price ($)', () => {
      const restaurant = { ...mockRestaurant, priceRange: '$' };
      render(<RestaurantCard restaurant={restaurant} />);
      expect(screen.getByText('$')).toBeInTheDocument();
      expect(screen.getByTitle('Budget-friendly')).toBeInTheDocument();
    });

    it('displays moderate price ($$)', () => {
      render(<RestaurantCard restaurant={mockRestaurant} />);
      expect(screen.getByText('$$')).toBeInTheDocument();
      expect(screen.getByTitle('Moderate')).toBeInTheDocument();
    });

    it('displays expensive price ($$$)', () => {
      const restaurant = { ...mockRestaurant, priceRange: '$$$' };
      render(<RestaurantCard restaurant={restaurant} />);
      expect(screen.getByText('$$$')).toBeInTheDocument();
      expect(screen.getByTitle('Expensive')).toBeInTheDocument();
    });

    it('displays very expensive price ($$$$)', () => {
      const restaurant = { ...mockRestaurant, priceRange: '$$$$' };
      render(<RestaurantCard restaurant={restaurant} />);
      expect(screen.getByText('$$$$')).toBeInTheDocument();
      expect(screen.getByTitle('Very expensive')).toBeInTheDocument();
    });
  });

  describe('Star Rating Display', () => {
    it('renders full stars for whole number ratings', () => {
      const restaurant = { ...mockRestaurant, rating: 4 };
      render(<RestaurantCard restaurant={restaurant} />);
      const rating = screen.getByRole('img', { name: /rating: 4.0 out of 5 stars/i });
      expect(rating).toBeInTheDocument();
    });

    it('renders half star for decimal ratings >= 0.5', () => {
      render(<RestaurantCard restaurant={mockRestaurant} />);
      const rating = screen.getByRole('img', { name: /rating: 4.5 out of 5 stars/i });
      expect(rating).toBeInTheDocument();
      expect(rating.textContent).toContain('½');
    });

    it('renders correct number of empty stars', () => {
      const restaurant = { ...mockRestaurant, rating: 3 };
      render(<RestaurantCard restaurant={restaurant} />);
      const rating = screen.getByRole('img', { name: /rating: 3.0 out of 5 stars/i });
      expect(rating.textContent).toContain('☆☆');
    });
  });

  describe('Operating Hours', () => {
    it('displays operating hours when operatingHoursDisplay is provided', () => {
      const restaurant = {
        ...mockRestaurant,
        operatingHoursDisplay: 'Mon-Fri: 11AM-10PM',
      };
      render(<RestaurantCard restaurant={restaurant} />);
      expect(screen.getByText('Mon-Fri: 11AM-10PM')).toBeInTheDocument();
    });

    it('displays basic hours when operatingHoursDisplay is not provided', () => {
      render(<RestaurantCard restaurant={mockRestaurant} />);
      expect(screen.getByText('11:00 - 22:00')).toBeInTheDocument();
    });
  });

  describe('Button Functionality', () => {
    it('View Details button calls onViewDetails when clicked', () => {
      const mockOnViewDetails = jest.fn();
      render(
        <RestaurantCard
          restaurant={mockRestaurant}
          onViewDetails={mockOnViewDetails}
        />
      );

      const viewDetailsButton = screen.getByRole('button', {
        name: /view details for test restaurant/i,
      });
      fireEvent.click(viewDetailsButton);

      expect(mockOnViewDetails).toHaveBeenCalledWith(mockRestaurant);
    });

    it('Phone button triggers tel: link', () => {
      render(<RestaurantCard restaurant={mockRestaurant} />);

      const phoneButton = screen.getByRole('button', {
        name: /call test restaurant at \(555\) 123-4567/i,
      });
      fireEvent.click(phoneButton);

      expect(window.location.href).toBe('tel:(555) 123-4567');
    });

    it('Phone button has proper accessibility attributes', () => {
      render(<RestaurantCard restaurant={mockRestaurant} />);

      const phoneButton = screen.getByRole('button', {
        name: /call test restaurant/i,
      });
      expect(phoneButton).toHaveAttribute('title', 'Call (555) 123-4567');
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-labelledby on article', () => {
      render(<RestaurantCard restaurant={mockRestaurant} />);
      const article = screen.getByRole('article');
      expect(article).toHaveAttribute('aria-labelledby', 'restaurant-1-name');
    });

    it('has screen reader text for address', () => {
      render(<RestaurantCard restaurant={mockRestaurant} />);
      expect(screen.getByText('Address:')).toHaveClass('sr-only');
    });

    it('has screen reader text for hours', () => {
      render(<RestaurantCard restaurant={mockRestaurant} />);
      expect(screen.getByText('Hours:')).toHaveClass('sr-only');
    });

    it('has aria-hidden on decorative emojis', () => {
      render(<RestaurantCard restaurant={mockRestaurant} />);
      const emojis = screen.getAllByText(/📍|🕒|📞/);
      emojis.forEach((emoji) => {
        expect(emoji).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });

  describe('Cuisine Emoji', () => {
    it('displays correct emoji for Italian cuisine', () => {
      render(<RestaurantCard restaurant={mockRestaurant} />);
      expect(screen.getByText('🍝')).toBeInTheDocument();
    });

    it('displays correct emoji for Mexican cuisine', () => {
      const restaurant = { ...mockRestaurant, cuisine: 'Mexican' };
      render(<RestaurantCard restaurant={restaurant} />);
      expect(screen.getByText('🌮')).toBeInTheDocument();
    });

    it('displays correct emoji for Japanese cuisine', () => {
      const restaurant = { ...mockRestaurant, cuisine: 'Japanese' };
      render(<RestaurantCard restaurant={restaurant} />);
      expect(screen.getByText('🍣')).toBeInTheDocument();
    });

    it('displays default emoji for unknown cuisine', () => {
      const restaurant = { ...mockRestaurant, cuisine: 'Unknown Cuisine' };
      render(<RestaurantCard restaurant={restaurant} />);
      expect(screen.getByText('🍽️')).toBeInTheDocument();
    });
  });
});
