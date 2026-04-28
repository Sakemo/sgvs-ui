import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface LowStockProduct {
  id: number;
  name: string;
  currentStock: number;
  minimumStock: number;
}

interface LowStockAlertProps {
  products: LowStockProduct[];
  isLoading?: boolean;
}

const LowStockAlert: React.FC<LowStockAlertProps> = ({ products, isLoading }) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 animate-pulse dark:border-gray-700 dark:bg-gray-800">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="rounded-lg border border-brand-primary/30 bg-brand-primary/10 p-3 dark:border-brand-primary/35 dark:bg-brand-primary/12">
      <div className="mb-2 flex items-center">
        <AlertTriangle className="mr-2 h-5 w-5 text-brand-accent dark:text-brand-primary" />
        <h3 className="text-lg font-medium text-[#2E6430] dark:text-[#F7F1ED]">
          {t('dashboard.lowStockAlerts')}
        </h3>
        <span className="ml-2 rounded-full bg-brand-primary px-2 py-1 text-sm text-[#1E1E1E] dark:bg-brand-primary dark:text-[#1E1E1E]">
          {products.length}
        </span>
      </div>
      <div className="space-y-1">
        {products.map(product => (
          <div key={product.id} className="flex justify-between text-sm text-[#36503A] dark:text-[#D9E8D5]">
            <span>• {product.name}</span>
            <span className="font-medium">
              {t('dashboard.lowStockUnitsAndMinimum', {
                currentStock: product.currentStock,
                minimumStock: product.minimumStock,
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LowStockAlert;
