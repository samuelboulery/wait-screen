import { type Photo } from '../hooks/usePhotos'
import { type Settings } from '../lib/settings'
import { type Countdown, formatCountdown } from '../hooks/useCountdown'

interface PhotoSidebarProps {
  side: 'left' | 'right'
  currentPhoto: Photo | null
  countdown: Countdown
  phrase: string | null
  delayPhrase: string | null
  settings: Settings
}

export function PhotoSidebar({
  side,
  currentPhoto,
  countdown,
  phrase,
  delayPhrase,
  settings,
}: PhotoSidebarProps) {
  const photoPanel = (
    <div
      className="relative h-full shrink-0 overflow-hidden bg-neutral-900"
      style={{ width: `${settings.photoSidebarWidthPct}%` }}
    >
      {currentPhoto ? (
        <img
          key={currentPhoto.id}
          src={currentPhoto.url}
          alt=""
          className="h-full w-full animate-[photoFade_500ms_ease-out] object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center p-4 text-center text-sm text-neutral-600">
          Ajoutez des photos dans les réglages
        </div>
      )}
    </div>
  )

  const countdownPanel = (
    <div className="relative flex flex-1 flex-col items-center justify-center px-8 text-center">
      {countdown.finished ? (
        <>
          <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
            {settings.finishedText}
          </h1>
          {delayPhrase && (
            <p
              key={delayPhrase}
              className="mt-6 animate-[headerSwap_500ms_ease-out] text-xl font-light italic text-neutral-500 md:text-2xl"
            >
              {delayPhrase}
            </p>
          )}
        </>
      ) : (
        <>
          <div className="mb-6 flex min-h-[2em] items-center justify-center">
            <p
              key={phrase ?? settings.headerText}
              className="animate-[headerSwap_500ms_ease-out] text-lg font-light tracking-wide text-neutral-400 md:text-2xl"
            >
              {phrase ?? settings.headerText}
            </p>
          </div>
          <div
            className="font-mono text-6xl font-semibold tabular-nums tracking-tight md:text-8xl"
            aria-label="countdown"
          >
            {formatCountdown(countdown)}
          </div>
        </>
      )}
      {settings.footerText && (
        <p className="absolute bottom-8 left-1/2 -translate-x-1/2 px-8 text-center text-sm font-light tracking-wide text-neutral-500 md:text-base">
          {settings.footerText}
        </p>
      )}
    </div>
  )

  return (
    <div className="flex h-full w-full">
      {side === 'left' ? (
        <>
          {photoPanel}
          {countdownPanel}
        </>
      ) : (
        <>
          {countdownPanel}
          {photoPanel}
        </>
      )}
    </div>
  )
}
