import config from '@/config/googlePlaces'

function formatReview(review, index) {
  const name = review.authorAttribution?.displayName ?? 'Anonyme'
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const date = review.relativePublishTimeDescription ?? ''

  return {
    id:      index + 1,
    name,
    initials,
    rating:  review.rating ?? 5,
    date,
    text:    review.text?.text ?? '',
  }
}

export async function fetchGoogleReviews() {
  const url = `${config.baseUrl}/places/${config.placeId}?fields=${config.fields}&key=${config.apiKey}`

  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`Google Places API error: ${response.status}`)
  }

  const data = await response.json()
  const reviews = (data.reviews ?? [])
    .slice(0, config.maxReviews)
    .map(formatReview)

  return reviews
}
