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
                    <label htmlFor={props.id || props.name} className="mb-1 block text-sm font-medium text-text-secondary">
                        {label}
                    </label>
                )}
                <textarea
                    className={clsx('flex min-h-[80px] w-full rounded-input border border-border-light bg-transparent px-3 py-2 text-sm', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 dark:focus-visible:ring-brand-accent/70', 'disabled:cursor-not-allowed disabled:opacity-50','dark:border-border-dark dark:bg-card-dark', 
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