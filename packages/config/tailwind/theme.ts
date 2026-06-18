import type { Config } from 'tailwindcss';

export const kclubColors = {
  navy: {
    950: '#040812',
    900: '#0A0F1E',
    800: '#111827',
    700: '#1E293B',
    600: '#334155',
  },
  gold: {
    50: '#FBF6E8',
    100: '#F5E6C4',
    300: '#D4AF6A',
    500: '#C9A227',
    600: '#A8841A',
    700: '#8A6B14',
  },
  canvas: '#F8F7F4',
  paper: '#F1EFE8',
} as const;

export const sharedConfig: Omit<Config, 'content'> = {
  theme: {
    extend: {
      colors: {
        kclub: kclubColors,
        brand: {
          50: kclubColors.gold[50],
          100: kclubColors.gold[100],
          300: kclubColors.gold[300],
          500: kclubColors.gold[500],
          600: kclubColors.gold[600],
          700: kclubColors.gold[700],
          900: kclubColors.navy[900],
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        border: 'var(--border)',
        ring: 'var(--ring)',
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
      },
      fontFamily: {
        sans: ['var(--font-body)', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'Consolas', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        md: 'var(--radius-md)',
        sm: 'var(--radius-sm)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      boxShadow: {
        gold: '0 8px 32px rgba(201, 162, 39, 0.18)',
        panel: '0 12px 40px rgba(4, 8, 18, 0.12)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'border-beam': {
          '100%': { offsetDistance: '100%' },
        },
      },
      animation: {
        shimmer: 'shimmer 3s linear infinite',
        'gradient-shift': 'gradient-shift 6s ease infinite',
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
