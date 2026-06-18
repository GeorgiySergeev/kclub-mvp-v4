import { sharedConfig } from '@kclub/config/tailwind/theme';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}', './messages/**/*.json'],
  presets: [sharedConfig],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
