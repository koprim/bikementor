import styles from './GoogleReviews.module.css'
import t from '../../../i18n/fr'

const STAR = '★'
const STAR_EMPTY = '☆'

function Stars({ rating }) {
  return (
    <span className={styles.stars} aria-label={t.googleReviews.starsLabel(rating)}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? styles.starFilled : styles.starEmpty}>
          {i < rating ? STAR : STAR_EMPTY}
        </span>
      ))}
    </span>
  )
}

function ReviewCard({ review }) {
  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.avatar}>{review.initials}</div>
        <div>
          <p className={styles.name}>{review.name}</p>
          <p className={styles.date}>{review.date}</p>
        </div>
        <div className={styles.googleLogo}>G</div>
      </div>
      <Stars rating={review.rating} />
      <p className={styles.text}>{review.text}</p>
    </article>
  )
}

function GoogleReviewsView({ reviews, trackRef, onMouseDown, onMouseMove, onMouseUp, onMouseLeave }) {
  const avg = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)

  return (
    <section id="reviews" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{t.googleReviews.title}</h2>
            <p className={styles.subtitle}>{t.googleReviews.subtitle}</p>
          </div>
          <div className={styles.overall}>
            <span className={styles.avgScore}>{avg}</span>
            <div className={styles.overallMeta}>
              <Stars rating={5} />
              <p className={styles.reviewCount}>{t.googleReviews.reviewCount(reviews.length)}</p>
            </div>
          </div>
        </div>

        <div className={styles.carouselWrap}>
          <div
            className={styles.track}
            ref={trackRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
          >
            {reviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default GoogleReviewsView
