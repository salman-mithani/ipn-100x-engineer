/**
 * Unit tests for the SearchForm component
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchForm from '@/components/SearchForm';

// Mock navigator.geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
};

Object.defineProperty(global.navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true,
});

describe('SearchForm', () => {
  const mockOnSearch = jest.fn();
  const mockOnSearchByCoordinates = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
    mockOnSearchByCoordinates.mockClear();
    mockGeolocation.getCurrentPosition.mockClear();
  });

  describe('Rendering', () => {
    it('renders the search form', () => {
      render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);
      expect(screen.getByLabelText(/enter your location/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /find restaurants/i })).toBeInTheDocument();
    });

    it('renders the location button', () => {
      render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);
      expect(screen.getByRole('button', { name: /use my current location/i })).toBeInTheDocument();
    });

    it('renders the hint text', () => {
      render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);
      expect(screen.getByText(/tip:/i)).toBeInTheDocument();
    });

    it('has proper accessibility attributes', () => {
      render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);
      const form = screen.getByRole('search');
      expect(form).toHaveAttribute('aria-label', 'Search for restaurants');
    });
  });

  describe('Form Submission', () => {
    it('calls onSearch when form is submitted with valid input', () => {
      render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

      const input = screen.getByPlaceholderText(/enter address/i);
      const button = screen.getByRole('button', { name: /find restaurants/i });

      fireEvent.change(input, { target: { value: 'Houston' } });
      fireEvent.click(button);

      expect(mockOnSearch).toHaveBeenCalledWith('Houston');
    });

    it('trims whitespace from input', () => {
      render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

      const input = screen.getByPlaceholderText(/enter address/i);
      const button = screen.getByRole('button', { name: /find restaurants/i });

      fireEvent.change(input, { target: { value: '  Houston  ' } });
      fireEvent.click(button);

      expect(mockOnSearch).toHaveBeenCalledWith('Houston');
    });

    it('does not call onSearch when input is empty', () => {
      render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

      const button = screen.getByRole('button', { name: /find restaurants/i });
      fireEvent.click(button);

      expect(mockOnSearch).not.toHaveBeenCalled();
    });

    it('does not call onSearch when input is only whitespace', () => {
      render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

      const input = screen.getByPlaceholderText(/enter address/i);
      const button = screen.getByRole('button', { name: /find restaurants/i });

      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.click(button);

      expect(mockOnSearch).not.toHaveBeenCalled();
    });
  });

  describe('Button States', () => {
    it('disables submit button when input is empty', () => {
      render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);
      const button = screen.getByRole('button', { name: /find restaurants/i });
      expect(button).toBeDisabled();
    });

    it('enables submit button when input has value', () => {
      render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

      const input = screen.getByPlaceholderText(/enter address/i);
      fireEvent.change(input, { target: { value: 'Houston' } });

      const button = screen.getByRole('button', { name: /find restaurants/i });
      expect(button).not.toBeDisabled();
    });

    it('disables submit button when loading', () => {
      render(<SearchForm onSearch={mockOnSearch} isLoading={true} />);

      const input = screen.getByPlaceholderText(/enter address/i);
      fireEvent.change(input, { target: { value: 'Houston' } });

      const button = screen.getByRole('button', { name: /searching for restaurants/i });
      expect(button).toBeDisabled();
    });

    it('disables location button when loading', () => {
      render(<SearchForm onSearch={mockOnSearch} isLoading={true} />);
      const locationButton = screen.getByRole('button', { name: /use my current location/i });
      expect(locationButton).toBeDisabled();
    });

    it('disables input when loading', () => {
      render(<SearchForm onSearch={mockOnSearch} isLoading={true} />);
      const input = screen.getByPlaceholderText(/enter address/i);
      expect(input).toBeDisabled();
    });
  });

  describe('Loading State', () => {
    it('displays "Searching..." text when loading', () => {
      render(<SearchForm onSearch={mockOnSearch} isLoading={true} />);
      expect(screen.getByText('Searching...')).toBeInTheDocument();
    });

    it('displays "Find Restaurants" text when not loading', () => {
      render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);
      expect(screen.getByText('Find Restaurants')).toBeInTheDocument();
    });
  });

  describe('Geolocation', () => {
    it('calls onSearchByCoordinates when location button is clicked and geolocation succeeds', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success({
          coords: {
            latitude: 29.7604,
            longitude: -95.3698,
          },
        });
      });

      render(
        <SearchForm
          onSearch={mockOnSearch}
          onSearchByCoordinates={mockOnSearchByCoordinates}
          isLoading={false}
        />
      );

      const locationButton = screen.getByRole('button', { name: /use my current location/i });
      fireEvent.click(locationButton);

      await waitFor(() => {
        expect(mockOnSearchByCoordinates).toHaveBeenCalledWith(29.7604, -95.3698);
      });
    });

    it('shows error when geolocation permission is denied', async () => {
      const mockError = {
        code: 1,
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
        message: 'Permission denied',
      };
      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error(mockError);
      });

      render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

      const locationButton = screen.getByRole('button', { name: /use my current location/i });
      fireEvent.click(locationButton);

      await waitFor(() => {
        expect(screen.getByText(/location permission denied/i)).toBeInTheDocument();
      });
    });

    it('shows error when geolocation is unavailable', async () => {
      const mockError = {
        code: 2,
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
        message: 'Position unavailable',
      };
      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error(mockError);
      });

      render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

      const locationButton = screen.getByRole('button', { name: /use my current location/i });
      fireEvent.click(locationButton);

      await waitFor(() => {
        expect(screen.getByText(/location information unavailable/i)).toBeInTheDocument();
      });
    });

    it('shows error when geolocation times out', async () => {
      const mockError = {
        code: 3,
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
        message: 'Timeout',
      };
      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error(mockError);
      });

      render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

      const locationButton = screen.getByRole('button', { name: /use my current location/i });
      fireEvent.click(locationButton);

      await waitFor(() => {
        expect(screen.getByText(/location request timed out/i)).toBeInTheDocument();
      });
    });

    it('falls back to onSearch if onSearchByCoordinates is not provided', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success({
          coords: {
            latitude: 29.7604,
            longitude: -95.3698,
          },
        });
      });

      render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

      const locationButton = screen.getByRole('button', { name: /use my current location/i });
      fireEvent.click(locationButton);

      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith('29.7604,-95.3698');
      });
    });
  });
});
