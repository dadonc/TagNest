/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./svelte/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        fadeBg: "rgba(17, 24, 39, 0.5)", // bg-gray-900 50% opacity
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/forms")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/colors/themes")["[data-theme=light]"],
        },
      },
      {
        dark: {
          ...require("daisyui/src/colors/themes")["[data-theme=dark]"],
          // "base-200": "rgb(58, 58, 58)",
        },
      },
    ],
  },
};
