import React, { lazy, Suspense } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './app/store.js'
import axios from 'axios'
import Home from './Home/Home'
import RootLayout from './RootLayout.jsx'

const Movies = lazy(() => import('./Movies/Movies'))
const Category = lazy(() => import('./Category/Category.jsx'))
const MovieInformation = lazy(() => import('./MovieInformation/MovieInformation.jsx'))
const Actor = lazy(() => import('./Actor/Actor.jsx'))
const Error = lazy(() => import('./Error/Error.jsx'))

const router = createBrowserRouter([
  {
    element:<RootLayout/>,
    errorElement:<Error/>,
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
              const {data} = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${import.meta.env.VITE_TMDB_API_KEY || import.meta.env.REACT_APP_TMDB_API_KEY}`)
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
              const {data} =await axios.get(`https://api.themoviedb.org/3/genre/tv/list?api_key=${import.meta.env.VITE_TMDB_API_KEY || import.meta.env.REACT_APP_TMDB_API_KEY}`)
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
      <Suspense fallback={<div role="status" className="visually-hidden">Loading page…</div>}>
        <RouterProvider router={router}/>
      </Suspense>
    </Provider>

  )
}

export default App
