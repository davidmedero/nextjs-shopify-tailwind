const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  mode: 'jit',
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
    borderRadius: ['responsive', 'first', 'last'],
    borderWidth: ['responsive', 'first', 'last']
  }
}
