/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./svelte/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
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
