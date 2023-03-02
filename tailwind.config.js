module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1a1a1a',
        secondary: '#f2f2f2',
        accent: '#ffcc00',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      padding: {
        '1/2': '0.125rem',
        '1/3': '0.0833rem',
        '2/3': '0.1667rem',
        '1/4': '0.0625rem',
        '2/4': '0.125rem',
        '3/4': '0.1875rem',
      },
      margin: {
        '1/2': '0.125rem',
        '1/3': '0.0833rem',
        '2/3': '0.1667rem',
        '1/4': '0.0625rem',
        '2/4': '0.125rem',
        '3/4': '0.1875rem',
      },
      fontSize: {
        '7xl': '5rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};