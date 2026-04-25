// Usage: GOOGLE_PLACES_API_KEY=xxx node scripts/find-place-id.js
//
// Stratégies dans l'ordre :
//   1. Old Places API  — lookup par CID (extrait de l'URL Google Maps)
//   2. New Places API  — Text Search  "BikeMentor Grenoble"
//   3. New Places API  — Nearby Search sur les coordonnées GPS du listing
//
// Le CID et les coordonnées GPS sont extraits de l'URL Maps connue :
// https://www.google.com/maps/place/BikeMentor+Grenoble/...
// !1s0x478a8da3dc1b4905:0xa27b5b0e955d389f
// !3d45.1842335  !4d5.71554

const apiKey = process.env.GOOGLE_PLACES_API_KEY;
if (!apiKey) { console.error('✗ Manque GOOGLE_PLACES_API_KEY'); process.exit(1); }

// CID extrait du segment !1s... (second hex, converti en décimal)
const CID = BigInt('0xa27b5b0e955d389f').toString(10);
const LAT = 45.1842335;
const LNG = 5.71554;

// ─── Stratégie 1 : old Places API + CID ────────────────────────────────────
async function byCID() {
  console.log(`\n[1/3] Old Places API — CID ${CID}`);
  const url = `https://maps.googleapis.com/maps/api/place/details/json?cid=${CID}&fields=place_id,name,formatted_address&key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== 'OK') {
    console.log(`  ✗ status: ${data.status} — ${data.error_message ?? ''}`);
    return null;
  }
  const r = data.result;
  console.log(`  ✓ ${r.name}`);
  console.log(`    Adresse  : ${r.formatted_address ?? '(aucune)'}`);
  console.log(`    Place ID : ${r.place_id}`);
  return r.place_id;
}

// ─── Stratégie 2 : new Places API Text Search ───────────────────────────────
async function byText(query) {
  console.log(`\n[2/3] New Places API — Text Search "${query}"`);
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ textQuery: query, languageCode: 'fr' }),
  });
  const data = await res.json();
  if (!res.ok) { console.log(`  ✗ HTTP ${res.status}:`, JSON.stringify(data)); return null; }
  const places = data.places ?? [];
  if (places.length === 0) { console.log('  Aucun résultat.'); return null; }
  places.forEach((p, i) => {
    console.log(`  [${i + 1}] ${p.displayName?.text} — ${p.formattedAddress ?? '(aucune adresse)'}`);
    console.log(`      Place ID : ${p.id}`);
  });
  return places[0].id;
}

// ─── Stratégie 3 : new Places API Nearby Search ─────────────────────────────
async function byNearby() {
  console.log(`\n[3/3] New Places API — Nearby Search (${LAT}, ${LNG}, r=500m)`);
  const res = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
    method: 'POST',
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      locationRestriction: { circle: { center: { latitude: LAT, longitude: LNG }, radius: 500 } },
      languageCode: 'fr',
    }),
  });
  const data = await res.json();
  if (!res.ok) { console.log(`  ✗ HTTP ${res.status}:`, JSON.stringify(data)); return null; }
  const places = data.places ?? [];
  if (places.length === 0) { console.log('  Aucun résultat.'); return null; }
  places.forEach((p, i) => {
    console.log(`  [${i + 1}] ${p.displayName?.text} — ${p.formattedAddress ?? '(aucune adresse)'}`);
    console.log(`      Place ID : ${p.id}`);
  });
  return places[0].id;
}

// ─── Main ────────────────────────────────────────────────────────────────────
const placeId = (await byCID())
  ?? (await byText('BikeMentor Grenoble'))
  ?? (await byNearby());

console.log('\n' + '─'.repeat(50));
if (placeId) {
  console.log(`✓ Place ID trouvé : ${placeId}`);
  console.log('  → Mettre à jour src/lib/config.js : placeId: \'' + placeId + '\'');
} else {
  console.log('✗ Aucune stratégie n\'a trouvé le Place ID.');
  console.log('  → Activer "Places API" (ancienne) sur Google Cloud Console,');
  console.log('    ou récupérer le Place ID depuis Google Business Profile :');
  console.log('    business.google.com → fiche → Profil → ID de lieu');
}
