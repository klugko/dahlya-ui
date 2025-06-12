/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  extend: {
    // Définition des keyframes pour les animations
    keyframes: {
      'fade-in-down': {
        '0%': {
          opacity: '0',
          transform: 'translateY(-20px)'
        },
        '100%': {
          opacity: '1',
          transform: 'translateY(0)'
        },
      },
      'fade-in-up': {
        '0%': {
          opacity: '0',
          transform: 'translateY(20px)'
        },
        '100%': {
          opacity: '1',
          transform: 'translateY(0)'
        },
      },
      'fade-in-up-delay': { // Une animation avec un délai pour le CTA
        '0%': {
          opacity: '0',
          transform: 'translateY(20px)'
        },
        '100%': {
          opacity: '1',
          transform: 'translateY(0)'
        },
      }
    },
    // Application des keyframes comme classes d'animation
    animation: {
      'fade-in-down': 'fade-in-down 0.7s ease-out forwards', // 'forwards' maintient l'état final
      'fade-in-up': 'fade-in-up 0.7s ease-out 0.3s forwards', // Délai de 0.3s
      'fade-in-up-delay': 'fade-in-up-delay 0.7s ease-out 0.6s forwards', // Délai plus long pour le CTA
    }
  },
  plugins: [], 
}
