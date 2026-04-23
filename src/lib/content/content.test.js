import { describe, it, expect } from 'vitest';
import { prestations } from './prestations.js';
import { coach } from './coach.js';
import reviews from './reviews.json';
import { config } from '../config.js';

describe('prestations', () => {
  it('has exactly 3 prestations', () => {
    expect(prestations).toHaveLength(3);
  });

  it('has slugs stage-prive, lecons-privees, creations-originales', () => {
    expect(prestations.map(p => p.slug)).toEqual([
      'stage-prive', 'lecons-privees', 'creations-originales',
    ]);
  });

  it('each prestation has required fields', () => {
    for (const p of prestations) {
      expect(p.title).toBeTruthy();
      expect(p.tagline).toBeTruthy();
      expect(p.summary).toBeTruthy();
      expect(p.videoSrc).toMatch(/^\/videos\/.+\.mp4$/);
      expect(p.poster).toMatch(/^\/posters\/.+\.webp$/);
      expect(Array.isArray(p.formats)).toBe(true);
      expect(p.formats.length).toBeGreaterThan(0);
      for (const f of p.formats) {
        expect(f.title).toBeTruthy();
        expect(f.description).toBeTruthy();
      }
    }
  });
});

describe('coach', () => {
  it('has name Théo Poudret', () => {
    expect(coach.name).toBe('Théo Poudret');
  });

  it('uses the wa.me/message link', () => {
    expect(coach.whatsappUrl).toBe('https://wa.me/message/CPLLJRUYZ43DB1');
  });

  it('has youtube url', () => {
    expect(coach.socials.youtube).toMatch(/^https:\/\/www\.youtube\.com/);
  });
});

describe('reviews bootstrap', () => {
  it('has the expected shape with empty reviews', () => {
    expect(reviews).toEqual(expect.objectContaining({
      fetchedAt: null,
      reviews: [],
    }));
  });
});

describe('config', () => {
  it('has siteUrl https://bikementor.fr', () => {
    expect(config.siteUrl).toBe('https://bikementor.fr');
  });
});
