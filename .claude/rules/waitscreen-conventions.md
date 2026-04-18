# waitscreen — Always-On Rules

Ces règles s'appliquent à toute session Claude sur ce projet. Pas d'exception.

## What Claude Must Never Do

- **Ne jamais ajouter de backend, d'API, ou de service externe** sans validation. L'app doit rester 100% locale (un simple `npm run dev` ou un dossier `dist/` statique).
- **Ne jamais introduire de dépendance** (npm install) sans demander d'abord. La stack actuelle (React 19 + Tailwind v4) suffit.
- **Ne jamais changer la clé localStorage `waitscreen.settings.v1`** sans bumper la version (`v2`, `v3`…) ET écrire une migration dans `src/lib/settings.ts`. Sinon les utilisateurs perdent leurs réglages.
- **Ne jamais appeler `setState` synchroniquement dans le corps d'un `useEffect`** — la règle ESLint `react-hooks/set-state-in-effect` (React 19) le bloque. Utiliser un compteur de tick et calculer la valeur à chaque rendu, ou retourner tôt avec un flag `enabled`.
- **Ne jamais ajouter de tracking, télémétrie, ou requête réseau sortante.**
- **Ne jamais committer** sans avoir vérifié `npm run lint` ET `npm run build`.

## File Organization

- Composants React → `src/components/<Nom>.tsx` (un par fichier, PascalCase).
- Hooks personnalisés → `src/hooks/use<Nom>.ts` (préfixe `use`, camelCase).
- Logique pure / types / constantes → `src/lib/<nom>.ts`.
- Pas de dossier `utils/` fourre-tout.

## Code Style

- **UI en français.** Toutes les chaînes visibles utilisateur (labels, placeholders, aria-label, titres) sont en français.
- **Immutabilité** : updates de state via spread (`{ ...settings, ...patch }`), jamais de mutation.
- **Types explicites** sur les exports publics. `interface` pour les objets, `type` pour les unions de littéraux.
- **Pas de `console.log`** dans le code de production.
- **Tailwind v4** : pas de `tailwind.config.js`. Si une config est nécessaire, utiliser `@theme` dans `index.css`.

## Settings Versioning Protocol

Toute évolution de la forme de `Settings` (ajout, suppression, ou changement de type d'un champ) :

1. Bumper la clé localStorage : `waitscreen.settings.v1` → `v2`.
2. Garder l'ancienne clé en lecture le temps d'écrire une fonction de migration `migrateV1ToV2(old) → new`.
3. Lire d'abord la nouvelle clé, puis tenter la migration depuis l'ancienne, puis fallback sur `DEFAULT_SETTINGS`.

## Avant Tout Commit

- [ ] `npm run lint` passe sans warning
- [ ] `npm run build` passe (TypeScript + Vite)
- [ ] L'app a été testée à l'œil dans le navigateur (countdown actif, phrase qui apparaît/disparaît, état "fini" quand on met une heure passée)
