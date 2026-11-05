import React, { useEffect,useState } from 'react'
import { useParams,Link,useNavigate } from 'react-router-dom'
import loadingImg from '../../assets/Spinner@1.25x-1.0s-200px-200px (1).svg'
import Movie from '../Movie/Movie'
import classes from './Actor.module.css'
import { useGetActorsDetailysByIdQuery } from '../services/movies'
import Pagination from '../Pagination/Pagination'
const Actor = () => {
 const {id} =  useParams()
 const navigate= useNavigate()
 const {data,isFetching,error} = useGetActorsDetailysByIdQuery({id:id})
 const [page,setPage] = useState(1)
 const [tvPage,setTvPage] = useState(1)
 let unqiueTV=[]
 unqiueTV = data?.tv_credits?.cast.filter(tv=>{
  const isDuplicate = unqiueTV.includes(tv.name)
  if(!isDuplicate)
  {
    unqiueTV.push(tv.name)
    return true
  }
  return false
})
if(error){
  return <p style={{textAlign:'center'}}>Something went wrong, Please try again after sometime!.
  <Link to="/">Home</Link></p>
} 
  if(isFetching){
    return <img src={loadingImg} style={{width:'60px',height:'60px',marginInline:'auto'}}/>
  }
 
  return (
  <>
    <button
      type="button"
      className={`${classes.iconButton} ${classes.backButton} uiTooltip`}
      data-tooltip="Back"
      aria-label="Go back"
      onClick={() => navigate(-1)}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <path d="M19 12H5m0 0 7 7m-7-7 7-7" />
      </svg>
    </button>
    <section className={classes.actorsInfo}>
        <img className={classes.image}
              src={`https://image.tmdb.org/t/p/w780/${data?.profile_path}`}
              alt={data.name}
            />
            <div className={classes.content}>
                <div className={classes.nameRow}>
                  <h2>{data?.name}</h2>
                  {data?.imdb_id && (
                    <a
                      className={`${classes.iconButton} uiTooltip`}
                      data-tooltip="IMDb"
                      href={`https://www.imdb.com/name/${data.imdb_id}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="View IMDb profile"
                    >
                      <span aria-hidden="true" className={classes.imdbIcon}>IMDb</span>
                    </a>
                  )}
                </div>
                <h4>Born: {new Date(data?.birthday).toDateString()}</h4>
                <p> {data?.biography || 'Sorry, no biography yet....'}</p>
            </div>
    </section>
    <div>
        <section className="CommonContainer" style={{display:'flex',flexDirection:'column'}}>
            <h2 className='headings'>Top Movies</h2>
            <div className="movieContainer">
            {
              [...data?.movie_credits?.cast].slice(page * 8 - 8, page * 8).map((movie,index)=><Movie item={movie} type={'movie'} isPriority={index === 0}/>)
            
            }
            </div>
            <Pagination  currentPage ={page} setPage ={setPage} totalPages={Math.ceil(data?.movie_credits?.cast.length / 8)}/>
        </section>
        <section className="CommonContainer" style={{display:'flex',flexDirection:'column'}}>
            <h2 className='headings'>Top Tv Series</h2>
            <div className="movieContainer">
            {
              [...unqiueTV].slice(tvPage * 8 - 8, tvPage * 8).map((tv,index)=><Movie item={tv} type={'tv'} isPriority={index === 0}/>)
            }
            </div>
            <Pagination   currentPage ={tvPage} setPage ={setTvPage} totalPages={Math.ceil(unqiueTV?.length / 8)}/>
        </section>
    </div>
  </>
  )
}

export default Actor
  {/* [...data?.movie_credits?.cast].filter(movie=>movie.vote_average > 7).slice(0,8).map(movie=><Movie item={movie} type={'movie'}/>) */}