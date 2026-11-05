import { getTmdbImageSrcSet, getTmdbImageUrl } from './tmdbImages'

describe('TMDB image URLs', () => {
  it('builds a responsive poster source set', () => {
    expect(getTmdbImageUrl('/poster.jpg')).toBe('https://image.tmdb.org/t/p/w342/poster.jpg')
    expect(getTmdbImageSrcSet('/poster.jpg')).toBe(
      'https://image.tmdb.org/t/p/w185/poster.jpg 185w, https://image.tmdb.org/t/p/w342/poster.jpg 342w, https://image.tmdb.org/t/p/w500/poster.jpg 500w'
    )
  })

  it('omits remote sources when there is no poster path', () => {
    expect(getTmdbImageUrl(undefined)).toBeUndefined()
    expect(getTmdbImageSrcSet(undefined)).toBeUndefined()
  })
})
