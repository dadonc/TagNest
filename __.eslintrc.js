/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
  extends: ["prettier"],
  plugins: ["simple-import-sort"],
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
  },
};
