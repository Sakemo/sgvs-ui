import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-btn font-semibold ring-offset-bg-light dark:ring-offset-bg-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
    {
        variants: {
            variant: {
                primary: 'bg-brand-primary text-white hover:bg-brand-primary/90 shadow-soft',
                secondary: 'bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark text-text-primary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60',
                danger: 'bg-red-600 text-white hover:bg-red-700 shadow-soft',
                ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800/50',
                link: 'text-brand-primary underline-offset-4 hover:underline p-0 h-auto',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-md px-3',
                lg: 'h-11 rounded-md px-8',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'default',
        },
    }
);