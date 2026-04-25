import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const MIN_TEXT_LENGTH = 40;
const MAX_REVIEWS     = 5;

export async function fetchAndWriteReviews({ placeId, outPath, apiKey = process.env.GOOGLE_PLACES_API_KEY }) {
  if (!apiKey) throw new Error('GOOGLE_PLACES_API_KEY manquant');
  if (!placeId) throw new Error('placeId manquant');

  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=fr`;
  const res = await fetch(url, {
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'reviews,displayName,googleMapsUri',
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '(no body)');
    throw new Error(`Places API ${res.status} — ${body}`);
  }

  const data = await res.json();
  const all = data.reviews ?? [];
  const filtered = all
    .filter(r => (r.text?.text ?? '').trim().length >= MIN_TEXT_LENGTH)
    .slice(0, MAX_REVIEWS);

  if (filtered.length === 0) {
    throw new Error(
      `no review passed the quality filter (total from API: ${all.length}, min length: ${MIN_TEXT_LENGTH})`
    );
  }

  const normalized = {
    fetchedAt: new Date().toISOString(),
    placeId,
    placeName: data.displayName?.text ?? 'bikementor',
    googleMapsUrl: data.googleMapsUri ?? null,
    writeReviewUrl: `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`,
    reviews: filtered.map(r => ({
      authorName: r.authorAttribution?.displayName ?? 'Anonyme',
      authorPhotoUrl: r.authorAttribution?.photoUri ?? null,
      rating: r.rating ?? 0,
      text: r.text?.text ?? '',
      relativeTime: r.relativePublishTimeDescription ?? '',
      publishTime: r.publishTime ?? null,
      language: r.text?.languageCode ?? 'fr',
    })),
  };

  writeFileSync(outPath, JSON.stringify(normalized, null, 2) + '\n', 'utf8');
  return normalized;
}

// CLI entrypoint
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const { config } = await import(pathToFileURL(resolve(__dirname, '../src/lib/config.js')).href);
  const outPath = resolve(__dirname, '../src/lib/content/reviews.json');

  console.log(`  place ID : ${config.placeId}`);
  console.log(`  API key  : ${process.env.GOOGLE_PLACES_API_KEY ? '✓ présente' : '✗ manquante'}`);

  try {
    const r = await fetchAndWriteReviews({ placeId: config.placeId, outPath });
    console.log(`✓ ${r.reviews.length} avis écrits dans ${outPath}`);
  } catch (err) {
    process.stdout.write(`✗ fetch-reviews: ${err.message} — fichier conservé\n`);
    process.exit(1);
  }
}
