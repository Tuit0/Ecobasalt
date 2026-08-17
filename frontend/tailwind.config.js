/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '400px',   // kichik mobile (Hero title uchun)
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Industrial Luxury palitra — chuqur bazalt + oxblood brand
        // Legacy nomlari saqlanadi: onyx = dark stone, pearl = light text, gold = brand red
        onyx: {
          50:  '#f5f1ec',
          100: '#e8e3de',
          200: '#c4beb8',
          300: '#a8a29e',
          400: '#8a847f',
          500: '#5c5651',
          600: '#3d3735',
          700: '#2a2624',  // border
          800: '#1a1716',  // surface (cards)
          900: '#0c0a09',  // asosiy fon (deep onyx)
          950: '#050505',  // drama background
        },
        // Brand oxblood qizil — premium industrial (Tesla/Audi/Ferrari uslubi)
        gold: {
          50:  '#fef2f3',
          100: '#fde6e8',
          200: '#fbcfd3',
          300: '#f6a4ac',  // soft hover
          400: '#a91d2a',  // PRIMARY — oxblood (komponentlarda asosiy)
          500: '#a91d2a',  // primary alias
          600: '#7d1820',  // deep accent
          700: '#601319',
          800: '#460f13',
          900: '#2d090c',
        },
        // Pearl — warm ivory text
        pearl: {
          50:  '#fdfaf6',
          100: '#f5f1ec',  // primary text
          200: '#e8e3de',  // secondary
          300: '#c4beb8',  // tertiary
          400: '#8a847f',  // muted
        },
        // Forest — eco aksent (juda muted, faqat sertifikat/success uchun)
        forest: {
          400: '#4a8568',
          500: '#2a5c40',
          600: '#1d3a2a',
          700: '#162c20',
          800: '#0f1f17',
          900: '#08120d',
        },
      },
      fontFamily: {
        // Industrial Display — Inter Tight (premium engineering)
        display: ['var(--font-display)', 'Inter Tight', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Inter Tight', 'Inter', 'system-ui', 'sans-serif'],
        // Body — toza Inter
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        // Mono — texnik raqamlar
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
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
          '0%, 100%': { boxShadow: '0 0 20px rgba(169, 29, 42, 0.35), 0 0 40px rgba(169, 29, 42, 0.18)' },
          '50%':      { boxShadow: '0 0 50px rgba(169, 29, 42, 0.55), 0 0 100px rgba(169, 29, 42, 0.28)' },
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
