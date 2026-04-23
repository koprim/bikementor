import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('theme tokens', () => {
  let css;
  beforeAll(() => {
    css = readFileSync(join(process.cwd(), 'src/styles/index.css'), 'utf8');
  });

  it('imports tailwindcss', () => {
    expect(css).toMatch(/@import\s+["']tailwindcss["']/);
  });

  it('defines light theme tokens', () => {
    expect(css).toMatch(/--color-bg:\s*#EBE6DD/);
    expect(css).toMatch(/--color-fg:\s*#161614/);
    expect(css).toMatch(/--color-accent:\s*#B23A26/);
  });

  it('defines dark theme tokens on [data-theme="dark"]', () => {
    expect(css).toMatch(/\[data-theme="dark"\]\s*\{[^}]*--color-bg:\s*#161614/s);
  });

  it('declares Hedvig Letters Serif as display font', () => {
    expect(css).toMatch(/--font-display:\s*["']Hedvig Letters Serif["']/);
  });

  it('respects prefers-reduced-motion', () => {
    expect(css).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  });
});
