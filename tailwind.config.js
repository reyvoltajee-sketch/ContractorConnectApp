module.exports = {
  content: ["./App.js"],
  // Use the nativewind dist preset path — EAS sometimes requires the dist entry
  presets: [require('nativewind/dist/tailwind')],
  theme: {
    extend: {},
  },
  plugins: [],
}