// components/ui/Select.tsx
import React from 'react';
import clsx from 'clsx';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, children, ...props }, ref) => {
    return (
      <div className="w-full dark:text-gray-300">
        {label && (
          <label htmlFor={props.id || props.name} className="mb-1 block text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            className={clsx(
              'h-10 w-full appearance-none rounded-input border border-border-light bg-transparent pl-3 pr-8 text-sm',
              'focus:outline-none focus:ring-2 focus:ring-brand-primary/50 dark:focus:ring-brand-accent/70',
              'dark:border-border-dark dark:bg-card-dark',
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
          </div>
        </div>
      </div>
    );
  }
);
Select.displayName = 'Select';

export default Select;