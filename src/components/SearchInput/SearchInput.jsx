import React,{useState} from 'react'
import { useLocation, useNavigate,Link } from 'react-router-dom'
import classes from './SearchInput.module.css'
import { useDispatch } from 'react-redux'
import { searchMovieOrTV } from '../services/currentGenre'
const SearchInput = () => {
    const path = useLocation()
    const searchTermValidation=path.pathname.split('/')[1]
    const [query,setQuery] = useState('')
    const dispatch = useDispatch()
    let searchTerm=''
    const navigate= useNavigate()
    if(searchTermValidation == '' && searchTermValidation === 'search'){
        searchTerm ='Movies or TV'
    }
    else if(searchTermValidation === 'movie'){
        searchTerm='Movies'
    }
    else if(searchTermValidation === 'tv'){
        searchTerm='TV'
    }
   
    function handleSubmit(e){
      e.preventDefault()
      if(query===''){
        return 
      }
      dispatch(searchMovieOrTV(query)) 
      if(searchTermValidation === 'movie' || searchTermValidation ==='tv'){
        navigate(`${searchTermValidation}/search/${query}`)
      }else{
        navigate(`search/${query}`)
      }
      setQuery('')
    }
  return (
    <div className={classes.searchContainer} >
      <svg class="h-6 w-6 md:h-8 md:w-8" fill="currentColor" width="1em" height="1em" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M27.613 25.72 23.08 21.2a10.56 10.56 0 0 0 2.253-6.533C25.333 8.776 20.558 4 14.667 4S4 8.776 4 14.667c0 5.89 4.776 10.666 10.667 10.666A10.56 10.56 0 0 0 21.2 23.08l4.52 4.533a1.333 1.333 0 0 0 1.893 0 1.333 1.333 0 0 0 0-1.893ZM6.667 14.667a8 8 0 1 1 16 0 8 8 0 0 1-16 0Z"></path></svg>
      <input type="text" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder={`Search for ${searchTerm}`}/>
     
      <button onClick={handleSubmit}>
        Search
      </button>
 
    </div>
  )
}

export default SearchInput
