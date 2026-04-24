import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PrestationModal from './PrestationModal.jsx';

const fixture = {
  slug: 'stage-prive',
  title: 'Stage privé',
  tagline: 'Coaching personnalisé.',
  summary: 'Une journée complète.',
  videoSrc: '/videos/stage-prive.mp4',
  poster: '/posters/stage-prive.webp',
  formats: [
    { title: 'Enduro & sauts', description: 'Tech matin, sauts aprem.', duration: 'journée' },
    { title: 'Enduro Ebike',   description: 'Montées techniques.' },
  ],
};

describe('PrestationModal', () => {
  it('renders title, summary and formats when open', () => {
    render(<PrestationModal open prestation={fixture} onClose={() => {}} />);
    expect(screen.getByRole('heading', { name: /stage privé/i })).toBeInTheDocument();
    expect(screen.getByText(/journée complète/i)).toBeInTheDocument();
    expect(screen.getByText(/enduro & sauts/i)).toBeInTheDocument();
    expect(screen.getByText(/enduro ebike/i)).toBeInTheDocument();
  });

  it('renders duration and price chips when provided', () => {
    render(<PrestationModal open prestation={fixture} onClose={() => {}} />);
    expect(screen.getByText('journée')).toBeInTheDocument();
  });

  it('renders WhatsApp CTA', () => {
    render(<PrestationModal open prestation={fixture} onClose={() => {}} />);
    expect(screen.getByRole('link', { name: /whatsapp/i })).toBeInTheDocument();
  });

  it('calls onClose when ESC pressed', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<PrestationModal open prestation={fixture} onClose={onClose} />);
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('does not render when prestation is null', () => {
    render(<PrestationModal open prestation={null} onClose={() => {}} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
