import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import VideoPlayer from './VideoPlayer.jsx';

describe('VideoPlayer', () => {
  it('renders a <video> with src and poster', () => {
    const { container } = render(<VideoPlayer src="/v.mp4" poster="/p.webp" label="démo" />);
    const video = container.querySelector('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('poster', '/p.webp');
    const source = video.querySelector('source');
    expect(source).toHaveAttribute('src', '/v.mp4');
    expect(source).toHaveAttribute('type', 'video/mp4');
  });

  it('applies muted, autoplay, loop, playsinline by default', () => {
    const { container } = render(<VideoPlayer src="/v.mp4" poster="/p.webp" label="démo" />);
    const video = container.querySelector('video');
    expect(video.muted).toBe(true);
    expect(video).toHaveAttribute('autoplay');
    expect(video).toHaveAttribute('loop');
    expect(video).toHaveAttribute('playsinline');
  });

  it('uses preload="none" by default', () => {
    const { container } = render(<VideoPlayer src="/v.mp4" poster="/p.webp" label="démo" />);
    expect(container.querySelector('video')).toHaveAttribute('preload', 'none');
  });

  it('accepts preload override', () => {
    const { container } = render(<VideoPlayer src="/v.mp4" poster="/p.webp" label="démo" preload="auto" />);
    expect(container.querySelector('video')).toHaveAttribute('preload', 'auto');
  });

  it('includes aria-label', () => {
    const { container } = render(<VideoPlayer src="/v.mp4" poster="/p.webp" label="Démo de stage privé" />);
    expect(container.querySelector('video')).toHaveAttribute('aria-label', 'Démo de stage privé');
  });
});
