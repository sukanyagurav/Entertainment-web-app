import React, { useState } from 'react'
import classes from './MovieImage.module.css'

const MovieImage = ({src,srcSet,sizes,alt,className,frameClassName,loading,fetchPriority}) => {
  const [loadedSource,setLoadedSource] = useState(null)
  const isLoaded = loadedSource === src

  return (
    <span className={`${classes.frame} ${frameClassName || ''}`}>
      {!isLoaded && <span className={`skeletonShimmer ${classes.skeleton}`} aria-hidden="true" />}
      <img
        className={`${classes.image} ${className || ''} ${isLoaded ? classes.loaded : ''}`}
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        onLoad={()=>setLoadedSource(src)}
        onError={()=>setLoadedSource(src)}
      />
    </span>
  )
}

export default MovieImage
