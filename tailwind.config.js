/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sonic: {
          gold: '#FFD700',
          orange: '#FFA500',
          dark: '#0A0A0A',
          card: '#1A1A1A',
        }
      },
      fontFamily: {
        rajdhani: ['Rajdhani', 'sans-serif'],
        bebas: ['Bebas Neue', 'cursive'],
      }
    },
  },
  plugins: [],
}
