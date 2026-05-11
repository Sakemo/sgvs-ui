import clsx from "clsx"
import React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={props.id || props.name} className="mb-1 block text-sm font-medium text-text-secondary dark:text-text-dark-secondary">
                        {label}
                    </label>
                )}
                <textarea
                    maxLength={300}
                    className={clsx('flex min-h-[80px] w-full rounded-input border border-border-light bg-transparent px-3 py-2 text-sm text-text-primary', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50', 'disabled:cursor-not-allowed disabled:opacity-50', 'dark:border-border-dark-subtle dark:bg-bg-dark-tertiary dark:text-text-dark-primary dark:placeholder:text-text-dark-tertiary/70 dark:focus-visible:ring-accent-dark-green/50', 
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
        );
    }
);
Textarea.displayName = 'Textarea';

export default Textarea;