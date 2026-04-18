import { useEffect, useState } from 'react'

export interface Countdown {
  totalMs: number
  hours: number
  minutes: number
  seconds: number
  finished: boolean
}

function compute(targetIso: string): Countdown {
  const target = new Date(targetIso).getTime()
  const now = Date.now()
  const totalMs = Math.max(0, target - now)
  const totalSec = Math.floor(totalMs / 1000)
  const hours = Math.floor(totalSec / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60
  return { totalMs, hours, minutes, seconds, finished: totalMs === 0 }
}

export function useCountdown(targetIso: string): Countdown {
  const [, setTick] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 250)
    return () => window.clearInterval(id)
  }, [])

  return compute(targetIso)
}

export function formatCountdown(c: Countdown): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return c.hours > 0
    ? `${pad(c.hours)}:${pad(c.minutes)}:${pad(c.seconds)}`
    : `${pad(c.minutes)}:${pad(c.seconds)}`
}
