import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-btn font-semibold ring-offset-bg-light dark:ring-offset-bg-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200',
    {
        variants: {
            variant: {
                primary: 'bg-brand-primary text-text-primary hover:bg-brand-accent active:bg-brand-accent shadow-soft dark:bg-accent-dark-green dark:text-text-dark-primary dark:hover:bg-accent-dark-green dark:active:bg-accent-dark-green/90',
                secondary: 'bg-card-light dark:bg-bg-dark-tertiary border border-border-light dark:border-border-dark-subtle text-text-primary dark:text-text-dark-primary hover:bg-brand-primary/10 dark:hover:bg-accent-dark-green/10 dark:hover:border-accent-dark-green/30',
                danger: 'bg-red-600 text-white hover:bg-red-700 shadow-soft dark:bg-accent-dark-red/80 dark:text-text-dark-primary dark:hover:bg-accent-dark-red',
                ghost: 'hover:bg-brand-primary/10 dark:hover:bg-bg-dark-tertiary dark:text-text-dark-secondary',
                link: 'text-brand-primary underline-offset-4 hover:underline p-0 h-auto dark:text-accent-dark-green dark:hover:text-accent-dark-green/80',
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
