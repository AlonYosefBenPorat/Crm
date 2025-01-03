// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          light: '#1e3a8a',  // Light mode blue
          dark: '#93c5fd',    // Dark mode blue
        },
        gray: {
          light: '#64748b',   // Light mode gray
          dark: '#d1d5db',    // Dark mode gray
        },
      },
    },
  },
  darkMode: 'class', // Enables toggling dark mode with a class
};
