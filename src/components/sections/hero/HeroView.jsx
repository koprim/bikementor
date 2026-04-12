import styles from './Hero.module.css'

function HeroView({ particles }) {
  return (
    <section id="hero">
      {/* Background */}
      <div className={styles.heroBg}>
        <div className={styles.heroParticles}>
          {particles.map((p, i) => (
            <div
              key={i}
              className={styles.particle}
              style={{
                left:              p.left,
                bottom:            p.bottom,
                width:             p.size,
                height:            p.size,
                animationDuration: p.duration,
                animationDelay:    p.delay,
              }}
            />
          ))}
        </div>
        <svg
          className={styles.heroMountains}
          viewBox="0 0 1440 400"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,400 L0,280 L120,160 L240,220 L360,120 L480,200 L600,80 L720,180 L840,100 L960,200 L1080,130 L1200,220 L1320,140 L1440,200 L1440,400 Z" fill="rgba(30,22,8,0.5)"/>
          <path d="M0,400 L0,320 L80,240 L180,300 L300,200 L420,280 L540,180 L660,260 L780,170 L900,250 L1020,200 L1140,280 L1260,220 L1380,270 L1440,240 L1440,400 Z" fill="rgba(26,18,6,0.7)"/>
          <path d="M0,400 L0,360 L100,300 L200,340 L350,270 L500,320 L650,260 L800,310 L950,270 L1100,320 L1250,280 L1440,310 L1440,400 Z" fill="rgba(20,14,4,0.9)"/>
        </svg>
      </div>

      {/* Content */}
      <div className={styles.heroContent}>
        <div className={styles.heroEyebrow}>Grenoble · Coaching VTT</div>
        <h1 className={styles.heroTitle}>
          <span>Pilote</span>
          <span className={styles.accent}>ton bike</span>
          <span className={styles.outline}>avec Théo</span>
        </h1>
        <p className={styles.heroDesc}>
          Coaching VTT technique par <strong style={{ color: 'var(--chalk)' }}>Théo Poudret</strong>,
          pilote trial pro. Leçons privées, stages enduro et créations originales à Grenoble —
          pour progresser vite et rider avec plaisir.
        </p>
        <div className={styles.heroActions}>
          <a href="#contact" className={styles.btnPrimary}>Contacter Théo <span>→</span></a>
          <a href="#services" className={styles.btnGhost}>Voir les prestations</a>
        </div>
      </div>

      {/* Scroll hint */}
      <div className={styles.scrollHint}>
        <span>Scroll</span>
        <div className={styles.scrollLine} />
      </div>
    </section>
  )
}

export default HeroView
