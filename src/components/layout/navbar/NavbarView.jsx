import styles from './Navbar.module.css'

const NAV_LINKS = [
  { href: '#about',    label: 'À propos' },
  { href: '#services', label: 'Prestations' },
  { href: '#reviews',  label: 'Avis' },
  { href: '#gallery',  label: 'Photos' },
  { href: '#contact',  label: 'Contact' },
]

function NavbarView({ scrolled, mobileOpen, onToggleMobile, onCloseMobile }) {
  const navClass   = [styles.nav,        scrolled    ? styles.scrolled : ''].join(' ')
  const burgerClass = [styles.hamburger, mobileOpen ? styles.open     : ''].join(' ')
  const menuClass  = [styles.mobileMenu, mobileOpen ? styles.open     : ''].join(' ')

  return (
    <>
      <div className={menuClass}>
        {NAV_LINKS.map(({ href, label }) => (
          <a key={href} href={href} onClick={onCloseMobile}>{label}</a>
        ))}
      </div>

      <nav className={navClass}>
        <a href="#hero" className={styles.navLogo}>
          Bike<span>Mentor</span>
        </a>
        <ul className={styles.navLinks}>
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}><a href={href}>{label}</a></li>
          ))}
        </ul>
        <a href="#contact" className={styles.navCta}>Contacter Théo</a>
        <button className={burgerClass} onClick={onToggleMobile} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>
    </>
  )
}

export default NavbarView
