import { useCallback, useEffect, useState } from 'react'
import { type Settings, loadSettings, saveSettings } from '../lib/settings'

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => loadSettings())

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }))
  }, [])

  return { settings, setSettings, update }
}
