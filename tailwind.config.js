/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx,html}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': '#7c3aed',
        'primary-dim': '#5b21b6',
        'primary-hover': '#6d28d9',
        // Dark mode colors
        'background-dark': '#000000',
        'card-dark': '#09090b',
        'surface-dark': '#0a0a0a',
        'border-dark': '#18181b',
        'text-main': '#e4e4e7',
        'text-muted': '#52525b',
        'text-secondary': '#71717a',
        'accent-dark': '#18181b',
        // Light mode colors
        'background-light': '#fafafa',
        'card-light': '#ffffff',
        'surface-light': '#f4f4f5',
        'border-light': '#e4e4e7',
        'text-light-main': '#18181b',
        'text-light-muted': '#71717a',
        'text-light-secondary': '#a1a1aa',
      },
      fontFamily: {
        'display': ['Space Grotesk', 'sans-serif'],
        'body': ['Noto Sans', 'sans-serif'],
      },
      borderRadius: {
        'DEFAULT': '0.25rem',
        'lg': '0.5rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '1.5rem',
        'full': '9999px',
      },
      boxShadow: {
        'glow': '0 0 20px -5px rgba(124, 58, 237, 0.3)',
        'neon': '0 0 25px -5px rgba(124, 58, 237, 0.4)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
