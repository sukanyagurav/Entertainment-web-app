import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import WatchProviders from './WatchProviders'

vi.mock('../services/movies', () => ({
  useGetWatchProvidersQuery: () => ({
    data: {
      results: {
        IN: {
          link: 'https://www.themoviedb.org/movie/123/watch',
          flatrate: [{ provider_id: 1, provider_name: 'Stream India', logo_path: '/india.png' }],
        },
        US: {
          link: 'https://www.themoviedb.org/movie/123/watch',
          rent: [{ provider_id: 2, provider_name: 'Rent US', logo_path: '/us.png' }],
        },
      },
    },
    isFetching: false,
    error: undefined,
    refetch: vi.fn(),
  }),
}))

describe('WatchProviders', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows India providers by default and persists a selected region', () => {
    render(<WatchProviders type="movie" id="123"/>)

    expect(screen.getByRole('heading', { name: 'Where to watch' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Stream India/ })).toHaveAttribute(
      'href',
      'https://www.themoviedb.org/movie/123/watch'
    )
    expect(screen.queryByText('Rent US')).not.toBeInTheDocument()

    fireEvent.change(screen.getByRole('combobox', { name: 'Streaming region' }), {
      target: { value: 'US' },
    })

    expect(screen.getByText('Rent US')).toBeInTheDocument()
    expect(screen.queryByText('Stream India')).not.toBeInTheDocument()
    expect(localStorage.getItem('entertainment-watch-provider-region')).toBe('US')
  })

  it('shows an unavailable message when the selected market has no providers', () => {
    render(<WatchProviders type="tv" id="456"/>)

    fireEvent.change(screen.getByRole('combobox', { name: 'Streaming region' }), {
      target: { value: 'GB' },
    })

    expect(screen.getByRole('status')).toHaveTextContent(
      'No streaming providers are listed for United Kingdom.'
    )
  })
})
