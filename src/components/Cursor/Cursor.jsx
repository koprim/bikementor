import { useEffect, useRef, useState } from 'react'
import styles from './Cursor.module.css'

function Cursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    function onMove(e) {
      const { clientX: x, clientY: y } = e
      if (dotRef.current)  { dotRef.current.style.left  = x + 'px'; dotRef.current.style.top  = y + 'px' }
      if (ringRef.current) { ringRef.current.style.left = x + 'px'; ringRef.current.style.top = y + 'px' }
    }

    function onEnter(e) { if (e.target.closest('a, button')) setHovering(true)  }
    function onLeave(e) { if (e.target.closest('a, button')) setHovering(false) }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover',  onEnter)
    document.addEventListener('mouseout',   onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover',  onEnter)
      document.removeEventListener('mouseout',   onLeave)
    }
  }, [])

  const ringClass = [styles.cursor, hovering ? styles.cursorRingLarge : ''].join(' ')

  return (
    <>
      <div ref={dotRef}  className={styles.cursor} style={{ top: 0, left: 0 }}>
        <div className={styles.cursorDot} />
      </div>
      <div ref={ringRef} className={ringClass} style={{ top: 0, left: 0 }}>
        <div className={styles.cursorRing} style={{ width: hovering ? 56 : 36, height: hovering ? 56 : 36 }} />
      </div>
    </>
  )
}

export default Cursor
