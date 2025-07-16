/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: false,
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",      // for Next.js 13+ app directory
    "./pages/**/*.{js,ts,jsx,tsx}",    // for pages directory if used
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
