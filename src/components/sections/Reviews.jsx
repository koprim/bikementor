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
