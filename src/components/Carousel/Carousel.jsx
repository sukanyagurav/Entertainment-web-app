import React, { useState } from 'react'
import { useGetInitialMoviesQuery,useGetInitialTvSeriesQuery } from '../services/movies'
import { Link } from 'react-router-dom'
import classes from './Carousel.module.css'
import { selectGenre } from '../services/currentGenre'
import { useDispatch } from 'react-redux'
import loadingImg from '../../assets/Spinner@1.25x-1.0s-200px-200px (1).svg'




const Carousel = ({heading_name,type,tag,genreName}) => {
    const [page,setPage] = useState(1)
  const {data,isFetching,error} = useGetInitialMoviesQuery({type,page,genreName})
  const dispatch = useDispatch()
  if(error){
    return <p style={{textAlign:'center'}}>Something went wrong try again after sometime!</p>
  }
  if(isFetching){
    return <img src={loadingImg} style={{width:'60px',height:'60px',marginInline:'auto'}}/>
  }
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
        <div className={classes.carousel_body}>
            {
                data?.results.map(movie=>(
                    <div className="container_card">
                    <Link  to={`/${type}/${movie.id}`}>
                        <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path }` : 'https://www.fillmurray.com/200/300'}  alt={movie.title} />
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
