# waitscreen

Écran d'attente plein écran pour conférences/talks : compte à rebours géant centré sur l'écran, précédé d'un titre ("Le talk commence dans"), interrompu périodiquement par des phrases rigolotes type fake loading screen ("éclaircissement de la voix du speaker en cours…"). Tout est paramétrable via un panneau de réglages, et tout est persisté localement dans le navigateur.

100% local, gratuit, sans backend, sans compte, sans dépendance externe à l'exécution.

## Architecture

```
┌──────────────────────────────────────────────┐
│  App.tsx                                     │
│  ├─ CountdownScreen (plein écran)            │
│  │    ├─ useCountdown(startTime) → HH:MM:SS  │
│  │    └─ usePhraseCycle(...) → phrase|null   │
│  │       3 états: countdown / phrase / fini  │
│  └─ SettingsPanel (modal latéral)            │
│       └─ useSettings() ← localStorage         │
└──────────────────────────────────────────────┘
```

**Tech stack :**
- Vite 8 + React 19 + TypeScript (strict)
- Tailwind CSS v4 (plugin `@tailwindcss/vite`, import `@import "tailwindcss"`)
- Persistance : `localStorage` (clé `waitscreen.settings.v1`)
- ESLint avec `react-hooks/recommended` (la règle `react-hooks/set-state-in-effect` est active)
- Aucune dépendance runtime hors React/React-DOM

## Key Commands

```bash
# Développement (HMR sur http://localhost:5173)
npm run dev

# Build production (sortie dans dist/)
npm run build

# Prévisualiser le build
npm run preview

# Lint (doit rester clean avant tout commit)
npm run lint
```

## Code Conventions

- **UI en français.** Toutes les chaînes visibles utilisateur sont en français (labels, placeholders, aria-label).
- **Pas de console.log** en production — règle commune, à respecter.
- **Immutabilité** pour les updates de `Settings` : toujours `{ ...settings, ...patch }`, jamais de mutation.
- **Hooks React 19** : ne JAMAIS appeler `setState` synchroniquement dans le corps d'un `useEffect` (déclenche `react-hooks/set-state-in-effect`). Utiliser un compteur de tick + calcul à chaque rendu, ou retourner tôt avec un flag `enabled`.
- **Tailwind v4** : pas de `tailwind.config.js`, configuration via CSS si besoin (`@theme`).
- **Petits fichiers ciblés** : un composant ou hook par fichier dans `src/components/` et `src/hooks/`. Logique pure dans `src/lib/`.
- **Types explicites** sur les exports publics (props de composant, signatures de hook). `interface` pour les objets, `type` pour les unions.

## Constraints

- **Ne jamais ajouter de backend** ni de service externe sans demander — l'app doit pouvoir tourner offline depuis un simple `npm run dev` ou un `dist/` statique.
- **Ne pas changer la clé localStorage** (`waitscreen.settings.v1`) sans bumper la version et écrire une migration — sinon tous les utilisateurs perdent leurs réglages.
- **Ne pas installer de nouvelle dépendance** sans validation explicite. Préférer une implémentation à la main avec ce qui est déjà là (React + Tailwind suffisent pour 99% des besoins de cette app).
- **Ne pas ajouter de tracking, télémétrie, ou requête réseau sortante.**

## Settings Schema

Forme persistée dans localStorage (`waitscreen.settings.v1`) :

| Champ | Type | Description |
|---|---|---|
| `startTime` | `string` (datetime-local) | Heure cible du décompte |
| `headerText` | `string` | Phrase au-dessus du compte à rebours |
| `finishedText` | `string` | Affichage une fois le décompte terminé |
| `swapIntervalSec` | `number` | Toutes les N secondes, on tente d'afficher une phrase |
| `swapDurationSec` | `number` | Durée d'affichage de chaque phrase |
| `phrases` | `string[]` | Pool de phrases tirées aléatoirement |

Toute modification de cette forme **doit** s'accompagner d'un bump de la clé (`v2`, `v3`…) et d'une migration dans `src/lib/settings.ts`.

## Project Layout

```
src/
├── App.tsx                       # Composition (CountdownScreen + bouton ⚙ + SettingsPanel)
├── main.tsx                      # Entrée React
├── index.css                     # @import "tailwindcss" + reset minimal
├── components/
│   ├── CountdownScreen.tsx       # Vue plein écran (3 états)
│   └── SettingsPanel.tsx         # Modal latéral droit
├── hooks/
│   ├── useCountdown.ts           # Tick toutes les 250ms, retourne {h,m,s,finished}
│   ├── usePhraseCycle.ts         # Cycle phrase|null
│   └── useSettings.ts            # Lecture/écriture localStorage
└── lib/
    └── settings.ts               # Settings type, DEFAULTS, load/save
```

## Team & Process

Projet solo. Pas de PR formelle, pas de CI. Avant tout commit :
- `npm run lint` doit passer
- `npm run build` doit passer
- Tester visuellement l'app en mode dev (countdown actif, transition vers phrase, état "fini")
