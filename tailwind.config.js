/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#15514f', // nouveau vert foncé
          dark: '#0f3e3c',
          light: '#1a5f5c',
        },
        accent: {
          DEFAULT: '#f59e42', // orange accent
          dark: '#b45309',
        },
        success: '#22c55e',
        warning: '#fbbf24',
        danger: '#ef4444',
        surface: '#FCFCFC', // fond très clair
        muted: '#6B7280',
        secondary: "#3B82F6",
        light: "#F7F8FA",
        neutral: "#374151"
      },
      fontFamily: {
        sans: [
          'Inter', 'Geist', 'Geist Mono', 'ui-sans-serif', 'system-ui', 'sans-serif',
        ],
      },
      borderRadius: {
        xl: '1rem',
      },
      boxShadow: {
        focus: '0 0 0 3px #2563eb55',
      },
    },
  },
  plugins: [],
}