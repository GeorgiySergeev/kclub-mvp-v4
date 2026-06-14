import type { Config } from 'tailwindcss';

// Example placeholder for shared tailwind config
export const sharedConfig: Omit<Config, 'content'> = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          900: '#134e4a',
        },
      },
    },
  },
  plugins: [],
};
