import { useEffect, useState } from 'react'
import { savePhoto, deletePhoto, getPhotos } from '../lib/photos'

export interface Photo {
  id: string
  url: string
}

export function usePhotos(photoIds: string[]): {
  photos: Photo[]
  uploading: boolean
  uploadPhoto: (file: File) => Promise<string>
  removePhoto: (id: string) => Promise<void>
} {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [uploading, setUploading] = useState(false)

  const photoIdsKey = photoIds.join(',')

  useEffect(() => {
    let cancelled = false
    const createdUrls: string[] = []

    getPhotos(photoIds).then((entries) => {
      if (cancelled) return
      const newPhotos = entries.map(({ id, blob }) => {
        const url = URL.createObjectURL(blob)
        createdUrls.push(url)
        return { id, url }
      })
      setPhotos(newPhotos)
    })

    return () => {
      cancelled = true
      for (const url of createdUrls) {
        URL.revokeObjectURL(url)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoIdsKey])

  async function uploadPhoto(file: File): Promise<string> {
    if (!file.type.startsWith('image/')) {
      throw new Error('Le fichier doit être une image')
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("L'image ne doit pas dépasser 5 Mo")
    }
    setUploading(true)
    try {
      return await savePhoto(file)
    } finally {
      setUploading(false)
    }
  }

  async function removePhoto(id: string): Promise<void> {
    await deletePhoto(id)
  }

  return { photos, uploading, uploadPhoto, removePhoto }
}
