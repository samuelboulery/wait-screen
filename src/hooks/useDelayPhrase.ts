import { useEffect, useState } from 'react'

export function useDelayPhrase(
  phrases: string[],
  intervalSec: number,
  enabled: boolean,
): string | null {
  const [phrase, setPhrase] = useState<string | null>(null)
  const active = enabled && phrases.length > 0 && intervalSec > 0

  useEffect(() => {
    if (!active) return

    const intervalMs = Math.max(1000, intervalSec * 1000)
    const pick = () => phrases[Math.floor(Math.random() * phrases.length)] ?? null

    const timer = window.setInterval(() => setPhrase(pick()), intervalMs)
    return () => window.clearInterval(timer)
  }, [active, phrases, intervalSec])

  return active ? phrase : null
}
