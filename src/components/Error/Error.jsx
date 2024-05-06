import React from 'react'
import NavBar from '../NavBar/NavBar'
import SearchInput from '../SearchInput/SearchInput'

const Error = () => {
  return (
    <div className='content'>
    <header>
       <NavBar/>
    </header>
    <main>
      <SearchInput/>
    
        <h1 style={{textAlign:'center'}}>An error occurred!</h1>
        <p style={{textAlign:'center'}}>Could not find page!</p>
   
    </main>
  </div>
  )
}

export default Error
