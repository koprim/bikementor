import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Hero from './Hero.jsx';

describe('Hero', () => {
  it('renders an h1 with brand tagline', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders WhatsApp CTA in hero', () => {
    render(<Hero />);
    expect(screen.getByRole('link', { name: /whatsapp/i })).toBeInTheDocument();
  });

  it('renders video element with poster fallback', () => {
    const { container } = render(<Hero />);
    expect(container.querySelector('video')).toBeInTheDocument();
  });

  it('renders scroll-down indicator', () => {
    render(<Hero />);
    expect(screen.getByLabelText(/défiler vers le bas/i)).toBeInTheDocument();
  });
});
