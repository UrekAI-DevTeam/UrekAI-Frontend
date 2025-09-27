/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/ui/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors - Deep Blue Premium Palette
        primary: {
          DEFAULT: 'rgb(var(--color-blood-red) / <alpha-value>)',
          dark: 'rgb(var(--color-dark-red) / <alpha-value>)',
          bright: 'rgb(var(--color-crimson) / <alpha-value>)',
          light: 'rgb(var(--color-copper-orange) / <alpha-value>)',
        },
        
        // Background Colors
        background: {
          DEFAULT: 'rgb(var(--color-background) / <alpha-value>)',
          surface: 'rgb(var(--color-surface) / <alpha-value>)',
          'surface-secondary': 'rgb(var(--color-surface-secondary) / <alpha-value>)',
          'surface-tertiary': 'rgb(var(--color-surface-tertiary) / <alpha-value>)',
        },
        
        // Text Colors
        text: {
          primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
          muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
          light: 'rgb(var(--color-text-light) / <alpha-value>)',
          white: 'rgb(var(--color-text-white) / <alpha-value>)',
        },
        
        // Border Colors
        border: {
          DEFAULT: 'rgb(var(--color-border) / <alpha-value>)',
          light: 'rgb(var(--color-border-light) / <alpha-value>)',
          dark: 'rgb(var(--color-border-dark) / <alpha-value>)',
        },
        
        // Interactive Colors
        interactive: {
          hover: 'rgb(var(--color-hover) / <alpha-value>)',
          active: 'rgb(var(--color-active) / <alpha-value>)',
          focus: 'rgb(var(--color-focus) / <alpha-value>)',
        },
        
        // Status Colors
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
        info: 'rgb(var(--color-info) / <alpha-value>)',
        
        // Neutral Colors
        neutral: {
          'almost-black': 'rgb(var(--color-almost-black) / <alpha-value>)',
          'smoky-gray': 'rgb(var(--color-smoky-gray) / <alpha-value>)',
          charcoal: 'rgb(var(--color-charcoal) / <alpha-value>)',
          'slate-gray': 'rgb(var(--color-slate-gray) / <alpha-value>)',
          'light-gray': 'rgb(var(--color-light-gray) / <alpha-value>)',
        },
      },
      
      // Gradient Colors
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, rgb(var(--color-gradient-start)), rgb(var(--color-gradient-end)))',
        'gradient-primary-light': 'linear-gradient(to right, rgb(var(--color-gradient-light-start)), rgb(var(--color-gradient-light-end)))',
      },
    }
  },
  plugins: [],
};