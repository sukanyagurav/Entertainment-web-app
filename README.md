# Frontend Mentor - Entertainment web app

![Design desktop preview for the Movie list app](./src/assets/desktop%20preview.png)

![Design mobile preview for the movie list app](./src/assets/mobile%20preview.png)

## Overview

A React-based entertainment web application for discovering movies and TV shows, including detailed information about actors. Users can also explore content categorized by genre.

The app supports responsive layouts, hover states, navigation between Home, Movies, and TV Series, searching across pages, recommendations and cast details for movies and TV series, and genre-based filtering with sort options.

## 🎨 Design Preview

- **Desktop**: Full-width movie grid with carousel navigation and filtering panels
- **Mobile**: Stacked layout with collapsible filters and bottom navigation

## 📦 Features

| Feature | Description |
|---------|-------------|
| **Genre Browsing** | Explore movies/TV by genre with filterable sort options |
| **Sort & Filters** | Sort by rating, release date, popularity; filter by year, min rating, language |
| **Carousel** | Horizontal scrollable carousels with lazy loading and arrow navigation |
| **Search** | Search across movies and TV series simultaneously |
| **Actor Details** | Full biographies, filmographies, and IMDb links |
| **Movie Details** | Overview, rating, runtime, genres, trailers, and recommendations |
| **Responsive** | Works across desktop and mobile form factors |

## Built with

- **React 18** with React Router DOM
- **Redux Toolkit** (RTK Query) for data fetching and state management
- **Vite** for fast development and building
- **React IntersectionObserver** for lazy loading and viewport detection
- **CSS** with modular CSS for component-scoped styling

## Getting started

Install dependencies and start the Vite development server:

```sh
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

## 🌐 Environment

The app uses a TMDB API key. Add it to a `.env` file in the project root:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
```

The previous `REACT_APP_TMDB_API_KEY` name is also supported for existing local environment files. Use the `VITE_` prefix for new setups.

## Available scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server with hot module replacement |
| `npm start` | Alias for `npm run dev` |
| `npm run build` | Create a production build in `dist/` |
| `npm test` | Run tests with Vitest |
| `npm run preview` | Preview the production build locally |

## 🏗️ Architecture

The app uses a feature-based directory structure:

```
src/
├── components/          # Reusable UI components
│   ├── App.jsx          # Root router provider
│   ├── NavBar.jsx       # Top navigation with search
│   ├── Home.jsx         # Home page with carousels
│   ├── Movies.jsx       # Movie/TV list with sort/filter
│   ├── Category.jsx     # Genre selection grid
│   ├── Carousel.jsx     # Horizontal scrollable carousel
│   ├── Movie.jsx        # Individual movie tile
│   ├── MovieInformation.jsx # Detailed movie/TV page
│   ├── Actor.jsx        # Actor biography and filmography
│   ├── Tv.jsx           # TV series listing page
│   ├── Pagination.jsx   # Page navigation
│   ├── Rating.jsx       # Star rating display
│   ├── SearchInput.jsx  # Search bar component
│   └── Error.jsx        # Error boundary page
├── services/            # API and state management
│   ├── movies.js        # RTK Query API with TMDB endpoints
│   └── currentGenre.js  # Redux slice for genre state
├── index.jsx            # React DOM root renderer
└── components/Router.jsx # Browser router configuration
```

## Key API endpoints (RTK Query)

The `movies.js` service provides auto-caching and refetching for:

- **Initial load**: `getInitialMovies` — popular, top_rated, upcoming, now_playing
- **Genre discovery**: `getInitialMovies` — filter by genre ID with sort/year/rating/language
- **Search**: `getInitialMovies` — multi-search or type-specific search
- **By ID**: `getMovie` — movie/TV details with credits and videos
- **Recommendations**: `getRecommendations` — "You may also like"
- **Actor details**: `getActorsDetailysById` — cast and biography data

Sort/filter options supported in discover queries:

| Type | Sort options | Filter options |
|------|-------------|----------------|
| **movies** | `release_date.desc`, `release_date.asc`, `rating.desc`, `rating.asc`, `popularity.desc` | `year`, `minRating`, `language` |
| **tv** | `first_air_date.desc`, `first_air_date.asc`, `vote_average.desc`, `vote_average.asc`, `popularity.desc` | `year`, `minRating`, `language` |

## 📱 Screens

- **Home** (`/`): Carousels for Now Playing, Popular, Top Rated, Upcoming (movies) and Top Rated, Popular, On The Air, Airing Today (TV)
- **Movies/TV by genre**: `/movie/genre/:genre` or `/tv/genre/:genre`
- **Search**: `/search/:query`
- **Details**: `/movie/:id` or `/tv/:id` — with overview, rating, genres, cast, trailer, and recommendations
- **Actor**: `/actors/:id` — biography, IMDb profile, movie and TV credits with pagination