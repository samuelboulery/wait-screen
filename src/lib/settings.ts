export type Template = 'default' | 'photo-sidebar-left' | 'photo-sidebar-right' | 'photo-background'

export interface Settings {
  startTime: string
  headerText: string
  footerText: string
  finishedText: string
  phrases: string[]
  swapIntervalSec: number
  swapDurationSec: number
  delayPhrases: string[]
  delayIntervalSec: number
  template: Template
  photoIds: string[]
  photoIntervalSec: number
  photoSidebarWidthPct: number
}

const STORAGE_KEY = 'waitscreen.settings.v5'
const LEGACY_KEY_V4 = 'waitscreen.settings.v4'
const LEGACY_KEY_V3 = 'waitscreen.settings.v3'
const LEGACY_KEY_V2 = 'waitscreen.settings.v2'
const LEGACY_KEY_V1 = 'waitscreen.settings.v1'

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
  footerText: '',
  finishedText: "C'est parti !",
  delayPhrases: [
    'enfin presque...',
    'bientôt...',
    'dans quelques instants...',
    'patience...',
    'ça arrive...',
    'encore un peu...',
    'on y est presque...',
    'juste une seconde...',
  ],
  delayIntervalSec: 10,
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
  template: 'default',
  photoIds: [],
  photoIntervalSec: 8,
  photoSidebarWidthPct: 33,
}

interface SettingsV1 {
  startTime: string
  headerText: string
  finishedText: string
  phrases: string[]
  swapIntervalSec: number
  swapDurationSec: number
}

interface SettingsV2 extends SettingsV1 {
  footerText: string
}

interface SettingsV3 extends SettingsV2 {
  delayPhrases: string[]
  delayIntervalSec: number
}

function migrateV1ToV2(old: Partial<SettingsV1>): SettingsV2 {
  return { ...DEFAULT_SETTINGS, ...old, footerText: '' }
}

function migrateV2ToV3(old: Partial<SettingsV2>): SettingsV3 {
  return {
    ...DEFAULT_SETTINGS,
    ...old,
    delayPhrases: DEFAULT_SETTINGS.delayPhrases,
    delayIntervalSec: DEFAULT_SETTINGS.delayIntervalSec,
  }
}

interface SettingsV4 extends SettingsV3 {
  template: Template
  photoIds: string[]
  photoIntervalSec: number
}

function migrateV3ToV4(old: Partial<SettingsV3>): SettingsV4 {
  return {
    ...DEFAULT_SETTINGS,
    ...old,
    template: 'default',
    photoIds: [],
    photoIntervalSec: DEFAULT_SETTINGS.photoIntervalSec,
  }
}

function migrateV4ToV5(old: Partial<SettingsV4>): Settings {
  return {
    ...DEFAULT_SETTINGS,
    ...old,
    photoSidebarWidthPct: DEFAULT_SETTINGS.photoSidebarWidthPct,
  }
}

export function loadSettings(): Settings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Settings>
      return { ...DEFAULT_SETTINGS, ...parsed }
    }
    const rawV4 = window.localStorage.getItem(LEGACY_KEY_V4)
    if (rawV4) {
      return migrateV4ToV5(JSON.parse(rawV4) as Partial<SettingsV4>)
    }
    const rawV3 = window.localStorage.getItem(LEGACY_KEY_V3)
    if (rawV3) {
      return migrateV4ToV5(migrateV3ToV4(JSON.parse(rawV3) as Partial<SettingsV3>))
    }
    const rawV2 = window.localStorage.getItem(LEGACY_KEY_V2)
    if (rawV2) {
      return migrateV4ToV5(migrateV3ToV4(migrateV2ToV3(JSON.parse(rawV2) as Partial<SettingsV2>)))
    }
    const rawV1 = window.localStorage.getItem(LEGACY_KEY_V1)
    if (rawV1) {
      return migrateV4ToV5(
        migrateV3ToV4(migrateV2ToV3(migrateV1ToV2(JSON.parse(rawV1) as Partial<SettingsV1>))),
      )
    }
    return DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(settings: Settings): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}
