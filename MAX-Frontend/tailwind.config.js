/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#05070e',
          card: 'rgba(11, 17, 32, 0.65)',
          border: 'rgba(56, 189, 248, 0.15)',
          glow: 'rgba(6, 182, 212, 0.35)',
          accent: '#06b6d4',
          neonCyan: '#00f3ff',
          neonBlue: '#3b82f6',
          neonPurple: '#a855f7',
          neonEmerald: '#10b981'
        }
      },
      fontFamily: {
        cyber: ['Orbitron', 'sans-serif'],
        tech: ['Rajdhani', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 18s linear infinite',
        'spin-reverse': 'spin-reverse 24s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    },
  },
  plugins: [],
}
