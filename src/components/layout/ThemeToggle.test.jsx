import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from './ThemeToggle.jsx';

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.setAttribute('data-theme', 'light');
  });

  it('renders a button with aria-label announcing the target theme', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button', { name: /mode sombre/i })).toBeInTheDocument();
  });

  it('toggles data-theme when clicked', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    await user.click(screen.getByRole('button'));
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    await user.click(screen.getByRole('button'));
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('announces target theme in aria-label after toggle', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button').getAttribute('aria-label')).toMatch(/mode clair/i);
  });
});
