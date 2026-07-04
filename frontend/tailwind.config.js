/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        isroBlue: '#0055A5',
        isroOrange: '#FF6C00'
      }
    },
  },
  plugins: [],
}