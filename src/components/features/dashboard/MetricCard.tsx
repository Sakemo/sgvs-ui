// src/components/features/dashboard/MetricCard.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
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
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, percentageChange, sparklineData, isLoading }) => {
  const { t } = useTranslation();
  const isPositive = percentageChange >= 0;

  const chartData = sparklineData.map((v, i) => ({ name: i, value: v }));
  const strokeColor = isPositive ? '#16A34A' : '#DC2626'; // green-600 | red-600

  return (
    <Card className="relative overflow-hidden">
      {isLoading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-5 w-2/3 bg-gray-200 dark:bg-gray-700 rounded-md" />
          <div className="h-9 w-1/2 bg-gray-300 dark:bg-gray-600 rounded-md" />
          <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded-md" />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <h3 className="text-base font-semibold text-text-secondary">{title}</h3>
            <div
              className={clsx(
                'flex items-center gap-1 text-sm font-bold',
                isPositive ? 'text-green-600' : 'text-red-600'
              )}
            >
              {isPositive ? <LuArrowUpRight /> : <LuArrowDownRight />}
              <span>{Math.abs(percentageChange).toFixed(1)}%</span>
            </div>
          </div>
          <p className="text-3xl font-bold mt-2 text-text-primary dark:text-white">
            {formatCurrency(value)}
          </p>
          <p className="text-xs text-text-secondary">{t('dashboard.vsPreviousPeriod')}</p>

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
