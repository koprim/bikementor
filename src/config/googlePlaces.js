const googlePlacesConfig = {
  apiKey:  import.meta.env.VITE_GOOGLE_PLACES_API_KEY,
  placeId: import.meta.env.VITE_GOOGLE_PLACE_ID,
  baseUrl: 'https://places.googleapis.com/v1',
  fields:  'reviews,rating,userRatingCount',
  maxReviews: 5,
}

export default googlePlacesConfig
