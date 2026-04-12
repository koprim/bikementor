import { useRef, useState, useEffect } from 'react'
import { fetchGoogleReviews } from '@/services/googleReviewsService'
import { reviews as fallbackReviews } from '@/components/data/review'
import GoogleReviewsView from './GoogleReviewsView'

function GoogleReviews() {
  const [reviews, setReviews] = useState(fallbackReviews)
  const trackRef = useRef(null)
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0 })

  useEffect(() => {
    fetchGoogleReviews()
      .then(setReviews)
      .catch(() => setReviews(fallbackReviews))
  }, [])

  function onMouseDown(e) {
    drag.current = { active: true, startX: e.pageX - trackRef.current.offsetLeft, scrollLeft: trackRef.current.scrollLeft }
    trackRef.current.style.cursor = 'grabbing'
  }

  function onMouseMove(e) {
    if (!drag.current.active) return
    e.preventDefault()
    const x = e.pageX - trackRef.current.offsetLeft
    const walk = (x - drag.current.startX) * 1.2
    trackRef.current.scrollLeft = drag.current.scrollLeft - walk
  }

  function onMouseUp() {
    drag.current.active = false
    trackRef.current.style.cursor = 'grab'
  }

  return (
    <GoogleReviewsView
      reviews={reviews}
      trackRef={trackRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    />
  )
}

export default GoogleReviews
