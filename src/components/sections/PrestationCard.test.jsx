import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PrestationCard from './PrestationCard.jsx';

const fixture = {
  slug: 'stage-prive',
  title: 'Stage privé',
  tagline: 'Coaching personnalisé.',
  poster: '/posters/stage-prive.webp',
  videoSrc: '/videos/stage-prive.mp4',
  summary: '…',
  formats: [],
};

describe('PrestationCard', () => {
  it('renders title and tagline', () => {
    render(<PrestationCard prestation={fixture} index={0} onOpen={() => {}} />);
    expect(screen.getByRole('heading', { name: /stage privé/i })).toBeInTheDocument();
    expect(screen.getByText(/coaching personnalisé/i)).toBeInTheDocument();
  });

  it('calls onOpen when clicked', async () => {
    const onOpen = vi.fn();
    const user = userEvent.setup();
    render(<PrestationCard prestation={fixture} index={0} onOpen={onOpen} />);
    await user.click(screen.getByRole('button', { name: /stage privé/i }));
    expect(onOpen).toHaveBeenCalledWith(fixture);
  });

  it('calls onOpen on Enter key', async () => {
    const onOpen = vi.fn();
    const user = userEvent.setup();
    render(<PrestationCard prestation={fixture} index={0} onOpen={onOpen} />);
    screen.getByRole('button', { name: /stage privé/i }).focus();
    await user.keyboard('{Enter}');
    expect(onOpen).toHaveBeenCalledWith(fixture);
  });
});
