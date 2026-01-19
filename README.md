# 🍽️ Restaurant Finder

A Next.js application for finding restaurants near you. This project serves as a foundation for an AI-assisted coding workshop.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Open http://localhost:3000 in your browser
```

## 📋 Features

- **Location Search**: Enter an address, city, or zip code to find nearby restaurants
- **Geolocation Support**: Use your current location to find nearby restaurants
- **Interactive Map**: View restaurant locations on an embedded map
- **Mock Data**: 20 restaurants in the Houston area
- **Distance Calculation**: Restaurants sorted by proximity using the Haversine formula
- **Restaurant Blog**: Blog posts about featured restaurants
- **Responsive Design**: Works on desktop and mobile devices
- **Accessibility**: WCAG-compliant with proper ARIA labels and keyboard navigation

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier

## 📁 Project Structure

```
restaurant-finder/
├── app/
│   ├── api/
│   │   ├── restaurants/
│   │   │   └── route.ts          # Main restaurants API endpoint
│   │   └── blogs/
│   │       ├── route.ts          # Blogs list API
│   │       └── [id]/route.ts     # Individual blog API
│   ├── blog/
│   │   ├── page.tsx              # Blog listing page
│   │   └── [id]/page.tsx         # Individual blog page
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Home page with search
├── components/
│   ├── BlogCardSkeleton.tsx      # Loading skeleton for blogs
│   ├── ErrorBoundary.tsx         # Error boundary component
│   ├── RestaurantCard.tsx        # Restaurant card with accessibility
│   ├── RestaurantCardSkeleton.tsx # Loading skeleton for restaurants
│   ├── RestaurantMap.tsx         # Interactive map component
│   └── SearchForm.tsx            # Search form with geolocation
├── hooks/
│   ├── index.ts                  # Hook exports
│   ├── useBlogs.ts               # Blog data fetching hook
│   └── useRestaurants.ts         # Restaurant data fetching hook
├── data/
│   ├── restaurants.json          # Mock restaurant data (Houston)
│   └── blogs.json                # Blog posts data
├── types/
│   ├── restaurant.ts             # Restaurant type definitions
│   └── blog.ts                   # Blog type definitions
├── utils/
│   └── distance.ts               # Distance calculations & geocoding
└── __tests__/
    ├── api/
    ├── components/
    └── utils/
```

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |

## 🎯 Workshop Exercises

This project is designed for the "Becoming a 100x Dev" workshop. Workshop materials and exercises are provided by your instructors during the session.

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

### API Endpoints (this one is provided, you'll be building more in the workshop)

#### GET /api/restaurants

Find restaurants near a location.

**Query Parameters:**
- `address` (string): Address to search near
- `lat` (number): Latitude coordinate
- `lng` (number): Longitude coordinate

**Example:**
```bash
curl "http://localhost:3000/api/restaurants?address=Houston"
```

**Response:**
```json
{
  "restaurants": [
    {
      "id": "1",
      "name": "Aga's Restaurant",
      "address": "6815 Hillcroft St Houston TX 77081",
      "cuisine": "Andhra/Telugu",
      "rating": 4.3,
      "priceRange": "$$",
      "openingHours": "11:30",
      "closingHours": "14:30",
      "latitude": 29.745,
      "longitude": -95.3367,
      "phone": "(713) 981-7717",
      "description": "Family Style Authentic Andhra Cuisine",
      "distance": 2.5
    }
  ],
  "searchLocation": {
    "latitude": 29.7604,
    "longitude": -95.3698,
    "address": "Houston"
  }
}
```

## 🤖 AI-Assisted Development

This project is designed to be enhanced using AI coding assistants such as Claude Code and agentic IDEs such as Cursor or Windsurf.

We will focus on using Claude Code in this workshop so use whichever IDE you're comfortable with to review/edit files manually. 

## 📄 License

MIT License - feel free to use this project for learning and workshops.

## 🙏 Acknowledgments

Built for the "Becoming a 100x Dev" Workshop at IPNSummit 2026. Happy coding! 🎉
