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
