/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Cormorant Garamond'", "Georgia", "serif"],
        body: ["'Instrument Sans'", "system-ui", "sans-serif"],
      },
      colors: {
        void: "#0a0a0a",
        "void-2": "#111111",
        "void-3": "#1a1a1a",
        pearl: "#f0ede8",
        "pearl-dim": "#b8b4ae",
        accent: "#e8d5b0",
      },
    },
  },
  plugins: [],
};
