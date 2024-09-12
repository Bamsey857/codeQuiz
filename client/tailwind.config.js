/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        darkBG: "#141414",
        lightBG: "#ffffff",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
