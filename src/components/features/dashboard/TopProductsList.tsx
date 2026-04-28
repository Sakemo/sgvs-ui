import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { LuArrowDownRight, LuArrowUpRight } from 'react-icons/lu';
import {
  type ChartDataPoint,
  type MetricCardData,
} from '../../../api/types/domain';
import Card from '../../common/ui/Card';
import { formatCurrency } from '../../../utils/formatters';

interface TopProductsListProps {
  data: ChartDataPoint[];
  averageTicket?: MetricCardData | null;
  isLoading?: boolean;
}

const TopProductsList: React.FC<TopProductsListProps> = ({
  data,
  averageTicket,
  isLoading,
}) => {
  const { t } = useTranslation();
  const topThreeProducts = data.slice(0, 3);
  const averageTicketChange = averageTicket?.percentageChange ?? 0;
  const isAverageTicketPositive = averageTicketChange >= 0;

  return (
    <Card className="flex h-full min-h-[320px] flex-col p-3">
      <h2 className="mb-2.5 text-lg font-semibold">
        {t('dashboard.topSellingProducts')}
      </h2>

      {isLoading ? (
        <div className="flex h-full flex-col justify-between gap-4 animate-pulse">
          <div className="space-y-2.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-5 w-3/5 rounded-md bg-gray-200 dark:bg-gray-700" />
                <div className="h-5 w-1/5 rounded-md bg-gray-300 dark:bg-gray-600" />
              </div>
            ))}
          </div>

          <div className="border-t border-border-light pt-2.5 dark:border-border-dark">
            <div className="h-4 w-1/3 rounded-md bg-gray-200 dark:bg-gray-700" />
            <div className="mt-2.5 h-8 w-1/2 rounded-md bg-gray-300 dark:bg-gray-600" />
            <div className="mt-2 h-4 w-1/4 rounded-md bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col justify-between gap-4">
          <div className="flex-grow">
            {topThreeProducts.length > 0 ? (
              <ul className="space-y-2.5">
                {topThreeProducts.map((product, index) => (
                  <li
                    key={product.label}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-text-secondary">
                        {index + 1}.
                      </span>
                      <span
                        className="truncate text-sm font-medium text-text-primary dark:text-[#F7F1ED]"
                        title={product.label}
                      >
                        {product.label}
                      </span>
                    </div>
                    <span className="flex-shrink-0 text-sm font-semibold text-brand-primary dark:text-brand-primary">
                      {formatCurrency(product.value)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-text-secondary">
                {t('dashboard.noSalesData')}
              </div>
            )}
          </div>

          <div className="border-t border-border-light pt-2.5 dark:border-border-dark">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  {t('dashboard.averageTicket')}
                </p>
                <p className="mt-2.5 text-2xl font-bold text-text-primary dark:text-[#F7F1ED]">
                  {formatCurrency(averageTicket?.value ?? 0)}
                </p>
                <div
                  className={clsx(
                    'mt-1.5 flex items-center gap-1 text-sm font-bold',
                    isAverageTicketPositive ? 'text-brand-accent dark:text-brand-primary' : 'text-red-600 dark:text-red-400',
                  )}
                >
                  {isAverageTicketPositive ? (
                    <LuArrowUpRight />
                  ) : (
                    <LuArrowDownRight />
                  )}
                  <span>{Math.abs(averageTicketChange).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TopProductsList;
