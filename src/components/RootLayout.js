import React from 'react'
import NavBar from './NavBar/NavBar'
import { Outlet } from 'react-router-dom'
import SearchInput from './SearchInput/SearchInput'
const RootLayout = () => {
  return (
    <div className='content'>
      <header>
         <NavBar/>
      </header>
      <main>
        <SearchInput/>
      
          <Outlet/>

     
      </main>
    </div>
    
  )
}

export default RootLayout
