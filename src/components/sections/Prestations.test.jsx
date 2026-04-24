import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Prestations from './Prestations.jsx';

describe('Prestations section', () => {
  it('renders 3 cards', () => {
    render(<Prestations />);
    expect(screen.getByRole('button', { name: /stage privé/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /leçons privées/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /créations originales/i })).toBeInTheDocument();
  });

  it('opens modal when a card is clicked, closes when ESC pressed', async () => {
    const user = userEvent.setup();
    render(<Prestations />);
    await user.click(screen.getByRole('button', { name: /stage privé/i }));
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has heading "Prestations" with anchor id', () => {
    render(<Prestations />);
    expect(screen.getByRole('heading', { name: /^prestations$/i })).toBeInTheDocument();
    const section = document.getElementById('prestations');
    expect(section).toBeInTheDocument();
  });
});
