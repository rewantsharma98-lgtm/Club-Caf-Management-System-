import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0b',
        surface: '#131316',
        elevated: '#1a1a1e',
        border: '#2a2a2e',
        cream: {
          DEFAULT: '#f5f2eb',
          muted: '#a8a49c',
        },
        gold: {
          DEFAULT: '#c4a574',
          light: '#d9c49a',
          muted: '#8f7d54',
        },
        slate: {
          DEFAULT: '#6b6b73',
          light: '#94949c',
        },
        midnight: '#0a0a0b',
        navy: '#111113',
        charcoal: '#131316',
        cyan: {
          DEFAULT: '#c4a574',
          glow: '#d9c49a',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.35)',
        'soft-lg': '0 4px 12px rgba(0,0,0,0.45), 0 24px 48px rgba(0,0,0,0.4)',
        panel: '0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 32px rgba(0,0,0,0.35)',
        glow: '0 8px 32px rgba(0,0,0,0.35)',
        'glow-lg': '0 16px 48px rgba(0,0,0,0.45)',
        card: '0 8px 32px rgba(0,0,0,0.4)',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
