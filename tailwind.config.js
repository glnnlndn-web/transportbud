export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: '#00d9ff',
          pink: '#ff006e',
          lime: '#39ff14',
          blue: '#0080ff',
          purple: '#d946ef',
        },
        dark: {
          bg: '#0a0e27',
          card: '#1a1f3a',
          border: '#2d3561',
        },
      },
      boxShadow: {
        neon: '0 0 20px rgba(0, 217, 255, 0.5)',
        'neon-pink': '0 0 20px rgba(255, 0, 110, 0.5)',
        'neon-lime': '0 0 20px rgba(57, 255, 20, 0.5)',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};