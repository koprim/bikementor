import styles from './Footer.module.css'

function FooterView() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <a href="#hero" className={styles.logo}>Bike<span>Mentor</span></a>
      <p className={styles.copy}>© {year} BikeMentor · Grenoble</p>
      <div className={styles.social}>
        <a href="#" className={styles.socialLink} aria-label="Instagram">IG</a>
        <a href="#" className={styles.socialLink} aria-label="Facebook">FB</a>
      </div>
    </footer>
  )
}

export default FooterView
