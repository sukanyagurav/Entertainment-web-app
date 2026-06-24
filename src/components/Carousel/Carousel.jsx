import React, { useState } from 'react'
import { useGetInitialMoviesQuery,useGetInitialTvSeriesQuery } from '../services/movies'
import { Link } from 'react-router-dom'
import classes from './Carousel.module.css'
import { selectGenre } from '../services/currentGenre'
import { useDispatch } from 'react-redux'
import loadingImg from '../../assets/Spinner@1.25x-1.0s-200px-200px (1).svg'
import noMovieFound from '../../assets/no image found.jpg'



const Carousel = ({heading_name,type,tag,genreName}) => {
    const [page,setPage] = useState(1)
    const [featuredIndex, setFeaturedIndex] = useState(0)
  const {data,isFetching,error} = useGetInitialMoviesQuery({type,page,genreName})
  const dispatch = useDispatch()
  
  const handleNext = () => {
    if (featuredIndex < data?.results.length - 1) {
      setFeaturedIndex(featuredIndex + 1)
    }
  }
  
  const handlePrev = () => {
    if (featuredIndex > 0) {
      setFeaturedIndex(featuredIndex - 1)
    }
  }
  
  if(error){
    return <p style={{textAlign:'center'}}>Something went wrong try again after sometime!</p>
  }
  if(isFetching){
    return <img src={loadingImg} style={{width:'60px',height:'60px',marginInline:'auto'}}/>
  }
  
  const featuredMovie = data?.results[featuredIndex]
  const movies = data?.results || []
  
  return (
    <section className={classes.carousel}>
        <div className={classes.carousel_header}>
             <h2>{heading_name} <span className={classes.badge}>{tag}</span></h2>
             <Link to={`/${type}/genre/${genreName}`}>
                <button onClick={()=>dispatch(selectGenre(genreName))}>
                    See More
                </button>
             </Link>
        </div>
        
        {/* Featured Hero Section */}
        {featuredMovie && (
          <div 
            className={classes.featured_section}
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 50%), url('https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}')`
            }}
          >
            <div className={classes.featured_content}>
              <div className={classes.featured_info}>
                <div className={classes.trending_badge}>TRENDING</div>
                <h1 className={classes.featured_title}>
                  {type === 'movie' ? featuredMovie.title : featuredMovie.name}
                </h1>
                <div className={classes.featured_meta}>
                  <span>{type === 'movie' ? featuredMovie.release_date?.split('-')[0] : featuredMovie.first_air_date?.split('-')[0]}</span>
                  <span>•</span>
                  <span>{type === 'movie' ? 'Movie' : 'TV Series'}</span>
                  <span>•</span>
                  <span>{Math.floor((featuredMovie.runtime || 120) / 60)}h {(featuredMovie.runtime || 120) % 60}m</span>
                </div>
                <p className={classes.featured_description}>
                  {featuredMovie.overview}
                </p>
                <div className={classes.featured_buttons}>
                  <Link to={`/${type}/${featuredMovie.id}`}>
                    <button className={classes.watch_btn}>
                      ▶ Watch Now
                    </button>
                  </Link>
                  <button className={classes.add_btn}>+</button>
                </div>
              </div>
              <div className={classes.featured_image}>
                <img 
                  src={featuredMovie.poster_path ? `https://image.tmdb.org/t/p/w500${featuredMovie.poster_path}` : noMovieFound}
                  alt={type === 'movie' ? featuredMovie.title : featuredMovie.name}
                />
              </div>
            </div>
            
            {/* Navigation Dots */}
            <div className={classes.featured_dots}>
              {movies.slice(0, 5).map((_, index) => (
                <button
                  key={index}
                  className={`${classes.dot} ${index === featuredIndex ? classes.active_dot : ''}`}
                  onClick={() => setFeaturedIndex(index)}
                />
              ))}
            </div>
            
            {/* Navigation Arrows */}
            <button className={classes.nav_arrow_left} onClick={handlePrev}>
              ‹
            </button>
            <button className={classes.nav_arrow_right} onClick={handleNext}>
              ›
            </button>
          </div>
        )}
        
        <div className={classes.carousel_body}>
            {
               movies.slice(0,7).map(movie=>(
                    <div className="container_card" key={movie.id}>
                    <Link  to={`/${type}/${movie.id}`}>
                        <img src={movie.backdrop_path ? `https://image.tmdb.org/t/p/w500/${movie.backdrop_path }` : noMovieFound}  alt={movie.title} />
                        <div className="container_card_details">
                            <span>{type==='movie' ? movie.release_date?.split('-')[0] : movie.first_air_date?.split('-')[0]}</span> 
                            &#x2022;<span>{type === 'movie' ? 
                                    <svg class="active-NavLink" fill="currentColor" width="1em" height="1em" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M16.956 0H3.044A3.044 3.044 0 0 0 0 3.044v13.912A3.044 3.044 0 0 0 3.044 20h13.912A3.044 3.044 0 0 0 20 16.956V3.044A3.044 3.044 0 0 0 16.956 0ZM4 9H2V7h2v2Zm-2 2h2v2H2v-2Zm16-2h-2V7h2v2Zm-2 2h2v2h-2v-2Zm2-8.26V4h-2V2h1.26a.74.74 0 0 1 .74.74ZM2.74 2H4v2H2V2.74A.74.74 0 0 1 2.74 2ZM2 17.26V16h2v2H2.74a.74.74 0 0 1-.74-.74Zm16 0a.74.74 0 0 1-.74.74H16v-2h2v1.26Z"></path></svg>
                                :
                                <svg class="icon-nav" fill="currentColor" width="1em" height="1em" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M20 4.481H9.08l2.7-3.278L10.22 0 7 3.909 3.78.029 2.22 1.203l2.7 3.278H0V20h20V4.481Zm-8 13.58H2V6.42h10v11.64Zm5-3.88h-2v-1.94h2v1.94Zm0-3.88h-2V8.36h2v1.94Z"></path> </svg>
                            }</span>
                            <span> {type==='movie'?'Movie':'TV Series'}</span>
                        </div>
                        <h3 className="container_card_title">{type==='movie' ? movie.title : movie.name}</h3>
                    </Link>
                    </div>
                   
                ))
            }
        </div>
    </section>
  )
}

export default Carousel
