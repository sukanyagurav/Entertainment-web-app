import React from 'react'
import { act, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Carousel from './Carousel'

const querySpy = vi.hoisted(() => vi.fn())
const observers = []

vi.mock('react-redux', () => ({
  useDispatch: () => vi.fn(),
}))

vi.mock('../services/currentGenre', () => ({
  selectGenre: genreName => ({ type: 'genre/select', payload: genreName }),
}))

vi.mock('../services/movies', () => ({
  useGetInitialMoviesQuery: (...args) => querySpy(...args),
}))

class MockIntersectionObserver {
  constructor(callback, options) {
    this.callback = callback
    this.options = options
    observers.push(this)
  }

  observe() {}
  disconnect() {}
  trigger(isIntersecting) {
    this.callback([{ isIntersecting }])
  }
}

describe('Carousel loading', () => {
  let originalIntersectionObserver

  beforeEach(() => {
    observers.length = 0
    querySpy.mockReturnValue({
      data: undefined,
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    })
    originalIntersectionObserver = window.IntersectionObserver
    window.IntersectionObserver = MockIntersectionObserver
  })

  afterEach(() => {
    if (originalIntersectionObserver) {
      window.IntersectionObserver = originalIntersectionObserver
    } else {
      delete window.IntersectionObserver
    }
  })

  it('defers fetching until the carousel nears the viewport', () => {
    render(
      <MemoryRouter>
        <Carousel heading_name="Popular" type="movie" tag="movie" genreName="popular" />
      </MemoryRouter>
    )

    expect(querySpy).toHaveBeenLastCalledWith(
      { type: 'movie', page: 1, genreName: 'popular' },
      { skip: true }
    )
    expect(observers[0].options.rootMargin).toBe('500px 0px')

    act(() => observers[0].trigger(true))

    expect(querySpy).toHaveBeenLastCalledWith(
      { type: 'movie', page: 1, genreName: 'popular' },
      { skip: false }
    )
    expect(querySpy.mock.calls.every(([args]) => args.page === 1)).toBe(true)
    expect(observers).toHaveLength(1)
  })
})
