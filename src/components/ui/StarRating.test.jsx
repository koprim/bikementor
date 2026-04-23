import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import StarRating from './StarRating.jsx';

describe('StarRating', () => {
  it('renders with role=img and accessible label', () => {
    const { container } = render(<StarRating rating={4} />);
    const el = container.querySelector('[role="img"]');
    expect(el).toHaveAttribute('aria-label', '4 sur 5 étoiles');
  });

  it('renders exactly 5 star SVGs', () => {
    const { container } = render(<StarRating rating={3} />);
    expect(container.querySelectorAll('svg')).toHaveLength(5);
  });

  it('clamps rating outside [0,5]', () => {
    const { container } = render(<StarRating rating={7} />);
    expect(container.querySelector('[role="img"]')).toHaveAttribute('aria-label', '5 sur 5 étoiles');
  });
});
