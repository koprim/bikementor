import { useMemo } from 'react'
import HeroView from './HeroView'

function seededRandom(seed) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

function generateParticles(count) {
  return Array.from({ length: count }, (_, i) => {
    const r = (offset) => seededRandom(i * 5 + offset)
    const size = (1 + r(0) * 2) + 'px'
    return {
      left:     r(1) * 100 + '%',
      bottom:   r(2) * 40  + '%',
      size,
      duration: (4 + r(3) * 8) + 's',
      delay:    r(4) * 6        + 's',
    }
  })
}

function Hero() {
  const particles = useMemo(() => generateParticles(30), [])

  return <HeroView particles={particles} />
}

export default Hero
