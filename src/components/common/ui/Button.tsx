import React from 'react';
import type { VariantProps } from 'class-variance-authority';
import { LuLoader } from 'react-icons/lu';
import clsx from 'clsx';
import { buttonVariants } from './variants/button.variants';

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, children, isLoading, iconLeft, iconRight, ...props }, ref) => {
        return (
            <button
                className={clsx(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <LuLoader className="mr-2 h-4 w-4 animate-spin" />}
                {!isLoading && iconLeft}
                {children && <span className={clsx(iconLeft && 'ml-2', iconRight && 'mr-2')}>{children}</span>}
                {!isLoading&& iconRight}
            </button>
        );
    }
);
Button.displayName = 'Button';

export default Button; 