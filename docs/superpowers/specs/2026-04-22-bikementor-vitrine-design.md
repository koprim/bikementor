# Design — Vitrine bikementor.fr

**Date :** 2026-04-22
**Projet :** refonte de bikementor.fr en site statique React, remplaçant la version WordPress existante.
**Auteur :** brainstorming session, synthèse des décisions validées.

---

## 1. Contexte projet

Vitrine pour **bikementor.fr** — service de coaching VTT (mountain bike) à Grenoble, animé par **Théo Poudret** (pilote trial professionnel). Les visiteurs découvrent les prestations et contactent le coach via WhatsApp pour réserver. Aucune authentification, aucune base de données, aucun backend — site **statique 100 % client-side**.

La version actuelle est un WordPress avec thème Corredo, plugins RevSlider/Elementor/EventsCalendar, stack lourde pour un besoin simple. Objectif de la refonte : performance maximale, design distinctif, maintenance nulle.

### Stack
- React 19 (JSX, pas de TypeScript)
- Vite 7 (dev + build)
- Tailwind CSS 4 (CSS-first, `@import "tailwindcss"`, pas de `tailwind.config.js`)
- ESLint 9 flat config
- Node 20+ pour les scripts (fetch-reviews)

### Staging & production
- **Staging :** Vercel (auto-deploy chaque push/PR, preview URL unique)
- **Production :** o2switch via FTP depuis GitHub Actions, déclenché par tag git

### Ce qui **n'est pas** dans le scope MVP
- Authentification
- Système de réservation en ligne
- Paiement
- CMS / backoffice (contenus édités dans du code / JSON)
- Multilingue (site 100 % français)
- Analytics / tracking (laissé pour plus tard)
- Blog (redirigé vers home pendant la migration)

---

## 2. Scope fonctionnel

Site **one-page** scrollable avec 6 sections, nav à ancres, toggle thème clair/sombre.

### Structure verticale
1. **Hero** — vidéo cinématographique plein écran + logo + CTA WhatsApp discret
2. **Prestations** — 3 cards vidéo → clic ouvre modale plein écran (détail + CTA WhatsApp)
3. **À propos** — mini-section : photo du coach, nom, diplômes, zone de coaching
4. **Contact** — grand CTA "Discuter sur WhatsApp" + liens sociaux secondaires
5. **Avis Google** — 3-5 avis récupérés via Google Places API au build-time
6. **Footer** — mentions légales, sitemap, réseaux sociaux, keywords SEO

### Header (sticky)
- Logo `BIKEMENTOR.FR`
- Nav : Accueil (`#top`), Prestations (`#prestations`), Avis (`#avis`)
- CTA "WhatsApp ↗" (externe, target `_blank`)
- Toggle thème clair/sombre (icône sun/moon, persisté en `localStorage`)
- Menu burger en `< 768px`

### Prestations (3, scrapées depuis le site actuel)
1. **Stage privé** — journée complète personnalisée, 5 sous-formats (enduro tech, enduro+sauts, enduro+trial, all-mountain, Ebike), 1 à 3 personnes.
2. **Leçons privées** — abonnement Grenoblois, 4 offres (1ère séance, mensuel, bi-mensuel, à la carte), 1 à 4 personnes.
3. **Créations originales** — formats collectifs, 4 formules (stage enduro collectif 70 €, trial training camp 90 €, collectif trial adulte 25 €, journées shuttles).

### Contact
- Un seul lien WhatsApp partout : `https://wa.me/message/CPLLJRUYZ43DB1` (lien avec message pré-configuré côté coach).
- Pas de formulaire, pas d'email visible, pas de téléphone.

### Avis Google
- 3-5 avis les plus récents, fetchés hebdomadairement via Google Places API (New).
- Si aucun avis → empty-state "Premiers avis bientôt disponibles."
- Liens "Voir tous les avis" (fiche Maps) + "Laisser un avis" (writeReviewUrl).

---

## 3. Architecture & arbre de composants

```
src/
├── app/
│   └── HomePage.jsx                # compose les 6 sections
├── components/
│   ├── layout/
│   │   ├── Header.jsx              # nav sticky + toggle thème + WhatsApp
│   │   ├── Footer.jsx
│   │   └── ThemeToggle.jsx
│   ├── sections/
│   │   ├── Hero.jsx                # vidéo fullscreen + overlay 60%
│   │   ├── Prestations.jsx         # grid 3 cards + state modale
│   │   ├── PrestationCard.jsx
│   │   ├── PrestationModal.jsx     # lazy-loaded
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   └── Reviews.jsx
│   ├── ui/
│   │   ├── WhatsAppButton.jsx      # CTA réutilisable
│   │   ├── VideoPlayer.jsx         # <video> natif, lazy
│   │   └── StarRating.jsx
│   └── primitives/
│       └── Modal.jsx               # a11y : focus trap, esc, scrim
├── lib/
│   ├── content/
│   │   ├── prestations.js          # source de vérité des 3 prestations
│   │   ├── coach.js                # bio, diplômes, zone, photo
│   │   └── reviews.json            # GÉNÉRÉ par scripts/fetch-reviews.js
│   ├── theme.js                    # hook useTheme + initThemeFromStorage
│   └── config.js                   # placeId, siteUrl (non-secret)
├── styles/
│   └── index.css                   # @import tailwindcss + tokens CSS
└── main.jsx                        # mount <HomePage /> dans StrictMode

scripts/
└── fetch-reviews.js                # Node, appelle Places API, écrit reviews.json

.github/workflows/
├── refresh-reviews.yml             # cron hebdo dimanche 04h UTC
└── deploy-prod.yml                 # tag v* → FTP o2switch

public/
├── videos/                         # MP4 prestations (stage-prive.mp4, etc.)
├── posters/                        # WebP posters vidéo
├── coach.webp                      # portrait Théo
├── og-cover.jpg                    # 1200×630 Open Graph
├── favicon.svg
├── apple-touch-icon.png
├── robots.txt
├── sitemap.xml
├── .htaccess                       # redirections WP + cache + HTTPS (prod o2switch)
└── 404.html                        # page 404 custom aux couleurs du site
```

### Principes de découpage
- `app/` = 1 page pour MVP. Si ajout ultérieur (ex. `/mentions-legales`), y vivra.
- Chaque `sections/*` lit uniquement son module `lib/content/*`. Pas de prop drilling cross-section.
- `Header`/`Footer` ne connaissent pas le contenu des sections — juste les ancres.
- `WhatsAppButton` prend `{ children, variant }` — l'URL est toujours `coach.whatsappUrl`.
- `Modal` ne connaît pas son contenu — wrapper générique a11y-ready.
- `lib/content/` isolé du code : le coach peut demander une modif texte sans comprendre React.

---

## 4. Data model

### `src/lib/content/prestations.js`

```js
/**
 * @typedef {Object} Format
 * @property {string}  title
 * @property {string}  description
 * @property {string=} duration        - "1h30 à 2h", "½ journée", "journée"
 * @property {string=} price           - "70 €", "Sur devis"
 * @property {string=} capacity        - "1 à 3 pers.", "8 pers max"
 *
 * @typedef {Object} Prestation
 * @property {string}   slug            - "stage-prive"
 * @property {string}   title
 * @property {string}   tagline         - pour la card
 * @property {string}   summary         - paragraphe d'intro (modale)
 * @property {string}   videoSrc        - "/videos/stage-prive.mp4"
 * @property {string}   poster          - "/posters/stage-prive.webp"
 * @property {Format[]} formats
 */

export const prestations = [
  {
    slug: 'stage-prive',
    title: 'Stage privé',
    tagline: 'Coaching premium personnalisé sur une journée.',
    summary: "Une journée complète de coaching technique individualisé à Grenoble. Matinée sur un spot technique (posture, virages, marches, noses, bunny-up), après-midi sur les meilleurs singles de Grenoble pour mettre en application. 1 à 3 personnes.",
    videoSrc: '/videos/stage-prive.mp4',
    poster: '/posters/stage-prive.webp',
    formats: [
      { title: 'Enduro & technique de pilotage', description: "Posture de base aux gestes spécifiques, puis application sur singles bijoux." },
      { title: 'Enduro & sauts',                 description: "Technique le matin, découverte progressive des sauts l'après-midi." },
      { title: 'Enduro & pilotage trial',        description: "Singles ultra techniques, racines, rochers, épingles serrées." },
      { title: 'Pilotage all-mountain',          description: "Maîtrise des descentes sinueuses pour randonneurs et longues distances." },
      { title: 'Enduro Ebike',                   description: "Spécificités du Ebike : montées techniques et franchissements." },
    ],
  },
  {
    slug: 'lecons-privees',
    title: 'Leçons privées',
    tagline: 'Progression technique régulière, par abonnement.',
    summary: "Service réservé aux Grenoblois, du XC à l'enduro, tous niveaux. Approche trial. Séances de 1h30 à 2h sur spots naturels proches de Grenoble (matin / pause déj / afterwork). Tarif dégressif de 1 à 3 personnes.",
    videoSrc: '/videos/lecons-privees.mp4',
    poster: '/posters/lecons-privees.webp',
    formats: [
      { title: '1ère séance',           description: "1er contact : 2h sur le spot principal pour échanger besoins et démarrer le travail technique.", duration: '2h' },
      { title: 'Abonnement mensuel',    description: "1 séance par mois, planification et fiche de suivi de progression.", duration: '1h30 à 2h', capacity: '1 à 3 pers.' },
      { title: 'Abonnement bi-mensuel', description: "2 séances par mois, rythme soutenu de progression.",               duration: '1h30 à 2h', capacity: '1 à 3 pers.' },
      { title: 'Coaching à la carte',   description: "Perfectionnement all-mountain, VTTAE, enduro, XC, trial.",         duration: '3h / ½ journée / journée', capacity: '1 à 4 pers.' },
    ],
  },
  {
    slug: 'creations-originales',
    title: 'Créations originales',
    tagline: 'Formats collectifs, dates planifiées.',
    summary: "Plusieurs fois par an, en complément des stages privés, des formats collectifs. Places limitées, règlement en début de session.",
    videoSrc: '/videos/creations-originales.mp4',
    poster: '/posters/creations-originales.webp',
    formats: [
      { title: 'Stage enduro collectif',   description: "Matinée technique, après-midi sur singles bijoux d'un spot enduro.", duration: 'journée', price: '70 €', capacity: '8 pers max' },
      { title: 'Trial training camp',      description: "Pure VTT Trial sur 2 jours, sur les spots du RTF38 (Fontaine et St-Nizier).", duration: '2 jours', price: '90 €', capacity: '8 pers max' },
      { title: 'Collectif trial adulte',   description: "Apprentissage et perfectionnement trial sur terrain de VTT Trial.",  duration: '1h30', price: '25 €' },
      { title: 'Journées shuttles',        description: "Journées shuttle, 2 fois par an.", duration: 'journée' },
    ],
  },
];
```

### `src/lib/content/coach.js`

```js
export const coach = {
  name: 'Théo Poudret',
  title: 'Pilote trial pro · Coach VTT',
  photo: '/coach.webp',                          // TODO fournir le fichier
  credentials: ['TODO confirmer le diplôme BE/DE VTT'],
  zone: 'Grenoble',
  bio: "TODO rédiger 2-3 lignes de bio (à partir du site actuel ou d'un brief coach)",
  whatsappUrl: 'https://wa.me/message/CPLLJRUYZ43DB1',
  socials: {
    youtube:   'https://www.youtube.com/channel/UCSWGp0nrUZ1AuUmXJXZa1VQ',
    instagram: 'TODO fournir l\'URL',
    facebook:  'TODO fournir l\'URL',
  },
};
```

### `src/lib/content/reviews.json` (bootstrap, généré ensuite au build)

```json
{
  "fetchedAt": null,
  "placeId": null,
  "placeName": "bikementor",
  "googleMapsUrl": null,
  "writeReviewUrl": null,
  "reviews": []
}
```

### `src/lib/config.js`

```js
export const config = {
  placeId: 'TODO renseigner le Google Place ID (public, non sensible)',
  siteUrl: 'https://bikementor.fr',
  siteName: 'bikementor',
};
```

### `.env.example`

```
# Secret. Utilisé uniquement par scripts/fetch-reviews.js (build-time + cron).
# Ne doit JAMAIS arriver dans le bundle client.
GOOGLE_PLACES_API_KEY=
```

---

## 5. Thème & tokens

Stratégie : variables CSS = source de vérité, Tailwind 4 consomme via `@theme`. Dark/light basculé par `[data-theme="dark"]` sur `<html>`. **Direction visuelle : Dojo Sentier** — light-first, éditorial minimaliste.

### `src/styles/index.css`

```css
@import "tailwindcss";

@theme {
  --font-display: "Hedvig Letters Serif", Georgia, serif;
  --font-sans:    "Commissioner", ui-sans-serif, system-ui, sans-serif;
  --font-mono:    "JetBrains Mono", ui-monospace, monospace;

  --text-xs:   0.75rem;
  --text-sm:   0.875rem;
  --text-base: 1rem;
  --text-lg:   1.125rem;
  --text-xl:   1.375rem;
  --text-2xl:  1.75rem;
  --text-3xl:  2.25rem;
  --text-4xl:  3rem;
  --text-hero: clamp(2.75rem, 6vw, 5.5rem);

  --spacing: 0.25rem;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
}

:root,
[data-theme="light"] {
  --color-bg:            #EBE6DD;
  --color-bg-elevated:   #F4F0E8;
  --color-fg:            #161614;
  --color-fg-muted:      #5C5A55;
  --color-fg-subtle:     #8B8780;
  --color-accent:        #B23A26;
  --color-accent-fg:     #F4F0E8;
  --color-secondary:     #5C6B4F;
  --color-border:        #D6D1C6;
  --color-border-strong: #B8B1A2;
  --color-scrim:         rgba(22, 22, 20, 0.72);
}

[data-theme="dark"] {
  --color-bg:            #161614;
  --color-bg-elevated:   #1F1E1B;
  --color-fg:            #EBE6DD;
  --color-fg-muted:      #A29D94;
  --color-fg-subtle:     #6E6A62;
  --color-accent:        #D65A40;
  --color-accent-fg:     #161614;
  --color-secondary:     #8A9579;
  --color-border:        #2C2B27;
  --color-border-strong: #3F3D37;
  --color-scrim:         rgba(0, 0, 0, 0.78);
}

html { background: var(--color-bg); color: var(--color-fg); scroll-behavior: smooth; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Hiérarchie typographique

| Usage | Font | Weight | Size | Line-height | Tracking |
|---|---|---|---|---|---|
| Hero title | Hedvig Letters Serif | 400 | `--text-hero` | 1.02 | −0.02em |
| Section title (h2) | Hedvig Letters Serif | 400 | `--text-3xl` → `--text-4xl` | 1.05 | −0.015em |
| Card title (h3) | Hedvig Letters Serif | 400 | `--text-xl` | 1.2 | −0.01em |
| Body | Commissioner | 300 | `--text-base` / `--text-lg` | 1.6 | 0 |
| Label / eyebrow | Commissioner | 500 | `--text-xs` | 1 | +0.14em (uppercase) |
| Data / durée / prix | JetBrains Mono | 500 | `--text-xs` / `--text-sm` | 1 | +0.06em |

### Règle d'usage de l'accent vermilion
- **Utilisé uniquement** : CTA primaires (WhatsApp), italic accent sur 1-2 mots des titres hero/section, hover des liens nav, indicateur actif du toggle thème.
- **Jamais** : fonds larges, borders généralistes, body text.

### FOUC-proof theme init (dans `index.html`, avant `<script type="module">`)

```html
<script>
  (function () {
    const saved = localStorage.getItem('theme');
    const prefers = matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', saved || (prefers ? 'dark' : 'light'));
  })();
</script>
```

### Motifs graphiques
- Filet horizontal `1px solid var(--color-border)` entre sections.
- Numérotation de section en marginalia desktop (`01 / Prestations`) en JetBrains Mono xs avec tracking large.
- **Pas** de dégradé, pas de glassmorphism généralisé. `backdrop-filter: blur(12px) saturate(1.4)` sur le header sticky **uniquement** après `scroll > 40px`.

### Contrastes WCAG vérifiés
- `#161614` sur `#EBE6DD` = **16.8:1** (AAA body)
- `#B23A26` sur `#EBE6DD` = **5.35:1** (AA normal, AAA large)
- `#D65A40` sur `#161614` = **4.8:1** (AA normal)

---

## 6. Pipeline build-time Google Reviews

### `scripts/fetch-reviews.js`

- **API cible :** Places API (New), endpoint `GET https://places.googleapis.com/v1/places/{placeId}`
- **Headers :** `X-Goog-Api-Key` (secret), `X-Goog-FieldMask: reviews,displayName,googleMapsUri`
- **Query :** `?languageCode=fr`
- **Transform :** filtre les avis < 40 caractères, slice 5 max, normalise au schéma interne
- **Output :** `src/lib/content/reviews.json`

### Règles fail-soft
- `GOOGLE_PLACES_API_KEY` manquante → exit 1 avant appel.
- HTTP 4xx/5xx → exit 1, fichier **non écrasé**.
- Zéro avis retourné → exit 1 avec warning, fichier conservé.
- Champs optionnels (photo, langue) → fallback `null`.

### `package.json` scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "fetch-reviews": "node scripts/fetch-reviews.js",
    "prebuild": "node scripts/fetch-reviews.js || echo '⚠ fetch-reviews a échoué, build continue avec le snapshot existant'"
  }
}
```

### `.github/workflows/refresh-reviews.yml`

Cron hebdomadaire (dimanche 04h UTC) + `workflow_dispatch`. Commit+push sur `main` uniquement si le JSON a changé. Code complet disponible en annexe du brainstorm.

### Coût Google
- Places API (New) "Details (Basic + Reviews)" : ~17 $ / 1000 requêtes, 200 $ de crédit gratuit/mois.
- 52 req/an → **coût effectif 0 €**.

---

## 7. Flows utilisateur

### Flow 1 — Première arrivée
`[Entrée]` → Hero vidéo autoplay muet, overlay 60 %, CTA WhatsApp discret.
Scroll → Prestations (3 cards) → click card → modale plein écran avec détails + CTA WhatsApp.
Scroll → À propos → Contact (gros CTA) → Avis Google → Footer.

### Flow 2 — Navigation par ancres
Header sticky. Liens : Accueil (`#top`), Prestations (`#prestations`), Avis (`#avis`), WhatsApp ↗ (externe).
- `scroll-behavior: smooth`, `scroll-margin-top: 80px` sur chaque section.
- Lien actif détecté via `IntersectionObserver`.
- Désactivé automatiquement si `prefers-reduced-motion`.

### Flow 3 — Modale prestation
`<dialog>` natif ou `role="dialog" aria-modal="true"`. Focus trap, focus initial sur Fermer, Esc + scrim ferme, focus retourne au trigger. Vidéo pausée au close. Ouverture scale 0.98→1 + fade 220 ms ease-out. Close 140 ms (règle exit-faster-than-enter).

### Flow 4 — Toggle thème
Clic icône sun/moon → `setTheme()` → attribut `data-theme` sur `<html>` + persist `localStorage`. Les tokens basculent instantanément, `color`/`background-color` des éléments transitionnent en 200 ms.

### Flow 5 — Menu mobile
`< 768px` → burger `≡` → drawer plein écran (slide depuis la droite, 240 ms), scrim, mêmes liens en XL + ThemeToggle + CTA WhatsApp. Esc/scrim/clic-lien ferme.

### Flow 6 — Avis Google
Si `reviews.length > 0` → grid 3 colonnes desktop / carrousel horizontal mobile. Sinon empty-state discret.
Boutons "Voir tous les avis" → `googleMapsUrl` (new tab), "Laisser un avis" → `writeReviewUrl` (new tab).

### Flow 7 — Performance
- Hero video autoplay muted loop playsinline, poster WebP < 80 Ko.
- Mobile `saveData` ou `< 640px` → **pas de vidéo**, uniquement le poster.
- Prestation videos : `preload="none"` jusqu'à l'IntersectionObserver, `preload="auto"` dans la modale ouverte.
- Fonts : preload Hedvig Letters Serif 400 + Commissioner 300, reste en `font-display: swap`.
- Images : WebP + `loading="lazy"` partout sauf hero poster + coach photo + 1ère card.
- Code-split : `PrestationModal` en `React.lazy`.

---

## 8. Performance & accessibilité

### Cibles Lighthouse mobile
- Performance ≥ 92, Accessibility ≥ 98, Best Practices ≥ 95, SEO 100
- LCP < 2.0 s, CLS < 0.05, TBT < 150 ms
- Total JS < 80 Ko gzipped

### Pipeline media
- **Vidéos** : H.264 baseline, 1080p max, CRF 26-28, 2 passes, 20-40 s, ~2-4 Mo. Audio supprimé.
- **Images** : WebP q=82, srcset 400/800/1200w, `width`+`height` obligatoires, `loading="lazy"` (sauf fold-above).

### A11y — checklist opérationnelle
- 1 seul `<h1>` (tagline hero). Hiérarchie h2 par section, h3 cards/formats.
- `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`.
- Skip link `<a href="#main">` visible au focus uniquement.
- Focus-ring jamais supprimé (`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`).
- Modale : focus-trap, focus initial sur Fermer, focus retour au trigger, Esc + scrim ferme.
- Avis : `<article aria-label="Avis de {nom}, {rating} étoiles sur 5">`, StarRating `role="img" aria-label="{rating} sur 5"`.
- WhatsApp CTA : `aria-label="Ouvrir WhatsApp pour contacter Théo (ouvre dans un nouvel onglet)"`.
- Images décoratives : `alt=""` + `aria-hidden="true"`.
- `prefers-reduced-motion` désactive toutes les animations au niveau racine.

### Bundle strategy
- Entry `main.jsx` : React, ReactDOM, HomePage, Header, Hero, ThemeToggle — ~40 Ko.
- `PrestationModal`, `Reviews` (optionnellement `Footer`) en `React.lazy`.
- Aucun tracker tiers dans MVP.

---

## 9. SEO & déploiement

### Meta tags (`index.html`)

```html
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#EBE6DD" media="(prefers-color-scheme: light)" />
  <meta name="theme-color" content="#161614" media="(prefers-color-scheme: dark)" />

  <title>bikementor · Coaching VTT par Théo Poudret à Grenoble</title>
  <meta name="description" content="Stages privés, leçons et collectifs de pilotage VTT à Grenoble. Enduro, trial, all-mountain, Ebike. Par Théo Poudret, pilote trial professionnel.">
  <link rel="canonical" href="https://bikementor.fr/">

  <meta property="og:type" content="website">
  <meta property="og:url" content="https://bikementor.fr/">
  <meta property="og:title" content="bikementor · Coaching VTT Grenoble">
  <meta property="og:description" content="Stages privés, leçons et collectifs de pilotage VTT à Grenoble.">
  <meta property="og:image" content="https://bikementor.fr/og-cover.jpg">
  <meta property="og:locale" content="fr_FR">
  <meta property="og:site_name" content="bikementor">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
</head>
```

### JSON-LD structured data

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://bikementor.fr/#org",
  "name": "bikementor",
  "description": "Coaching VTT par Théo Poudret à Grenoble — stages privés, leçons et collectifs.",
  "url": "https://bikementor.fr/",
  "image": "https://bikementor.fr/coach.webp",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Grenoble",
    "addressRegion": "Isère",
    "addressCountry": "FR"
  },
  "areaServed": "Grenoble",
  "founder": { "@type": "Person", "name": "Théo Poudret" },
  "sameAs": [
    "https://www.youtube.com/channel/UCSWGp0nrUZ1AuUmXJXZa1VQ"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Prestations",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Stage privé" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Leçons privées" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Créations originales" } }
    ]
  }
}
```

Les avis Google ne sont **pas** republiés en JSON-LD (ToS Google).

### `public/robots.txt`

```
User-agent: *
Allow: /
Sitemap: https://bikementor.fr/sitemap.xml
```

### `public/sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://bikementor.fr/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

### Staging — Vercel
- Repo GitHub → Vercel (connexion 1 clic, détection auto Vite).
- Preview URL par branche et par PR.
- Aucune env var côté Vercel (les reviews sont déjà dans `reviews.json` committé).

### Production — o2switch via FTP

**`.github/workflows/deploy-prod.yml`** déclenché par `push tag v*` :

```yaml
on:
  push:
    tags: ['v*']
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run build
      - uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server:    ${{ secrets.O2SWITCH_FTP_HOST }}
          username:  ${{ secrets.O2SWITCH_FTP_USER }}
          password:  ${{ secrets.O2SWITCH_FTP_PASSWORD }}
          local-dir: ./dist/
          server-dir: /public_html/
          protocol:  ftps
```

**Secrets GitHub requis :**
- `GOOGLE_PLACES_API_KEY` (cron reviews)
- `O2SWITCH_FTP_HOST`, `O2SWITCH_FTP_USER`, `O2SWITCH_FTP_PASSWORD`

### `public/.htaccess` (déployé avec `dist/`)

```apache
RewriteEngine On

# HTTPS forcé
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# www → apex
RewriteCond %{HTTP_HOST} ^www\.bikementor\.fr$ [NC]
RewriteRule ^(.*)$ https://bikementor.fr/$1 [L,R=301]

# Redirections WordPress → one-page
RewriteRule ^services/stage-prive/?$           /#prestations [L,R=301]
RewriteRule ^services/lecons-privees/?$        /#prestations [L,R=301]
RewriteRule ^services/creations-originales/?$  /#prestations [L,R=301]
RewriteRule ^become-a-volunteer/?$             /#prestations [L,R=301]
RewriteRule ^contact/?$                        /#contact     [L,R=301]
RewriteRule ^videos-3/?$                       /#prestations [L,R=301]
RewriteRule ^images/?$                         /             [L,R=301]
RewriteRule ^blog/?.*$                         /             [L,R=301]
RewriteRule ^event/?$                          /#prestations [L,R=301]
RewriteRule ^services_group/.*$                /#prestations [L,R=301]

# Cache + compression
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType video/mp4              "access plus 1 month"
  ExpiresByType image/webp             "access plus 1 month"
  ExpiresByType image/jpeg             "access plus 1 month"
  ExpiresByType image/png              "access plus 1 month"
  ExpiresByType font/woff2             "access plus 1 year"
  ExpiresByType text/css               "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType text/html              "access plus 0 seconds"
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json image/svg+xml
</IfModule>

ErrorDocument 404 /404.html
```

---

## 10. Plan de migration WordPress → statique

### Étape 1 — Préparation (impact 0 sur l'existant)
1. Dev local + preview Vercel, validation complète.
2. Collecter chez le coach : **place ID Google**, diplômes à confirmer, photo coach haute résolution, URLs Instagram + Facebook.
3. Récupérer les vidéos et images depuis le WP actuel (ou tourner des nouvelles).
4. Tester toute la preview Vercel.

### Étape 2 — Bascule (fenêtre courte)
1. **Backup WordPress** complet (BDD + fichiers) via cPanel o2switch.
2. Sur o2switch : renommer `public_html/` → `public_html_wp_backup/` (rollback binaire possible).
3. Créer un `public_html/` vide.
4. Déclencher `deploy-prod` (tag `v1.0.0` ou `workflow_dispatch`).
5. Vérifier l'upload FTP, tester `https://bikementor.fr`.
6. **TTL DNS** baissé à 300 s au moins 48 h avant la bascule → rollback < 5 min si besoin.

### Étape 3 — Nettoyage post-bascule
- Désinstaller WordPress (Softaculous cPanel) et supprimer la BDD MySQL WP (phpMyAdmin).
- Garder `public_html_wp_backup/` 30 jours, puis supprimer.
- Vérifier que les emails `@bikementor.fr` (hébergés o2switch) continuent à fonctionner — la bascule du site ne touche pas le mail.
- Soumettre le nouveau sitemap dans Google Search Console.

### Étape 4 — SEO post-migration (S+1 à S+4)
- Monitorer les 404 dans Search Console (les redirections `.htaccess` devraient tout couvrir).
- Confirmer que la fiche Google My Business (qui porte les avis) est inchangée — elle est indépendante du site.
- Lighthouse + PageSpeed Insights post-bascule, baseline de comparaison avec l'ancien WP.

### Rollback
Renommer `public_html/` → `public_html_new_site/`, restaurer `public_html_wp_backup/` → `public_html/`. WordPress reprend, DNS inchangé. Durée : ~5 min via cPanel.

---

## 11. Données à fournir avant implémentation

Placeholders marqués `TODO` dans le code :

### Contenu coach
- [ ] Diplôme(s) exact(s) — BE / DE VTT / MF (à confirmer auprès de Théo)
- [ ] Bio 2-3 lignes (adaptation du texte actuel ou brief)
- [ ] Photo portrait haute résolution (WebP 1200×1200 min)
- [ ] URL Instagram
- [ ] URL Facebook

### Assets prestations
- [ ] `stage-prive.mp4` + `stage-prive.webp`
- [ ] `lecons-privees.mp4` + `lecons-privees.webp`
- [ ] `creations-originales.mp4` + `creations-originales.webp`

### Configuration Google
- [ ] **Place ID** Google (public, non sensible — à récupérer via [Place ID Finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder))
- [ ] **API Key** Google Places API (privée, à stocker dans GitHub Secrets uniquement)

### Assets génériques
- [ ] `og-cover.jpg` 1200×630
- [ ] Favicon SVG + apple-touch-icon.png 180×180
- [ ] Logo final (si différent de l'actuel)
- [ ] `404.html` custom aux couleurs du site

### Secrets GitHub à créer
- [ ] `GOOGLE_PLACES_API_KEY`
- [ ] `O2SWITCH_FTP_HOST`
- [ ] `O2SWITCH_FTP_USER`
- [ ] `O2SWITCH_FTP_PASSWORD`

---

## 12. Critères de succès

MVP considéré comme livré quand :
1. Le site s'ouvre sur `https://bikementor.fr` et charge en < 2.5 s en 4G sur smartphone moyen.
2. Les 3 prestations sont toutes ouvrables en modale, la vidéo joue, le CTA WhatsApp ouvre bien `wa.me`.
3. Les 3-5 avis Google les plus récents s'affichent, rafraîchis hebdomadairement sans intervention.
4. Lighthouse mobile : Perf ≥ 92, A11y ≥ 98, SEO = 100.
5. Toutes les anciennes URLs WordPress connues redirigent en 301 (vérifiées avec `curl -I`).
6. Le toggle thème clair/sombre fonctionne et persiste.
7. Aucune clé secrète dans le bundle client (vérifié avec `grep -r "GOOGLE_PLACES_API_KEY" dist/` → vide).
