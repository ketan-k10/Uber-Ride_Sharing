/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a', // Deep slate
        surface: '#1e293b', 
        primary: '#3b82f6', // Neon Blue
        primaryHover: '#2563eb',
        accent: '#8b5cf6', // Neon Purple
        textMain: '#f8fafc',
        textMuted: '#94a3b8',
        inputBg: '#334155'
      }
    },
  },
  plugins: [],
}
