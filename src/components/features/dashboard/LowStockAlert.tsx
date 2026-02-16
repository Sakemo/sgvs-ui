import React from 'react';
import { AlertTriangle } from 'lucide-react';

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
  if (isLoading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-lg p-4">
      <div className="flex items-center mb-2">
        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
        <h3 className="text-lg font-medium text-amber-800 dark:text-amber-200">
          Alertas de Estoque Baixo
        </h3>
        <span className="ml-2 bg-amber-600 dark:bg-amber-700 text-white text-sm px-2 py-1 rounded-full">
          {products.length}
        </span>
      </div>
      <div className="space-y-1">
        {products.map(product => (
          <div key={product.id} className="text-sm text-amber-700 dark:text-amber-300 flex justify-between">
            <span>• {product.name}</span>
            <span className="font-medium">
              {product.currentStock} unidades (mínimo: {product.minimumStock})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LowStockAlert;
