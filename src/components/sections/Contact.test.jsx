import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Contact from './Contact.jsx';

describe('Contact', () => {
  it('renders a big WhatsApp CTA', () => {
    render(<Contact />);
    const link = screen.getByRole('link', { name: /whatsapp/i });
    expect(link).toHaveAttribute('href', 'https://wa.me/message/CPLLJRUYZ43DB1');
  });

  it('has anchor id "contact"', () => {
    render(<Contact />);
    expect(document.getElementById('contact')).toBeInTheDocument();
  });

  it('renders heading', () => {
    render(<Contact />);
    expect(screen.getByRole('heading', { name: /contact|discute|reserve|réserve/i })).toBeInTheDocument();
  });
});
