import {createSlice} from '@reduxjs/toolkit'

export const genre = createSlice({
    name:'genre',
    initialState:{
        genreName:'',
        page:1,
        searchQuery:''
    },
    reducers:{
        selectGenre:(state,action)=>{
            state.genreName = action.payload
            state.searchQuery = ''
        },
        searchMovieOrTV:(state,action)=>{
            state.searchQuery = action.payload

        }
    }
})
export const {selectGenre,searchMovieOrTV} = genre.actions
export default genre.reducer

