import { useState, useEffect } from 'react'
import { fetchMPLSchedule } from '../services/mplService'
import { matchesData } from '../data/mockData'

const CACHE_KEY = 'sonic_mpl_schedule'
const CACHE_TTL_MS = 30 * 60 * 1000

function normalizeMatches(data) {
  return data.map(m => ({
    ...m,
    dateObj: m.dateObj ? new Date(m.dateObj) : null
  }))
}

export function useMPLSchedule() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [source, setSource] = useState('loading')

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError(null)

        // CACHE
        try {
          const cached = localStorage.getItem(CACHE_KEY)
          if (cached) {
            const { data, timestamp } = JSON.parse(cached)
            if (Date.now() - timestamp < CACHE_TTL_MS && Array.isArray(data) && data.length > 0) {
              if (!cancelled) {
                setMatches(normalizeMatches(data))
                setSource('cache')
              }
            }
          }
        } catch (e) {}

        // FETCH
        let data = []

    try {
      data = await fetchMPLSchedule()
    } catch (err) {
      console.warn('API gagal, pakai fallback')
    }


        if (!cancelled) {
          if (Array.isArray(data) && data.length > 0) {
            setMatches(normalizeMatches(data))
            setSource('live')

            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({ data, timestamp: Date.now() })
            )
          } else {
            setMatches(normalizeMatches(matchesData))
            setSource('fallback')
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
          setMatches(normalizeMatches(matchesData))
          setSource('fallback')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { matches, loading, error, source }
}
