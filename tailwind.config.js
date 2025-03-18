/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007ea7', // Reemplazo de primary
          light: '#5ab8d1', // Reemplazo de primary-light
          dark: '#005f7e', // Reemplazo de primary-dark
        },
      },
    },
  },
  plugins: [],
};
