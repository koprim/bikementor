// Usage: GOOGLE_PLACES_API_KEY=xxx node scripts/find-place-id.js
//
// Stratégies dans l'ordre :
//   1. Old Places API  — lookup par ftid  /g/11h1dpbk4t (identifiant réel BikeMentor dans l'URL Maps)
//   2. Old Places API  — Find Place from Text "BikeMentor Grenoble"
//   3. New Places API  — Text Search "BikeMentor Grenoble"
//
// ftid extrait du segment !16s dans l'URL Maps :
// !16s%2Fg%2F11h1dpbk4t  →  /g/11h1dpbk4t

const apiKey = process.env.GOOGLE_PLACES_API_KEY;
if (!apiKey) { console.error('✗ Manque GOOGLE_PLACES_API_KEY'); process.exit(1); }

const FTID = '/g/11h1dpbk4t';

// ─── Stratégie 1 : old Places Details API + ftid ────────────────────────────
async function byFtid() {
  console.log(`\n[1/3] Old Places API — ftid ${FTID}`);
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(FTID)}&fields=place_id,name,formatted_address&key=${apiKey}`;
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

// ─── Stratégie 2 : old Find Place from Text ─────────────────────────────────
async function byFindPlace(input) {
  console.log(`\n[2/3] Old Places API — Find Place from Text "${input}"`);
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(input)}&inputtype=textquery&fields=place_id,name,formatted_address&key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== 'OK') {
    console.log(`  ✗ status: ${data.status} — ${data.error_message ?? ''}`);
    return null;
  }
  const candidates = data.candidates ?? [];
  if (candidates.length === 0) { console.log('  Aucun résultat.'); return null; }
  candidates.forEach((p, i) => {
    console.log(`  [${i + 1}] ${p.name} — ${p.formatted_address ?? '(aucune adresse)'}`);
    console.log(`      Place ID : ${p.place_id}`);
  });
  return candidates[0].place_id;
}

// ─── Stratégie 3 : new Places API Text Search ───────────────────────────────
async function byTextSearch(query) {
  console.log(`\n[3/3] New Places API — Text Search "${query}"`);
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

// ─── Main ────────────────────────────────────────────────────────────────────
const placeId = (await byFtid())
  ?? (await byFindPlace('BikeMentor Grenoble'))
  ?? (await byTextSearch('BikeMentor Grenoble'));

console.log('\n' + '─'.repeat(50));
if (placeId) {
  console.log(`✓ Place ID trouvé : ${placeId}`);
  console.log(`  → Mettre à jour src/lib/config.js : placeId: '${placeId}'`);
} else {
  console.log('✗ Aucune stratégie n\'a trouvé le Place ID.');
  console.log('  → Récupérer l\'ID depuis Google Business Profile :');
  console.log('    business.google.com → fiche → "Voir la fiche" → l\'URL contient l\'ID');
}
