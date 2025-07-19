import { cva } from "class-variance-authority";

export const badgeVariants = cva(
    // Estilos base
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                default: 'border-transparent text-white',
                secondary: 'border-transparent bg-brand-secondary-accent text-white',
                destructive: 'border-transparent bg-red-600 text-white',
                outline: 'text-text-primary dark:text-gray-100',
                subtle: 'border-transparent',
            },
            colorScheme: {
                gray:      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
                green:     'bg-green-600 text-white dark:bg-green-700',
                blue:      'bg-brand-primary text-white dark:bg-blue-700',
                yellow:    'bg-yellow-500 text-white dark:bg-yellow-600',
            },
        },
        compoundVariants: [
            { variant: 'subtle', colorScheme: 'gray', className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200' },
            { variant: 'subtle', colorScheme: 'green', className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
            { variant: 'subtle', colorScheme: 'yellow', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' },
            { variant: 'subtle', colorScheme: 'blue', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' },
            { variant: 'outline', colorScheme: 'gray', className: 'border-border-light dark:border-border-dark' },
            { variant: 'outline', colorScheme: 'green', className: 'text-green-600 border-green-300 dark:text-green-400 dark:border-green-800' },
            { variant: 'outline', colorScheme: 'yellow', className: 'text-yellow-600 border-yellow-300 dark:text-yellow-400 dark:border-yellow-800' },
            { variant: 'outline', colorScheme: 'blue', className: 'text-blue-600 border-blue-300 dark:text-blue-400 dark:border-blue-800' },
        ],
        defaultVariants: {
            variant: 'default',
            colorScheme: 'blue'
        },
    }
);