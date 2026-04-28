// src/components/features/dashboard/MetricCard.tsx
import React from 'react';
import clsx from 'clsx';
import { LuArrowDownRight, LuArrowUpRight } from 'react-icons/lu';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import Card from '../../common/ui/Card';
import { formatCurrency } from '../../../utils/formatters';

interface MetricCardProps {
  title: string;
  value: number;
  percentageChange: number;
  sparklineData: number[];
  isLoading?: boolean;
  className?: string;
  changeColorVariant?: 'profit' | 'expense' | 'blue' | 'yellow';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  percentageChange,
  sparklineData,
  isLoading,
  className,
  changeColorVariant = 'profit',
}) => {
  const isPositive = percentageChange >= 0;

  const chartData = sparklineData.map((v, i) => ({ name: i, value: v }));
  const changeColorMap = {
    profit: {
      className: isPositive
        ? 'text-brand-accent dark:text-brand-primary'
        : 'text-red-600 dark:text-red-400',
      strokeColor: isPositive ? '#418C46' : '#DC2626',
    },
    expense: {
      className: isPositive
        ? 'text-red-600 dark:text-red-400'
        : 'text-[#1E1E1E] dark:text-[#F7F1ED]',
      strokeColor: isPositive ? '#DC2626' : '#1E1E1E',
    },
    blue: {
      className: 'text-brand-primary dark:text-brand-primary',
      strokeColor: '#53B154',
    },
    yellow: {
      className: 'text-brand-accent dark:text-brand-secondary-accent',
      strokeColor: '#84C97F',
    },
  } as const;

  const { className: changeColorClassName, strokeColor } =
    changeColorMap[changeColorVariant];

  return (
    <Card className={clsx('relative flex h-full overflow-hidden', className)}>
      {isLoading ? (
        <div className="flex min-h-[120px] w-full flex-col justify-between space-y-2 animate-pulse">
          <div className="h-5 w-2/3 bg-gray-200 dark:bg-gray-700 rounded-md" />
          <div className="h-9 w-1/2 bg-gray-300 dark:bg-gray-600 rounded-md" />
          <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded-md" />
        </div>
      ) : (
        <>
          <div className="relative z-10 flex min-h-[120px] w-full flex-col">
            <h3 className="text-sm font-semibold leading-snug text-text-secondary">
              {title}
            </h3>
            <p className="mt-3 text-2xl font-bold text-text-primary dark:text-[#F7F1ED] sm:text-3xl">
              {formatCurrency(value)}
            </p>
            <div
              className={clsx(
                'mt-1.5 flex items-center gap-1 text-xs font-bold sm:text-sm',
                changeColorClassName
              )}
            >
              {isPositive ? <LuArrowUpRight /> : <LuArrowDownRight />}
              <span>{Math.abs(percentageChange).toFixed(1)}%</span>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-1/3 opacity-20 dark:opacity-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id={`color-${strokeColor}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={strokeColor} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke={strokeColor} strokeWidth={2} fill={`url(#color-${strokeColor})`} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </Card>
  );
};

export default MetricCard;
