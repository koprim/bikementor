import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('../../lib/content/reviews.json', () => ({
  default: {
    fetchedAt: '2026-04-22T00:00:00Z',
    placeName: 'bikementor',
    googleMapsUrl: 'https://maps.example/x',
    writeReviewUrl: 'https://search.google.com/writereview?placeid=x',
    reviews: [
      { authorName: 'Julien', rating: 5, text: 'Super coach, top pédagogie.', relativeTime: 'il y a 2 semaines' },
      { authorName: 'Marie',  rating: 5, text: 'Progression rapide, merci !',  relativeTime: 'il y a 1 mois' },
    ],
  },
}));

import Reviews from './Reviews.jsx';

describe('Reviews — populated', () => {
  it('renders each review author and text', () => {
    render(<Reviews />);
    expect(screen.getByText(/julien/i)).toBeInTheDocument();
    expect(screen.getByText(/super coach, top pédagogie/i)).toBeInTheDocument();
  });

  it('renders "Voir tous les avis" pointing to googleMapsUrl', () => {
    render(<Reviews />);
    expect(screen.getByRole('link', { name: /voir tous les avis/i })).toHaveAttribute('href', 'https://maps.example/x');
  });

  it('renders "Laisser un avis" pointing to writeReviewUrl', () => {
    render(<Reviews />);
    const links = screen.getAllByRole('link', { name: /laisser un avis/i });
    expect(links.length).toBeGreaterThan(0);
    links.forEach(l => expect(l).toHaveAttribute('href', expect.stringMatching(/writereview/)));
  });
});
