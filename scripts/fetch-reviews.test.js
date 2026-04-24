import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { writeFileSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { fetchAndWriteReviews } from './fetch-reviews.js';

const okPayload = {
  displayName: { text: 'bikementor' },
  googleMapsUri: 'https://maps.example/x',
  reviews: [
    {
      authorAttribution: { displayName: 'Julien', photoUri: 'https://p/1' },
      rating: 5,
      text: { text: 'Super coach. Vraiment top pédagogie, progression nette en deux séances.', languageCode: 'fr' },
      publishTime: '2026-04-01T00:00:00Z',
      relativePublishTimeDescription: 'il y a 2 semaines',
    },
    {
      authorAttribution: { displayName: 'Short' },
      rating: 5,
      text: { text: 'Top.' }, // < 40 chars → filtered
      publishTime: '2026-04-10T00:00:00Z',
    },
  ],
};

describe('fetch-reviews', () => {
  let tmpOut;
  const originalFetch = global.fetch;
  const originalEnv = process.env.GOOGLE_PLACES_API_KEY;

  beforeEach(() => {
    tmpOut = join(mkdtempSync(join(tmpdir(), 'bm-')), 'reviews.json');
    process.env.GOOGLE_PLACES_API_KEY = 'fake-key';
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.GOOGLE_PLACES_API_KEY = originalEnv;
  });

  it('writes normalized reviews to target path on success', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve(okPayload) });
    await fetchAndWriteReviews({ placeId: 'ChIJxxx', outPath: tmpOut });
    const written = JSON.parse(readFileSync(tmpOut, 'utf8'));
    expect(written.placeName).toBe('bikementor');
    expect(written.googleMapsUrl).toBe('https://maps.example/x');
    expect(written.writeReviewUrl).toMatch(/writereview\?placeid=ChIJxxx/);
    expect(written.reviews).toHaveLength(1); // "Top." filtered
    expect(written.reviews[0].authorName).toBe('Julien');
  });

  it('throws and does not write when API returns 4xx', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 403, text: () => Promise.resolve('denied') });
    writeFileSync(tmpOut, JSON.stringify({ sentinel: 'keep-me' }));
    await expect(fetchAndWriteReviews({ placeId: 'ChIJxxx', outPath: tmpOut })).rejects.toThrow(/403/);
    expect(JSON.parse(readFileSync(tmpOut, 'utf8')).sentinel).toBe('keep-me');
  });

  it('throws when API key is missing', async () => {
    delete process.env.GOOGLE_PLACES_API_KEY;
    await expect(fetchAndWriteReviews({ placeId: 'x', outPath: tmpOut })).rejects.toThrow(/GOOGLE_PLACES_API_KEY/);
  });

  it('throws when no review passes the quality filter', async () => {
    const bad = { ...okPayload, reviews: [{ rating: 5, text: { text: 'ok' }, publishTime: '2026-04-10T00:00:00Z' }] };
    global.fetch = vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve(bad) });
    writeFileSync(tmpOut, JSON.stringify({ sentinel: 'keep' }));
    await expect(fetchAndWriteReviews({ placeId: 'x', outPath: tmpOut })).rejects.toThrow(/no review/i);
    expect(JSON.parse(readFileSync(tmpOut, 'utf8')).sentinel).toBe('keep');
  });
});
