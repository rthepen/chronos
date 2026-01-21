/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nano-bg': '#0f172a',      // Slate 900
        'nano-surface': '#1e293b', // Slate 800
        'nano-green': '#39FF14',   // Neon Green (Active Work)
        'nano-blue': '#00F0FF',    // Neon Blue (Rest)
        'nano-red': '#FF003C',     // Neon Red (Warning/Stop)
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', "Liberation Mono", "Courier New", 'monospace'],
      },
    },
  },
  plugins: [],
}
