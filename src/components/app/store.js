import { configureStore } from "@reduxjs/toolkit";
import { tmdbApi } from "../services/movies";
import genreReducer from '../services/currentGenre'
export default configureStore({
    reducer: {
        [tmdbApi.reducerPath]: tmdbApi.reducer,
        genre : genreReducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tmdbApi.middleware),
})
