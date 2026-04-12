import { useState, useEffect } from 'react'
import NavbarView from './NavbarView'

function Navbar() {
  const [scrolled, setScrolled]       = useState(false)
  const [mobileOpen, setMobileOpen]   = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function toggleMobile() {
    setMobileOpen((prev) => {
      document.body.style.overflow = !prev ? 'hidden' : ''
      return !prev
    })
  }

  function closeMobile() {
    setMobileOpen(false)
    document.body.style.overflow = ''
  }

  return (
    <NavbarView
      scrolled={scrolled}
      mobileOpen={mobileOpen}
      onToggleMobile={toggleMobile}
      onCloseMobile={closeMobile}
    />
  )
}

export default Navbar
