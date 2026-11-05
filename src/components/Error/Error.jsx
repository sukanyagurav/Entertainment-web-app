import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import NavBar from '../NavBar/NavBar'
import classes from './Error.module.css'

const Error = () => {
  const navigate = useNavigate()

  return (
    <div className='content'>
      <header>
        <NavBar/>
      </header>
      <main>
        <div className={classes.error}>
          <span className={classes.error__code}>404</span>
          <h1 className={classes.error__title}>Page not found</h1>
          <p className={classes.error__message}>
            Sorry, the page you are looking for doesn’t exist or has been moved.
            Let us help you get back on track.
          </p>
          <div className={classes.error__actions}>
            <Link to='/' className={classes.error__btn + ' ' + classes['error__btn--primary']}>
              Back to Home
            </Link>
            <button
              type='button'
              className={classes.error__btn + ' ' + classes['error__btn--ghost']}
              onClick={() => navigate(-1)}
            >
              Go back
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Error