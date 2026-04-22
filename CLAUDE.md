# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projet

Site vitrine SPA pour **BikeMentor** — coaching VTT professionnel par Maxime Leroux (ex-compétiteur Enduro, 8 ans d'expérience). Le site présente les programmes de coaching et permet de contacter le coach via WhatsApp.

## Architecture actuelle

Projet statique sans bundler ni framework :

- `index.html` — SPA unique avec toutes les sections (Hero, À propos, Programmes, Résultats, Témoignages, FAQ, CTA, Footer)
- `styles.css` — Tous les styles (variables CSS, composants, responsive, animations)
- `main.js` — Comportements JS (navbar scroll, menu mobile, FAQ accordion, scroll-reveal)

Pas de `package.json` pour l'instant. Pour servir localement : `python3 -m http.server 8080` ou `npx serve .`

## Design system

Thème sombre avec accents orange et vert WhatsApp. Toutes les couleurs passent par les variables CSS :

```
--orange: #e05c00       /* accent principal */
--orange-light: #ff7a1f /* hover / highlights */
--green: #25d366        /* WhatsApp exclusivement */
--dark: #0f1117         /* fond principal */
--dark-2/#3/#4          /* fonds de sections imbriquées */
--gray / --gray-light   /* textes secondaires */
```

Police : **Inter** (Google Fonts, poids 400/500/600/700/900). Rayon de bordure : `--radius: 12px` / `--radius-lg: 20px`. Transition standard : `0.25s ease`.

**Règles de style à respecter :**
- Pas de fond blanc, jamais de gradients violets.
- Les boutons CTA primaires sont orange (`btn-primary`), les WhatsApp sont verts (`btn-whatsapp`).
- Les cartes utilisent un fond `var(--dark-3)` avec `border: 1px solid rgba(255,255,255,0.06)` au repos, `rgba(224,92,0,0.3)` au hover.
- Le scroll-reveal utilise les classes `.reveal` + `.visible` injectées par JS via `IntersectionObserver`.

## Contenu / données à ne pas inventer

- **Coach** : Maxime Leroux, certifié FFVELO Niveau 3, basé dans les Alpes (Chartreuse, Belledonne, Vercors)
- **WhatsApp** : `+33600000000` (placeholder — à remplacer par le vrai numéro)
- **Programmes** : Initiation VTT / Progression Enduro / Prépa Compétition
- **Stats hero** : +200 riders coachés, 8 ans d'expérience, 98% satisfaction
- Les liens WhatsApp utilisent le format `https://wa.me/33600000000?text=...` avec message pré-rempli encodé en URL

## Prochaines évolutions prévues

### Backend Node.js + Claude API
Ajout d'un assistant chat VTT alimenté par Claude (modèle `claude-opus-4-7`). Architecture cible :

```
server.js         Express + @anthropic-ai/sdk, endpoint POST /api/chat (SSE streaming)
package.json      type: "module", dépendances express + anthropic
index.html        Widget chat flottant (bouton bas-droite → panel slide-in)
styles.css        Styles du widget cohérents avec le design system existant
main.js           Logique client du chat (fetch streaming, historique messages)
```

**Règles pour l'intégration Claude API :**
- La clé API (`ANTHROPIC_API_KEY`) est côté serveur uniquement, jamais exposée au client.
- Utiliser le streaming SSE (`client.messages.stream(...)`) pour une réponse en temps réel.
- Activer le prompt caching (`cache_control: { type: "ephemeral" }`) sur le system prompt.
- Le system prompt positionne l'assistant comme "BikeMentor AI", répond en français, limite à 2-4 phrases, redirige vers WhatsApp pour tarifs/dispo.
- Historique de conversation côté client uniquement (pas de session serveur).

## Conventions de code

- JavaScript ES modules natifs (pas de bundler), pas de TypeScript côté front.
- Pas de framework CSS — uniquement des variables CSS et classes utilitaires définies dans `styles.css`.
- Les animations d'entrée passent par `.reveal` / `.reveal-delay-1/2/3` + `IntersectionObserver` dans `main.js` : ajouter la classe `.reveal` aux nouveaux éléments de grille.
- Responsive : breakpoints à 1024px, 900px, 768px (menu burger), 480px.
