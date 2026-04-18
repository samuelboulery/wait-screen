import { useState } from 'react'
import { type Settings, DEFAULT_SETTINGS } from '../lib/settings'

interface SettingsPanelProps {
  settings: Settings
  onChange: (patch: Partial<Settings>) => void
  onReset: () => void
  onClose: () => void
}

export function SettingsPanel({
  settings,
  onChange,
  onReset,
  onClose,
}: SettingsPanelProps) {
  const [newPhrase, setNewPhrase] = useState('')
  const [newDelayPhrase, setNewDelayPhrase] = useState('')

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
