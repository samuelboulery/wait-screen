import { type Photo } from '../hooks/usePhotos'
import { type Settings } from '../lib/settings'
import { type Countdown, formatCountdown } from '../hooks/useCountdown'

interface PhotoBackgroundProps {
  currentPhoto: Photo | null
  countdown: Countdown
  phrase: string | null
  delayPhrase: string | null
  settings: Settings
}

export function PhotoBackground({
  currentPhoto,
  countdown,
  phrase,
  delayPhrase,
  settings,
}: PhotoBackgroundProps) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center px-8 text-center">
      {currentPhoto && (
        <img
          key={currentPhoto.id}
          src={currentPhoto.url}
          alt=""
          className="absolute inset-0 h-full w-full animate-[photoFade_500ms_ease-out] object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 flex flex-col items-center">
        {countdown.finished ? (
          <>
            <h1 className="text-6xl font-semibold tracking-tight md:text-8xl">
              {settings.finishedText}
            </h1>
            {delayPhrase && (
              <p
                key={delayPhrase}
                className="mt-6 animate-[headerSwap_500ms_ease-out] text-2xl font-light italic text-neutral-300 md:text-3xl"
              >
                {delayPhrase}
              </p>
            )}
          </>
        ) : (
          <>
            <div className="mb-8 flex min-h-[2.5em] items-center justify-center md:min-h-[2em]">
              <p
                key={phrase ?? settings.headerText}
                className="animate-[headerSwap_500ms_ease-out] text-xl font-light tracking-wide text-neutral-200 md:text-3xl"
              >
                {phrase ?? settings.headerText}
              </p>
            </div>
            <div
              className="font-mono text-7xl font-semibold tabular-nums tracking-tight md:text-[10rem]"
              aria-label="countdown"
            >
              {formatCountdown(countdown)}
            </div>
          </>
        )}
      </div>

      {settings.footerText && (
        <p className="absolute bottom-12 left-1/2 z-10 -translate-x-1/2 px-8 text-center text-base font-light tracking-wide text-neutral-300 md:text-xl">
          {settings.footerText}
        </p>
      )}
    </div>
  )
}
