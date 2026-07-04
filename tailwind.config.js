/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic tokens (auto-adapt via CSS variables where possible)
        brand: {
          50: '#EEF1FF',
          100: '#DDE3FF',
          200: '#BAC7FF',
          300: '#8FA3FF',
          400: '#5F7CFF',
          500: '#3757FF',
          600: '#2340F0',
          700: '#1A31C4',
          800: '#182A9E',
          900: '#182878',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#0B0B0F',
        },
        elevated: {
          light: '#F7F7FA',
          dark: '#16161C',
        },
        border: {
          light: '#E5E5EA',
          dark: '#2A2A32',
        },
        muted: {
          light: '#8E8E93',
          dark: '#8A8A94',
        },
        text: {
          light: '#0B0B0F',
          dark: '#F5F5F7',
        },
      },
      fontFamily: {
        sans: ['System'],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
        '3xl': '28px',
      },
      spacing: {
        18: '4.5rem',
      },
    },
  },
  plugins: [],
};
