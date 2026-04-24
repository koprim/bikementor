import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from './HomePage.jsx';

describe('HomePage', () => {
  it('renders header, hero, all sections, and footer', () => {
    render(<HomePage />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(document.getElementById('prestations')).toBeInTheDocument();
    expect(document.getElementById('a-propos')).toBeInTheDocument();
    expect(document.getElementById('contact')).toBeInTheDocument();
    expect(document.getElementById('avis')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('has a skip link to main content', () => {
    render(<HomePage />);
    expect(screen.getByRole('link', { name: /aller au contenu/i })).toHaveAttribute('href', '#main');
  });
});
