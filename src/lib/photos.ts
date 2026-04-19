const DB_NAME = 'waitscreen-photos'
const STORE_NAME = 'photos'
const DB_VERSION = 1

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
    request.onsuccess = (event) => resolve((event.target as IDBOpenDBRequest).result)
    request.onerror = (event) => reject((event.target as IDBOpenDBRequest).error)
  })
}

export async function savePhoto(blob: Blob): Promise<string> {
  const id = crypto.randomUUID()
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.oncomplete = () => { db.close(); resolve(id) }
    tx.onerror = () => reject(tx.error)
    tx.objectStore(STORE_NAME).put(blob, id)
  })
}

export async function deletePhoto(id: string): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.oncomplete = () => { db.close(); resolve() }
    tx.onerror = () => reject(tx.error)
    tx.objectStore(STORE_NAME).delete(id)
  })
}

export async function getPhotos(ids: string[]): Promise<Array<{ id: string; blob: Blob }>> {
  if (ids.length === 0) return []
  const db = await openDb()
  const map = new Map<string, Blob>()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    tx.oncomplete = () => {
      db.close()
      resolve(
        ids.flatMap((id) => {
          const blob = map.get(id)
          return blob ? [{ id, blob }] : []
        }),
      )
    }
    tx.onerror = () => reject(tx.error)
    const store = tx.objectStore(STORE_NAME)
    for (const id of ids) {
      const req = store.get(id)
      req.onsuccess = () => {
        if (req.result) map.set(id, req.result as Blob)
      }
    }
  })
}
