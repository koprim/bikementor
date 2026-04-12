import styles from './Gallery.module.css'

const PLACEHOLDERS = ['🏔️', '🚵', '⛰️', '🌲', '🎯', '🏅']

function GalleryView({ sectionRef }) {
  return (
    <section id="gallery" ref={sectionRef}>
      <div className={styles.section}>
        <div className="section-label reveal">Photos</div>
        <h2 className="section-title reveal reveal-delay-1">
          Sur le<br /><em>terrain</em>
        </h2>
        <div className={styles.grid}>
          {PLACEHOLDERS.map((icon, i) => (
            <div key={i} className={styles.item}>
              <span className={styles.placeholder}>{icon}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default GalleryView
