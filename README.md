# Entertainment

A responsive movie and TV discovery app built with React. Browse titles by category or genre, search TMDB, and explore cast, recommendations, and title details.

### 🌐 **Links**
- 🔗 [GitHub](https://github.com/sukanyagurav/Entertainment-web-app)
- 🚀 [Live URL](https://entertainmentwebapp67.netlify.app/)

## Video

<video controls width="100%" preload="metadata">
  <source src="./src/assets/movie%20app.mp4" type="video/mp4" />
  Your browser does not support embedded videos. [Open the video](./src/assets/movie%20app.mp4).
</video>

## Features

- Browse popular, top-rated, now-playing, and upcoming movies and TV shows.
- Search across titles, with suggestions and recent searches.
- Explore genres and filter or sort results by release year, rating, language, and popularity.
- View title details, trailers, cast, watch providers, and recommendations.
- Explore actor biographies and filmographies.
- Load carousels as they approach the viewport and lazy-load responsive poster images.

## Tech stack

- React 18 and React Router
- Redux Toolkit and RTK Query for application state and TMDB data fetching/caching
- Vite
- Netlify Functions for server-side TMDB API requests
- CSS Modules and responsive CSS
- TMDB API for movie, TV, and cast data

## Getting started

### Prerequisites

- Node.js 22
- A TMDB API key

### Install and run

1. Clone the repository and install dependencies:

   ```sh
   git clone https://github.com/sukanyagurav/Entertainment-web-app.git
   cd Entertainment-web-app
   npm ci
   ```

2. Create a `.env` file in the project root:

   ```env
   TMDB_API_KEY=your_tmdb_api_key
   ```

   The `.env` file is git-ignored. Do not use a `VITE_` prefix: Vite-prefixed variables are intended for browser code. The local Vite proxy reads `TMDB_API_KEY` server-side.

3. Start the development server:

   ```sh
   npm run dev
   ```

   Open the local URL printed by Vite. During development, Vite proxies TMDB requests and adds the key on the server.

For Netlify deployment, add `TMDB_API_KEY` under **Site configuration → Environment variables**, then redeploy. The Netlify Function handles `/api/tmdb/*` requests without exposing the key to the browser.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm test -- --pool=threads --maxWorkers=1` | Run tests using the same worker settings as CI |

## Architecture

- `src/index.jsx` mounts the React application.
- `src/components/App.jsx` configures Redux, the router, and lazy-loaded route components.
- `src/components/RootLayout.jsx` provides the shared navigation and page layout.
- Page and UI components are grouped under `src/components/` by feature, including `Home/`, `Movies/`, `MovieInformation/`, `Actor/`, and `Carousel/`.
- `src/components/app/store.js` registers the Redux reducers and RTK Query middleware.
- `src/components/services/movies.js` defines TMDB endpoints. RTK Query retains unused query results for 50,000 seconds.
- `src/components/services/currentGenre.js` stores genre and search state.
- `src/components/MovieImage/` builds responsive TMDB image URLs and renders movie artwork.
- `netlify/functions/tmdb.mjs` validates and forwards allowed TMDB requests using the server-side API key.

## Main routes

| Route | Page |
|---|---|
| `/` | Home carousels |
| `/movie` or `/tv` | Genre browsing |
| `/movie/genre/:genre` or `/tv/genre/:genre` | Filtered title listing |
| `/search/:query`, `/movie/search/:query`, `/tv/search/:query` | Search results |
| `/movie/:id` or `/tv/:id` | Title details |
| `/actors/:id` | Actor details and filmography |
