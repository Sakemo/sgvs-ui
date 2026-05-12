import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'border border-border-light bg-card-light p-card-padding shadow-soft dark:border-border-dark-subtle dark:bg-card-dark dark:text-text-dark-primary hover:shadow-card dark:hover:bg-card-dark-hover dark:hover:border-border-dark transition-all duration-200',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export default Card;
