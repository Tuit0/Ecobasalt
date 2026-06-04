/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Mineral Eco palitra — bazalt tosh (dark stone)
        // Legacy nomlari saqlanadi: onyx = dark stone, pearl = light text, gold = brand red
        onyx: {
          50:  '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',  // border
          800: '#292524',  // surface (cards)
          900: '#1c1917',  // asosiy fon (warm graphite)
          950: '#0c0a09',  // eng chuqur
        },
        // Brand qizil — signal aksent (CTA only)
        gold: {
          50:  '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#dc2626',
          500: '#dc2626',
          600: '#b91c1c',
          700: '#991b1b',
          800: '#7f1d1d',
          900: '#5b1414',
        },
        // Pearl — light text (oq)
        pearl: {
          50:  '#fafaf9',
          100: '#fafaf9',  // primary
          200: '#e7e5e4',  // secondary
          300: '#a8a29e',  // muted
        },
        // Forest — eco green sekundar aksent
        forest: {
          400: '#22c55e',
          500: '#16a34a',
          600: '#15803d',
          700: '#166534',
          800: '#14532d',
          900: '#052e16',
        },
      },
      fontFamily: {
        // Modern bold display
        display: ['var(--font-display)', 'Bricolage Grotesque', 'system-ui', 'sans-serif'],
        // Serif body uchun (display bilan bir xil — Bricolage italic ham bor)
        serif: ['var(--font-serif)', 'Bricolage Grotesque', 'system-ui', 'sans-serif'],
        // Sans — toza tipografika body uchun
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        // Mono — texnik raqamlar va detallar
        mono: ['var(--font-mono)', 'monospace'],
      },
      letterSpacing: {
        'luxury': '0.25em',
        'lux': '0.18em',
      },
      animation: {
        'shimmer-gold': 'shimmer-gold 6s linear infinite',
        'fade-up': 'fade-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'reveal': 'reveal 1.4s cubic-bezier(0.77, 0, 0.175, 1) forwards',
        'breath': 'breath 8s ease-in-out infinite',
        'marquee': 'marquee 40s linear infinite',
        'marquee-slow': 'marquee 80s linear infinite',
        'marquee-reverse': 'marquee-reverse 50s linear infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'orbit': 'orbit 30s linear infinite',
        'orbit-reverse': 'orbit 40s linear infinite reverse',
        'glow': 'glow 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
        'wiggle': 'wiggle 6s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
      },
      keyframes: {
        'shimmer-gold': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-up': {
          '0%':   { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        reveal: {
          '0%':   { clipPath: 'inset(0 100% 0 0)' },
          '100%': { clipPath: 'inset(0 0 0 0)' },
        },
        breath: {
          '0%, 100%': { opacity: 0.4, transform: 'scale(1)' },
          '50%': { opacity: 0.7, transform: 'scale(1.05)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%':   { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%':      { transform: 'translateY(-25px) rotate(3deg)' },
        },
        orbit: {
          '0%':   { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(220, 38, 38, 0.3), 0 0 40px rgba(220, 38, 38, 0.15)' },
          '50%':      { boxShadow: '0 0 50px rgba(220, 38, 38, 0.6), 0 0 100px rgba(220, 38, 38, 0.3)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
          '50%':      { opacity: 0.6, transform: 'scale(1.1)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%':      { transform: 'rotate(2deg)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};
