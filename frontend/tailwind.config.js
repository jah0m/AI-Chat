/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        secondary: "#E5E7EB",
        user: "#EBF8FF",
        assistant: "#F9FAFB",
      },
    },
  },
  plugins: [],
}
