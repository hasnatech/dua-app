
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: false,
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx",
    "./resources/**/*.ts",
    "./resources/**/*.tsx",
    "./resources/**/*.vue",
  ],
  theme: {
    extend: {
      colors: {
        // The <alpha-value> placeholder is used by Tailwind for opacity
        primary: 'oklch(var(--color-primary) / <alpha-value>)',
        sidebar: 'hsl(var(--color-sidebar) / <alpha-value>)',
        active: 'var(--color-highlight)',
        icon: 'hsl(var(--color-icon) / <alpha-value>)',
        background: 'hsl(var(--color-bg) / <alpha-value>)',
        panel: 'hsl(var(--color-panel) / <alpha-value>)',
        foreground: 'hsl(var(--color-text) / <alpha-value>)',
        border: 'hsl(var(--color-border) / <alpha-value>)'
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.2s ease-out'
      },
      keyframes: {
        'fade-in-down': {
            '0%': { opacity: '0', transform: 'translateY(-10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    }
  },
  plugins: [],
}
