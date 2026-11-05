import React, { useState } from 'react'
import { useGetWatchProvidersQuery } from '../services/movies'
import classes from './WatchProviders.module.css'

const REGION_STORAGE_KEY = 'entertainment-watch-provider-region'
const DEFAULT_REGION = 'IN'
const REGION_CODES = ['IN', 'US', 'GB', 'CA', 'AU']
const PROVIDER_GROUPS = [
  { key: 'flatrate', label: 'Stream' },
  { key: 'free', label: 'Free' },
  { key: 'ads', label: 'Free with ads' },
  { key: 'rent', label: 'Rent' },
  { key: 'buy', label: 'Buy' },
]

const getSavedRegion = () => {
  try {
    const savedRegion = localStorage.getItem(REGION_STORAGE_KEY)
    return REGION_CODES.includes(savedRegion) ? savedRegion : DEFAULT_REGION
  } catch (error) {
    console.error('Could not read watch-provider region from local storage.', error)
    return DEFAULT_REGION
  }
}

const getRegionName = code => {
  if (typeof Intl.DisplayNames !== 'function') return code
  return new Intl.DisplayNames(undefined, { type: 'region' }).of(code) || code
}

const WatchProviders = ({ type, id }) => {
  const [region, setRegion] = useState(getSavedRegion)
  const { data, isFetching, error, refetch } = useGetWatchProvidersQuery({ type, id })
  const regionData = data?.results?.[region]
  const hasProviders = PROVIDER_GROUPS.some(group => regionData?.[group.key]?.length)

  const handleRegionChange = event => {
    const nextRegion = event.target.value
    setRegion(nextRegion)
    try {
      localStorage.setItem(REGION_STORAGE_KEY, nextRegion)
    } catch (error) {
      console.error('Could not save watch-provider region to local storage.', error)
    }
  }

  return (
    <section className={classes.providers} aria-labelledby="watch-providers-heading">
      <div className={classes.header}>
        <h3 id="watch-providers-heading">Where to watch</h3>
        <label className={classes.regionControl}>
          <span>Region</span>
          <select value={region} onChange={handleRegionChange} aria-label="Streaming region">
            {REGION_CODES.map(code => (
              <option value={code} key={code}>{getRegionName(code)}</option>
            ))}
          </select>
        </label>
      </div>

      {isFetching && <p className={classes.message} role="status">Loading providers…</p>}
      {error && (
        <p className={classes.message} role="alert">
          Could not load streaming providers. <button type="button" onClick={refetch}>Retry</button>
        </p>
      )}
      {!isFetching && !error && !hasProviders && (
        <p className={classes.message} role="status">
          No streaming providers are listed for {getRegionName(region)}.
        </p>
      )}

      {!isFetching && !error && hasProviders && (
        <div className={classes.groups}>
          {PROVIDER_GROUPS.map(group => {
            const providers = regionData?.[group.key]
            if (!providers?.length) return null

            return (
              <div className={classes.group} key={group.key}>
                <h4>{group.label}</h4>
                <ul>
                  {providers.map(provider => (
                    <li key={`${group.key}-${provider.provider_id}`}>
                      <a
                        href={regionData.link}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${provider.provider_name} — ${group.label} (${getRegionName(region)})`}
                        title={provider.provider_name}
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                          alt=""
                          loading="lazy"
                        />
                        <span>{provider.provider_name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      )}

      <p className={classes.attribution}>
        Streaming availability provided by{' '}
        <a href="https://www.justwatch.com/" target="_blank" rel="noreferrer">JustWatch</a>
        {' '}via TMDB.
      </p>
    </section>
  )
}

export default WatchProviders
