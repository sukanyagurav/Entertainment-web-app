import React from 'react'
import classes from './MovieSkeleton.module.css'

const MovieSkeleton = ({count = 1}) => (
  <>
    {Array.from({length: count}, (_, index) => (
      <div className={`container_card ${classes.card}`} key={index} aria-hidden="true">
        <div className={classes.poster}>
          <span className={`skeletonShimmer ${classes.shimmer}`} />
        </div>
        <div className={classes.metadata}>
          <span className={`skeletonShimmer ${classes.shimmer} ${classes.metadataBar}`} />
        </div>
        <div className={classes.title}>
          <span className={`skeletonShimmer ${classes.shimmer} ${classes.titleBar}`} />
        </div>
      </div>
    ))}
  </>
)

export default MovieSkeleton
