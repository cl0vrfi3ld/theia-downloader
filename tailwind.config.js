module.exports = {
  mode: "jit",
  // you dont need `purge: enabled: production` beca
  // purge: [],
  purge: {
    enabled: false,
    enabled: !process.env.ROLLUP_WATCH,
    content: [
      "./src/renderer/public/index.html",
      "./src/renderer/App.svelte",
      "./src/renderer/components/*.svelte",
      "./src/renderer/pages/*.svelte",
    ],
    options: {
      defaultExtractor: (content) => [
        ...(content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []),
        ...(content.match(/(?<=class:)[^=>\/\s]*/g) || []),
      ],
    },
  },
  darkMode: "class",
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
};
