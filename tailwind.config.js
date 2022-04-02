const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      'xs': '500px',
      'xxs': '320px',
      ...defaultTheme.screens,
    },
  },
  variants: {
    borderRadius: ['first', 'last']
  },
  plugins: [],
}
