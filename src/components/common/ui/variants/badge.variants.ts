import { cva } from "class-variance-authority";

export const badgeVariants = cva(
    // Estilos base
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 gap-2',
    {
        variants: {
            variant: {
                default: 'border-transparent text-white dark:bg-bg-dark-tertiary dark:text-text-dark-primary',
                secondary: 'border-transparent bg-brand-secondary-accent text-text-primary dark:bg-accent-dark-green/25 dark:text-accent-dark-green',
                destructive: 'border-transparent bg-red-600 text-white dark:bg-accent-dark-red/40 dark:text-accent-dark-red',
                outline: 'text-text-primary border-border-light dark:text-text-dark-primary dark:border-border-dark-subtle',
                subtle: 'border-transparent px-2 flex items-center justify-between',
            },
            colorScheme: {
                gray:      'bg-[#EFE7E2] text-[#4F5C54] dark:bg-bg-dark-tertiary dark:text-text-dark-secondary',
                green:     'bg-brand-primary text-text-primary dark:bg-accent-dark-green dark:text-text-dark-primary',
                blue:      'bg-[#012F22] text-[#F7F1ED] dark:bg-accent-dark-blue/30 dark:text-accent-dark-blue',
                yellow:    'bg-[#DCE8D4] text-text-primary dark:bg-accent-dark-yellow/25 dark:text-accent-dark-yellow',
                red:       'bg-red-500 text-white dark:bg-accent-dark-red/40 dark:text-accent-dark-red',
                purple:    'bg-[#1E1E1E] text-[#F7F1ED] dark:bg-border-dark dark:text-text-dark-primary',
                orange:    'bg-[#4F6F45] text-[#F7F1ED] dark:bg-accent-dark-yellow/30 dark:text-accent-dark-yellow',
                emerald:   'bg-brand-accent text-text-primary dark:bg-accent-dark-green/35 dark:text-accent-dark-green',
                sky:       'bg-brand-secondary-accent text-text-primary dark:bg-accent-dark-blue/25 dark:text-accent-dark-blue',  
            },
        },
        compoundVariants: [
            { variant: 'subtle', colorScheme: 'gray', className: 'bg-[#EFE7E2] text-[#4F5C54] dark:bg-bg-dark-tertiary dark:text-text-dark-secondary' },
            { variant: 'subtle', colorScheme: 'green', className: 'bg-brand-primary/14 text-brand-primary dark:bg-accent-dark-green/15 dark:text-accent-dark-green' },
            { variant: 'subtle', colorScheme: 'yellow', className: 'bg-[#DCE8D4] text-[#36503A] dark:bg-accent-dark-yellow/15 dark:text-accent-dark-yellow' },
            { variant: 'subtle', colorScheme: 'blue', className: 'bg-[#012F22]/10 text-[#012F22] dark:bg-accent-dark-blue/15 dark:text-accent-dark-blue' },
            { variant: 'outline', colorScheme: 'gray', className: 'border-border-light dark:border-border-dark-subtle dark:text-text-dark-secondary' },
            { variant: 'outline', colorScheme: 'green', className: 'text-brand-primary border-brand-primary/40 dark:text-accent-dark-green dark:border-accent-dark-green/45' },
            { variant: 'outline', colorScheme: 'yellow', className: 'text-[#36503A] border-[#C6D8BE] dark:text-accent-dark-yellow dark:border-accent-dark-yellow/45' },
            { variant: 'outline', colorScheme: 'blue', className: 'text-[#012F22] border-[#7DAA74]/50 dark:text-accent-dark-blue dark:border-accent-dark-blue/45' },
            { variant: 'subtle', colorScheme: 'emerald', className: 'bg-brand-accent/14 text-brand-accent dark:bg-accent-dark-green/15 dark:text-accent-dark-green' },
            { variant: 'subtle', colorScheme: 'sky', className: 'bg-brand-secondary-accent/22 text-text-primary dark:bg-accent-dark-blue/15 dark:text-accent-dark-blue' },
        ],
        defaultVariants: {
            variant: 'default',
            colorScheme: 'blue'
        },
    }
);
