import React from 'react'
import { useLoaderData,Link } from 'react-router-dom'
import classes from './Category.module.css'
import { useDispatch,useSelector } from 'react-redux'
import { selectGenre } from '../services/currentGenre'
const Category = () => {
  const data = useLoaderData()
  const disptach = useDispatch();
  return (
    <ul className={classes.genresContainer}>
      {data?.genres?.map(genre=>(
        <Link to={`genre/${genre.name.toLowerCase()}`}>
        <button onClick={()=>disptach(selectGenre(genre.id))}>
         <li key={genre.id} >
            <span> {genre.name} </span>
        </li>
        </button>
        </Link>
      ))}     
    </ul>
  )
}

export default Category
