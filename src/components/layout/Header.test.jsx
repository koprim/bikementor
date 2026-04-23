import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './Header.jsx';

describe('Header', () => {
  it('renders brand name and desktop nav links', () => {
    render(<Header />);
    expect(screen.getByText(/bikementor/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /accueil/i })).toHaveAttribute('href', '#top');
    expect(screen.getByRole('link', { name: /^prestations$/i })).toHaveAttribute('href', '#prestations');
    expect(screen.getByRole('link', { name: /^avis$/i })).toHaveAttribute('href', '#avis');
  });

  it('renders WhatsApp external link with target=_blank', () => {
    render(<Header />);
    const wa = screen.getByRole('link', { name: /whatsapp/i });
    expect(wa).toHaveAttribute('target', '_blank');
  });

  it('renders theme toggle button', () => {
    render(<Header />);
    expect(screen.getAllByRole('button', { name: /mode/i })).toHaveLength(2);
  });

  it('opens mobile menu when burger is clicked', async () => {
    const user = userEvent.setup();
    render(<Header />);
    const burger = screen.getByRole('button', { name: /ouvrir le menu/i });
    await user.click(burger);
    expect(screen.getByRole('dialog', { name: /menu/i })).toBeInTheDocument();
  });
});
