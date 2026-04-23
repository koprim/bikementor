# bikementor Vitrine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static React one-page vitrine for bikementor.fr (VTT coach Théo Poudret) with WhatsApp-only contact, build-time Google reviews pipeline, light/dark theme, deployed to Vercel (staging) and o2switch (production).

**Architecture:** React 19 + Vite 7 + Tailwind CSS 4 (CSS-first `@theme`). Functional components, no state management library — data is static modules in `src/lib/content/`. Google reviews fetched at build time by a Node script, committed as JSON. Modal is React.lazy. No backend.

**Tech Stack:** React 19, Vite 7, Tailwind CSS 4, Vitest + React Testing Library, focus-trap-react, Node 20 (scripts), GitHub Actions (cron + FTP deploy).

**Reference spec:** `docs/superpowers/specs/2026-04-22-bikementor-vitrine-design.md`

---

## Task 1: Project cleanup & test tooling

**Files:**
- Delete: `src/App.jsx`, `src/App.css`, `src/assets/`
- Modify: `package.json`, `vite.config.js`
- Create: `vitest.config.js`, `src/test/setup.js`

- [ ] **Step 1: Remove Vite scaffold files**

```bash
rm src/App.jsx src/App.css
rm -rf src/assets/
```

- [ ] **Step 2: Swap postcss for @tailwindcss/vite, add test deps**

Update `package.json` — remove `autoprefixer` and `postcss` from `devDependencies`, add new deps and scripts:

```json
{
  "name": "bikementor",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "fetch-reviews": "node scripts/fetch-reviews.js",
    "prebuild": "node scripts/fetch-reviews.js || echo '⚠ fetch-reviews failed, build continues with existing snapshot'"
  },
  "dependencies": {
    "focus-trap-react": "^11.0.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@tailwindcss/vite": "^4.2.1",
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.0",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "jsdom": "^25.0.0",
    "tailwindcss": "^4.2.1",
    "vite": "^7.3.1",
    "vitest": "^2.1.0"
  }
}
```

Run: `npm install`
Expected: all deps install without error.

- [ ] **Step 3: Update vite.config.js with Tailwind plugin**

Replace `vite.config.js`:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

- [ ] **Step 4: Create vitest.config.js**

Create `vitest.config.js`:

```js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: false,
    css: true,
  },
});
```

- [ ] **Step 5: Create test setup file**

Create `src/test/setup.js`:

```js
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 6: Verify build still works after cleanup**

Run: `npm run build`
Expected: Build fails because `main.jsx` still imports `./App.jsx` which was deleted. That's expected — we fix this in Task 19. For now, run lint to confirm deps resolve:

Run: `npm run lint`
Expected: PASS (no errors on remaining files).

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vite.config.js vitest.config.js src/test/setup.js
git rm src/App.jsx src/App.css
git rm -r src/assets
git commit -m "chore: remove scaffold, add tailwind 4 vite plugin and vitest"
```

---

## Task 2: Theme tokens, FOUC script & fonts

**Files:**
- Create: `src/styles/index.css`
- Delete: `src/index.css`
- Modify: `index.html`
- Test: `src/test/theme-tokens.test.js`

- [ ] **Step 1: Write failing test for theme tokens presence**

Create `src/test/theme-tokens.test.js`:

```js
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('theme tokens', () => {
  let css;
  beforeAll(() => {
    css = readFileSync(join(process.cwd(), 'src/styles/index.css'), 'utf8');
  });

  it('imports tailwindcss', () => {
    expect(css).toMatch(/@import\s+["']tailwindcss["']/);
  });

  it('defines light theme tokens', () => {
    expect(css).toMatch(/--color-bg:\s*#EBE6DD/);
    expect(css).toMatch(/--color-fg:\s*#161614/);
    expect(css).toMatch(/--color-accent:\s*#B23A26/);
  });

  it('defines dark theme tokens on [data-theme="dark"]', () => {
    expect(css).toMatch(/\[data-theme="dark"\]\s*\{[^}]*--color-bg:\s*#161614/s);
  });

  it('declares Hedvig Letters Serif as display font', () => {
    expect(css).toMatch(/--font-display:\s*["']Hedvig Letters Serif["']/);
  });

  it('respects prefers-reduced-motion', () => {
    expect(css).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  });
});
```

- [ ] **Step 2: Run test to see it fail**

Run: `npm test -- theme-tokens`
Expected: FAIL — tokens file does not exist yet.

- [ ] **Step 3: Move CSS to src/styles/index.css with the full theme**

```bash
mkdir -p src/styles
rm -f src/index.css
```

Create `src/styles/index.css` with:

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

html {
  background: var(--color-bg);
  color: var(--color-fg);
  scroll-behavior: smooth;
  font-family: var(--font-sans);
  font-weight: 300;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

body { margin: 0; min-height: 100dvh; }

* { scroll-margin-top: 80px; }

.sr-only {
  position: absolute !important;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0, 0, 0, 0);
  white-space: nowrap; border: 0;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- theme-tokens`
Expected: PASS (all 5 assertions).

- [ ] **Step 5: Update index.html with FOUC script, fonts preload, meta basics**

Replace the entire content of `index.html`:

```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#EBE6DD" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#161614" media="(prefers-color-scheme: dark)" />

    <title>bikementor · Coaching VTT par Théo Poudret à Grenoble</title>
    <meta name="description" content="Stages privés, leçons et collectifs de pilotage VTT à Grenoble. Enduro, trial, all-mountain, Ebike. Par Théo Poudret, pilote trial professionnel." />
    <link rel="canonical" href="https://bikementor.fr/" />

    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif&family=Commissioner:wght@300;500;700&family=JetBrains+Mono:wght@500&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif&family=Commissioner:wght@300;500;700&family=JetBrains+Mono:wght@500&display=swap" />

    <script>
      (function () {
        try {
          var saved = localStorage.getItem('theme');
          var prefers = matchMedia('(prefers-color-scheme: dark)').matches;
          document.documentElement.setAttribute('data-theme', saved || (prefers ? 'dark' : 'light'));
        } catch (_) {
          document.documentElement.setAttribute('data-theme', 'light');
        }
      })();
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

(Open Graph, Twitter Card, and JSON-LD will be added in Task 20.)

- [ ] **Step 6: Commit**

```bash
git add src/styles/ index.html src/test/theme-tokens.test.js
git rm -f src/index.css
git commit -m "feat(theme): add design tokens, FOUC-proof theme init, fonts"
```

---

## Task 3: Static data modules (config, coach, prestations, reviews bootstrap)

**Files:**
- Create: `src/lib/config.js`, `src/lib/content/coach.js`, `src/lib/content/prestations.js`, `src/lib/content/reviews.json`
- Test: `src/lib/content/content.test.js`

- [ ] **Step 1: Write failing tests for content shape**

Create `src/lib/content/content.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { prestations } from './prestations.js';
import { coach } from './coach.js';
import reviews from './reviews.json';
import { config } from '../config.js';

describe('prestations', () => {
  it('has exactly 3 prestations', () => {
    expect(prestations).toHaveLength(3);
  });

  it('has slugs stage-prive, lecons-privees, creations-originales', () => {
    expect(prestations.map(p => p.slug)).toEqual([
      'stage-prive', 'lecons-privees', 'creations-originales',
    ]);
  });

  it('each prestation has required fields', () => {
    for (const p of prestations) {
      expect(p.title).toBeTruthy();
      expect(p.tagline).toBeTruthy();
      expect(p.summary).toBeTruthy();
      expect(p.videoSrc).toMatch(/^\/videos\/.+\.mp4$/);
      expect(p.poster).toMatch(/^\/posters\/.+\.webp$/);
      expect(Array.isArray(p.formats)).toBe(true);
      expect(p.formats.length).toBeGreaterThan(0);
      for (const f of p.formats) {
        expect(f.title).toBeTruthy();
        expect(f.description).toBeTruthy();
      }
    }
  });
});

describe('coach', () => {
  it('has name Théo Poudret', () => {
    expect(coach.name).toBe('Théo Poudret');
  });

  it('uses the wa.me/message link', () => {
    expect(coach.whatsappUrl).toBe('https://wa.me/message/CPLLJRUYZ43DB1');
  });

  it('has youtube url', () => {
    expect(coach.socials.youtube).toMatch(/^https:\/\/www\.youtube\.com/);
  });
});

describe('reviews bootstrap', () => {
  it('has the expected shape with empty reviews', () => {
    expect(reviews).toEqual(expect.objectContaining({
      fetchedAt: null,
      reviews: [],
    }));
  });
});

describe('config', () => {
  it('has siteUrl https://bikementor.fr', () => {
    expect(config.siteUrl).toBe('https://bikementor.fr');
  });
});
```

- [ ] **Step 2: Run tests to see them fail**

Run: `npm test -- content`
Expected: FAIL (modules don't exist).

- [ ] **Step 3: Create src/lib/config.js**

```js
export const config = {
  placeId: 'TODO renseigner le Google Place ID (public, non sensible)',
  siteUrl: 'https://bikementor.fr',
  siteName: 'bikementor',
};
```

- [ ] **Step 4: Create src/lib/content/coach.js**

```js
export const coach = {
  name: 'Théo Poudret',
  title: 'Pilote trial pro · Coach VTT',
  photo: '/coach.webp',
  credentials: ['TODO confirmer le diplôme BE/DE VTT'],
  zone: 'Grenoble',
  bio: "TODO rédiger 2-3 lignes de bio",
  whatsappUrl: 'https://wa.me/message/CPLLJRUYZ43DB1',
  socials: {
    youtube:   'https://www.youtube.com/channel/UCSWGp0nrUZ1AuUmXJXZa1VQ',
    instagram: 'TODO fournir l\'URL',
    facebook:  'TODO fournir l\'URL',
  },
};
```

- [ ] **Step 5: Create src/lib/content/prestations.js**

```js
/**
 * @typedef {Object} Format
 * @property {string}  title
 * @property {string}  description
 * @property {string=} duration
 * @property {string=} price
 * @property {string=} capacity
 *
 * @typedef {Object} Prestation
 * @property {string}   slug
 * @property {string}   title
 * @property {string}   tagline
 * @property {string}   summary
 * @property {string}   videoSrc
 * @property {string}   poster
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
      { title: 'Collectif trial adulte',   description: "Apprentissage et perfectionnement trial sur terrain de VTT Trial.", duration: '1h30', price: '25 €' },
      { title: 'Journées shuttles',        description: "Journées shuttle, 2 fois par an.", duration: 'journée' },
    ],
  },
];
```

- [ ] **Step 6: Create src/lib/content/reviews.json (bootstrap)**

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

- [ ] **Step 7: Run tests to verify they pass**

Run: `npm test -- content`
Expected: PASS (all assertions).

- [ ] **Step 8: Commit**

```bash
git add src/lib/
git commit -m "feat(content): add prestations, coach, config, reviews bootstrap"
```

---

## Task 4: useTheme hook

**Files:**
- Create: `src/lib/theme.js`
- Test: `src/lib/theme.test.js`

- [ ] **Step 1: Write failing tests for useTheme**

Create `src/lib/theme.test.js`:

```js
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from './theme.js';

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('reads initial theme from data-theme attribute', () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
  });

  it('defaults to light when no attribute set', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
  });

  it('setTheme updates the attribute and localStorage', () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme('dark'));
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(result.current.theme).toBe('dark');
  });

  it('toggleTheme flips between light and dark', () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme('light'));
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe('dark');
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe('light');
  });
});
```

- [ ] **Step 2: Run tests to see them fail**

Run: `npm test -- theme.test`
Expected: FAIL — `useTheme` not exported.

- [ ] **Step 3: Implement useTheme hook**

Create `src/lib/theme.js`:

```js
import { useCallback, useEffect, useState } from 'react';

function readInitial() {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-theme') || 'light';
}

export function useTheme() {
  const [theme, setThemeState] = useState(readInitial);

  const setTheme = useCallback((next) => {
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (_) { /* ignore */ }
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'theme' && e.newValue) {
        document.documentElement.setAttribute('data-theme', e.newValue);
        setThemeState(e.newValue);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return { theme, setTheme, toggleTheme };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- theme.test`
Expected: PASS (all 4 assertions).

- [ ] **Step 5: Commit**

```bash
git add src/lib/theme.js src/lib/theme.test.js
git commit -m "feat(theme): add useTheme hook with localStorage sync"
```

---

## Task 5: Modal primitive (a11y-ready)

**Files:**
- Create: `src/components/primitives/Modal.jsx`
- Test: `src/components/primitives/Modal.test.jsx`

- [ ] **Step 1: Write failing tests for Modal**

Create `src/components/primitives/Modal.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal.jsx';

describe('Modal', () => {
  it('does not render when open=false', () => {
    render(<Modal open={false} onClose={() => {}} labelledBy="t"><h2 id="t">Hi</h2></Modal>);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders dialog with aria attributes when open', () => {
    render(<Modal open onClose={() => {}} labelledBy="title-id"><h2 id="title-id">Hi</h2></Modal>);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'title-id');
  });

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Modal open onClose={onClose} labelledBy="t"><h2 id="t">Hi</h2></Modal>);
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when scrim is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Modal open onClose={onClose} labelledBy="t"><h2 id="t">Hi</h2></Modal>);
    await user.click(screen.getByTestId('modal-scrim'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders close button that calls onClose', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Modal open onClose={onClose} labelledBy="t"><h2 id="t">Hi</h2></Modal>);
    await user.click(screen.getByRole('button', { name: /fermer/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run tests to see them fail**

Run: `npm test -- Modal.test`
Expected: FAIL — Modal doesn't exist.

- [ ] **Step 3: Implement Modal**

Create `src/components/primitives/Modal.jsx`:

```jsx
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FocusTrap } from 'focus-trap-react';

export default function Modal({ open, onClose, labelledBy, describedBy, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <FocusTrap focusTrapOptions={{ initialFocus: '#modal-close-btn', escapeDeactivates: false }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          data-testid="modal-scrim"
          onClick={onClose}
          className="absolute inset-0"
          style={{ background: 'var(--color-scrim)' }}
          aria-hidden="true"
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          className="relative mx-4 my-8 max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-xl p-6 md:p-8"
          style={{
            background: 'var(--color-bg-elevated)',
            color: 'var(--color-fg)',
            border: '1px solid var(--color-border)',
          }}
        >
          <button
            id="modal-close-btn"
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full border hover:bg-[var(--color-bg)] focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ borderColor: 'var(--color-border)', outlineColor: 'var(--color-accent)' }}
          >
            <span aria-hidden="true">✕</span>
          </button>
          {children}
        </div>
      </div>
    </FocusTrap>,
    document.body
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- Modal.test`
Expected: PASS (5 assertions).

- [ ] **Step 5: Commit**

```bash
git add src/components/primitives/Modal.jsx src/components/primitives/Modal.test.jsx
git commit -m "feat(ui): add a11y Modal primitive with focus trap"
```

---

## Task 6: WhatsAppButton

**Files:**
- Create: `src/components/ui/WhatsAppButton.jsx`
- Test: `src/components/ui/WhatsAppButton.test.jsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/ui/WhatsAppButton.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import WhatsAppButton from './WhatsAppButton.jsx';

describe('WhatsAppButton', () => {
  it('renders an anchor pointing to the coach whatsappUrl', () => {
    render(<WhatsAppButton>Discuter</WhatsAppButton>);
    const link = screen.getByRole('link', { name: /discuter/i });
    expect(link).toHaveAttribute('href', 'https://wa.me/message/CPLLJRUYZ43DB1');
  });

  it('opens in a new tab with security attrs', () => {
    render(<WhatsAppButton>Go</WhatsAppButton>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringMatching(/noopener/));
  });

  it('has descriptive aria-label mentioning new tab', () => {
    render(<WhatsAppButton>Go</WhatsAppButton>);
    expect(screen.getByRole('link')).toHaveAttribute('aria-label', expect.stringMatching(/ouvre dans un nouvel onglet/i));
  });

  it('applies variant primary styles when variant="primary"', () => {
    render(<WhatsAppButton variant="primary">P</WhatsAppButton>);
    expect(screen.getByRole('link').className).toMatch(/primary/);
  });
});
```

- [ ] **Step 2: Run tests to see them fail**

Run: `npm test -- WhatsAppButton`
Expected: FAIL.

- [ ] **Step 3: Implement WhatsAppButton**

Create `src/components/ui/WhatsAppButton.jsx`:

```jsx
import { coach } from '../../lib/content/coach.js';

export default function WhatsAppButton({ children, variant = 'primary', className = '' }) {
  const variantClass = variant === 'primary' ? 'wa-btn-primary' : 'wa-btn-ghost';
  const styles = variant === 'primary'
    ? { background: 'var(--color-accent)', color: 'var(--color-accent-fg)', borderColor: 'var(--color-accent)' }
    : { background: 'transparent', color: 'var(--color-fg)', borderColor: 'var(--color-border-strong)' };

  return (
    <a
      href={coach.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Ouvrir WhatsApp pour contacter Théo (ouvre dans un nouvel onglet)"
      className={`${variantClass} inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-medium uppercase tracking-[0.12em] transition-transform duration-200 ease-out hover:-translate-y-[1px] focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
      style={{ ...styles, outlineColor: 'var(--color-accent)' }}
    >
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.5 3.5A11 11 0 0 0 2.1 17.7L1 23l5.5-1.4A11 11 0 1 0 20.5 3.5zm-8.5 17a9 9 0 0 1-4.6-1.2l-.3-.2-3.3.8.9-3.2-.2-.3A9 9 0 1 1 12 20.5zm5-6.7c-.3-.1-1.6-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.2-1.3-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.2-.5 0-.2 0-.3-.1-.5l-.7-1.7c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.3s.9 2.7 1 2.8c.1.2 1.9 2.9 4.6 4 2.7 1 2.7.7 3.2.6.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3z"/>
      </svg>
      <span>{children}</span>
    </a>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- WhatsAppButton`
Expected: PASS (4 assertions).

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/WhatsAppButton.jsx src/components/ui/WhatsAppButton.test.jsx
git commit -m "feat(ui): add WhatsAppButton CTA"
```

---

## Task 7: VideoPlayer

**Files:**
- Create: `src/components/ui/VideoPlayer.jsx`
- Test: `src/components/ui/VideoPlayer.test.jsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/ui/VideoPlayer.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import VideoPlayer from './VideoPlayer.jsx';

describe('VideoPlayer', () => {
  it('renders a <video> with src and poster', () => {
    const { container } = render(<VideoPlayer src="/v.mp4" poster="/p.webp" label="démo" />);
    const video = container.querySelector('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('poster', '/p.webp');
    const source = video.querySelector('source');
    expect(source).toHaveAttribute('src', '/v.mp4');
    expect(source).toHaveAttribute('type', 'video/mp4');
  });

  it('applies muted, autoplay, loop, playsinline by default', () => {
    const { container } = render(<VideoPlayer src="/v.mp4" poster="/p.webp" label="démo" />);
    const video = container.querySelector('video');
    expect(video.muted).toBe(true);
    expect(video).toHaveAttribute('autoplay');
    expect(video).toHaveAttribute('loop');
    expect(video).toHaveAttribute('playsinline');
  });

  it('uses preload="none" by default', () => {
    const { container } = render(<VideoPlayer src="/v.mp4" poster="/p.webp" label="démo" />);
    expect(container.querySelector('video')).toHaveAttribute('preload', 'none');
  });

  it('accepts preload override', () => {
    const { container } = render(<VideoPlayer src="/v.mp4" poster="/p.webp" label="démo" preload="auto" />);
    expect(container.querySelector('video')).toHaveAttribute('preload', 'auto');
  });

  it('includes aria-label', () => {
    const { container } = render(<VideoPlayer src="/v.mp4" poster="/p.webp" label="Démo de stage privé" />);
    expect(container.querySelector('video')).toHaveAttribute('aria-label', 'Démo de stage privé');
  });
});
```

- [ ] **Step 2: Run tests to see them fail**

Run: `npm test -- VideoPlayer`
Expected: FAIL.

- [ ] **Step 3: Implement VideoPlayer**

Create `src/components/ui/VideoPlayer.jsx`:

```jsx
export default function VideoPlayer({ src, poster, label, preload = 'none', className = '' }) {
  return (
    <video
      className={`size-full object-cover ${className}`}
      poster={poster}
      aria-label={label}
      muted
      autoPlay
      loop
      playsInline
      preload={preload}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- VideoPlayer`
Expected: PASS (5 assertions).

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/VideoPlayer.jsx src/components/ui/VideoPlayer.test.jsx
git commit -m "feat(ui): add VideoPlayer with autoplay muted defaults"
```

---

## Task 8: StarRating

**Files:**
- Create: `src/components/ui/StarRating.jsx`
- Test: `src/components/ui/StarRating.test.jsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/ui/StarRating.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StarRating from './StarRating.jsx';

describe('StarRating', () => {
  it('renders with role=img and accessible label', () => {
    render(<StarRating rating={4} />);
    const el = screen.getByRole('img');
    expect(el).toHaveAttribute('aria-label', '4 sur 5 étoiles');
  });

  it('renders exactly 5 star SVGs', () => {
    const { container } = render(<StarRating rating={3} />);
    expect(container.querySelectorAll('svg')).toHaveLength(5);
  });

  it('clamps rating outside [0,5]', () => {
    render(<StarRating rating={7} />);
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', '5 sur 5 étoiles');
  });
});
```

- [ ] **Step 2: Run tests to see them fail**

Run: `npm test -- StarRating`
Expected: FAIL.

- [ ] **Step 3: Implement StarRating**

Create `src/components/ui/StarRating.jsx`:

```jsx
function Star({ filled }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ color: filled ? 'var(--color-accent)' : 'var(--color-border-strong)' }}
    >
      <path
        fill="currentColor"
        d="M12 17.27l5.18 3.04-1.38-5.92 4.6-3.99-6.05-.52L12 4l-2.35 5.88-6.05.52 4.6 3.99-1.38 5.92z"
      />
    </svg>
  );
}

export default function StarRating({ rating }) {
  const r = Math.max(0, Math.min(5, Math.round(rating ?? 0)));
  return (
    <span role="img" aria-label={`${r} sur 5 étoiles`} className="inline-flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => <Star key={i} filled={i < r} />)}
    </span>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- StarRating`
Expected: PASS (3 assertions).

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/StarRating.jsx src/components/ui/StarRating.test.jsx
git commit -m "feat(ui): add StarRating with accessible label"
```

---

## Task 9: ThemeToggle

**Files:**
- Create: `src/components/layout/ThemeToggle.jsx`
- Test: `src/components/layout/ThemeToggle.test.jsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/layout/ThemeToggle.test.jsx`:

```jsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from './ThemeToggle.jsx';

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.setAttribute('data-theme', 'light');
  });

  it('renders a button with aria-label announcing the target theme', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button', { name: /mode sombre/i })).toBeInTheDocument();
  });

  it('toggles data-theme when clicked', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    await user.click(screen.getByRole('button'));
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    await user.click(screen.getByRole('button'));
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('announces target theme in aria-label after toggle', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button').getAttribute('aria-label')).toMatch(/mode clair/i);
  });
});
```

- [ ] **Step 2: Run tests to see them fail**

Run: `npm test -- ThemeToggle`
Expected: FAIL.

- [ ] **Step 3: Implement ThemeToggle**

Create `src/components/layout/ThemeToggle.jsx`:

```jsx
import { useTheme } from '../../lib/theme.js';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const targetLabel = isDark ? 'mode clair' : 'mode sombre';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Passer en ${targetLabel}`}
      aria-pressed={isDark}
      className="inline-flex size-10 items-center justify-center rounded-full border transition-colors hover:bg-[var(--color-bg-elevated)] focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ borderColor: 'var(--color-border)', color: 'var(--color-fg)', outlineColor: 'var(--color-accent)' }}
    >
      {isDark ? (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
          <circle cx="12" cy="12" r="4" />
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="2" x2="12" y2="5"/>
            <line x1="12" y1="19" x2="12" y2="22"/>
            <line x1="2" y1="12" x2="5" y2="12"/>
            <line x1="19" y1="12" x2="22" y2="12"/>
            <line x1="4.9" y1="4.9" x2="7" y2="7"/>
            <line x1="17" y1="17" x2="19.1" y2="19.1"/>
            <line x1="4.9" y1="19.1" x2="7" y2="17"/>
            <line x1="17" y1="7" x2="19.1" y2="4.9"/>
          </g>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- ThemeToggle`
Expected: PASS (3 assertions).

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/ThemeToggle.jsx src/components/layout/ThemeToggle.test.jsx
git commit -m "feat(layout): add ThemeToggle button"
```

---

## Task 10: Header

**Files:**
- Create: `src/components/layout/Header.jsx`
- Test: `src/components/layout/Header.test.jsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/layout/Header.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './Header.jsx';

describe('Header', () => {
  it('renders brand name and desktop nav links', () => {
    render(<Header />);
    expect(screen.getByText(/bikementor/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /accueil/i })).toHaveAttribute('href', '#top');
    expect(screen.getByRole('link', { name: /^prestations$/i })).toHaveAttribute('href', '#prestations');
    expect(screen.getByRole('link', { name: /^avis$/i })).toHaveAttribute('href', '#avis');
  });

  it('renders WhatsApp external link with target=_blank', () => {
    render(<Header />);
    const wa = screen.getByRole('link', { name: /whatsapp/i });
    expect(wa).toHaveAttribute('target', '_blank');
  });

  it('renders theme toggle button', () => {
    render(<Header />);
    expect(screen.getByRole('button', { name: /mode/i })).toBeInTheDocument();
  });

  it('opens mobile menu when burger is clicked', async () => {
    const user = userEvent.setup();
    render(<Header />);
    const burger = screen.getByRole('button', { name: /ouvrir le menu/i });
    await user.click(burger);
    expect(screen.getByRole('dialog', { name: /menu/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to see them fail**

Run: `npm test -- Header.test`
Expected: FAIL.

- [ ] **Step 3: Implement Header**

Create `src/components/layout/Header.jsx`:

```jsx
import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle.jsx';
import { coach } from '../../lib/content/coach.js';

const NAV_LINKS = [
  { id: 'top',         href: '#top',          label: 'Accueil' },
  { id: 'prestations', href: '#prestations',  label: 'Prestations' },
  { id: 'avis',        href: '#avis',         label: 'Avis' },
];

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observers = ids
      .map(id => document.getElementById(id))
      .filter(Boolean)
      .map(el => {
        const o = new IntersectionObserver(
          ([entry]) => { if (entry.isIntersecting) setActive(entry.target.id); },
          { rootMargin: '-40% 0px -55% 0px' }
        );
        o.observe(el);
        return o;
      });
    return () => observers.forEach(o => o.disconnect());
  }, [ids]);
  return active;
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const active = useActiveSection(NAV_LINKS.map(l => l.id));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const close = () => setMobileOpen(false);

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 transition-all duration-200"
      style={{
        backdropFilter: scrolled ? 'blur(12px) saturate(1.4)' : 'none',
        background: scrolled ? 'color-mix(in srgb, var(--color-bg) 78%, transparent)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
      }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
        <a href="#top" className="font-[var(--font-display)] text-lg tracking-tight" style={{ color: 'var(--color-fg)' }}>
          bikementor
        </a>

        <nav aria-label="Navigation principale" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(l => {
            const isActive = active === l.id;
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={isActive ? 'location' : undefined}
                className="text-sm uppercase tracking-[0.14em] transition-colors hover:text-[var(--color-accent)]"
                style={{
                  color: isActive ? 'var(--color-accent)' : 'var(--color-fg)',
                  borderBottom: isActive ? '1px solid var(--color-accent)' : '1px solid transparent',
                }}
              >
                {l.label}
              </a>
            );
          })}
          <a
            href={coach.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp (ouvre dans un nouvel onglet)"
            className="text-sm uppercase tracking-[0.14em]"
            style={{ color: 'var(--color-accent)' }}
          >
            WhatsApp ↗
          </a>
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Ouvrir le menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="inline-flex size-10 items-center justify-center rounded-full border"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-fg)' }}
          >
            <span aria-hidden="true">≡</span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex flex-col"
          style={{ background: 'var(--color-bg)' }}
        >
          <div className="flex h-16 items-center justify-between px-4">
            <span className="font-[var(--font-display)] text-lg">bikementor</span>
            <button
              type="button"
              aria-label="Fermer le menu"
              onClick={close}
              className="inline-flex size-10 items-center justify-center rounded-full border"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>
          <nav aria-label="Navigation mobile" className="flex flex-col gap-6 px-6 pt-8">
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} onClick={close} className="font-[var(--font-display)] text-3xl" style={{ color: 'var(--color-fg)' }}>
                {l.label}
              </a>
            ))}
            <a
              href={coach.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="font-[var(--font-display)] text-3xl"
              style={{ color: 'var(--color-accent)' }}
            >
              WhatsApp ↗
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- Header.test`
Expected: PASS (4 assertions).

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Header.jsx src/components/layout/Header.test.jsx
git commit -m "feat(layout): add sticky Header with mobile drawer"
```

---

## Task 11: Footer

**Files:**
- Create: `src/components/layout/Footer.jsx`
- Test: `src/components/layout/Footer.test.jsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/layout/Footer.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer.jsx';

describe('Footer', () => {
  it('renders site name', () => {
    render(<Footer />);
    expect(screen.getByText(/bikementor/i)).toBeInTheDocument();
  });

  it('renders youtube link', () => {
    render(<Footer />);
    const yt = screen.getByRole('link', { name: /youtube/i });
    expect(yt).toHaveAttribute('href', expect.stringMatching(/youtube\.com/));
    expect(yt).toHaveAttribute('target', '_blank');
  });

  it('renders current year', () => {
    render(<Footer />);
    expect(screen.getByText(String(new Date().getFullYear()))).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to see them fail**

Run: `npm test -- Footer.test`
Expected: FAIL.

- [ ] **Step 3: Implement Footer**

Create `src/components/layout/Footer.jsx`:

```jsx
import { coach } from '../../lib/content/coach.js';

const SEO_KEYWORDS = ['Stage VTT Grenoble', 'Coaching pilotage', 'Enduro', 'Trial', 'All-mountain'];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t" style={{ borderColor: 'var(--color-border)' }}>
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="font-[var(--font-display)] text-xl">bikementor</div>
            <p className="mt-2 text-sm" style={{ color: 'var(--color-fg-muted)' }}>
              Coaching VTT à Grenoble par {coach.name}.
            </p>
          </div>

          <nav aria-label="Réseaux sociaux">
            <h2 className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--color-fg-subtle)' }}>Réseaux</h2>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              <li>
                <a href={coach.socials.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube (ouvre dans un nouvel onglet)" style={{ color: 'var(--color-fg)' }}>
                  YouTube ↗
                </a>
              </li>
              <li>
                <a href={coach.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram (ouvre dans un nouvel onglet)" style={{ color: 'var(--color-fg)' }}>
                  Instagram ↗
                </a>
              </li>
              <li>
                <a href={coach.socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook (ouvre dans un nouvel onglet)" style={{ color: 'var(--color-fg)' }}>
                  Facebook ↗
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--color-fg-subtle)' }}>Mots-clés</h2>
            <p className="mt-3 text-xs" style={{ color: 'var(--color-fg-subtle)' }}>
              {SEO_KEYWORDS.join(' · ')}
            </p>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between border-t pt-6 text-xs" style={{ borderColor: 'var(--color-border)', color: 'var(--color-fg-subtle)' }}>
          <span>© {year} bikementor</span>
          <span className="font-[var(--font-mono)] tracking-[0.1em]">Grenoble · France</span>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- Footer.test`
Expected: PASS (3 assertions).

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Footer.jsx src/components/layout/Footer.test.jsx
git commit -m "feat(layout): add Footer with social links and seo keywords"
```

---

## Task 12: Hero section

**Files:**
- Create: `src/components/sections/Hero.jsx`
- Test: `src/components/sections/Hero.test.jsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/sections/Hero.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Hero from './Hero.jsx';

describe('Hero', () => {
  it('renders an h1 with brand tagline', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders WhatsApp CTA in hero', () => {
    render(<Hero />);
    expect(screen.getByRole('link', { name: /whatsapp/i })).toBeInTheDocument();
  });

  it('renders video element with poster fallback', () => {
    const { container } = render(<Hero />);
    expect(container.querySelector('video')).toBeInTheDocument();
  });

  it('renders scroll-down indicator', () => {
    render(<Hero />);
    expect(screen.getByLabelText(/défiler vers le bas/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to see them fail**

Run: `npm test -- Hero.test`
Expected: FAIL.

- [ ] **Step 3: Implement Hero**

Create `src/components/sections/Hero.jsx`:

```jsx
import { useEffect, useState } from 'react';
import VideoPlayer from '../ui/VideoPlayer.jsx';
import WhatsAppButton from '../ui/WhatsAppButton.jsx';

function useShouldLoadHeroVideo() {
  const [shouldLoad, setShouldLoad] = useState(false);
  useEffect(() => {
    const isMobile = matchMedia('(max-width: 640px)').matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    setShouldLoad(!isMobile && !saveData && !reducedMotion);
  }, []);
  return shouldLoad;
}

export default function Hero() {
  const shouldLoadVideo = useShouldLoadHeroVideo();

  return (
    <section id="top" className="relative isolate flex min-h-[100dvh] items-end overflow-hidden">
      <div className="absolute inset-0 -z-20">
        {shouldLoadVideo ? (
          <VideoPlayer
            src="/videos/hero.mp4"
            poster="/posters/hero.webp"
            label="Pilotage VTT en montagne"
            preload="metadata"
          />
        ) : (
          <img
            src="/posters/hero.webp"
            alt="Pilotage VTT en montagne"
            width="1920"
            height="1080"
            loading="eager"
            className="size-full object-cover"
          />
        )}
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{ background: 'linear-gradient(to bottom, rgba(22,22,20,0.1) 0%, rgba(22,22,20,0.35) 45%, rgba(22,22,20,0.72) 100%)' }}
      />

      <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-32 md:px-8 md:pb-32">
        <p className="font-[var(--font-mono)] text-xs uppercase tracking-[0.22em]" style={{ color: '#EBE6DD' }}>
          bikementor · Grenoble
        </p>
        <h1
          className="mt-4 max-w-4xl font-[var(--font-display)] leading-[1.02]"
          style={{ fontSize: 'var(--text-hero)', color: '#EBE6DD', letterSpacing: '-0.02em' }}
        >
          Rouler <em style={{ fontStyle: 'italic', color: 'var(--color-accent)' }}>juste</em>, rouler loin.
        </h1>
        <div className="mt-10">
          <WhatsAppButton>Discuter sur WhatsApp</WhatsAppButton>
        </div>
      </div>

      <a
        href="#prestations"
        aria-label="Défiler vers le bas"
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        style={{ color: '#EBE6DD' }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- Hero.test`
Expected: PASS (4 assertions).

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Hero.jsx src/components/sections/Hero.test.jsx
git commit -m "feat(sections): add Hero with cinematic video background"
```

---

## Task 13: PrestationCard

**Files:**
- Create: `src/components/sections/PrestationCard.jsx`
- Test: `src/components/sections/PrestationCard.test.jsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/sections/PrestationCard.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PrestationCard from './PrestationCard.jsx';

const fixture = {
  slug: 'stage-prive',
  title: 'Stage privé',
  tagline: 'Coaching personnalisé.',
  poster: '/posters/stage-prive.webp',
  videoSrc: '/videos/stage-prive.mp4',
  summary: '…',
  formats: [],
};

describe('PrestationCard', () => {
  it('renders title and tagline', () => {
    render(<PrestationCard prestation={fixture} onOpen={() => {}} />);
    expect(screen.getByRole('heading', { name: /stage privé/i })).toBeInTheDocument();
    expect(screen.getByText(/coaching personnalisé/i)).toBeInTheDocument();
  });

  it('calls onOpen when clicked', async () => {
    const onOpen = vi.fn();
    const user = userEvent.setup();
    render(<PrestationCard prestation={fixture} onOpen={onOpen} />);
    await user.click(screen.getByRole('button', { name: /stage privé/i }));
    expect(onOpen).toHaveBeenCalledWith(fixture);
  });

  it('calls onOpen on Enter key', async () => {
    const onOpen = vi.fn();
    const user = userEvent.setup();
    render(<PrestationCard prestation={fixture} onOpen={onOpen} />);
    screen.getByRole('button', { name: /stage privé/i }).focus();
    await user.keyboard('{Enter}');
    expect(onOpen).toHaveBeenCalledWith(fixture);
  });
});
```

- [ ] **Step 2: Run tests to see them fail**

Run: `npm test -- PrestationCard`
Expected: FAIL.

- [ ] **Step 3: Implement PrestationCard**

Create `src/components/sections/PrestationCard.jsx`:

```jsx
import VideoPlayer from '../ui/VideoPlayer.jsx';

export default function PrestationCard({ prestation, index, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(prestation)}
      className="group flex flex-col overflow-hidden rounded-xl border text-left transition-transform duration-200 ease-out hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-elevated)', outlineColor: 'var(--color-accent)' }}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <VideoPlayer src={prestation.videoSrc} poster={prestation.poster} label={prestation.title} preload="none" />
        <span
          className="absolute left-4 top-4 font-[var(--font-mono)] text-xs uppercase tracking-[0.14em]"
          style={{ color: '#EBE6DD' }}
        >
          {String(index + 1).padStart(2, '0')} / {prestation.title}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-6">
        <h3 className="font-[var(--font-display)] text-xl leading-tight group-hover:text-[var(--color-accent)]">
          {prestation.title}
        </h3>
        <p className="text-sm" style={{ color: 'var(--color-fg-muted)' }}>{prestation.tagline}</p>
      </div>
    </button>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- PrestationCard`
Expected: PASS (3 assertions).

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/PrestationCard.jsx src/components/sections/PrestationCard.test.jsx
git commit -m "feat(sections): add PrestationCard with video preview"
```

---

## Task 14: PrestationModal

**Files:**
- Create: `src/components/sections/PrestationModal.jsx`
- Test: `src/components/sections/PrestationModal.test.jsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/sections/PrestationModal.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PrestationModal from './PrestationModal.jsx';

const fixture = {
  slug: 'stage-prive',
  title: 'Stage privé',
  tagline: 'Coaching personnalisé.',
  summary: 'Une journée complète.',
  videoSrc: '/videos/stage-prive.mp4',
  poster: '/posters/stage-prive.webp',
  formats: [
    { title: 'Enduro & sauts', description: 'Tech matin, sauts aprem.', duration: 'journée' },
    { title: 'Enduro Ebike',   description: 'Montées techniques.' },
  ],
};

describe('PrestationModal', () => {
  it('renders title, summary and formats when open', () => {
    render(<PrestationModal open prestation={fixture} onClose={() => {}} />);
    expect(screen.getByRole('heading', { name: /stage privé/i })).toBeInTheDocument();
    expect(screen.getByText(/journée complète/i)).toBeInTheDocument();
    expect(screen.getByText(/enduro & sauts/i)).toBeInTheDocument();
    expect(screen.getByText(/enduro ebike/i)).toBeInTheDocument();
  });

  it('renders duration and price chips when provided', () => {
    render(<PrestationModal open prestation={fixture} onClose={() => {}} />);
    expect(screen.getByText('journée')).toBeInTheDocument();
  });

  it('renders WhatsApp CTA', () => {
    render(<PrestationModal open prestation={fixture} onClose={() => {}} />);
    expect(screen.getByRole('link', { name: /whatsapp/i })).toBeInTheDocument();
  });

  it('calls onClose when ESC pressed', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<PrestationModal open prestation={fixture} onClose={onClose} />);
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('does not render when prestation is null', () => {
    render(<PrestationModal open prestation={null} onClose={() => {}} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to see them fail**

Run: `npm test -- PrestationModal`
Expected: FAIL.

- [ ] **Step 3: Implement PrestationModal**

Create `src/components/sections/PrestationModal.jsx`:

```jsx
import Modal from '../primitives/Modal.jsx';
import VideoPlayer from '../ui/VideoPlayer.jsx';
import WhatsAppButton from '../ui/WhatsAppButton.jsx';

function Chip({ children }) {
  return (
    <span
      className="inline-block rounded-full border px-2.5 py-0.5 font-[var(--font-mono)] text-xs uppercase tracking-[0.1em]"
      style={{ borderColor: 'var(--color-border)', color: 'var(--color-fg-muted)' }}
    >
      {children}
    </span>
  );
}

export default function PrestationModal({ open, prestation, onClose }) {
  if (!prestation) return null;
  const titleId = `prestation-${prestation.slug}-title`;
  const descId = `prestation-${prestation.slug}-desc`;

  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId} describedBy={descId}>
      <div className="flex flex-col gap-6">
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <VideoPlayer src={prestation.videoSrc} poster={prestation.poster} label={prestation.title} preload="auto" />
        </div>

        <div>
          <p className="font-[var(--font-mono)] text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--color-fg-subtle)' }}>
            {prestation.title}
          </p>
          <h2 id={titleId} className="mt-2 font-[var(--font-display)] text-3xl leading-tight md:text-4xl">
            {prestation.title}
          </h2>
          <p id={descId} className="mt-3 text-base md:text-lg" style={{ color: 'var(--color-fg-muted)' }}>
            {prestation.summary}
          </p>
        </div>

        <div className="border-t pt-6" style={{ borderColor: 'var(--color-border)' }}>
          <h3 className="font-[var(--font-mono)] text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--color-fg-subtle)' }}>
            Formats
          </h3>
          <ul className="mt-4 flex flex-col gap-5">
            {prestation.formats.map((f, i) => (
              <li key={i}>
                <div className="flex flex-wrap items-baseline gap-2">
                  <h4 className="font-[var(--font-display)] text-lg leading-tight">{f.title}</h4>
                  {f.duration && <Chip>{f.duration}</Chip>}
                  {f.price && <Chip>{f.price}</Chip>}
                  {f.capacity && <Chip>{f.capacity}</Chip>}
                </div>
                <p className="mt-1 text-sm" style={{ color: 'var(--color-fg-muted)' }}>{f.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-start pt-2">
          <WhatsAppButton>Discuter sur WhatsApp</WhatsAppButton>
        </div>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- PrestationModal`
Expected: PASS (5 assertions).

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/PrestationModal.jsx src/components/sections/PrestationModal.test.jsx
git commit -m "feat(sections): add PrestationModal with formats and CTA"
```

---

## Task 15: Prestations section

**Files:**
- Create: `src/components/sections/Prestations.jsx`
- Test: `src/components/sections/Prestations.test.jsx`

- [ ] **Step 1: Write failing integration tests**

Create `src/components/sections/Prestations.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Prestations from './Prestations.jsx';

describe('Prestations section', () => {
  it('renders 3 cards', () => {
    render(<Prestations />);
    expect(screen.getByRole('button', { name: /stage privé/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /leçons privées/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /créations originales/i })).toBeInTheDocument();
  });

  it('opens modal when a card is clicked, closes when ESC pressed', async () => {
    const user = userEvent.setup();
    render(<Prestations />);
    await user.click(screen.getByRole('button', { name: /stage privé/i }));
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has heading "Prestations" with anchor id', () => {
    render(<Prestations />);
    expect(screen.getByRole('heading', { name: /^prestations$/i })).toBeInTheDocument();
    const section = document.getElementById('prestations');
    expect(section).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to see them fail**

Run: `npm test -- Prestations.test`
Expected: FAIL.

- [ ] **Step 3: Implement Prestations with Suspense-wrapped lazy modal**

Create `src/components/sections/Prestations.jsx`:

```jsx
import { Suspense, lazy, useCallback, useState } from 'react';
import PrestationCard from './PrestationCard.jsx';
import { prestations } from '../../lib/content/prestations.js';

const PrestationModal = lazy(() => import('./PrestationModal.jsx'));

export default function Prestations() {
  const [selected, setSelected] = useState(null);
  const handleClose = useCallback(() => setSelected(null), []);

  return (
    <section id="prestations" className="mx-auto max-w-6xl px-4 py-24 md:px-8 md:py-32">
      <div className="flex items-baseline justify-between border-b pb-6" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <p className="font-[var(--font-mono)] text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--color-fg-subtle)' }}>01 / Services</p>
          <h2 className="mt-2 font-[var(--font-display)] text-3xl leading-tight md:text-4xl">Prestations</h2>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {prestations.map((p, i) => (
          <PrestationCard key={p.slug} prestation={p} index={i} onOpen={setSelected} />
        ))}
      </div>

      <Suspense fallback={null}>
        {selected && <PrestationModal open prestation={selected} onClose={handleClose} />}
      </Suspense>
    </section>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- Prestations.test`
Expected: PASS (3 assertions).

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Prestations.jsx src/components/sections/Prestations.test.jsx
git commit -m "feat(sections): add Prestations grid with lazy modal"
```

---

## Task 16: About section

**Files:**
- Create: `src/components/sections/About.jsx`
- Test: `src/components/sections/About.test.jsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/sections/About.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from './About.jsx';

describe('About', () => {
  it('renders coach name', () => {
    render(<About />);
    expect(screen.getByText(/théo poudret/i)).toBeInTheDocument();
  });

  it('renders coach photo with alt text', () => {
    render(<About />);
    const img = screen.getByAltText(/théo poudret/i);
    expect(img).toHaveAttribute('src', '/coach.webp');
  });

  it('renders zone Grenoble', () => {
    render(<About />);
    expect(screen.getByText(/grenoble/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to see them fail**

Run: `npm test -- About.test`
Expected: FAIL.

- [ ] **Step 3: Implement About**

Create `src/components/sections/About.jsx`:

```jsx
import { coach } from '../../lib/content/coach.js';

export default function About() {
  return (
    <section id="a-propos" className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
      <div className="grid gap-10 md:grid-cols-[auto_1fr] md:items-center">
        <img
          src={coach.photo}
          alt={coach.name}
          width="320"
          height="320"
          loading="lazy"
          className="aspect-square w-48 rounded-full object-cover md:w-64"
          style={{ border: '1px solid var(--color-border)' }}
        />
        <div>
          <p className="font-[var(--font-mono)] text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--color-fg-subtle)' }}>02 / Le coach</p>
          <h2 className="mt-2 font-[var(--font-display)] text-3xl leading-tight md:text-4xl">{coach.name}</h2>
          <p className="mt-1 text-sm uppercase tracking-[0.12em]" style={{ color: 'var(--color-fg-muted)' }}>
            {coach.title} · {coach.zone}
          </p>
          <p className="mt-6 max-w-2xl text-base md:text-lg" style={{ color: 'var(--color-fg-muted)' }}>
            {coach.bio}
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {coach.credentials.map((c, i) => (
              <li key={i} className="rounded-full border px-3 py-1 font-[var(--font-mono)] text-xs uppercase tracking-[0.12em]" style={{ borderColor: 'var(--color-border)', color: 'var(--color-fg-muted)' }}>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- About.test`
Expected: PASS (3 assertions).

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/About.jsx src/components/sections/About.test.jsx
git commit -m "feat(sections): add About with coach bio"
```

---

## Task 17: Contact section

**Files:**
- Create: `src/components/sections/Contact.jsx`
- Test: `src/components/sections/Contact.test.jsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/sections/Contact.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Contact from './Contact.jsx';

describe('Contact', () => {
  it('renders a big WhatsApp CTA', () => {
    render(<Contact />);
    const link = screen.getByRole('link', { name: /whatsapp/i });
    expect(link).toHaveAttribute('href', 'https://wa.me/message/CPLLJRUYZ43DB1');
  });

  it('has anchor id "contact"', () => {
    render(<Contact />);
    expect(document.getElementById('contact')).toBeInTheDocument();
  });

  it('renders heading', () => {
    render(<Contact />);
    expect(screen.getByRole('heading', { name: /contact|discutons|reserve|réserve/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to see them fail**

Run: `npm test -- Contact.test`
Expected: FAIL.

- [ ] **Step 3: Implement Contact**

Create `src/components/sections/Contact.jsx`:

```jsx
import WhatsAppButton from '../ui/WhatsAppButton.jsx';

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 py-24 md:px-8 md:py-32">
      <div className="flex flex-col items-start gap-6 border-t pt-16" style={{ borderColor: 'var(--color-border)' }}>
        <p className="font-[var(--font-mono)] text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--color-fg-subtle)' }}>03 / Contact</p>
        <h2 className="max-w-3xl font-[var(--font-display)] leading-tight" style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}>
          On en <em style={{ fontStyle: 'italic', color: 'var(--color-accent)' }}>discute</em> sur WhatsApp ?
        </h2>
        <p className="max-w-2xl text-base md:text-lg" style={{ color: 'var(--color-fg-muted)' }}>
          Le plus rapide pour échanger sur une date, un niveau, ou poser une question.
          Un message est déjà préparé — il suffit de l'envoyer.
        </p>
        <WhatsAppButton>Discuter sur WhatsApp</WhatsAppButton>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- Contact.test`
Expected: PASS (3 assertions).

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Contact.jsx src/components/sections/Contact.test.jsx
git commit -m "feat(sections): add Contact with WhatsApp CTA"
```

---

## Task 18: Reviews section

**Files:**
- Create: `src/components/sections/Reviews.jsx`
- Test: `src/components/sections/Reviews.test.jsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/sections/Reviews.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('../../lib/content/reviews.json', () => ({
  default: {
    fetchedAt: '2026-04-22T00:00:00Z',
    placeName: 'bikementor',
    googleMapsUrl: 'https://maps.example/x',
    writeReviewUrl: 'https://search.google.com/writereview?placeid=x',
    reviews: [
      { authorName: 'Julien', rating: 5, text: 'Super coach, top pédagogie.', relativeTime: 'il y a 2 semaines' },
      { authorName: 'Marie',  rating: 5, text: 'Progression rapide, merci !',  relativeTime: 'il y a 1 mois' },
    ],
  },
}));

import Reviews from './Reviews.jsx';

describe('Reviews — populated', () => {
  it('renders each review author and text', () => {
    render(<Reviews />);
    expect(screen.getByText(/julien/i)).toBeInTheDocument();
    expect(screen.getByText(/super coach, top pédagogie/i)).toBeInTheDocument();
  });

  it('renders "Voir tous les avis" pointing to googleMapsUrl', () => {
    render(<Reviews />);
    expect(screen.getByRole('link', { name: /voir tous les avis/i })).toHaveAttribute('href', 'https://maps.example/x');
  });

  it('renders "Laisser un avis" pointing to writeReviewUrl', () => {
    render(<Reviews />);
    expect(screen.getByRole('link', { name: /laisser un avis/i })).toHaveAttribute('href', expect.stringMatching(/writereview/));
  });
});
```

Create a second test file `src/components/sections/Reviews.empty.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('../../lib/content/reviews.json', () => ({
  default: {
    fetchedAt: null, placeName: 'bikementor',
    googleMapsUrl: null, writeReviewUrl: null,
    reviews: [],
  },
}));

import Reviews from './Reviews.jsx';

describe('Reviews — empty', () => {
  it('shows empty-state message when no reviews', () => {
    render(<Reviews />);
    expect(screen.getByText(/premiers avis bientôt/i)).toBeInTheDocument();
  });

  it('does not render review list when empty', () => {
    render(<Reviews />);
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to see them fail**

Run: `npm test -- Reviews`
Expected: FAIL.

- [ ] **Step 3: Implement Reviews**

Create `src/components/sections/Reviews.jsx`:

```jsx
import reviewsData from '../../lib/content/reviews.json';
import StarRating from '../ui/StarRating.jsx';

export default function Reviews() {
  const { reviews, googleMapsUrl, writeReviewUrl } = reviewsData;
  const hasReviews = reviews.length > 0;

  return (
    <section id="avis" className="mx-auto max-w-6xl px-4 py-24 md:px-8 md:py-32">
      <div className="flex items-baseline justify-between border-b pb-6" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <p className="font-[var(--font-mono)] text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--color-fg-subtle)' }}>04 / Retours</p>
          <h2 className="mt-2 font-[var(--font-display)] text-3xl leading-tight md:text-4xl">Avis clients</h2>
        </div>
        {writeReviewUrl && (
          <a
            href={writeReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Laisser un avis (ouvre dans un nouvel onglet)"
            className="hidden text-sm uppercase tracking-[0.14em] md:inline-block"
            style={{ color: 'var(--color-accent)' }}
          >
            Laisser un avis ↗
          </a>
        )}
      </div>

      {!hasReviews && (
        <p className="mt-12 text-base italic" style={{ color: 'var(--color-fg-muted)' }}>
          Premiers avis bientôt disponibles.
        </p>
      )}

      {hasReviews && (
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <li key={i}>
              <article
                aria-label={`Avis de ${r.authorName}, ${r.rating} étoiles sur 5`}
                className="flex h-full flex-col gap-3 rounded-xl border p-6"
                style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-elevated)' }}
              >
                <StarRating rating={r.rating} />
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-fg)' }}>
                  « {r.text} »
                </p>
                <div className="mt-auto flex items-baseline justify-between border-t pt-3" style={{ borderColor: 'var(--color-border)' }}>
                  <span className="font-[var(--font-display)] text-base">{r.authorName}</span>
                  <span className="font-[var(--font-mono)] text-xs" style={{ color: 'var(--color-fg-subtle)' }}>
                    {r.relativeTime}
                  </span>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10 flex flex-wrap gap-4">
        {googleMapsUrl && (
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Voir tous les avis sur Google Maps (ouvre dans un nouvel onglet)"
            className="text-sm uppercase tracking-[0.14em]"
            style={{ color: 'var(--color-fg)' }}
          >
            Voir tous les avis ↗
          </a>
        )}
        {writeReviewUrl && (
          <a
            href={writeReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Laisser un avis (ouvre dans un nouvel onglet)"
            className="text-sm uppercase tracking-[0.14em] md:hidden"
            style={{ color: 'var(--color-accent)' }}
          >
            Laisser un avis ↗
          </a>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- Reviews`
Expected: PASS (5 assertions across both files).

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Reviews.jsx src/components/sections/Reviews.test.jsx src/components/sections/Reviews.empty.test.jsx
git commit -m "feat(sections): add Reviews with populated and empty states"
```

---

## Task 19: HomePage composition + main.jsx update

**Files:**
- Create: `src/app/HomePage.jsx`
- Modify: `src/main.jsx`
- Test: `src/app/HomePage.test.jsx`

- [ ] **Step 1: Write failing test for HomePage**

Create `src/app/HomePage.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from './HomePage.jsx';

describe('HomePage', () => {
  it('renders header, hero, all sections, and footer', () => {
    render(<HomePage />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(document.getElementById('prestations')).toBeInTheDocument();
    expect(document.getElementById('a-propos')).toBeInTheDocument();
    expect(document.getElementById('contact')).toBeInTheDocument();
    expect(document.getElementById('avis')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('has a skip link to main content', () => {
    render(<HomePage />);
    expect(screen.getByRole('link', { name: /aller au contenu/i })).toHaveAttribute('href', '#main');
  });
});
```

- [ ] **Step 2: Run test to see it fail**

Run: `npm test -- HomePage`
Expected: FAIL.

- [ ] **Step 3: Implement HomePage**

Create `src/app/HomePage.jsx`:

```jsx
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';
import Hero from '../components/sections/Hero.jsx';
import Prestations from '../components/sections/Prestations.jsx';
import About from '../components/sections/About.jsx';
import Contact from '../components/sections/Contact.jsx';
import Reviews from '../components/sections/Reviews.jsx';

export default function HomePage() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:text-[var(--color-accent-fg)]">
        Aller au contenu
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Prestations />
        <About />
        <Contact />
        <Reviews />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Update main.jsx to mount HomePage**

Replace `src/main.jsx`:

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import HomePage from './app/HomePage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HomePage />
  </StrictMode>
);
```

- [ ] **Step 5: Run tests and build to verify**

Run: `npm test`
Expected: all tests PASS.

Run: `npm run build`
Expected: build succeeds (videos/posters may 404 at runtime — that's expected until assets are added).

- [ ] **Step 6: Visual QA**

Run: `npm run dev`
Manually verify:
- Page loads without console errors
- Header visible, sticky on scroll
- Theme toggle flips light/dark
- Skip link appears on Tab
- Clicking a prestation card opens the modal
- ESC closes the modal
- Mobile viewport (DevTools 375px): burger menu opens the drawer

- [ ] **Step 7: Commit**

```bash
git add src/app/ src/main.jsx src/app/HomePage.test.jsx
git commit -m "feat(app): compose HomePage and mount from main"
```

---

## Task 20: Enrich index.html with Open Graph, Twitter Card, JSON-LD

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add OG, Twitter, JSON-LD blocks inside `<head>`**

Insert inside `<head>` of `index.html`, after the existing `<link rel="stylesheet">` for fonts and before the FOUC `<script>`:

```html
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://bikementor.fr/" />
    <meta property="og:title" content="bikementor · Coaching VTT Grenoble" />
    <meta property="og:description" content="Stages privés, leçons et collectifs de pilotage VTT à Grenoble." />
    <meta property="og:image" content="https://bikementor.fr/og-cover.jpg" />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:site_name" content="bikementor" />

    <meta name="twitter:card" content="summary_large_image" />

    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": "https://bikementor.fr/#org",
        "name": "bikementor",
        "description": "Coaching VTT par Théo Poudret à Grenoble — stages privés, leçons et collectifs.",
        "url": "https://bikementor.fr/",
        "image": "https://bikementor.fr/coach.webp",
        "address": { "@type": "PostalAddress", "addressLocality": "Grenoble", "addressRegion": "Isère", "addressCountry": "FR" },
        "areaServed": "Grenoble",
        "founder": { "@type": "Person", "name": "Théo Poudret" },
        "sameAs": [ "https://www.youtube.com/channel/UCSWGp0nrUZ1AuUmXJXZa1VQ" ],
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
    </script>
```

- [ ] **Step 2: Verify with build**

Run: `npm run build`
Expected: PASS, `dist/index.html` contains the JSON-LD block (spot check `grep -c "LocalBusiness" dist/index.html` → 1).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(seo): add Open Graph, Twitter Card and JSON-LD LocalBusiness"
```

---

## Task 21: fetch-reviews script + tests

**Files:**
- Create: `scripts/fetch-reviews.js`, `scripts/fetch-reviews.test.js`

- [ ] **Step 1: Write failing tests with mocked fetch**

Create `scripts/fetch-reviews.test.js`:

```js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { writeFileSync, mkdtempSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { fetchAndWriteReviews } from './fetch-reviews.js';

const okPayload = {
  displayName: { text: 'bikementor' },
  googleMapsUri: 'https://maps.example/x',
  reviews: [
    {
      authorAttribution: { displayName: 'Julien', photoUri: 'https://p/1' },
      rating: 5,
      text: { text: 'Super coach. Vraiment top pédagogie, progression nette en deux séances.', languageCode: 'fr' },
      publishTime: '2026-04-01T00:00:00Z',
      relativePublishTimeDescription: 'il y a 2 semaines',
    },
    {
      authorAttribution: { displayName: 'Short' },
      rating: 5,
      text: { text: 'Top.' }, // < 40 chars → filtered
      publishTime: '2026-04-10T00:00:00Z',
    },
  ],
};

describe('fetch-reviews', () => {
  let tmpOut;
  const originalFetch = global.fetch;
  const originalEnv = process.env.GOOGLE_PLACES_API_KEY;

  beforeEach(() => {
    tmpOut = join(mkdtempSync(join(tmpdir(), 'bm-')), 'reviews.json');
    process.env.GOOGLE_PLACES_API_KEY = 'fake-key';
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.GOOGLE_PLACES_API_KEY = originalEnv;
  });

  it('writes normalized reviews to target path on success', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve(okPayload) });
    await fetchAndWriteReviews({ placeId: 'ChIJxxx', outPath: tmpOut });
    const written = JSON.parse(readFileSync(tmpOut, 'utf8'));
    expect(written.placeName).toBe('bikementor');
    expect(written.googleMapsUrl).toBe('https://maps.example/x');
    expect(written.writeReviewUrl).toMatch(/writereview\?placeid=ChIJxxx/);
    expect(written.reviews).toHaveLength(1); // "Top." filtered
    expect(written.reviews[0].authorName).toBe('Julien');
  });

  it('throws and does not write when API returns 4xx', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 403, text: () => Promise.resolve('denied') });
    writeFileSync(tmpOut, JSON.stringify({ sentinel: 'keep-me' }));
    await expect(fetchAndWriteReviews({ placeId: 'ChIJxxx', outPath: tmpOut })).rejects.toThrow(/403/);
    expect(JSON.parse(readFileSync(tmpOut, 'utf8')).sentinel).toBe('keep-me');
  });

  it('throws when API key is missing', async () => {
    delete process.env.GOOGLE_PLACES_API_KEY;
    await expect(fetchAndWriteReviews({ placeId: 'x', outPath: tmpOut })).rejects.toThrow(/GOOGLE_PLACES_API_KEY/);
  });

  it('throws when no review passes the quality filter', async () => {
    const bad = { ...okPayload, reviews: [{ rating: 5, text: { text: 'ok' }, publishTime: '2026-04-10T00:00:00Z' }] };
    global.fetch = vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve(bad) });
    writeFileSync(tmpOut, JSON.stringify({ sentinel: 'keep' }));
    await expect(fetchAndWriteReviews({ placeId: 'x', outPath: tmpOut })).rejects.toThrow(/no review/i);
    expect(JSON.parse(readFileSync(tmpOut, 'utf8')).sentinel).toBe('keep');
  });
});
```

- [ ] **Step 2: Run tests to see them fail**

Run: `npm test -- fetch-reviews`
Expected: FAIL — script doesn't exist.

- [ ] **Step 3: Implement fetch-reviews.js**

Create `scripts/fetch-reviews.js`:

```js
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const MIN_TEXT_LENGTH = 40;
const MAX_REVIEWS     = 5;

export async function fetchAndWriteReviews({ placeId, outPath, apiKey = process.env.GOOGLE_PLACES_API_KEY }) {
  if (!apiKey) throw new Error('GOOGLE_PLACES_API_KEY manquant');
  if (!placeId) throw new Error('placeId manquant');

  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=fr`;
  const res = await fetch(url, {
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'reviews,displayName,googleMapsUri',
    },
  });

  if (!res.ok) {
    throw new Error(`Places API ${res.status}`);
  }

  const data = await res.json();
  const filtered = (data.reviews ?? [])
    .filter(r => (r.text?.text ?? '').trim().length >= MIN_TEXT_LENGTH)
    .slice(0, MAX_REVIEWS);

  if (filtered.length === 0) {
    throw new Error('no review passed the quality filter');
  }

  const normalized = {
    fetchedAt: new Date().toISOString(),
    placeId,
    placeName: data.displayName?.text ?? 'bikementor',
    googleMapsUrl: data.googleMapsUri ?? null,
    writeReviewUrl: `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`,
    reviews: filtered.map(r => ({
      authorName: r.authorAttribution?.displayName ?? 'Anonyme',
      authorPhotoUrl: r.authorAttribution?.photoUri ?? null,
      rating: r.rating ?? 0,
      text: r.text?.text ?? '',
      relativeTime: r.relativePublishTimeDescription ?? '',
      publishTime: r.publishTime ?? null,
      language: r.text?.languageCode ?? 'fr',
    })),
  };

  writeFileSync(outPath, JSON.stringify(normalized, null, 2) + '\n', 'utf8');
  return normalized;
}

// CLI entrypoint
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const { config } = await import(pathToFileURL(resolve(__dirname, '../src/lib/config.js')).href);
  const outPath = resolve(__dirname, '../src/lib/content/reviews.json');

  try {
    const r = await fetchAndWriteReviews({ placeId: config.placeId, outPath });
    console.log(`✓ ${r.reviews.length} avis écrits dans ${outPath}`);
  } catch (err) {
    console.error(`✗ fetch-reviews: ${err.message} — fichier conservé`);
    process.exit(1);
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- fetch-reviews`
Expected: PASS (4 assertions).

- [ ] **Step 5: Commit**

```bash
git add scripts/fetch-reviews.js scripts/fetch-reviews.test.js
git commit -m "feat(scripts): add fetch-reviews with fail-soft and quality filter"
```

---

## Task 22: Static public/ assets (.htaccess, 404.html, robots, sitemap)

**Files:**
- Create: `public/.htaccess`, `public/404.html`, `public/robots.txt`, `public/sitemap.xml`

- [ ] **Step 1: Create public/.htaccess**

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

- [ ] **Step 2: Create public/404.html**

```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Page introuvable — bikementor</title>
    <style>
      :root { color-scheme: light dark; }
      body {
        margin: 0;
        min-height: 100dvh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #EBE6DD;
        color: #161614;
        font-family: Georgia, serif;
        text-align: center;
        padding: 1rem;
      }
      h1 { font-size: clamp(2rem, 6vw, 4rem); margin: 0 0 1rem; }
      p  { color: #5C5A55; margin-bottom: 2rem; }
      a  { color: #B23A26; font-family: system-ui, sans-serif; text-transform: uppercase; letter-spacing: 0.14em; font-size: .9rem; }
    </style>
  </head>
  <body>
    <main>
      <h1>Ce single n'existe pas.</h1>
      <p>La page demandée est introuvable. Reprenons le chemin depuis le début.</p>
      <a href="/">Retour à l'accueil</a>
    </main>
  </body>
</html>
```

- [ ] **Step 3: Create public/robots.txt**

```
User-agent: *
Allow: /
Sitemap: https://bikementor.fr/sitemap.xml
```

- [ ] **Step 4: Create public/sitemap.xml**

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

- [ ] **Step 5: Verify assets copy to dist/**

Run: `npm run build`
Expected: `dist/.htaccess`, `dist/404.html`, `dist/robots.txt`, `dist/sitemap.xml` all present.

Run: `ls dist/ | grep -E "htaccess|404|robots|sitemap"`
Expected: 4 files listed.

- [ ] **Step 6: Commit**

```bash
git add public/
git commit -m "feat(public): add .htaccess, 404, robots, sitemap"
```

---

## Task 23: GitHub Actions — refresh-reviews cron

**Files:**
- Create: `.github/workflows/refresh-reviews.yml`

- [ ] **Step 1: Create the workflow file**

```yaml
name: Refresh Google Reviews

on:
  schedule:
    - cron: '0 4 * * 0'
  workflow_dispatch:

permissions:
  contents: write

jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - name: Fetch Google reviews
        env:
          GOOGLE_PLACES_API_KEY: ${{ secrets.GOOGLE_PLACES_API_KEY }}
        run: npm run fetch-reviews

      - name: Commit if changed
        run: |
          if ! git diff --quiet src/lib/content/reviews.json; then
            git config user.name "bikementor-bot"
            git config user.email "bot@bikementor.fr"
            git add src/lib/content/reviews.json
            git commit -m "chore: refresh google reviews $(date -u +%Y-%m-%d)"
            git push
          else
            echo "Pas de changement dans les avis."
          fi
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/refresh-reviews.yml
git commit -m "ci: add weekly refresh-reviews cron workflow"
```

---

## Task 24: GitHub Actions — deploy-prod (FTP to o2switch)

**Files:**
- Create: `.github/workflows/deploy-prod.yml`

- [ ] **Step 1: Create the workflow file**

```yaml
name: Deploy to o2switch (prod)

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
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - name: Build production bundle
        run: npm run build

      - name: Deploy via FTPS to o2switch
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server:     ${{ secrets.O2SWITCH_FTP_HOST }}
          username:   ${{ secrets.O2SWITCH_FTP_USER }}
          password:   ${{ secrets.O2SWITCH_FTP_PASSWORD }}
          local-dir:  ./dist/
          server-dir: /public_html/
          protocol:   ftps
          exclude: |
            **/.git*
            **/.DS_Store
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy-prod.yml
git commit -m "ci: add deploy-prod workflow (tag v* → FTPS o2switch)"
```

---

## Task 25: .env.example + README note

**Files:**
- Create: `.env.example`
- Modify: `CLAUDE.md` (add a "Running the project" note)

- [ ] **Step 1: Create .env.example**

```
# Secret. Utilisé uniquement par scripts/fetch-reviews.js (build-time + cron).
# Ne doit JAMAIS arriver dans le bundle client.
GOOGLE_PLACES_API_KEY=
```

- [ ] **Step 2: Append section to CLAUDE.md**

Open `CLAUDE.md` and append at the end:

```markdown

## Running the project

```bash
npm install            # once
npm run dev            # dev server on http://localhost:5173
npm test               # unit tests (vitest)
npm run lint           # eslint
npm run fetch-reviews  # fetch Google reviews (requires GOOGLE_PLACES_API_KEY env)
npm run build          # production bundle in dist/
```

Environment: copy `.env.example` to `.env` and fill `GOOGLE_PLACES_API_KEY` for local `fetch-reviews` runs. The key is never read by the Vite build — only by the Node script.

Deploy:
- Staging: every push to GitHub auto-deploys on Vercel.
- Production: push a git tag `vX.Y.Z` → GitHub Actions uploads `dist/` to o2switch via FTPS.
```

- [ ] **Step 3: Commit**

```bash
git add .env.example CLAUDE.md
git commit -m "docs: add .env.example and project running notes to CLAUDE.md"
```

---

## Task 26: Final QA pass

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: all tests PASS (≥ 50 assertions across ~16 files).

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS, 0 errors.

- [ ] **Step 3: Build production bundle**

Run: `npm run build`
Expected: `dist/` produced, total JS < 100 KB gzipped (spot check via `ls -lh dist/assets/*.js`). Warning about missing videos is expected if placeholders haven't been added — that's fine, they're referenced at runtime only.

- [ ] **Step 4: Verify no secret leaked in dist/**

Run: `grep -r "GOOGLE_PLACES_API_KEY" dist/ || echo "OK — no leak"`
Expected: `OK — no leak`.

- [ ] **Step 5: Serve and manually smoke test**

Run: `npm run preview`
Open `http://localhost:4173` and verify (on desktop Chrome + mobile viewport):
- Hero renders (with broken video poster — normal without real assets)
- Prestations section shows 3 cards, each opens a modal
- Modal Esc + close button + scrim all dismiss
- Theme toggle flips colors instantly, persists after refresh
- Burger menu opens on mobile, ESC closes it
- Skip-link appears on Tab
- Avis section shows empty-state ("Premiers avis bientôt disponibles.")
- Keyboard navigation reaches every interactive element
- Enable "prefers-reduced-motion" in DevTools → animations stop
- Switch to Dark Reader / force dark OS → dark tokens apply

- [ ] **Step 6: Lighthouse audit (Chrome DevTools)**

Run Lighthouse in DevTools (mobile, throttled 4G):
Expected targets (with placeholder videos absent, adjust after real assets):
- Performance: ≥ 92
- Accessibility: ≥ 98
- Best Practices: ≥ 95
- SEO: 100

If Performance < 92, likely culprits are font loading or unoptimized dev-only content — revisit the `<link rel="preload">` and fonts.

- [ ] **Step 7: Tag v0.1.0 as the first deployable milestone**

Do NOT push the tag until the placeholders (coach bio, diplomas, videos, Place ID, social URLs) are provided by the coach. When ready:

```bash
git tag v0.1.0 -m "MVP: first deployable milestone"
# git push --tags  # user triggers this explicitly
```

- [ ] **Step 8: Final commit (none expected — QA only)**

The QA pass should not need any code change. If issues are found, fix them inline and commit with scoped messages (`fix(...)`, `chore(...)`).

---

## Summary

26 tasks producing:
- **Site** (components, sections, theme, data): Tasks 1–19
- **SEO**: Task 20
- **Reviews pipeline**: Task 21
- **Static deployment assets**: Task 22
- **CI/CD**: Tasks 23–24
- **Docs & env**: Task 25
- **QA**: Task 26

**Commit checkpoints:** ≥ 25 commits across the plan. Every task ends with a commit.

**Deferred until coach data is provided:**
- Place ID → replace in `src/lib/config.js`
- Coach bio, credentials, socials → edit `src/lib/content/coach.js`
- `public/videos/*.mp4`, `public/posters/*.webp`, `public/coach.webp`, `public/og-cover.jpg`, `public/favicon.svg`, `public/apple-touch-icon.png` → add files
- GitHub Secrets → `GOOGLE_PLACES_API_KEY`, `O2SWITCH_FTP_HOST`, `O2SWITCH_FTP_USER`, `O2SWITCH_FTP_PASSWORD`

Tag `v0.1.0` once those are in place → `deploy-prod` workflow fires → site goes live on o2switch.
