/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#09090B',
        sidebar: '#111114',
        card: '#18181B',
        'card-hover': '#202024',
        border: '#27272A',
        'border-light': '#3F3F46',
        accent: {
          violet: '#8B5CF6',
          'violet-dark': '#7C3AED',
          'violet-glow': 'rgba(139, 92, 246, 0.25)',
          cyan: '#22D3EE',
          'cyan-dark': '#06B6D4',
          'cyan-glow': 'rgba(34, 211, 238, 0.25)',
        },
        syntax: {
          keyword: '#F472B6',
          fn: '#60A5FA',
          string: '#34D399',
          number: '#FBBF24',
          comment: '#71717A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(139, 92, 246, 0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 25px rgba(34, 211, 238, 0.6))' },
        },
        'shimmer': {
          'from': { backgroundPosition: '200% 0' },
          'to': { backgroundPosition: '-200% 0' }
        }
      }
    },
  },
  plugins: [],
}
