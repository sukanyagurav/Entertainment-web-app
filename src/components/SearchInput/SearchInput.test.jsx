import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SearchInput from './SearchInput'

vi.mock('react-redux', () => ({
  useDispatch: () => vi.fn(),
}))

vi.mock('../services/currentGenre', () => ({
  searchMovieOrTV: query => ({ type: 'search', payload: query }),
}))

vi.mock('../services/movies', () => ({
  useGetInitialMoviesQuery: () => ({
    data: {
      results: [{ id: 1, name: 'Stale suggestion', media_type: 'tv' }],
    },
    isFetching: false,
  }),
}))

describe('SearchInput suggestions', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows cleaned recent searches without stale suggestions when the input is empty', () => {
    localStorage.setItem(
      'entertainment-recent-searches',
      JSON.stringify([' Arrival ', 'arrival', '', 42, 'Heat'])
    )

    render(
      <MemoryRouter initialEntries={['/tv']}>
        <SearchInput />
      </MemoryRouter>
    )

    fireEvent.focus(screen.getByRole('textbox', { name: 'Search TV' }))

    expect(screen.getByText('Recent searches')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Arrival' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Heat' })).toBeInTheDocument()
    expect(screen.queryByText('Stale suggestion')).not.toBeInTheDocument()
    expect(screen.queryByText('TV series')).not.toBeInTheDocument()
  })

  it('shows only the 10 most recent unique searches', () => {
    const storedSearches = Array.from({ length: 12 }, (_, index) => `Title ${index + 1}`)
    localStorage.setItem('entertainment-recent-searches', JSON.stringify(storedSearches))

    render(
      <MemoryRouter initialEntries={['/tv']}>
        <SearchInput />
      </MemoryRouter>
    )

    fireEvent.focus(screen.getByRole('textbox', { name: 'Search TV' }))

    const recentOptions = screen.getAllByRole('option')
    expect(recentOptions).toHaveLength(10)
    expect(recentOptions[0]).toHaveTextContent('Title 1')
    expect(recentOptions[9]).toHaveTextContent('Title 10')
    expect(screen.queryByText('Title 11')).not.toBeInTheDocument()
    expect(screen.queryByText('Title 12')).not.toBeInTheDocument()
  })

  it('keeps long recent search titles in a truncated title element with a tooltip', () => {
    const longTitle = 'A Very Long Movie Title That Should Be Truncated In The Recent Searches List'
    localStorage.setItem('entertainment-recent-searches', JSON.stringify([longTitle]))

    render(
      <MemoryRouter initialEntries={['/tv']}>
        <SearchInput />
      </MemoryRouter>
    )

    fireEvent.focus(screen.getByRole('textbox', { name: 'Search TV' }))

    const title = screen.getByText(longTitle)
    expect(title).toHaveAttribute('title', longTitle)
    expect(title.className).toContain('recentSearchTitle')
  })
})
