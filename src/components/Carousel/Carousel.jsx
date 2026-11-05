import React, { useState, useRef, useEffect } from 'react'
import { useGetInitialMoviesQuery } from '../services/movies'
import { Link, useLocation } from 'react-router-dom'
import classes from './Carousel.module.css'
import { selectGenre } from '../services/currentGenre'
import { useDispatch } from 'react-redux'
import noMovieFound from '../../assets/no image found.jpg'
import MovieImage from '../MovieImage/MovieImage'
import MovieSkeleton from '../Movie/MovieSkeleton'
import { getTmdbImageSrcSet, getTmdbImageUrl } from '../MovieImage/tmdbImages'

const SCROLL_STEP = 300
const INITIAL_SKELETON_COUNT = 6


const Carousel = ({heading_name,type,tag,genreName,isPriority = false}) => {
    const [hasEnteredViewport,setHasEnteredViewport] = useState(isPriority)
    const scrollRef = useRef(null)
    const sectionRef = useRef(null)
    const shouldLoad = isPriority || hasEnteredViewport

  const {data,isFetching,error,refetch} = useGetInitialMoviesQuery(
    {type,page:1,genreName},
    {skip:!shouldLoad}
  )
  const dispatch = useDispatch()
  const location = useLocation()
  const movies = data?.results || []

  useEffect(() => {
    if(shouldLoad) return

    const section = sectionRef.current
    if(!section) return
    if(typeof IntersectionObserver === 'undefined'){
      setHasEnteredViewport(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if(entry.isIntersecting){
        setHasEnteredViewport(true)
        observer.disconnect()
      }
    }, {rootMargin:'500px 0px'})
    observer.observe(section)
    return () => observer.disconnect()
  }, [shouldLoad])

  const scrollTo = (direction) => {
    const el = scrollRef.current
    if (!el) return

    if (direction === -1 && el.scrollLeft === 0) {
      el.scrollTo({ left: el.scrollWidth - el.clientWidth, behavior: 'smooth' })
      return
    }

    const amount = direction * SCROLL_STEP
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }

  if(error && movies.length === 0){
    return <p style={{textAlign:'center'}}>Something went wrong try again after sometime!</p>
  }
  return (
    <section className={classes.carousel} ref={sectionRef}>
        <div className={classes.carousel_header}>
             <h2>{heading_name} <span className={classes.badge}>{tag}</span></h2>
             <Link
               className={classes.seeMore}
               to={`/${type}/genre/${genreName}`}
               onClick={()=>dispatch(selectGenre(genreName))}
             >
               See more
             </Link>
        </div>

        <div className={classes.carousel_body_wrapper}>
          <button
            className={`${classes.carousel_arrow_left} railArrow`}
            onClick={() => scrollTo(-1)}
            aria-label="Scroll left"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5m0 0 7 7m-7-7 7-7" />
            </svg>
          </button>
          <div className={classes.carousel_body} ref={scrollRef} aria-busy={shouldLoad && isFetching && movies.length === 0}>
            {
               movies.map((movie,index)=>(
                    <div className="container_card" key={movie.id}>
                    <Link to={`/${type}/${movie.id}`} state={{from:location}}>
                        <MovieImage
                          src={getTmdbImageUrl(movie.poster_path || movie.backdrop_path) || noMovieFound}
                          srcSet={getTmdbImageSrcSet(movie.poster_path || movie.backdrop_path)}
                          sizes="184px"
                          alt={movie.title || movie.name || 'Title artwork'}
                          loading={isPriority && index === 0 ? undefined : 'lazy'}
                          fetchPriority={isPriority && index === 0 ? 'high' : undefined}
                        />
                        <div className="container_card_details">
                            <span>{type==='movie' ? movie.release_date?.split('-')[0] : movie.first_air_date?.split('-')[0]}</span>
                            &#x2022;<span>{type === 'movie' ?
                                    <svg aria-hidden="true" className="active-NavLink" fill="currentColor" width="1em" height="1em" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M16.956 0H3.044A3.044 3.044 0 0 0 0 3.044v13.912A3.044 3.044 0 0 0 3.044 20h13.912A3.044 3.044 0 0 0 20 16.956V3.044A3.044 3.044 0 0 0 16.956 0ZM4 9H2V7h2v2Zm-2 2h2v2H2v-2Zm16-2h-2V7h2v2Zm-2 2h2v2h-2v-2Zm2-8.26V4h-2V2h1.26a.74.74 0 0 1 .74.74ZM2.74 2H4v2H2V2.74A.74.74 0 0 1 2.74 2ZM2 17.26V16h2v2H2.74a.74.74 0 0 1-.74-.74Zm16 0a.74.74 0 0 1-.74.74H16v-2h2v1.26Z"></path></svg>
                                :
                                <svg aria-hidden="true" className="icon-nav" fill="currentColor" width="1em" height="1em" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M20 4.481H9.08l2.7-3.278L10.22 0 7 3.909 3.78.029 2.22 1.203l2.7 3.278H0V20h20V4.481Zm-8 13.58H2V6.42h10v11.64Zm5-3.88h-2v-1.94h2v1.94Zm0-3.88h-2V8.36h2v1.94Z"></path> </svg>
                            }</span>
                            <span> {type==='movie'?'Movie':'TV series'}</span>
                        </div>
                        <h3
                          className={`container_card_title ${classes.carousel_title}`}
                          title={type==='movie' ? movie.title : movie.name}
                        >
                          {type==='movie' ? movie.title : movie.name}
                        </h3>
                    </Link>
                    </div>

                ))
            }
            {shouldLoad && isFetching && movies.length === 0 && <MovieSkeleton count={INITIAL_SKELETON_COUNT}/>}
          </div>
          <button
            className={`${classes.carousel_arrow_right} railArrow`}
            onClick={() => scrollTo(1)}
            aria-label="Scroll right"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14m0 0-7-7m7 7-7 7" />
            </svg>
          </button>
        </div>
        {error && movies.length > 0 && (
          <p role="alert">Could not refresh titles. <button onClick={refetch}>Retry</button></p>
        )}
    </section>
  )
}

export default Carousel