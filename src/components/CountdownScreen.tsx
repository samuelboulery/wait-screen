import { type Settings } from '../lib/settings'
import { formatCountdown, useCountdown } from '../hooks/useCountdown'
import { useDelayPhrase } from '../hooks/useDelayPhrase'
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
  const delayPhrase = useDelayPhrase(
    settings.delayPhrases,
    settings.delayIntervalSec,
    countdown.finished,
  )

  if (countdown.finished) {
    return (
      <div className="relative flex h-full w-full flex-col items-center justify-center px-8 text-center">
        <h1 className="text-6xl font-semibold tracking-tight md:text-8xl">
          {settings.finishedText}
        </h1>
        {delayPhrase && (
          <p
            key={delayPhrase}
            className="mt-6 animate-[headerSwap_500ms_ease-out] text-2xl font-light italic text-neutral-500 md:text-3xl"
          >
            {delayPhrase}
          </p>
        )}
        {settings.footerText && <Footer text={settings.footerText} />}
        <style>{`
          @keyframes headerSwap {
            from { opacity: 0; transform: translateY(8px); filter: blur(4px); }
            to   { opacity: 1; transform: translateY(0);   filter: blur(0); }
          }
        `}</style>
      </div>
    )
  }

  const headerContent = phrase ?? settings.headerText

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center px-8 text-center">
      <div className="mb-8 flex min-h-[2.5em] items-center justify-center md:min-h-[2em]">
        <p
          key={headerContent}
          className="animate-[headerSwap_500ms_ease-out] text-xl font-light tracking-wide text-neutral-400 md:text-3xl"
        >
          {headerContent}
        </p>
      </div>
      <div
        className="font-mono text-7xl font-semibold tabular-nums tracking-tight md:text-[10rem]"
        aria-label="countdown"
      >
        {formatCountdown(countdown)}
      </div>

      {settings.footerText && <Footer text={settings.footerText} />}

      <style>{`
        @keyframes headerSwap {
          from { opacity: 0; transform: translateY(8px); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0);   filter: blur(0); }
        }
      `}</style>
    </div>
  )
}

function Footer({ text }: { text: string }) {
  return (
    <p className="absolute bottom-12 left-1/2 -translate-x-1/2 px-8 text-center text-base font-light tracking-wide text-neutral-500 md:text-xl">
      {text}
    </p>
  )
}
