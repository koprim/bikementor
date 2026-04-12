import { useEffect, useRef } from 'react'
import GalleryView from './GalleryView'

function Gallery() {
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

  return <GalleryView sectionRef={sectionRef} />
}

export default Gallery
