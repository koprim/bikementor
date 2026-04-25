// Usage: GOOGLE_PLACES_API_KEY=xxx node scripts/find-place-id.js
// Essaie 2 stratégies : Text Search puis Nearby Search par coordonnées GPS.
const apiKey = process.env.GOOGLE_PLACES_API_KEY;
if (!apiKey) { console.error('✗ Manque GOOGLE_PLACES_API_KEY'); process.exit(1); }

const FIELD_MASK = 'places.id,places.displayName,places.formattedAddress';

async function textSearch(query) {
  console.log(`\n[1/2] Text Search : "${query}"`);
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: { 'X-Goog-Api-Key': apiKey, 'X-Goog-FieldMask': FIELD_MASK, 'Content-Type': 'application/json' },
    body: JSON.stringify({ textQuery: query, languageCode: 'fr' }),
  });
  const data = await res.json();
  if (!res.ok) { console.log('  ✗ HTTP', res.status, JSON.stringify(data)); return []; }
  return data.places ?? [];
}

async function nearbySearch(lat, lng, radius = 300) {
  console.log(`\n[2/2] Nearby Search (${lat}, ${lng}, r=${radius}m)`);
  const res = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
    method: 'POST',
    headers: { 'X-Goog-Api-Key': apiKey, 'X-Goog-FieldMask': FIELD_MASK, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      locationRestriction: { circle: { center: { latitude: lat, longitude: lng }, radius } },
      languageCode: 'fr',
    }),
  });
  const data = await res.json();
  if (!res.ok) { console.log('  ✗ HTTP', res.status, JSON.stringify(data)); return []; }
  return data.places ?? [];
}

function printPlaces(places) {
  if (places.length === 0) { console.log('  Aucun résultat.'); return; }
  places.forEach((p, i) => {
    console.log(`  [${i + 1}] ${p.displayName?.text}`);
    console.log(`      Adresse  : ${p.formattedAddress}`);
    console.log(`      Place ID : ${p.id}`);
  });
}

// Coordonnées GPS extraites de l'URL Google Maps de BikeMentor Grenoble
const LAT = 45.1842335;
const LNG = 5.71554;

const byText = await textSearch('BikeMentor Grenoble');
printPlaces(byText);

if (byText.length === 0) {
  const byNearby = await nearbySearch(LAT, LNG);
  printPlaces(byNearby);
}

console.log('\n→ Copie le Place ID dans src/lib/config.js');
