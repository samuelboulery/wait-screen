import { type Settings } from '../lib/settings'
import { formatCountdown, useCountdown } from '../hooks/useCountdown'
import { usePhraseCycle } from '../hooks/usePhraseCycle'

interface CountdownScreenProps {
  settings: Settings
}

export function CountdownScreen({ settings }: CountdownScreenProps) {
  const countdown = useCountdown(settings.startTime)
  const { phrase } = usePhraseCycle(
    settings.phrases,
    settings.swapIntervalSec,
    settings.swapDurationSec,
  )

  const showPhrase = !countdown.finished && phrase !== null

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-8 text-center">
      {countdown.finished ? (
        <h1 className="text-6xl font-semibold tracking-tight md:text-8xl">
          {settings.finishedText}
        </h1>
      ) : showPhrase ? (
        <p
          key={phrase}
          className="animate-[fadeIn_400ms_ease-out] text-3xl font-light text-neutral-200 md:text-5xl"
        >
          {phrase}
        </p>
      ) : (
        <>
          <p className="mb-8 text-xl font-light tracking-wide text-neutral-400 md:text-3xl">
            {settings.headerText}
          </p>
          <div
            className="font-mono text-7xl font-semibold tabular-nums tracking-tight md:text-[10rem]"
            aria-label="countdown"
          >
            {formatCountdown(countdown)}
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
