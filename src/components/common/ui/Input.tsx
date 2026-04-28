import React from 'react';
import clsx from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  iconLeft?: React.ReactNode;
  error?: string | null;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, iconLeft, error, ...props }, ref) => {
    const hasIcon = !!iconLeft;
    return (
      <div className="w-full dark:text-text-dark-primary">
        {label && (
          <label htmlFor={props.id || props.name} className="mb-1 block text-sm font-medium text-text-secondary dark:text-text-dark-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          {hasIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 dark:text-text-dark-tertiary">
              {iconLeft}
            </div>
          )}
          <input
            type={type}
            className={clsx(
              'flex h-10 w-full rounded-input border border-border-light bg-transparent px-3 py-2 text-sm text-text-primary',
              'file:border-0 file:bg-transparent file:text-sm file:font-medium',
              'placeholder:text-text-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'dark:border-border-dark-subtle dark:bg-bg-dark-tertiary dark:text-text-dark-primary dark:placeholder:text-text-dark-tertiary/70 dark:focus-visible:ring-accent-dark-green/50 dark:focus-visible:border-accent-dark-green/50',
              error && 'border-red-500 focus-visible:ring-red-500/50 dark:border-accent-dark-red/50 dark:focus-visible:ring-accent-dark-red/50',
              hasIcon && 'pl-10',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
      </div>
    );
  }
);
Input.displayName = 'Input';

export default Input;