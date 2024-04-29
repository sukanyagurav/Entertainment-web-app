import React,{useState} from 'react'
import { useLocation,useParams,Link } from 'react-router-dom'
import { useGetInitialMoviesQuery } from '../services/movies';
import classes from './Movies.module.css';
import { useSelector } from 'react-redux';
import loadingImg from '../../assets/Spinner@1.25x-1.0s-200px-200px (1).svg'
import { selectGenre } from '../services/currentGenre'
const Movies = () => {
  const path = useLocation()
  let type=path.pathname.split('/')[1]
  console.log(type)
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
  const {data,error,isFetching} = useGetInitialMoviesQuery({type,genreName,page,searchQuery})
  function makeCapital(sentence){
    const words = sentence.split(" ");
    return words.map((word) => { 
        return word[0].toUpperCase() + word.substring(1); 
    }).join(" ")
  }
  console.log(data?.results)
  if(error){
    return <p style={{textAlign:'center'}}>Something went wrong, Please try again after sometime!.</p>
  } 
  if(isFetching){
    return <img src={loadingImg} style={{width:'60px',height:'60px',marginInline:'auto'}}/>
  }

  return (
    <section style={{padding:'1.2rem'}}>
      <h2>{searchQuery ? `Found ${data?.total_results} results for ${searchQuery}` : makeCapital(genre.replace('_',' '))}</h2>
      <div className={classes.container}>
      {
                data?.results.map(item=>(
                    <div className="container_card">
                    <Link  to={`/${type}/${item.id}`}>
                        <img src={item.poster_path ? `https://image.tmdb.org/t/p/w500/${item.poster_path }` : 'https://www.fillmurray.com/200/300'}  alt={(type==='movie'|| item.media_type ==='movie')} />
                        <div className="container_card_details">
                            <span>{(type==='movie'|| item.media_type ==='movie') ? item.release_date?.split('-')[0] : item.first_air_date?.split('-')[0]}</span> 
                            &#x2022;<span>{(type === 'movie' || item.media_type ==='movie') ? 
                                    <svg class="active-NavLink" fill="currentColor" width="1em" height="1em" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M16.956 0H3.044A3.044 3.044 0 0 0 0 3.044v13.912A3.044 3.044 0 0 0 3.044 20h13.912A3.044 3.044 0 0 0 20 16.956V3.044A3.044 3.044 0 0 0 16.956 0ZM4 9H2V7h2v2Zm-2 2h2v2H2v-2Zm16-2h-2V7h2v2Zm-2 2h2v2h-2v-2Zm2-8.26V4h-2V2h1.26a.74.74 0 0 1 .74.74ZM2.74 2H4v2H2V2.74A.74.74 0 0 1 2.74 2ZM2 17.26V16h2v2H2.74a.74.74 0 0 1-.74-.74Zm16 0a.74.74 0 0 1-.74.74H16v-2h2v1.26Z"></path></svg>
                                :
                                <svg class="icon-nav" fill="currentColor" width="1em" height="1em" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M20 4.481H9.08l2.7-3.278L10.22 0 7 3.909 3.78.029 2.22 1.203l2.7 3.278H0V20h20V4.481Zm-8 13.58H2V6.42h10v11.64Zm5-3.88h-2v-1.94h2v1.94Zm0-3.88h-2V8.36h2v1.94Z"></path> </svg>
                            }</span>
                            <span> {(type==='movie'|| item.media_type ==='movie')?'Movie':'TV Series'}</span>
                        </div>
                        <h3 className="container_card_title">{(type==='movie'|| item.media_type ==='movie') ? item.title : item.name}</h3>
                    </Link>
                    </div>
                   
                ))
            }
      </div>
    </section>
  )
}

export default Movies
