/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'selector',
  content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // pageBg: '#27374D',
      // blockBg: '#526D82'
    },
  },
  plugins: [],
}