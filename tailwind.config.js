/** @type {import('tailwindcss').Config} */
// Brand tokens measured from the live site. See docs/brand-tokens.md before adding anything here.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#002140', // primary
          cyan: '#00AFEF', // accent
          'cyan-form': '#30B0ED', // form submit buttons
        },
        ink: '#000000',
        surface: {
          page: '#F7F8F9',
          gray: '#EEEEEE',
        },
        line: {
          DEFAULT: '#D6D6D6',
          strong: '#1F2124',
          divider: '#BDBDBD',
        },
      },
      fontFamily: {
        serif: ['Merriweather', 'Georgia', 'serif'],
        sans: ['Sora', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        button: '12px',
        card: '22px',
      },
      maxWidth: {
        container: '1280px',
      },
    },
  },
  plugins: [],
};
