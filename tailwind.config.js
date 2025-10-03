/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    // './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    // './src/ui/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Font Families
      fontFamily: {
        sans: ['var(--font-family-sans)'],
        mono: ['var(--font-family-mono)'],
        display: ['var(--font-family-display)'],
      },
      
      // Enhanced Typography System - 5 Levels
      fontSize: {
        'text-1': ['var(--text-1-size)', { lineHeight: 'var(--text-1-line-height)', letterSpacing: 'var(--text-1-spacing)' }],
        'text-2': ['var(--text-2-size)', { lineHeight: 'var(--text-2-line-height)', letterSpacing: 'var(--text-2-spacing)' }],
        'text-3': ['var(--text-3-size)', { lineHeight: 'var(--text-3-line-height)', letterSpacing: 'var(--text-3-spacing)' }],
        'text-4': ['var(--text-4-size)', { lineHeight: 'var(--text-4-line-height)', letterSpacing: 'var(--text-4-spacing)' }],
        'text-5': ['var(--text-5-size)', { lineHeight: 'var(--text-5-line-height)', letterSpacing: 'var(--text-5-spacing)' }],
        // Legacy sizes for backward compatibility
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem', { lineHeight: '1.6' }],
        'lg': ['1.125rem', { lineHeight: '1.5' }],
        'xl': ['1.25rem', { lineHeight: '1.4' }],
        '2xl': ['1.5rem', { lineHeight: '1.3' }],
        '3xl': ['1.875rem', { lineHeight: '1.2' }],
        '4xl': ['2.25rem', { lineHeight: '1.1' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      
      // Font Weights
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
      
      // Line Heights
      lineHeight: {
        none: '1',
        tight: '1.25',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2',
      },
      
      // Letter Spacing
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
      
      // Enhanced Color System - Priority-based
      colors: {
        // Primary Brand Colors
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          dark: 'rgb(var(--color-primary-dark) / <alpha-value>)',
          light: 'rgb(var(--color-primary-light) / <alpha-value>)',
          lighter: 'rgb(var(--color-primary-lighter) / <alpha-value>)',
          lightest: 'rgb(var(--color-primary-lightest) / <alpha-value>)',
        },
        
        // White Shades - Priority-based
        white: {
          1: 'rgb(var(--color-white-1) / <alpha-value>)',
          2: 'rgb(var(--color-white-2) / <alpha-value>)',
          3: 'rgb(var(--color-white-3) / <alpha-value>)',
          4: 'rgb(var(--color-white-4) / <alpha-value>)',
          5: 'rgb(var(--color-white-5) / <alpha-value>)',
        },
        
        // Dark Shades - Priority-based
        dark: {
          1: 'rgb(var(--color-dark-1) / <alpha-value>)',
          2: 'rgb(var(--color-dark-2) / <alpha-value>)',
          3: 'rgb(var(--color-dark-3) / <alpha-value>)',
          4: 'rgb(var(--color-dark-4) / <alpha-value>)',
          5: 'rgb(var(--color-dark-5) / <alpha-value>)',
        },
        
        // Background Colors
        background: {
          DEFAULT: 'rgb(var(--color-background) / <alpha-value>)',
          surface: 'rgb(var(--color-background-surface) / <alpha-value>)',
          'surface-secondary': 'rgb(var(--color-background-surface-secondary) / <alpha-value>)',
          'surface-tertiary': 'rgb(var(--color-background-surface-tertiary) / <alpha-value>)',
          muted: 'rgb(var(--color-background-muted) / <alpha-value>)',
        },
        
        // Text Colors - Priority-based
        text: {
          primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--color-text-tertiary) / <alpha-value>)',
          muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
          disabled: 'rgb(var(--color-text-disabled) / <alpha-value>)',
          white: 'rgb(var(--color-text-white) / <alpha-value>)',
        },
        
        // Border Colors
        border: {
          DEFAULT: 'rgb(var(--color-border) / <alpha-value>)',
          light: 'rgb(var(--color-border-light) / <alpha-value>)',
          dark: 'rgb(var(--color-border-dark) / <alpha-value>)',
          muted: 'rgb(var(--color-border-muted) / <alpha-value>)',
        },
        
        // Interactive Colors
        hover: 'rgb(var(--color-hover) / <alpha-value>)',
        active: 'rgb(var(--color-active) / <alpha-value>)',
        focus: 'rgb(var(--color-focus) / <alpha-value>)',
        selected: 'rgb(var(--color-selected) / <alpha-value>)',
        
        // Status Colors
        success: {
          DEFAULT: 'rgb(var(--color-success) / <alpha-value>)',
          light: 'rgb(var(--color-success-light) / <alpha-value>)',
          dark: 'rgb(var(--color-success-dark) / <alpha-value>)',
          bg: 'rgb(var(--color-success-bg) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'rgb(var(--color-warning) / <alpha-value>)',
          light: 'rgb(var(--color-warning-light) / <alpha-value>)',
          dark: 'rgb(var(--color-warning-dark) / <alpha-value>)',
          bg: 'rgb(var(--color-warning-bg) / <alpha-value>)',
        },
        error: {
          DEFAULT: 'rgb(var(--color-error) / <alpha-value>)',
          light: 'rgb(var(--color-error-light) / <alpha-value>)',
          dark: 'rgb(var(--color-error-dark) / <alpha-value>)',
          bg: 'rgb(var(--color-error-bg) / <alpha-value>)',
        },
        info: {
          DEFAULT: 'rgb(var(--color-info) / <alpha-value>)',
          light: 'rgb(var(--color-info-light) / <alpha-value>)',
          dark: 'rgb(var(--color-info-dark) / <alpha-value>)',
          bg: 'rgb(var(--color-info-bg) / <alpha-value>)',
        },
        
        // Legacy color mappings for backward compatibility
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          secondary: 'rgb(var(--color-surface-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--color-surface-tertiary) / <alpha-value>)',
        },
      },
      
      // Spacing
      spacing: {
        '0': 'var(--spacing-0)',
        '1': 'var(--spacing-1)',
        '2': 'var(--spacing-2)',
        '3': 'var(--spacing-3)',
        '4': 'var(--spacing-4)',
        '5': 'var(--spacing-5)',
        '6': 'var(--spacing-6)',
        '8': 'var(--spacing-8)',
        '10': 'var(--spacing-10)',
        '12': 'var(--spacing-12)',
        '16': 'var(--spacing-16)',
        '20': 'var(--spacing-20)',
        '24': 'var(--spacing-24)',
        '32': 'var(--spacing-32)',
      },
      
      // Border Radius
      borderRadius: {
        'none': 'var(--radius-none)',
        'sm': 'var(--radius-sm)',
        'DEFAULT': 'var(--radius-base)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
        'full': 'var(--radius-full)',
      },
      
      // Enhanced Box Shadow System
      boxShadow: {
        'xs': 'var(--shadow-xs)',
        'sm': 'var(--shadow-sm)',
        'DEFAULT': 'var(--shadow-md)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        'inner': 'var(--shadow-inner)',
        'soft': 'var(--shadow-soft)',
        'glow': 'var(--shadow-glow)',
        'focus': 'var(--shadow-focus)',
      },
      
      // Background Images
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-primary-subtle': 'var(--gradient-primary-subtle)',
        'gradient-surface': 'var(--gradient-surface)',
        'gradient-muted': 'var(--gradient-muted)',
      },
    }
  },
  plugins: [],
};