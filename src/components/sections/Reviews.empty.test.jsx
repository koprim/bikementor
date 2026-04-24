import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('../../lib/content/reviews.json', () => ({
  default: {
    fetchedAt: null, placeName: 'bikementor',
    googleMapsUrl: null, writeReviewUrl: null,
    reviews: [],
  },
}));

import Reviews from './Reviews.jsx';

describe('Reviews — empty', () => {
  it('shows empty-state message when no reviews', () => {
    render(<Reviews />);
    expect(screen.getByText(/premiers avis bientôt/i)).toBeInTheDocument();
  });

  it('does not render review list when empty', () => {
    render(<Reviews />);
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });
});
