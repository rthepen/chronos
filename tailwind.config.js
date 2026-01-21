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
        'nano-orange': '#FF9F1C',  // Neon Orange (Prepare/Warning)
        'nano-red': '#FF003C',     // Neon Red (Warning/Stop)
        'nano-gold': '#FFD700',    // Gold (Finish)
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', "Liberation Mono", "Courier New", 'monospace'],
      },
    },
  },
  plugins: [],
}
