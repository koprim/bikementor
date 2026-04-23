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
