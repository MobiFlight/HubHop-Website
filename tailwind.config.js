module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Assistant", "Helvetica", "Arial", "sans-serif"],
      },
      colors: {
        mfBlue: "#3366cc",
        hhBG: "#33353e",
        hhCard: "#545963",
        hhText: "#D2D0D2",
        hhIcons: "#F9E7E7",
        hhOrange: "#ffa047",
        hhOrangeShade: {
          100: "#ffe2c6",
          200: "#ffd5ad",
          300: "#ffc793",
          400: "#ffba7a",
          500: "#ffa047",
          600: "#ff932d",
          700: "#ff8614",
          800: "#f97900",
          900: "#e06c00",
        },
      },
    },
  },
  plugins: [],
};
