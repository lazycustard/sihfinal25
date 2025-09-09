/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-green': '#2f6f3b',
        'warm-brown': '#8b5e3c',
        'cream': '#f7f1e5',
        'earth-yellow': '#e9c46a',
      },
      fontFamily: {
        'heading': ['Merriweather', 'Georgia', 'Times New Roman', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
