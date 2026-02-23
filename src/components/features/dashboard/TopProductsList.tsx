import React from 'react';
import { useTranslation } from 'react-i18next';
import { type ChartDataPoint } from '../../../api/types/domain';
import Card from '../../common/ui/Card';
import { formatCurrency } from '../../../utils/formatters';

interface TopProductsListProps {
  data: ChartDataPoint[];
  isLoading?: boolean;
}

const TopProductsList: React.FC<TopProductsListProps> = ({ data, isLoading }) => {
  const { t } = useTranslation();

  return (
    <Card className="h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4">{t('dashboard.topSellingProducts')}</h2>
      
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-5 w-3/5 bg-gray-200 dark:bg-gray-700 rounded-md" />
              <div className="h-5 w-1/5 bg-gray-300 dark:bg-gray-600 rounded-md" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-grow">
          {data.length > 0 ? (
            <ul className="space-y-4">
              {data.map((product, index) => (
                <li key={product.label} className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-text-secondary">{index + 1}.</span>
                    <span className="text-sm font-medium text-text-primary dark:text-gray-200 truncate" title={product.label}>
                      {product.label}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-brand-primary dark:text-brand-accent flex-shrink-0">
                    {formatCurrency(product.value)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-text-secondary">
              {t('dashboard.noSalesData')}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default TopProductsList;
