/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F8F7FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6', // Secondary purple
          600: '#6335F5', // Primary purple
          700: '#5225E0',
          800: '#4219C0',
          900: '#2E0F92',
          DEFAULT: '#6335F5',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          50: '#F8F7FF',
          100: '#F1F0FB',
          200: '#E8E7F0',
          card: '#FFFFFF',
        },
        heading: '#17153A', // Primary text
        body: '#77758B',    // Secondary text
        'text-primary': '#17153A',
        'text-secondary': '#77758B',
        'border-subtle': '#ECEAF8',
        'border-light': '#E5E3F0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(23, 21, 58, 0.04)',
        'card': '0 2px 8px -1px rgba(99, 53, 245, 0.05), 0 1px 3px -1px rgba(23, 21, 58, 0.03)',
        'card-hover': '0 12px 28px -4px rgba(99, 53, 245, 0.12), 0 4px 10px -2px rgba(23, 21, 58, 0.04)',
        'glow': '0 0 20px rgba(99, 53, 245, 0.18)',
        'glow-lg': '0 0 40px rgba(99, 53, 245, 0.28)',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(14px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
