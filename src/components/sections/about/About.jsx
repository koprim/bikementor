import { useEffect, useRef } from 'react'
import AboutView from './AboutView'

function About() {
  const revealRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.querySelectorAll('.reveal').forEach((el) => {
            if (entry.isIntersecting) el.classList.add('visible')
          })
        })
      },
      { threshold: 0.1 }
    )

    if (revealRef.current) observer.observe(revealRef.current)
    return () => observer.disconnect()
  }, [])

  return <AboutView revealRef={revealRef} />
}

export default About
