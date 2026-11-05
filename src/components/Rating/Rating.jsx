import React from 'react'
import classes from './Rating.module.css'

const MAX_STARS = 5
// TMDB vote_average is on a 0-10 scale; convert it to a 0-5 star rating.
const toStarScale = (rating) => Math.max(0, Math.min(10, rating ?? 0)) / 2

const Rating = ({ rating }) => {
  const score = toStarScale(rating)

  return (
    <div className={classes.rating} aria-label={`Rating ${score.toFixed(1)} out of 5`}>
      <div className={classes.rating__stars}>
        {Array.from({ length: MAX_STARS }, (_, index) => {
          const starValue = index + 1
          // Fill fraction for this star: 0, partial, or 1.
          const fill =
            score >= starValue ? 1 : score > index ? score - index : 0

          return (
            <span key={index} className={classes.rating__star}>
            <svg className={`${classes.rating__starIcon} ${classes.rating__starEmpty}`} viewBox="0 0 24 24" aria-hidden="true">
              <path d="m12 2 2.9 6 6.6.9-4.8 4.7 1.1 6.6-5.8-3.1-5.8 3.1 1.1-6.6-4.8-4.7 6.6-.9L12 2Z" />
            </svg>
            {fill > 0 && (
              <svg
                className={`${classes.rating__starIcon} ${classes.rating__starFilled}`}
                viewBox="0 0 24 24"
                  aria-hidden="true"
                style={{
                  clipPath: `polygon(0 0, ${fill * 100}% 0, ${fill * 100}% 100%, 0 100%)`,
                }}
              >
                <path d="m12 2 2.9 6 6.6.9-4.8 4.7 1.1 6.6-5.8-3.1-5.8 3.1 1.1-6.6-4.8-4.7 6.6-.9L12 2Z" />
              </svg>
            )}
            </span>
          )
        })}
      </div>
      <span className={classes.rating__value}>{score.toFixed(1)}</span>
    </div>
  )
}

export default Rating