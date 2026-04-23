import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import WhatsAppButton from './WhatsAppButton.jsx';

describe('WhatsAppButton', () => {
  it('renders an anchor pointing to the coach whatsappUrl', () => {
    render(<WhatsAppButton>Discuter</WhatsAppButton>);
    const link = screen.getByText('Discuter').closest('a');
    expect(link).toHaveAttribute('href', 'https://wa.me/message/CPLLJRUYZ43DB1');
  });

  it('opens in a new tab with security attrs', () => {
    render(<WhatsAppButton>Contact</WhatsAppButton>);
    const link = screen.getByText('Contact').closest('a');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringMatching(/noopener/));
  });

  it('has descriptive aria-label mentioning new tab', () => {
    render(<WhatsAppButton>Envoyer</WhatsAppButton>);
    const link = screen.getByText('Envoyer').closest('a');
    expect(link).toHaveAttribute('aria-label', expect.stringMatching(/ouvre dans un nouvel onglet/i));
  });

  it('applies variant primary styles when variant="primary"', () => {
    render(<WhatsAppButton variant="primary">P</WhatsAppButton>);
    const link = screen.getByText('P').closest('a');
    expect(link.className).toMatch(/primary/);
  });
});
