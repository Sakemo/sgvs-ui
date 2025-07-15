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
        'brand-primary': '#00BFFF',          // Deep Sky Blue
        'brand-accent': '#7DF9FF',           // Electric Blue
        'brand-secondary-accent': '#8A2BE2', // Blue Violet
        'brand-muted': '#A3A3A3',            // Gray
        'bg-light': '#F8F9FA',               // Off-white
        'bg-dark': '#1A202C',                // Dark Slate
        'card-light': '#FFFFFF',             // White
        'card-dark': '#2D3748',              // Darker Slate
        'text-primary': '#1F2937',           // Dark Gray
        'text-secondary': '#6B7280',         // Medium Gray
        'border-light': '#E5E7EB',           // Light Gray
        'border-dark': '#4A5568',            // Lighter Dark Gray (ajustado de 700 para 600 para melhor contraste)
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