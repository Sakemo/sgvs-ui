import React from 'react';
import clsx from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  iconLeft?: React.ReactNode;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, iconLeft, error, ...props }, ref) => {
    const hasIcon = !!iconLeft;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={props.id || props.name} className="mb-1 block text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          {hasIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              {iconLeft}
            </div>
          )}
          <input
            type={type}
            className={clsx(
              'flex h-10 w-full rounded-input border border-border-light bg-transparent px-3 py-2 text-sm',
              'file:border-0 file:bg-transparent file:text-sm file:font-medium',
              'placeholder:text-text-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 dark:focus-visible:ring-brand-accent/70',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'dark:border-border-dark dark:bg-card-dark',
              error && 'border-red-500 focus-visible:ring-red-500/50',
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