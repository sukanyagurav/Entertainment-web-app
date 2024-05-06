import React from 'react'
import classes from './MovieInformatio.module.css'
import { useParams,useLocation,Link } from 'react-router-dom'
import { useGetMovieQuery,useGetRecommendationsQuery } from '../services/movies'
import loadingImg from '../../assets/Spinner@1.25x-1.0s-200px-200px (1).svg'
import Rating from '../Rating/Rating'
import noMovieFound from '../../assets/no image found.jpg'
import { selectGenre } from '../services/currentGenre'
import { useDispatch } from 'react-redux'
import Movie from '../Movie/Movie'
import { useState } from 'react'
const MovieInformation = () => {

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
 
  return (
    <>
  <article className={classes.movieInfoContainer}>
        <img className={classes.movieImage} src={data?.poster_path ? `https://image.tmdb.org/t/p/w500${data?.poster_path}` :noMovieFound} alt={(type==='movie') ? data?.original_title : data?.original_name}/>
        <div className={classes.movieContent}>
          <h2>{(type==='movie') ? data?.original_title : data?.original_name} ({(type==='movie') ? data?.release_date.split('-')[0] : data?.first_air_date.split('-')[0]})</h2>
          <span className={classes.tagLine}>{data?.tagline}</span>
         
          <ul className={classes.movie_stat}>
            <li><Rating rating={data?.vote_average}/> </li>
            { data?.runtime && <li><h6>{data?.runtime}min</h6></li>}
            {data?.seasons && <li><h6>{data?.seasons >1 ? 'Seasons' : 'Season'}: {data?.seasons.length}</h6></li>}
            <li><h6>{data?.spoken_languages.length > 0? data?.spoken_languages[0].name : ''}</h6></li>
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
          <ul className={classes.movie_cast}>
          { [...data?.credits?.cast].sort((a,b)=> b.popularity - a.popularity).filter(actor=>actor.known_for_department == 'Acting').slice(0,8).map(actor=>(actor['profile_path'] && <li>
            <Link to={`/actors/${actor.id}`}>
              <img src={`https://image.tmdb.org/t/p/w500${actor['profile_path']}`}  loading='lazy' className={classes.actor__image}/>
                  <span>{actor.name ? actor.name : actor.original_name}</span>
              </Link>
                 
              </li>))}
          </ul>
          <ul className={classes.links}>
            <li><Link to={data?.homepage} target='_blank' style={{opacity:`${data?.homepage ? '1' : '0.5' }`,
            pointerEvents: data?.homepage ? data?.homepage : 'none',
            cursor:`${data?.homepage ? 'pointer' : 'not-allowed' }`}}>
            
            Website <i class="fa-solid fa-link"></i></Link></li>
            <li><button  onClick={()=>{setIsOpen(true)}} style={{opacity:`${data?.videos?.results[0]?.key ? '1' : '0.5' }`,
            cursor:`${data?.videos?.results[0]?.key ? 'pointer' : 'not-allowed' }`
            }} disabled={data?.videos?.results[0]?.key ? false :true}>Trailer <i class="fa-solid fa-film"></i></button></li>
            <li><Link  to="/">Back <i class="fa-solid fa-arrow-left"></i></Link></li>
          </ul>
         
        </div>
      
    </article>
    <section className="CommonContainer">
            <h3 className="headings">You may also like</h3>
            <div className="movieContainer">
                {
                  recommendations.results.length > 0 ? recommendations.results.slice(0,12).map(item=>(
                    <Movie item={item} type={type}/>
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
