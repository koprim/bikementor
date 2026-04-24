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
