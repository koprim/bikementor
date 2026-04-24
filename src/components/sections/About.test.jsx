import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from './About.jsx';

describe('About', () => {
  it('renders coach name', () => {
    render(<About />);
    expect(screen.getByText(/théo poudret/i)).toBeInTheDocument();
  });

  it('renders coach photo with alt text', () => {
    render(<About />);
    const img = screen.getByAltText(/théo poudret/i);
    expect(img).toHaveAttribute('src', '/coach.svg');
  });

  it('renders zone Grenoble', () => {
    render(<About />);
    expect(screen.getByText(/grenoble/i)).toBeInTheDocument();
  });
});
