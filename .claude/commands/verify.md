---
description: Run lint + build to verify the project is in a shippable state
---

# /verify

Vérifier que le projet est dans un état propre avant commit.

Étapes (séquentielles, s'arrêter au premier échec) :

1. `npm run lint` — doit retourner 0 warning, 0 erreur.
2. `npm run build` — TypeScript + Vite doivent compiler sans erreur.

Si une étape échoue : analyser la sortie, corriger, relancer. Ne pas masquer les warnings (pas de `--quiet`, pas de `// eslint-disable-next-line` sans justification écrite).

Reporter à la fin :
- ✅ ou ❌ pour chaque étape
- Taille du bundle (gzip) si build réussi
- Prochaine action suggérée
