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
