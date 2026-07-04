/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Outer page background (warm linen - the "desk" the phone sits on)
        pageBackground: '#EDE9E1',
        // Phone frame / app background
        background: '#FAFAF8',
        surface: '#FFFFFF',
        // Claude-inspired warm terracotta primary
        primary: '#C96442',
        primaryHover: '#A8512F',
        // Soft warm accent
        accent: '#C96442',
        // Text
        textMain: '#3D3929',
        textMuted: '#8C8A7D',
        // Inputs & borders
        inputBg: '#F5F3EF',
        borderColor: '#E8E4DC',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        phone: '2.5rem',
      }
    },
  },
  plugins: [],
}
