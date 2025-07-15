import React from 'react';
import { type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import { badgeVariants } from './variants/badge.variants';


export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, colorScheme, ...props }: BadgeProps) {
    return (
        <div className={clsx(badgeVariants({ variant, colorScheme, className }))} {...props} />
    );
}

export default Badge;