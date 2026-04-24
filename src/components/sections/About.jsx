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
