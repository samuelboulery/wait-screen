export interface Settings {
  startTime: string
  headerText: string
  finishedText: string
  phrases: string[]
  swapIntervalSec: number
  swapDurationSec: number
}

const STORAGE_KEY = 'waitscreen.settings.v1'

function defaultStartTime(): string {
  const d = new Date()
  d.setMinutes(d.getMinutes() + 15)
  d.setSeconds(0, 0)
  return toLocalDatetimeInput(d)
}

export function toLocalDatetimeInput(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export const DEFAULT_SETTINGS: Settings = {
  startTime: defaultStartTime(),
  headerText: 'Le talk commence dans',
  finishedText: "C'est parti !",
  phrases: [
    'Éclaircissement de la voix du speaker en cours...',
    'Vérification du micro...',
    'Calibration des slides...',
    'Hydratation du speaker...',
    'Échauffement vocal en cours...',
    'Connexion au cerveau du speaker...',
    'Détection des bugs de dernière minute...',
    'Compilation des blagues...',
    'Réglage des spots lumière...',
    'Synchronisation des neurones...',
  ],
  swapIntervalSec: 30,
  swapDurationSec: 4,
}

export function loadSettings(): Settings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS
    const parsed = JSON.parse(raw) as Partial<Settings>
    return { ...DEFAULT_SETTINGS, ...parsed }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(settings: Settings): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}
