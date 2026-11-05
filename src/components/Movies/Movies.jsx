import React,{useState} from 'react'
import { useLocation,useParams,Link } from 'react-router-dom'
import { useGetInitialMoviesQuery } from '../services/movies';

import { useSelector } from 'react-redux';
import { selectGenre } from '../services/currentGenre'

import Movie from '../Movie/Movie';
import MovieSkeleton from '../Movie/MovieSkeleton';
import Pagination from '../Pagination/Pagination';
import classes from './Movies.module.css';

const PAGE_SIZE = 20

const Movies = () => {
  const path = useLocation()
  let type=path.pathname.split('/')[1]

  let { genre } = useParams();
  const [page,setPage] = useState(1)
  if(type==='movie'){
    type="movie"
  }else if(type==='tv'){
    type='tv'
  }else{
    type=''
  }

  const {genreName,searchQuery} = useSelector((state)=>state.genre)
  // Local filter/sort state: reset each page visit, work with genre, search, and list pages
  const [sortBy, setSortBy] = useState('')
  const [yearFilter, setYearFilter] = useState('')
  const [minRating, setMinRating] = useState(0)
  const [languageFilter, setLanguageFilter] = useState('')

    // Map filter params for the API query
  // For TMDB discover endpoint sort_by values:
  // movies: 'popularity.desc', 'vote_average.desc', 'release_date.desc', 'release_date.asc', 'primary_release.desc'
  // tv: 'popularity.desc', 'vote_average.desc', 'first_air_date.desc', 'first_air_date.asc'
  const apiSortBy = sortBy ? (type === 'movie'
    ? { 'release_date.desc': 'release_date.desc', 'release_date.asc': 'release_date.asc',
        'rating.desc': 'vote_average.desc', 'rating.asc': 'vote_average.asc',
        'popularity.desc': 'popularity.desc' }[sortBy] || sortBy
    : { 'release_date.desc': 'first_air_date.desc', 'release_date.asc': 'first_air_date.asc',
        'rating.desc': 'vote_average.desc', 'rating.asc': 'vote_average.asc',
        'popularity.desc': 'popularity.desc' }[sortBy] || sortBy) : ''

  const {currentData,error,isFetching} = useGetInitialMoviesQuery({
    type,
    genreName,
    page,
    searchQuery,
    // Pass sort/filter params as part of the query object
    sortBy: apiSortBy || undefined,
    year: yearFilter || undefined,
    minRating: minRating > 0 ? minRating : undefined,
    language: languageFilter || undefined,
  })
  function makeCapital(sentence){
    const words = sentence.split(" ");
    return words.map((word) => { 
        return word[0].toUpperCase() + word.substring(1); 
    }).join(" ")
  }
 
  if(error){
    return <p style={{textAlign:'center'}}>Something went wrong, Please try again after sometime!.</p>
  }
  // Build filter display
  const activeFilters = [
    ...(sortBy ? [{
      key:'sort',
      label:`Sort: ${{'popularity.desc':'Popularity','vote_average.desc':'Rating','release_date.desc':'Release Date','vote_average.asc':'Low Rating'}[sortBy] || sortBy}`,
      remove:()=>setSortBy('')
    }] : []),
    ...(yearFilter ? [{key:'year',label:`Year: ${yearFilter}`,remove:()=>setYearFilter('')}] : []),
    ...(minRating > 0 ? [{key:'rating',label:`Min Rating: ${minRating}+/10`,remove:()=>setMinRating(0)}] : []),
    ...(languageFilter ? [{key:'language',label:`Language: ${languageFilter.toUpperCase()}`,remove:()=>setLanguageFilter('')}] : []),
  ]
  const hasActiveFilters = activeFilters.length > 0
  const emptyMessage = type === 'movie'
    ? 'No movies are present.'
    : type === 'tv'
      ? 'No TV series are present.'
      : 'No movies or TV series are present.'

  return (
    <div style={{display:'flex',flexDirection:'column',justifyContent:'center',gap:'1rem'}}>
      {/* Filter and Sort Controls */}
      <section className="CommonContainer" style={{marginBottom:'1rem'}}>
        <div className={classes.filterHeader}>
          <h2>{searchQuery
            ? currentData
              ? `Found ${currentData.total_results} results for ${searchQuery}`
              : `Searching for ${searchQuery}`
            : makeCapital(genre.replace('_',' '))}</h2>
          <div className={classes.filterControls}>
            <div className={classes.filters}>
          <select
            className={classes.filters__select}
            value={sortBy}
            onChange={(e)=>setSortBy(e.target.value || '')}
          >
            <option value="">Default Order</option>
            <option value="popularity.desc">Popularity</option>
            <option value="vote_average.desc">Rating</option>
            <option value="release_date.desc">Release Date</option>
            <option value="vote_average.asc">Low Rating</option>
          </select>
          {type === 'movie' && (
            <select
              className={classes.filters__select}
              value={yearFilter || ''}
              onChange={(e)=>setYearFilter(e.target.value)}
            >
              <option value="">All Years</option>
              {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017].map(year=>
                <option key={year} value={year}>
                  {year}
                </option>
              )}
            </select>
          )}
          {type === 'tv' && (
            <select
              className={classes.filters__select}
              value={yearFilter || ''}
              onChange={(e)=>setYearFilter(e.target.value)}
            >
              <option value="">All Years</option>
              {[2024, 2023, 2022, 2021, 2020].map(year=>
                <option key={year} value={year}>
                  {year}
                </option>
              )}
            </select>
          )}
          {type === 'movie' && (
            <select
              className={classes.filters__select}
              value={minRating || ''}
              onChange={(e)=>setMinRating(e.target.value === '' ? 0 : parseFloat(e.target.value))}
            >
              <option value="">Min Rating</option>
              {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(r=>(
                <option key={r} value={r}>
                  {r}+
                </option>
              ))}
            </select>
          )}
          {type === 'tv' && (
            <select
              className={classes.filters__select}
              value={minRating || ''}
              onChange={(e)=>setMinRating(e.target.value === '' ? 0 : parseFloat(e.target.value))}
            >
              <option value="">Min Rating</option>
              {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(r=>(
                <option key={r} value={r}>
                  {r}+
                </option>
              ))}
            </select>
          )}
          {type === 'movie' && (
            <select
              className={classes.filters__select}
              value={languageFilter || ''}
              onChange={(e)=>setLanguageFilter(e.target.value)}
            >
              <option value="">All Languages</option>
              {'en hi es fr de zh pt ja'.split(' ').map(lang=>
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              )}
            </select>
          )}
          {type === 'tv' && (
            <select
              className={classes.filters__select}
              value={languageFilter || ''}
              onChange={(e)=>setLanguageFilter(e.target.value)}
            >
              <option value="">All Languages</option>
              {'en hi es fr de'.split(' ').map(lang=>
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              )}
            </select>
          )}
            </div>
            {hasActiveFilters && (
              <div className={classes.filterChips} aria-label="Active filters">
                {activeFilters.map(filter=>(
                  <span className={classes.filterChip} key={filter.key}>
                    {filter.label}
                    <button type="button" onClick={filter.remove} aria-label={`Remove ${filter.label} filter`}>
                      <svg aria-hidden="true" viewBox="0 0 16 16" fill="none">
                        <path d="m4 4 8 8m0-8-8 8" />
                      </svg>
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  className={classes.filters__reset}
                  onClick={()=>{setSortBy(''); setYearFilter(''); setMinRating(0); setLanguageFilter('')}}
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {isFetching && !currentData ? (
        <div className="movieContainer" aria-busy="true" role="status">
          <span className="visually-hidden">Loading titles…</span>
          <MovieSkeleton count={PAGE_SIZE}/>
        </div>
      ) : currentData?.results?.length ? (
        <>
          <div className="movieContainer">
            {currentData.results.map((item,index)=><Movie item={item} type={type} key={item.id} isPriority={index === 0}/>)}
          </div>
          <Pagination currentPage={page} setPage={setPage} totalPages={currentData.total_pages}/>
        </>
      ) : (
        <p className={classes.emptyState} role="status">{emptyMessage}</p>
      )}
    </div>
  )
}

export default Movies
