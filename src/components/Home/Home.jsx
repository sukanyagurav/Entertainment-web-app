import React from 'react'
import Carousel from '../Carousel/Carousel'

const Home = () => {
  return (
    <div style={{padding:'2rem 1rem',display:'flex',flexDirection:'column',gap:'3rem'}}>
     <Carousel heading_name="Now Playing" genreName="now_playing" tag="movie" type="movie"/>
     <Carousel heading_name="Popular" genreName="popular" tag="movie" type="movie"/>
     <Carousel heading_name="Top Rated" genreName="top_rated" tag="movie" type="movie"/>
     <Carousel heading_name="Upcoming" genreName="upcoming" tag="movie" type="movie"/>
    
     <Carousel heading_name="Top Rated" genreName="top_rated" tag="TV SERIES" type="tv"/>
     <Carousel heading_name="Popular" genreName="popular" tag="TV SERIES" type="tv"/>
     <Carousel heading_name="On The Air" genreName="on_the_air" tag="TV SERIES" type="tv"/>
     <Carousel heading_name="Airing Today" genreName="airing_today" tag="TV SERIES" type="tv"/>
    </div>
  )
}

export default Home
