import React, { useRef } from 'react'
import classes from './MovieInformatio.module.css'
import { useParams,useLocation,Link } from 'react-router-dom'
import { useGetMovieQuery,useGetRecommendationsQuery } from '../services/movies'
import loadingImg from '../../assets/Spinner@1.25x-1.0s-200px-200px (1).svg'
import Rating from '../Rating/Rating'
import noMovieFound from '../../assets/no image found.jpg'
import MovieImage from '../MovieImage/MovieImage'
import { selectGenre } from '../services/currentGenre'
import { useDispatch } from 'react-redux'
import Movie from '../Movie/Movie'
import { useState } from 'react'
import WatchProviders from './WatchProviders'
const MovieInformation = () => {

  const castRef = useRef(null)
  const path = useLocation()
  const searchTermValidation=path.pathname.split('/')[1]
  const dispatch = useDispatch()
  let type =''
  if(searchTermValidation === 'movie'){
    type='movie'
  }
  else if(searchTermValidation === 'tv'){
    type='tv'
  }
  const [isOpen,setIsOpen] =useState(false)
  const {id} = useParams()
  const {data,isFetching,error} = useGetMovieQuery({type,id})
  const {data:recommendations,isFetching:isRecommendationsFetching}= useGetRecommendationsQuery({type,movie_id:id,list:'recommendations'})
  const topCast = (data?.credits?.cast || [])
    .filter(actor=>actor.known_for_department === 'Acting')
    .sort((a,b)=>b.popularity - a.popularity)
    .slice(0,8)
    .filter(actor=>actor.profile_path)

  if(error){
    return <p style={{textAlign:'center'}}>Something went wrong, Please try again after sometime!.
    <Link to="/">Home</Link></p>
  } 
  if(isFetching){
    return <img src={loadingImg} style={{width:'60px',height:'60px',marginInline:'auto'}}/>
  }
 
  function onClose(){
    setIsOpen(false)
  }

  function scrollCast(direction){
    const castList = castRef.current
    if(!castList) return

    const maxScroll = castList.scrollWidth - castList.clientWidth
    if(direction < 0 && castList.scrollLeft <= 0){
      castList.scrollTo({left:maxScroll,behavior:'smooth'})
      return
    }
    if(direction > 0 && castList.scrollLeft >= maxScroll - 1){
      castList.scrollTo({left:0,behavior:'smooth'})
      return
    }

    castList.scrollBy({left:direction * 300,behavior:'smooth'})
  }
 
  return (
    <>
  <article className={classes.movieInfoContainer}>
        <Link
          className={`${classes.backLink} uiTooltip`}
          data-tooltip="Back"
          data-tooltip-position="below"
          aria-label="Back"
          to={path.state?.from || '/'}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5m0 0 7 7m-7-7 7-7" />
          </svg>
        </Link>
        <MovieImage
          frameClassName={classes.movieImageFrame}
          className={classes.movieImage}
          src={data?.poster_path ? `https://image.tmdb.org/t/p/w500${data?.poster_path}` : noMovieFound}
          alt={(type==='movie') ? data?.original_title : data?.original_name}
        />
        <div className={classes.movieContent}>
          <h2>{(type==='movie') ? data?.original_title : data?.original_name} ({(type==='movie') ? data?.release_date.split('-')[0] : data?.first_air_date.split('-')[0]})</h2>
          <span className={classes.tagLine}>{data?.tagline}</span>
         
          <ul className={classes.movie_stat}>
            <li><Rating rating={data?.vote_average}/> </li>
            { data?.runtime && <li><h6>{data?.runtime}min</h6></li>}
            {data?.seasons && <li><h6>{data?.seasons >1 ? 'Seasons' : 'Season'}: {data?.seasons.length}</h6></li>}
            <li><h6>{data?.spoken_languages.length > 0? data?.spoken_languages[0].name : ''}</h6></li>
          </ul>
          <ul className={`${classes.links} ${classes.mediaActions}`}>
            <li className="uiTooltip" data-tooltip="Trailer">
              <button
                className={classes.primaryAction}
                onClick={()=>setIsOpen(true)}
                disabled={!data?.videos?.results?.[0]?.key}
                aria-label="Trailer"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="M7 4v4m5-4v4m5-4v4M7 16v4m5-4v4m5-4v4M3 9h18m-18 6h18" />
                </svg>
              </button>
            </li>
            <li className="uiTooltip" data-tooltip="Website">
              <a
                className={classes.secondaryAction}
                href={data?.homepage || undefined}
                target="_blank"
                rel="noreferrer"
                aria-disabled={!data?.homepage}
                tabIndex={data?.homepage ? undefined : -1}
                aria-label="Website"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                  <path d="M10 13.5a5 5 0 0 0 7.1 0l3-3a5 5 0 0 0-7.1-7.1l-1.7 1.7m2.7 5.4a5 5 0 0 0-7.1 0l-3 3a5 5 0 0 0 7.1 7.1l1.7-1.7" />
                </svg>
              </a>
            </li>
          </ul>
          <p className={classes.headings}>Overview:</p>
          <p className={classes.description}>{data?.overview}</p>
          <p className={classes.headings}>Genre</p>
          <ul className={classes.movie_genres}>
          {data?.genres.map(genre=>(
              <li><Link to={`/${type}/genre/${genre.name.toLowerCase()}`}>
              <button onClick={()=>dispatch(selectGenre(genre.id))}>
                  {genre.name}
              </button>
              </Link></li>
            ))}
          </ul>
          <p className={classes.headings}>Top Cast:</p>
            {topCast.length > 0 ? <div className={classes.castCarousel}>
            <button
              className={`${classes.castArrowLeft} railArrow`}
              onClick={()=>scrollCast(-1)}
              aria-label="Scroll cast left"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5m0 0 7 7m-7-7 7-7" />
              </svg>
            </button>
            <ul className={classes.movie_cast} ref={castRef}>
            {topCast.map(actor=>(<li key={actor.id}>
              <Link to={`/actors/${actor.id}`}>
                <img src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}  loading='lazy' className={classes.actor__image}/>
                    <span>{actor.name ? actor.name : actor.original_name}</span>
                </Link>
              </li>))}
            </ul>
            <button
              className={`${classes.castArrowRight} railArrow`}
              onClick={()=>scrollCast(1)}
              aria-label="Scroll cast right"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14m0 0-7-7m7 7-7 7" />
              </svg>
            </button>
          </div> : <p>No cast</p>}
        </div>
      
    </article>
    <WatchProviders type={type} id={id}/>
    <section className="CommonContainer">
            <h3 className="headings">You may also like</h3>
            <div className="movieContainer">
                {
                  recommendations.results.length > 0 ? recommendations.results.slice(0,12).map((item,index)=>(
                    <Movie item={item} type={type} isPriority={index === 0}/>
                  ))
                  : <p style={{textAlign:'center'}}>Sorry, nothing was found.</p>
                }
                </div>
    </section>
  {isOpen && 
    <>
        <div className="backdrop" onClick={onClose}/>
        <dialog open={isOpen} className='modal'> 
          <button onClick={onClose} className='close'> X</button>
        <iframe autoPlay title="trailer" src={`https://www.youtube.com/embed/${data.videos.results[0].key}`}/>
        </dialog>
    </>
  }
    </>
  
  )
}

export default MovieInformation
