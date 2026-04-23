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
    <FocusTrap
      focusTrapOptions={{
        initialFocus: '#modal-close-btn',
        fallbackFocus: '#modal-close-btn',
        escapeDeactivates: false,
        allowOutsideClick: true,
      }}
    >
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
