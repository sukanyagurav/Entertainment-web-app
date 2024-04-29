import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const tmdbApiKey = process.env.REACT_APP_TMDB_API_KEY


export const tmdbApi=createApi({
    reducerPath:'tmdbApi',
    baseQuery:fetchBaseQuery({baseUrl:'https://api.themoviedb.org/3'}),
    endpoints:(builder)=>({
        //get Movies by type
        getInitialMovies:builder.query({
            query:({type,genreName,page,searchQuery})=>{
                //get movies by search
                if(searchQuery && !type){
                
                    return `search/multi?query=${searchQuery}&page=${page}&api_key=${tmdbApiKey}`
                }
                
    
                //get movies by search and type
                if(searchQuery && type){
                
                    return `/search/${type}?query=${searchQuery}&page=${page}&api_key=${tmdbApiKey}`
                }
                //get movies by genre
                if(genreName && typeof genreName === 'string'){
                    return `${type}/${genreName}?page=${page}&api_key=${tmdbApiKey}`
                }
                if(genreName && typeof genreName === 'number'){
                    return `discover/${type}?with_genres=${genreName}&page=${page}&api_key=${tmdbApiKey}`
                }
               
                //return `${type}/${genreName}?page=${page}&api_key=${tmdbApiKey}`
            }
        }),
        //get movies by genre

    })
})

export const {useGetInitialMoviesQuery} = tmdbApi