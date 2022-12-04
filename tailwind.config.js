const sizes = {
  0: '0',
  4: '4px',
  8: '8px',
  12: '12px',
  16: '16px',
  20: '20px',
  24: '24px',
  32: '32px',
  36: '36px',
  40: '40px',
  44: '44px',
  48: '48px',
  56: '56px',
  64: '64px',
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx,jsx,js}'],
  theme: {
    extend: {
      minWidth: sizes,
      minHeight: sizes,
      maxWidth: sizes,
      maxHeight: sizes,

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', visibility: 'hidden' },
          '1%': { visibility: 'visible' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '99%': { visibility: 'visible' },
          '100%': { opacity: '0', visibility: 'hidden' },
        },
      },
      animation: {
        fadeIn: 'fadeIn .25s ease-out',
        fadeOut: 'fadeIn .25s ease-out',
      },
    },
    colors: {
      white: '#ffffff',
      black: '#000000',
      lightgrey100: '#F5F5F9',
      lightgrey200: '#EEEEF1',
      grey100: '#E8E8EB',
      grey200: '#D4D4DA',
      grey300: '#BCBCC1',
      darkgrey100: '#8D8D92',
      darkgrey200: '#4C4D4E',
      darkgrey300: '#1C1C1C',

      primary50: '#EFEFF6',
      primary100: '#EAEDFF',
      primary200: '#DBE0FF',
      primary300: '#96A5FF',
      primary400: '#4E67F8',
      primary500: '#2F49E2',

      orange100: '#FFF7E7',
      orange200: '#FFD482',
      orange300: '#FFB21D',
      orange350: '#FFA800',

      warning: '#FB6258',
      success: '#2FB3FE',

      transparent: 'transparent',
    },
    fontFamily: {
      Pretendard: ['Pretendard', 'sans-serif'],
    },
    fontSize: {
      heading: '32px',
      title: '24px',
      subtitle: '20px',
      body1: '18px',
      body2: '16px',
      caption1: '14px',
      caption2: '12px',
      caption3: '9px',
    },
    fontWeight: {
      bold: '700',
      semibold: '600',
      regular: '400',
      light: '300',
      extralight: '200',
    },
    lineHeight: {
      m: '1.7',
    },
    letterSpacing: {
      tight: '-0.24px',
      tighter: '-0.5px',
    },
    spacing: sizes,
    boxShadow: {
      100: '0px -4px 12px rgba(0, 0, 0, 0.05)',
    },
    opacity: {
      0: 0,
      40: 0.4,
      100: 1,
    },
    borderWidth: {
      0: '0',
      1: '1px',
      2: '2px',
    },
    borderRadius: {
      4: '4px',
      8: '8px',
      12: '12px',
      26: '26px',
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
