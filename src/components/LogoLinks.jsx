import reactLogo from '@/assets/react.svg'
import viteLogo from '/vite.svg'
import styles from './LogoLinks.module.css'

function LogoLinks() {
  return (
    <div>
      <a href="https://vite.dev" target="_blank">
        <img src={viteLogo} className={styles.logo} alt="Vite logo" />
      </a>
      <a href="https://react.dev" target="_blank">
        <img src={reactLogo} className={`${styles.logo} ${styles.react}`} alt="React logo" />
      </a>
    </div>
  )
}

export default LogoLinks
