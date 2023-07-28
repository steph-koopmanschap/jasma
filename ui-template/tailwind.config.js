/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin');
export default {
  content: [
    "./index.html",
    "./js/**/*.js",
    "./pages/**/*.html"
  ],
  darkMode:"class",
  theme: {
    extend: {
      colors:{
        background:{
          DEFAULT : "var(--background)",
          card : "var(--card)",
          card_inside : "var(--card-inside)",
        },
        foreground:{
          DEFAULT : "var(--heading3)",
          heading1:"var(--heading1)",
          heading2:"var(--heading2)",
          heading3:"var(--heading3)",
          heading4:"var(--heading4)",
          heading5:"var(--heading5)"
        },
        bdr:{
          DEFAULT: "var(--bdr)"
        }
      },
      zIndex:{
        60:"60",
        70:"70",
        80:"80"
      },
      screens:{
        xs:"330px"
      }
    },
  },
  plugins: [
    plugin(function({ addVariant }) {
        addVariant('children', '&>*')
      })
  ],
}

