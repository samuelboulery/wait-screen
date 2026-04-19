import { useRef, useState } from 'react'
import { type Settings, type Template, DEFAULT_SETTINGS } from '../lib/settings'
import { type Photo } from '../hooks/usePhotos'

interface SettingsPanelProps {
  settings: Settings
  onChange: (patch: Partial<Settings>) => void
  onReset: () => void
  onClose: () => void
  photos: Photo[]
  uploading: boolean
  onPhotoAdded: (id: string) => void
  onPhotoRemoved: (id: string) => void
  onUploadPhoto: (file: File) => Promise<string>
  onRemovePhoto: (id: string) => Promise<void>
}

const TEMPLATES: { value: Template; label: string }[] = [
  { value: 'default', label: 'Par défaut' },
  { value: 'photo-sidebar-left', label: 'Photos à gauche (1/3)' },
  { value: 'photo-sidebar-right', label: 'Photos à droite (1/3)' },
  { value: 'photo-background', label: 'Photo en fond' },
]

export function SettingsPanel({
  settings,
  onChange,
  onReset,
  onClose,
  photos,
  uploading,
  onPhotoAdded,
  onPhotoRemoved,
  onUploadPhoto,
  onRemovePhoto,
}: SettingsPanelProps) {
  const [newPhrase, setNewPhrase] = useState('')
  const [newDelayPhrase, setNewDelayPhrase] = useState('')
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addPhrase = () => {
    const trimmed = newPhrase.trim()
    if (!trimmed) return
    onChange({ phrases: [...settings.phrases, trimmed] })
    setNewPhrase('')
  }

  const removePhrase = (index: number) => {
    onChange({ phrases: settings.phrases.filter((_, i) => i !== index) })
  }

  const updatePhrase = (index: number, value: string) => {
    onChange({
      phrases: settings.phrases.map((p, i) => (i === index ? value : p)),
    })
  }

  const addDelayPhrase = () => {
    const trimmed = newDelayPhrase.trim()
    if (!trimmed) return
    onChange({ delayPhrases: [...settings.delayPhrases, trimmed] })
    setNewDelayPhrase('')
  }

  const removeDelayPhrase = (index: number) => {
    onChange({ delayPhrases: settings.delayPhrases.filter((_, i) => i !== index) })
  }

  const updateDelayPhrase = (index: number, value: string) => {
    onChange({
      delayPhrases: settings.delayPhrases.map((p, i) => (i === index ? value : p)),
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    setUploadError(null)
    for (const file of files) {
      try {
        const id = await onUploadPhoto(file)
        onPhotoAdded(id)
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : 'Erreur lors du chargement')
        break
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleRemovePhoto = async (id: string) => {
    await onRemovePhoto(id)
    onPhotoRemoved(id)
  }

  const handleRemoveAllPhotos = async () => {
    for (const photo of photos) {
      await onRemovePhoto(photo.id)
      onPhotoRemoved(photo.id)
    }
  }

  const showPhotoSection = settings.template !== 'default'
  const showSidebarWidth =
    settings.template === 'photo-sidebar-left' || settings.template === 'photo-sidebar-right'

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <aside
        className="flex h-full w-full max-w-md flex-col gap-6 overflow-y-auto border-l border-neutral-800 bg-neutral-950 p-6 shadow-2xl md:max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-50">Réglages</h2>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-neutral-50"
            aria-label="Fermer"
          >
            ✕
          </button>
        </header>

        <section className="flex flex-col gap-3">
          <span className="text-sm font-medium text-neutral-300">Mise en page</span>
          <div className="grid grid-cols-2 gap-2">
            {TEMPLATES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onChange({ template: value })}
                className={`rounded-md border px-3 py-2 text-left text-sm transition ${
                  settings.template === value
                    ? 'border-purple-500 bg-purple-600/20 text-purple-300'
                    : 'border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-neutral-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {showPhotoSection && (
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-300">
                Photos ({photos.length})
              </span>
              {photos.length > 0 && (
                <button
                  onClick={handleRemoveAllPhotos}
                  className="text-xs text-neutral-500 transition hover:text-red-400"
                >
                  Tout supprimer
                </button>
              )}
            </div>

            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo) => (
                  <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-md bg-neutral-800">
                    <img
                      src={photo.url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={() => handleRemovePhoto(photo.id)}
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-xs text-white opacity-0 transition group-hover:opacity-100"
                      aria-label="Supprimer la photo"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {photos.length === 0 && (
              <p className="text-xs text-neutral-600">
                Aucune photo. Ajoutez des images ci-dessous.
              </p>
            )}

            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className={`cursor-pointer rounded-md border border-neutral-700 px-4 py-2 text-center text-sm text-neutral-400 transition hover:border-neutral-500 hover:text-neutral-200 ${uploading ? 'pointer-events-none opacity-50' : ''}`}
              >
                {uploading ? 'Chargement…' : 'Ajouter des photos'}
              </label>
              {uploadError && (
                <p className="text-xs text-red-400">{uploadError}</p>
              )}
            </div>

            {showSidebarWidth && (
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-neutral-300">
                  Largeur de la photo — {settings.photoSidebarWidthPct}%
                </span>
                <input
                  type="range"
                  min={15}
                  max={60}
                  value={settings.photoSidebarWidthPct}
                  onChange={(e) => onChange({ photoSidebarWidthPct: Number(e.target.value) })}
                  className="w-full accent-purple-500"
                />
                <div className="flex justify-between text-xs text-neutral-600">
                  <span>15%</span>
                  <span>60%</span>
                </div>
              </label>
            )}

            <Field label="Intervalle diaporama (s)">
              <input
                type="number"
                min={1}
                value={settings.photoIntervalSec}
                onChange={(e) => onChange({ photoIntervalSec: Number(e.target.value) })}
                className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-50 focus:border-purple-500 focus:outline-none"
              />
            </Field>
          </section>
        )}

        <Field label="Heure de début">
          <input
            type="datetime-local"
            value={settings.startTime}
            onChange={(e) => onChange({ startTime: e.target.value })}
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-50 focus:border-purple-500 focus:outline-none"
          />
        </Field>

        <Field label="Texte d'introduction">
          <input
            type="text"
            value={settings.headerText}
            onChange={(e) => onChange({ headerText: e.target.value })}
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-50 focus:border-purple-500 focus:outline-none"
          />
        </Field>

        <Field label="Consigne en bas d'écran (optionnel)">
          <input
            type="text"
            value={settings.footerText}
            placeholder="Ex. : Merci d'éteindre votre téléphone"
            onChange={(e) => onChange({ footerText: e.target.value })}
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-50 focus:border-purple-500 focus:outline-none"
          />
        </Field>

        <Field label="Texte une fois terminé">
          <input
            type="text"
            value={settings.finishedText}
            onChange={(e) => onChange({ finishedText: e.target.value })}
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-50 focus:border-purple-500 focus:outline-none"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Intervalle (s)">
            <input
              type="number"
              min={5}
              value={settings.swapIntervalSec}
              onChange={(e) =>
                onChange({ swapIntervalSec: Number(e.target.value) })
              }
              className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-50 focus:border-purple-500 focus:outline-none"
            />
          </Field>
          <Field label="Durée affichée (s)">
            <input
              type="number"
              min={1}
              value={settings.swapDurationSec}
              onChange={(e) =>
                onChange({ swapDurationSec: Number(e.target.value) })
              }
              className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-50 focus:border-purple-500 focus:outline-none"
            />
          </Field>
        </div>

        <Field label={`Phrases rigolotes (${settings.phrases.length})`}>
          <div className="flex flex-col gap-2">
            {settings.phrases.map((phrase, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={phrase}
                  onChange={(e) => updatePhrase(i, e.target.value)}
                  className="flex-1 rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-50 focus:border-purple-500 focus:outline-none"
                />
                <button
                  onClick={() => removePhrase(i)}
                  className="rounded-md border border-neutral-700 px-3 text-neutral-400 transition hover:border-red-500 hover:text-red-400"
                  aria-label="Supprimer"
                >
                  ✕
                </button>
              </div>
            ))}
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={newPhrase}
                placeholder="Ajouter une phrase..."
                onChange={(e) => setNewPhrase(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addPhrase()}
                className="flex-1 rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-50 focus:border-purple-500 focus:outline-none"
              />
              <button
                onClick={addPhrase}
                className="rounded-md bg-purple-600 px-4 text-sm font-medium text-white transition hover:bg-purple-500"
              >
                Ajouter
              </button>
            </div>
          </div>
        </Field>

        <Field label={`Phrases de retard (${settings.delayPhrases.length})`}>
          <p className="text-xs text-neutral-500">
            Apparaissent toutes les {settings.delayIntervalSec}s quand le compte à rebours est terminé.
          </p>
          <div className="flex flex-col gap-2">
            {settings.delayPhrases.map((phrase, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={phrase}
                  onChange={(e) => updateDelayPhrase(i, e.target.value)}
                  className="flex-1 rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-50 focus:border-purple-500 focus:outline-none"
                />
                <button
                  onClick={() => removeDelayPhrase(i)}
                  className="rounded-md border border-neutral-700 px-3 text-neutral-400 transition hover:border-red-500 hover:text-red-400"
                  aria-label="Supprimer"
                >
                  ✕
                </button>
              </div>
            ))}
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={newDelayPhrase}
                placeholder="Ajouter une phrase de retard..."
                onChange={(e) => setNewDelayPhrase(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addDelayPhrase()}
                className="flex-1 rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-50 focus:border-purple-500 focus:outline-none"
              />
              <button
                onClick={addDelayPhrase}
                className="rounded-md bg-purple-600 px-4 text-sm font-medium text-white transition hover:bg-purple-500"
              >
                Ajouter
              </button>
            </div>
          </div>
        </Field>

        <Field label="Intervalle phrases de retard (s)">
          <input
            type="number"
            min={5}
            value={settings.delayIntervalSec}
            onChange={(e) => onChange({ delayIntervalSec: Number(e.target.value) })}
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-50 focus:border-purple-500 focus:outline-none"
          />
        </Field>

        <button
          onClick={onReset}
          className="mt-auto rounded-md border border-neutral-700 px-4 py-2 text-sm text-neutral-400 transition hover:border-neutral-500 hover:text-neutral-200"
        >
          Réinitialiser ({DEFAULT_SETTINGS.phrases.length} phrases par défaut)
        </button>
      </aside>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-neutral-300">{label}</span>
      {children}
    </label>
  )
}
