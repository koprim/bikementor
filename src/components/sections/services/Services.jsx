import { useEffect, useRef } from 'react'
import { services } from '@/components/data/services'
import ServicesView from './ServicesView'

function Services() {
  const sectionRef = useRef(null)

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

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return <ServicesView services={services} sectionRef={sectionRef} />
}

export default Services
