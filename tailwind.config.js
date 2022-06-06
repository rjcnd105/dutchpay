module.exports = {
  content: ['./app/**/*.{ts,tsx,jsx,js}'],
  theme: {
    extend: {},
    colors: {
      'white': '#ffffff',
      'lightgrey100': '#F5F5F9',
      'lightgrey200': '#EEEEF1',
      'grey100': '#E8E8EB',
      'grey200': '#D4D4DA',
      'grey300': '#BCBCC1',
      'darkgrey300': '#8D8D92',
      'darkgrey200': '#4C4D4E',
      'darkgrey100': '#1C1C1C',

      'primary500': '#EAEDFF',
      'primary400': '#DBE0FF',
      'primary300': '#96A5FF',
      'primary200': '#4E67F8',
      'primary100': '#2F49E2',

      'orange300': '#FFF7E7',
      'orange200': '#FFD482',
      'orange100': '#FFB21D',

      'warning': '#FB6258',
      'success': '#2FB3FE'
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
      caption2: '12px'
    },
    fontWeight: {
      bold: '700',
      semibold: '600',
      regular: '400',
      light: '300',
      extralight: '200'
    },
    lineHeight: {
      m: '1.7'
    },
    letterSpacing: {
      tight: '-0.24px',
      tighter: '-0.5px'
    },
    spacing: { },
    boxShadow: { },
    opacity: {},
    borderRadius: {}
  },
  plugins: [],
}
