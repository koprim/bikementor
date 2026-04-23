# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Showcase website for **bikementor.fr** — a mountain bike (VTT) coaching service. Visitors browse available services (prestations) and contact the coach to book sessions or sign up for group courses (stages). No authentication, no backend — static/client-side only.

## Tech Stack

- **React 19** (JSX, no TypeScript)
- **Vite 7** — dev server & build
- **Tailwind CSS 4** (imported via CSS, v4 uses `@import "tailwindcss"` — no `tailwind.config.js`)
- **ESLint 9** flat config with react-hooks and react-refresh plugins

## Commands

```bash
npm run dev      # Start dev server (HMR)
npm run build    # Production build → dist/
npm run preview  # Serve production build locally
npm run lint     # ESLint
```

## Architecture

Hexagonal-inspired folder layout under `src/`:

| Folder | Role |
|---|---|
| `src/app/` | Pages and route definitions |
| `src/components/` | Reusable UI components |
| `src/lib/` | Utilities, helpers, and configuration |

Entry point: `src/main.jsx` → renders `<App />` inside `<StrictMode>`.

## Conventions

- Use **Tailwind utility classes** for all styling; avoid custom CSS unless absolutely necessary.
- Components are functional React components (hooks, no class components).
- Files use `.jsx` extension.
- ESLint rule: unused variables starting with an uppercase letter or `_` are ignored (`varsIgnorePattern: '^[A-Z_]'`).
- All content is in **French** (user-facing text, labels, alt attributes).

## Frontend Aesthetics

Avoid generic "AI slop" aesthetics. Make creative, distinctive frontends that surprise and delight.

- **Typography:** Choose beautiful, unique fonts. Avoid generic families (Inter, Roboto, Arial, system fonts). Opt for distinctive choices that elevate the design.
- **Color & Theme:** Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. Draw from IDE themes and cultural aesthetics for inspiration. Avoid clichéd color schemes (particularly purple gradients on white backgrounds).
- **Motion:** Use animations for effects and micro-interactions. Prioritize CSS-only solutions. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (`animation-delay`) creates more delight than scattered micro-interactions.
- **Backgrounds:** Create atmosphere and depth rather than defaulting to solid colors. Layer CSS gradients, use geometric patterns, or add contextual effects that match the overall aesthetic.
- **Originality:** Avoid predictable layouts, cookie-cutter component patterns, and overused font/color combinations (e.g. Space Grotesk). Vary between light and dark themes, different fonts, different aesthetics. Interpret creatively and make unexpected choices that feel genuinely designed for the context.
