import React from 'react'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Movies from './Movies'

vi.mock('react-redux', () => ({
  useSelector: () => ({ genreName: 'popular', searchQuery: '' }),
}))

vi.mock('../services/movies', () => ({
  useGetInitialMoviesQuery: () => ({
    currentData: undefined,
    error: undefined,
    isFetching: true,
  }),
}))

vi.mock('../services/currentGenre', () => ({
  selectGenre: genreName => ({ type: 'genre/select', payload: genreName }),
}))

describe('Movies loading state', () => {
  it('reserves the page layout with one skeleton per result slot', () => {
    render(
      <MemoryRouter initialEntries={['/movie/genre/popular']}>
        <Routes>
          <Route path="/:type/genre/:genre" element={<Movies />} />
        </Routes>
      </MemoryRouter>
    )

    const loadingStatus = screen.getByRole('status')
    expect(loadingStatus).toHaveAttribute('aria-busy', 'true')
    expect(within(loadingStatus).getByText('Loading titles…')).toBeInTheDocument()
    expect(loadingStatus.querySelectorAll('.container_card')).toHaveLength(20)
  })
})
