import styles from './ContactForm.module.css'

function ContactFormView({ fields, onChange, onSubmit, status }) {
  return (
    <section id="contact" className={styles.section}>
      <div className={styles.inner}>

        {/* Left */}
        <div>
          <div className="section-label">Contact</div>
          <h2 className={`section-title ${styles.contactTitle}`}>
            Parlons de<br /><em>votre projet</em>
          </h2>
          <p className={styles.contactDesc}>
            Prêt à progresser ? Décrivez votre niveau et vos objectifs, et Théo vous répondra
            sous 24h pour construire votre programme sur mesure.
          </p>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <div className={styles.contactItemIcon}>📍</div>
              <span><strong>Grenoble</strong> & alentours</span>
            </div>
            <div className={styles.contactItem}>
              <div className={styles.contactItemIcon}>📱</div>
              <span>Instagram <strong>@bikementor_theo</strong></span>
            </div>
          </div>
          <div className={styles.responseTime}>
            <div className={styles.responseDot} />
            Répond généralement sous 24h
          </div>
        </div>

        {/* Right — form */}
        {status === 'success' ? (
          <div className={styles.formSuccess}>
            <div className={styles.successIcon}>✓</div>
            <h4>Message envoyé !</h4>
            <p>Théo vous répondra dans les meilleurs délais. À très vite sur les trails !</p>
          </div>
        ) : (
          <form className={styles.form} onSubmit={onSubmit} noValidate>
            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label htmlFor="name">Prénom & Nom</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={fields.name}
                  onChange={onChange}
                  placeholder="Théo Poudret"
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={fields.email}
                  onChange={onChange}
                  placeholder="theo@bikementor.fr"
                  required
                />
              </div>
            </div>
            <div className={styles.field}>
              <label htmlFor="service">Prestation souhaitée</label>
              <select id="service" name="service" value={fields.service} onChange={onChange}>
                <option value="">Choisir une prestation…</option>
                <option value="lecons">Leçons privées</option>
                <option value="stage">Stage privé (journée)</option>
                <option value="creations">Créations originales</option>
                <option value="autre">Autre / Question</option>
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="message">Votre message</label>
              <textarea
                id="message"
                name="message"
                value={fields.message}
                onChange={onChange}
                placeholder="Décrivez votre niveau, vos objectifs et disponibilités…"
                rows={5}
                required
              />
            </div>
            <button type="submit" className={styles.submit} disabled={status === 'sending'}>
              {status === 'sending' ? 'Envoi en cours…' : 'Envoyer →'}
            </button>
            {status === 'error' && (
              <p className={styles.formNote} style={{ color: '#f87171' }}>
                Une erreur est survenue. Veuillez réessayer.
              </p>
            )}
          </form>
        )}

      </div>
    </section>
  )
}

export default ContactFormView
