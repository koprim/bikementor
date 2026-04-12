import styles from './Services.module.css'

function ServiceCard({ service, delay }) {
  return (
    <div className={`${styles.card} reveal${delay ? ` reveal-delay-${delay}` : ''}`}>
      <div className={styles.visual}>
        <div className={styles.visualIcon}>{service.icon}</div>
      </div>
      <div className={styles.body}>
        <div className={styles.tag}>{service.tag}</div>
        <div className={styles.name}>{service.name}</div>
        <p className={styles.desc}>{service.description}</p>
        <div className={styles.footer}>
          <div className={styles.detail}>{service.detail}</div>
          <a href="#contact" className={styles.cta}>
            Contacter <span className={styles.ctaArrow}>→</span>
          </a>
        </div>
      </div>
    </div>
  )
}

function ServicesView({ services, sectionRef }) {
  return (
    <section id="services" ref={sectionRef}>
      <div className={styles.section}>
        <div className={styles.header}>
          <div>
            <div className="section-label reveal">Prestations</div>
            <h2 className="section-title reveal reveal-delay-1">
              Choisissez<br /><em>votre session</em>
            </h2>
          </div>
          <a href="#contact" className={`${styles.headerCta} reveal`}>Réserver →</a>
        </div>
        <div className={styles.grid}>
          {services.map((s, i) => (
            <ServiceCard key={s.id} service={s} delay={i > 0 ? i : undefined} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesView
