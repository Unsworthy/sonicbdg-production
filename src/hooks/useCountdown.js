import { useState, useEffect } from 'react'

export function useCountdown(targetDate) {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    if (!targetDate) return

    const targetTime = new Date(targetDate).getTime()

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const gap = targetTime - now

      if (gap <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        clearInterval(interval) // ✅ stop interval saat waktu habis
        return
      }

      setCountdown({
        days: Math.floor(gap / (1000 * 60 * 60 * 24)),
        hours: Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((gap % (1000 * 60)) / 1000),
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  return countdown
}