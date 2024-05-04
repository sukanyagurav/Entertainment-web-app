import React from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './Home/Home'
import Movies from './Movies/Movies'
import Tv from './Tv/Tv'
import RootLayout from './RootLayout.js'
import { Provider } from 'react-redux'
import store from './app/store.js'
import GenrePage from './GenrePage/GenrePage'
import Category from './Category/Category.jsx'
import axios from 'axios'
import MovieInformation from './MovieInformation/MovieInformation.jsx'
import Actor from './Actor/Actor.jsx'
const router = createBrowserRouter([
  {
    element:<RootLayout/>,
    children:[
      {
        path:'/',
        element:<Home/>,
      },
      {
        path:'/actors/:id',
        element:<Actor/>
      },
      { 
        path:'/movie',
        children:[
         {
          index:true,
          element:<Category/>,
          loader:async ()=>{
              const {data} = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.REACT_APP_TMDB_API_KEY}`)
              return data
          }
         },{
          path:'genre/:genre',
          element:<Movies/>
         },
         {
          path:'search/:query',
          element:<Movies/>
         },
         {
          path:':id',
          element:<MovieInformation/>
         }
        ]
      },
      {
        path:'/tv',
        children:[
          { index:true,
            element:<Category/>,
            loader:async ()=>{
              const {data} =await axios.get(`https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.REACT_APP_TMDB_API_KEY}`)
              return data
            }
          },
          {
            path:'genre/:genre',
            element:<Movies/>
          },
          {
            path:'search/:query',
            element:<Movies/>
           },
          {
            path:':id',
            element:<MovieInformation/>
          }
        ]
      },
      { 
        path:'/search/:query',
        element:<Movies/>
       },
    ]
  }
])
const App = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>

  )
}

export default App
