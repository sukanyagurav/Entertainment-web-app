import React,{useEffect,useRef,useState} from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import classes from './SearchInput.module.css'
import { useDispatch } from 'react-redux'
import { searchMovieOrTV } from '../services/currentGenre'
import { useGetInitialMoviesQuery } from '../services/movies'

const RECENT_SEARCHES_KEY = 'entertainment-recent-searches'
const MAX_RECENT_SEARCHES = 10

const readRecentSearches = () => {
  try {
    const storedSearches = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]')
    if (!Array.isArray(storedSearches)) return []

    const seenSearches = new Set()
    return storedSearches
      .filter(search => typeof search === 'string')
      .map(search => search.trim())
      .filter(search => {
        const normalizedSearch = search.toLowerCase()
        if (!normalizedSearch || seenSearches.has(normalizedSearch)) return false
        seenSearches.add(normalizedSearch)
        return true
      })
      .slice(0,MAX_RECENT_SEARCHES)
  } catch (error) {
    console.error('Could not read recent searches from local storage.',error)
    return []
  }
}

const SearchInput = () => {
    const location = useLocation()
    const {pathname} = location
    const {query:routeQuery} = useParams()
    const [query,setQuery] = useState(routeQuery || '')
    const [debouncedQuery,setDebouncedQuery] = useState('')
    const [recentSearches,setRecentSearches] = useState(readRecentSearches)
    const [isOpen,setIsOpen] = useState(false)
    const debounceRef = useRef(null)
    const containerRef = useRef(null)
    const dispatch = useDispatch()
    const navigate= useNavigate()
    const searchType = pathname.split('/')[1]
    const placeholder = searchType === 'movie' ? 'Search movies' : searchType === 'tv' ? 'Search TV' : 'Search movies or TV'
    const currentQuery = routeQuery || ''
    const suggestionType = searchType === 'movie' || searchType === 'tv' ? searchType : ''
    const trimmedQuery = query.trim()
    const {data:suggestionData,isFetching:isFetchingSuggestions} = useGetInitialMoviesQuery(
      {type:suggestionType,page:1,searchQuery:debouncedQuery},
      {skip:debouncedQuery.length < 2}
    )
    const suggestions = (suggestionData?.results || [])
      .filter(item => item.media_type === 'movie' || item.media_type === 'tv' || suggestionType)
      .filter(item => typeof (item.title || item.name) === 'string' && (item.title || item.name).trim())
      .slice(0,5)
    const matchingSuggestions = trimmedQuery.length >= 2 && debouncedQuery === trimmedQuery
      ? suggestions
      : []
    const isSearchingSuggestions = trimmedQuery.length >= 2
      && (debouncedQuery !== trimmedQuery || isFetchingSuggestions)
    const showRecentSearches = !trimmedQuery && recentSearches.length > 0

    useEffect(() => {
      setQuery(currentQuery)
    }, [currentQuery,pathname])

    useEffect(() => {
      const timeoutId = window.setTimeout(() => setDebouncedQuery(query.trim()),250)
      return () => window.clearTimeout(timeoutId)
    }, [query])

    useEffect(() => {
      const handleOutsideClick = event => {
        if(!containerRef.current?.contains(event.target)){
          setIsOpen(false)
        }
      }

      document.addEventListener('mousedown',handleOutsideClick)
      return () => document.removeEventListener('mousedown',handleOutsideClick)
    }, [])

    useEffect(() => {
      if(routeQuery){
        dispatch(searchMovieOrTV(routeQuery))
      }else if(!pathname.includes('/search/')){
        dispatch(searchMovieOrTV(''))
      }
    }, [routeQuery,pathname,dispatch])

    useEffect(() => {
      const trimmedQuery = query.trim()
      if(trimmedQuery === currentQuery) return

      debounceRef.current = window.setTimeout(() => {
        debounceRef.current = null
        dispatch(searchMovieOrTV(trimmedQuery))
        if(trimmedQuery){
          const routeType = pathname.split('/')[1]
          const searchPath = routeType === 'movie' || routeType === 'tv' ? `/${routeType}/search` : '/search'
          navigate(`${searchPath}/${encodeURIComponent(trimmedQuery)}`)
        }else if(pathname.includes('/search/')){
          const routeType = pathname.split('/')[1]
          navigate(routeType === 'movie' || routeType === 'tv' ? `/${routeType}` : '/')
        }
      },400)

      return () => {
        clearPendingSearchNavigation()
      }
    }, [query,currentQuery,pathname,dispatch,navigate])

    function handleSubmit(event){
      event.preventDefault()
      const trimmedQuery = query.trim()
      if(!trimmedQuery) return

      if(debounceRef.current){
        window.clearTimeout(debounceRef.current)
        debounceRef.current = null
      }
      saveRecentSearch(trimmedQuery)
      navigateToSearch(trimmedQuery)
    }

    function saveRecentSearch(search){
      const trimmedSearch = search.trim()
      if(!trimmedSearch) return

      const updatedSearches = [trimmedSearch,...recentSearches.filter(item => item.toLowerCase() !== trimmedSearch.toLowerCase())]
        .slice(0,MAX_RECENT_SEARCHES)
      setRecentSearches(updatedSearches)
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY,JSON.stringify(updatedSearches))
      } catch (error) {
        console.error('Could not save recent searches to local storage.',error)
      }
    }

    function navigateToSearch(search){
      clearPendingSearchNavigation()
      dispatch(searchMovieOrTV(search))
      const routeType = pathname.split('/')[1]
      const searchPath = routeType === 'movie' || routeType === 'tv' ? `/${routeType}/search` : '/search'
      setQuery(search)
      setIsOpen(false)
      navigate(`${searchPath}/${encodeURIComponent(search)}`)
    }

    function selectSuggestion(item){
      const mediaType = item.media_type || suggestionType
      if(!mediaType) return

      const title = item.title || item.name
      clearPendingSearchNavigation()
      if(title) saveRecentSearch(title)
      setIsOpen(false)
      navigate(`/${mediaType}/${item.id}`, {state:{from:location}})
    }

    function clearPendingSearchNavigation(){
      if(debounceRef.current){
        window.clearTimeout(debounceRef.current)
        debounceRef.current = null
      }
    }

    function selectRecentSearch(search){
      saveRecentSearch(search)
      navigateToSearch(search)
    }

    function clearSearch(){
      setQuery('')
      setDebouncedQuery('')
      setIsOpen(true)
    }

  const showSuggestions = trimmedQuery.length >= 2

  return (
    <form
      className={classes.searchContainer}
      onSubmit={handleSubmit}
      role="search"
      ref={containerRef}
    >
      <svg aria-hidden="true" fill="currentColor" width="1em" height="1em" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M27.613 25.72 23.08 21.2a10.56 10.56 0 0 0 2.253-6.533C25.333 8.776 20.558 4 14.667 4S4 8.776 4 14.667c0 5.89 4.776 10.666 10.667 10.666A10.56 10.56 0 0 0 21.2 23.08l4.52 4.533a1.333 1.333 0 0 0 1.893 0 1.333 1.333 0 0 0 0-1.893ZM6.667 14.667a8 8 0 1 1 16 0 8 8 0 0 1-16 0Z"></path></svg>
      <input
        type="text"
        value={query}
        onChange={event=>setQuery(event.target.value)}
        onFocus={()=>setIsOpen(true)}
        placeholder={placeholder}
        aria-label={placeholder}
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls="search-suggestions"
      />
      {query && (
        <button type="button" className={classes.clearButton} onClick={clearSearch} aria-label="Clear search">
          <svg aria-hidden="true" viewBox="0 0 16 16" fill="none">
            <path d="m4 4 8 8m0-8-8 8" />
          </svg>
        </button>
      )}
      <button type="submit" aria-label="Search">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
          <path d="m20 20-4.5-4.5M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
        </svg>
      </button>
      {isOpen && (showSuggestions || showRecentSearches) && (
        <div className={classes.suggestions} id="search-suggestions" role="listbox" aria-label="Search suggestions">
          {showSuggestions && (
            <span className={classes.suggestionsHeading}>Suggestions</span>
          )}
          {isSearchingSuggestions && <span className={classes.suggestionsMessage}>Searching…</span>}
          {matchingSuggestions.map(item => {
            const mediaType = item.media_type || suggestionType
            const title = item.title || item.name
            return (
              <button
                type="button"
                role="option"
                aria-selected="false"
                className={classes.suggestion}
                key={`${mediaType}-${item.id}`}
                onClick={()=>selectSuggestion(item)}
              >
                <span className={classes.suggestionTitle}>{title}</span>
                <span className={classes.suggestionType}>{mediaType === 'tv' ? 'TV series' : 'Movie'}</span>
              </button>
            )
          })}
          {!isSearchingSuggestions && showSuggestions && matchingSuggestions.length === 0 && (
            <span className={classes.suggestionsMessage}>No suggestions found</span>
          )}
          {showRecentSearches && (
            <>
              <span className={classes.suggestionsHeading}>Recent searches</span>
              {recentSearches.map(search=>(
                <button
                  type="button"
                  role="option"
                  aria-selected="false"
                  className={classes.recentSearch}
                  key={search}
                  onClick={()=>selectRecentSearch(search)}
                >
                  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
                    <path d="M10 5v5l3 2m4-2a7 7 0 1 1-2.05-4.95" />
                    <path d="M15 2v3h-3" />
                  </svg>
                  <span className={classes.recentSearchTitle} title={search}>
                    {search}
                  </span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </form>
  )
}

export default SearchInput
