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
        'brand-primary': '#7AA2F7',          // Tokyo Night Blue
        'brand-accent': '#7DCFFF',           // Tokyo Night Cyan
        'brand-secondary-accent': '#BB9AF7', // Tokyo Night Magenta
        'brand-muted': '#565F89',            // Tokyo Night Comment
        'bg-light': '#E1E2E7',               // Tokyo Night Day Background
        'bg-dark': '#1A1B26',                // Tokyo Night Night Background
        'card-light': '#FFFFFF',             // Elevated Light Surface
        'card-dark': '#24283B',              // Tokyo Night Surface
        'text-primary': '#1F2335',           // Tokyo Night Day Foreground
        'text-secondary': '#545C7E',         // Tokyo Night Muted Foreground
        'border-light': '#C0CAF5',           // Tokyo Night Day Border
        'border-dark': '#414868',            // Tokyo Night Night Border
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '0.75rem', // 12px (um pouco mais sutil que o anterior)
        'btn': '0.5rem',  // 8px
        'input': '0.5rem', // 8px, para consistência
      },
      boxShadow: {
        'soft': '0 2px 12px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 16px -2px rgba(0, 0, 0, 0.08), 0 2px 6px -2px rgba(0, 0, 0, 0.05)',
        'hover': '0 6px 20px -3px rgba(0, 0, 0, 0.09), 0 4px 8px -3px rgba(0, 0, 0, 0.06)',
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
