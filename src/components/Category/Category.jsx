import React from 'react'
import { useLoaderData,Link } from 'react-router-dom'
import classes from './Category.module.css'
import { useDispatch } from 'react-redux'
import { selectGenre } from '../services/currentGenre'
const Category = () => {
  const data = useLoaderData()
  const dispatch = useDispatch()
  return (
    <>
    <h1 className={classes.heading}>Explore genres</h1>
    <ul className={classes.genresContainer}>
      {data?.genres?.map(genre=>(
        <li key={genre.id}>
          <Link
            to={`genre/${genre.name.toLowerCase()}`}
            onClick={()=>dispatch(selectGenre(genre.id))}
          >
            {genre.name}
          </Link>
        </li>
      ))}     
    </ul>
    </>
  )
}

export default Category
