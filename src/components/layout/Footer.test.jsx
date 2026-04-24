import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer.jsx';

describe('Footer', () => {
  it('renders site name', () => {
    render(<Footer />);
    expect(screen.getAllByText(/bikementor/i).length).toBeGreaterThan(0);
  });

  it('renders youtube link', () => {
    render(<Footer />);
    const yt = screen.getByRole('link', { name: /youtube/i });
    expect(yt).toHaveAttribute('href', expect.stringMatching(/youtube\.com/));
    expect(yt).toHaveAttribute('target', '_blank');
  });

  it('renders current year', () => {
    render(<Footer />);
    expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument();
  });
});
