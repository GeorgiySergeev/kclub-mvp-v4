import { Cormorant_Garamond, DM_Sans, JetBrains_Mono } from 'next/font/google';

export const displayFont = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-display',
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const bodyFont = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const monoFont = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
});

export const fontVariables = `${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`;
