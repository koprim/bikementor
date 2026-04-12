import styles from './About.module.css'

function AboutView({ revealRef }) {
  return (
    <div className={styles.wrapper}>
      <div id="about" className={styles.section} ref={revealRef}>

        {/* Visual */}
        <div className={`${styles.visual} reveal`}>
          <div className={styles.imgFrame}>
            <div className={styles.imgPlaceholder}>
              <div className={styles.bigIcon}>🚵</div>
              <p>Photo de Théo</p>
            </div>
          </div>
          <div className={styles.badge}>
            <strong>Pro</strong>trial<br />rider
          </div>
        </div>

        {/* Text */}
        <div className={styles.text}>
          <div className="section-label reveal">Le coach</div>
          <h2 className="section-title reveal reveal-delay-1">
            Théo<br /><em>Poudret</em>
          </h2>
          <p className="reveal reveal-delay-2">
            <strong>Pilote trial professionnel</strong> et coach VTT passionné basé à Grenoble.
            Théo a développé une approche pédagogique unique, inspirée du trial, pour vous aider
            à progresser sur tous les terrains — du XC à l'enduro en passant par le VTTAE.
          </p>
          <p className="reveal reveal-delay-2">
            Chaque session est conçue pour <strong>améliorer votre posture, vos gestes de pilotage</strong> et
            votre confiance en descente. Que vous soyez débutant ou rider confirmé, Théo adapte son
            enseignement à votre niveau.
          </p>
          <div className={`${styles.stats} reveal reveal-delay-3`}>
            <div>
              <div className={styles.statNum}>+10</div>
              <div className={styles.statLabel}>Ans d'expérience</div>
            </div>
            <div>
              <div className={styles.statNum}>100+</div>
              <div className={styles.statLabel}>Riders coachés</div>
            </div>
            <div>
              <div className={styles.statNum}>5★</div>
              <div className={styles.statLabel}>Avis Google</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default AboutView
