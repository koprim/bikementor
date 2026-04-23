import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal.jsx';

describe('Modal', () => {
  afterEach(() => cleanup());
  it('does not render when open=false', () => {
    render(<Modal open={false} onClose={() => {}} labelledBy="t"><h2 id="t">Hi</h2></Modal>);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders dialog with aria attributes when open', () => {
    render(<Modal open onClose={() => {}} labelledBy="title-id"><h2 id="title-id">Hi</h2></Modal>);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'title-id');
  });

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Modal open onClose={onClose} labelledBy="t"><h2 id="t">Hi</h2></Modal>);
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when scrim is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Modal open onClose={onClose} labelledBy="t"><h2 id="t">Hi</h2></Modal>);
    await user.click(screen.getByTestId('modal-scrim'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders close button that calls onClose', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Modal open onClose={onClose} labelledBy="t"><h2 id="t">Hi</h2></Modal>);
    await user.click(screen.getByRole('button', { name: /fermer/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
