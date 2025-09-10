/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "../frontend/index.html",
    "../frontend/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'deep-green': '#2f6f3b',
        'warm-brown': '#8b5e3c',
        'cream': '#f7f1e5',
        'earth-yellow': '#e9c46a',
      },
      fontFamily: {
        'serif': ['Merriweather', 'Georgia', 'Times New Roman', 'serif'],
      },
      animation: {
        'pulse-mic': 'pulse-mic 1s ease-in-out infinite',
        'listening-wave': 'listening-wave 0.8s ease-in-out infinite',
        'shine': 'shine 3s infinite',
      },
      keyframes: {
        'pulse-mic': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        'listening-wave': {
          '0%, 100%': { height: '4px' },
          '50%': { height: '12px' },
        },
        'shine': {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
      },
    },
  },
  plugins: [],
}

