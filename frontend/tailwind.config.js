/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8eef5',
          100: '#c5d4e6',
          500: '#2d5a8e',
          600: '#1e3a5f',
          700: '#162d4a',
          800: '#0e1e32',
          900: '#070f19',
        },
        gold: {
          400: '#d4b86a',
          500: '#c9a84c',
          600: '#b8922e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
