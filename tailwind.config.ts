/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{vue,js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        base: '#0d0f14',
        surface: '#13151b',
        elevated: '#171a22',
        hover: 'rgb(255 255 255 / 0.04)',
        border: 'rgb(255 255 255 / 0.10)',
        soft: 'rgb(255 255 255 / 0.05)',
        muted: 'rgb(255 255 255 / 0.55)',
        dim: 'rgb(255 255 255 / 0.80)',
        subtle: 'rgb(255 255 255 / 0.45)',
        main: 'rgb(255 255 255 / 0.92)',
        positive: '#00d743',
        negative: '#ff3b30'
      }
    }
  },
  plugins: []
}
