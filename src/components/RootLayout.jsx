import React, { useEffect } from 'react'
import NavBar from './NavBar/NavBar'
import { Outlet, useLocation } from 'react-router-dom'

const ScrollToTop = () => {
  const {pathname} = useLocation()

  useEffect(() => {
    window.scrollTo(0,0)
  }, [pathname])

  return null
}

const RootLayout = () => {
  return (
    <div className='content'>
      <ScrollToTop/>
      <header>
         <NavBar/>
      </header>
      <main className="page-content">
          <Outlet/>
      </main>
    </div>
  )
}

export default RootLayout
