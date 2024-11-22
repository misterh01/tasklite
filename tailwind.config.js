const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "mainBackgroundColor": "#0D1117",
        "columnBackgroundColor": "#161C22",
        "brandColor": "#5d00ff"
      }
    },
  },
  darkMode: "class",
  plugins: [nextui({
    themes: {
      dark: {
        colors: {
          success: "#16a34a",
        },
      },
    }
  })],
}

