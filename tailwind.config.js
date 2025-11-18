module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'border-border',
    'bg-border',
    'text-border',
  ],
  theme: {
    extend: {
      borderColor: {
        border: 'var(--border)',
      },
      colors: {
        border: 'var(--border)',
      },
    },
  },
  plugins: [],
}; 