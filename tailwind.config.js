/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],  theme: {
    extend: {
      colors: {
        'deep-black': '#0a0a0a',
        'dark-surface': '#1e1e1e', // Added lighter black from --background-dark
      },
    },
  },
  plugins: [
    typography,
  ],
}