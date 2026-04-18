import { useState } from 'react'
import { CountdownScreen } from './components/CountdownScreen'
import { SettingsPanel } from './components/SettingsPanel'
import { useSettings } from './hooks/useSettings'
import { DEFAULT_SETTINGS } from './lib/settings'

export default function App() {
  const { settings, setSettings, update } = useSettings()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative h-full w-full">
      <CountdownScreen settings={settings} />

      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 rounded-full border border-neutral-800 bg-neutral-900/80 p-3 text-neutral-400 backdrop-blur transition hover:border-neutral-600 hover:text-neutral-50"
        aria-label="Ouvrir les réglages"
        title="Réglages"
      >
        <GearIcon />
      </button>

      {open && (
        <SettingsPanel
          settings={settings}
          onChange={update}
          onReset={() => setSettings(DEFAULT_SETTINGS)}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}

function GearIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}
