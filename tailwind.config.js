/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        abhaya: ['"Abhaya Libre"', 'serif'],
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
         Inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
  require('tailwind-scrollbar-hide')
]

}
