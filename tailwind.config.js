// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        'pastel-blue': '#a3cef1',
        'pastel-purple': '#b39ddb',
        'pastel-green': '#a8e6cf',
        'dark-bg': '#2b2b2b',
        'highlight-add': 'rgba(0, 255, 0, 0.2)',
        'highlight-remove': 'rgba(255, 0, 0, 0.2)'
      }
    }
  },
  plugins: []
}
