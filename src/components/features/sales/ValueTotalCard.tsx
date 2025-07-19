import React from 'react';
import clsx from 'clsx';
import { cva, type VariantProps } from 'class-variance-authority';
import Card from '../../common/ui/Card';
import { formatCurrency } from '../../../utils/formatters';

const valueTextVariants = cva(
  'text-3xl font-bold mt-1',
  {
    variants: {
      color: {
        default: 'text-brand-primary dark:text-brand-accent',
        blue: 'text-blue-600 dark:text-blue-400',
        green: 'text-green-600 dark:text-green-500',
        red: 'text-red-600 dark:text-red-500',
      },
    },
    defaultVariants: {
      color: 'default',
    },
  }
);

interface ValueTotalCardProps extends VariantProps<typeof valueTextVariants> {
  title: string;
  value: number;
  description?: string;
  isLoading?: boolean;
}

const ValueTotalCard: React.FC<ValueTotalCardProps> = ({
  title,
  value,
  description,
  color,
  isLoading = false
}) => {
  return (
    <Card className="flex-1">
      <div className="flex flex-col items-center justify-center text-center">
        <h4 className="text-sm font-medium text-text-secondary uppercase tracking-wider">
          {title}
        </h4>
        
        {isLoading ? (
          <div className="h-10 mt-1 flex items-center">
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
          </div>
        ) : (
          <p className={clsx(valueTextVariants({ color }))}>
            {formatCurrency(value)}
          </p>
        )}

        {description && (
          <p className="text-xs text-text-secondary mt-1 h-4">
            {description}
          </p>
        )}
      </div>
    </Card>
  );
};

export default ValueTotalCard;