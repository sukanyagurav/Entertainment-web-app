import React,{useState} from 'react'
import { useLocation,useParams,Link } from 'react-router-dom'
import { useGetInitialMoviesQuery } from '../services/movies';

import { useSelector } from 'react-redux';
import loadingImg from '../../assets/Spinner@1.25x-1.0s-200px-200px (1).svg'
import { selectGenre } from '../services/currentGenre'

import Movie from '../Movie/Movie';
import Pagination from '../Pagination/Pagination';
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
  const {data,error,isFetching} = useGetInitialMoviesQuery({type,genreName,page,searchQuery})
  function makeCapital(sentence){
    const words = sentence.split(" ");
    return words.map((word) => { 
        return word[0].toUpperCase() + word.substring(1); 
    }).join(" ")
  }
 
  if(error){
    return <p style={{textAlign:'center'}}>Something went wrong, Please try again after sometime!.</p>
  } 
  if(isFetching){
    return <img src={loadingImg} style={{width:'60px',height:'60px',marginInline:'auto'}}/>
  }

  return (
    <div  style={{display:'flex',flexDirection:'column',justifyContent:'center'}}>
    <section className="CommonContainer">
      <h2>{searchQuery ? `Found ${data?.total_results} results for ${searchQuery}` : makeCapital(genre.replace('_',' '))}</h2>
      <div className="movieContainer">
            {
                data?.results.map(item=><Movie item={item} type={type}/>)
            }
      </div>
      </section>
      <Pagination currentPage={page} setPage={setPage} totalPages= {data?.total_pages}/>
    </div>
  )
}

export default Movies
