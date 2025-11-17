/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#8a2be2",
        "primary-light": "#9b4ee3",
        "primary-dark": "#6a1cb0",
        background: "#121212",
        "bg-secondary": "#1e1e1e",
        "bg-tertiary": "#252525",
        text: "#ffffff",
        "text-secondary": "#b3b3b3",
        success: "#4caf50",
        warning: "#ffc107",
        danger: "#f44336",
        info: "#2196f3",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      spacing: {
        sidebar: "250px",
      },
      borderRadius: {
        DEFAULT: "12px",
      },
      boxShadow: {
        DEFAULT: "0 4px 12px rgba(0, 0, 0, 0.3)",
      },
      transitionProperty: {
        DEFAULT: "all",
      },
      transitionDuration: {
        DEFAULT: "300ms",
      },
      transitionTimingFunction: {
        DEFAULT: "ease",
      },
    },
  },
  plugins: [],
}