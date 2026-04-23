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
