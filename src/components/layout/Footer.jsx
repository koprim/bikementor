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
