import { useEffect, useState } from 'react'

export interface PhraseCycleState {
  phrase: string | null
}

export function usePhraseCycle(
  phrases: string[],
  intervalSec: number,
  durationSec: number,
): PhraseCycleState {
  const [phrase, setPhrase] = useState<string | null>(null)
  const enabled = phrases.length > 0 && intervalSec > 0 && durationSec > 0

  useEffect(() => {
    if (!enabled) return

    let hideTimer: number | null = null
    const intervalMs = Math.max(1000, intervalSec * 1000)
    const durationMs = Math.max(500, durationSec * 1000)

    const showRandom = () => {
      const next = phrases[Math.floor(Math.random() * phrases.length)] ?? null
      setPhrase(next)
      hideTimer = window.setTimeout(() => setPhrase(null), durationMs)
    }

    const showInterval = window.setInterval(showRandom, intervalMs)

    return () => {
      window.clearInterval(showInterval)
      if (hideTimer !== null) window.clearTimeout(hideTimer)
    }
  }, [enabled, phrases, intervalSec, durationSec])

  return { phrase: enabled ? phrase : null }
}
