/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    borderRadius: {
      none: '0',
      sm: '0.0625rem',  // 1px
      DEFAULT: '0.125rem', // 2px
      md: '0.125rem', // 2px
      lg: '0.25rem', // 4px
      xl: '0.375rem', // 6px
      '2xl': '0.5rem', // 8px
      '3xl': '0.625rem', // 10px
      full: '9997px',
      card: '0.375rem', // 6px
      btn: '0.25rem', // 4px
      input: '0.25rem', // 4px
    },
    extend: {
      colors: {
        // Brand Colors
        'brand-primary': '#53B154',          // Accent Green
        'brand-accent': '#418C46',           // Darker Accent Green
        'brand-secondary-accent': '#84C97F', // Soft Green Tint
        'brand-muted': '#8A817B',            // Warm Neutral
        
        // Light Mode
        'bg-light': '#F7F1ED',               // Soft Off-White
        'card-light': '#FFFCFA',             // Elevated Light Surface
        'text-primary': '#1E1E1E',           // Charcoal
        'text-secondary': '#4F5C54',         // Soft Neutral Green
        'border-light': '#E2DAD4',           // Warm Border
        
        // Dark Mode - Improved Palette
        'bg-dark': '#0F1419',                // Very Dark Base (almost black, slightly blue-tinted)
        'bg-dark-secondary': '#1A1F28',      // Slightly elevated surface
        'bg-dark-tertiary': '#242B36',       // Even lighter surface for depth
        'card-dark': '#151B24',              // Card base (subtle elevation)
        'card-dark-hover': '#1E2534',        // Card hover state
        'card-dark-accent': '#1F3A34',       // Subtle green-tinted elevated surface
        'text-dark-primary': '#E8E9EB',      // Bright text for primary content
        'text-dark-secondary': '#A0A6AE',    // Muted text for secondary content
        'text-dark-tertiary': '#7A8190',     // Very muted text for hints
        'border-dark': '#2A3139',             // Stronger borders for clarity
        'border-dark-subtle': '#1F2633',     // Subtle borders
        
        // Dark Mode - Accent Variations
        'accent-dark-green': '#5DBF6F',      // Bright green for dark mode
        'accent-dark-green-muted': '#3A8B4C', // Muted green
        'accent-dark-blue': '#4A9FD8',       // Secondary accent
        'accent-dark-red': '#E85555',        // Status/error
        'accent-dark-yellow': '#F5B956',     // Warning
        'accent-dark-success': '#5DBF6F',    // Success
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 12px 28px -24px rgba(30, 30, 30, 0.28), 0 8px 18px -24px rgba(83, 177, 84, 0.18)',
        'card': '0 18px 42px -30px rgba(30, 30, 30, 0.32), 0 10px 22px -24px rgba(1, 47, 34, 0.22)',
        'hover': '0 24px 52px -32px rgba(30, 30, 30, 0.38), 0 12px 28px -26px rgba(83, 177, 84, 0.2)',
      },
      spacing: {
        'section': '4rem',
        'card-padding': '1.5rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
