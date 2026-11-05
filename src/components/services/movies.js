import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const tmdbApiKey = import.meta.env.VITE_TMDB_API_KEY || import.meta.env.REACT_APP_TMDB_API_KEY


export const tmdbApi=createApi({
    reducerPath:'tmdbApi',
    baseQuery:fetchBaseQuery({baseUrl:'https://api.themoviedb.org/3'}),
    endpoints:(builder)=>({
        //get Movies by type
        getInitialMovies:builder.query({
            query:({type,genreName,page,searchQuery,sortBy,year,minRating,language})=>{
                const params = new URLSearchParams()
                params.set('api_key', tmdbApiKey)
                params.set('page', page)

                //get movies by search
                if(searchQuery && !type){
                    params.set('query', searchQuery)
                    if(sortBy){
                        params.set('sort_by', sortBy)
                    }
                    if(year){
                        params.set('year', year)
                    }
                    if(minRating > 0){
                        params.set('vote_average.gte', minRating)
                    }
                    if(language){
                        params.set('with_original_language', language)
                    }
                    return `search/multi?${params.toString()}`
                }

                //get movies by search and type
                if(searchQuery && type){
                    params.set('query', searchQuery)
                    if(sortBy){
                        params.set('sort_by', sortBy)
                    }
                    if(year){
                        params.set('year', year)
                    }
                    if(minRating > 0){
                        params.set('vote_average.gte', minRating)
                    }
                    if(language){
                        params.set('with_original_language', language)
                    }
                    return `search/${type}?${params.toString()}`
                }

                //get movies by genre id (discover) - supports sort and filters
                if(genreName && typeof genreName === 'number'){
                    params.set('with_genres', genreName)
                    if(sortBy){
                        params.set('sort_by', sortBy)
                    }
                    if(year){
                        if(type === 'tv'){
                            params.set('first_air_date_year', year)
                        }else{
                            params.set('primary_release_year', year)
                        }
                    }
                    if(minRating > 0){
                        params.set('vote_average.gte', minRating)
                    }
                    if(language){
                        params.set('with_original_language', language)
                    }
                    return `discover/${type}?${params.toString()}`
                }

                //get movies by genre name list (popular, top_rated, etc.) - no sort/filters supported
                if(genreName && typeof genreName === 'string'){
                    return `${type}/${genreName}?page=${page}&api_key=${tmdbApiKey}`
                }

                //return `${type}/${genreName}?page=${page}&api_key=${tmdbApiKey}`
            }
        }),
        //get movies by id
        getMovie:builder.query({
            query:({type,id})=>  `${type}/${id}?append_to_response=videos,credits&api_key=${tmdbApiKey}`
        }),
        getWatchProviders:builder.query({
            query:({type,id})=> `${type}/${id}/watch/providers?api_key=${tmdbApiKey}`
        }),
        getRecommendations:builder.query({
            query:({type,movie_id,list})=>`${type}/${movie_id}/${list}?api_key=${tmdbApiKey}`
        }),
        getActorsDetailysById:builder.query({
            query:({id})=> `person/${id}?append_to_response=movie_credits,tv_credits&api_key=${tmdbApiKey}`
        })
    })
})

export const {useGetInitialMoviesQuery,useGetMovieQuery,useGetActorsDetailysByIdQuery,useGetRecommendationsQuery,useGetWatchProvidersQuery} = tmdbApi
