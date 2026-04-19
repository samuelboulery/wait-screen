import { useEffect, useState } from 'react'
import { type Photo } from './usePhotos'

export function usePhotoSlideshow(
  photos: Photo[],
  intervalSec: number,
): { currentPhoto: Photo | null } {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (photos.length === 0) return
    const ms = Math.max(1000, intervalSec * 1000)
    const id = setInterval(() => setTick((t) => t + 1), ms)
    return () => clearInterval(id)
  }, [photos.length, intervalSec])

  const index = photos.length > 0 ? tick % photos.length : 0
  const currentPhoto = photos.length > 0 ? (photos[index] ?? null) : null
  return { currentPhoto }
}
