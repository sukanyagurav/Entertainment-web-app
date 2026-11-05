const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'
const IMAGE_WIDTHS = [185, 342, 500]

export const getTmdbImageUrl = (path, width = 342) =>
  path ? `${IMAGE_BASE_URL}/w${width}${path}` : undefined

export const getTmdbImageSrcSet = path =>
  path
    ? IMAGE_WIDTHS.map(width => `${getTmdbImageUrl(path, width)} ${width}w`).join(', ')
    : undefined
