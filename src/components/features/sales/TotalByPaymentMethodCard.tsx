// src/components/features/sales/TotalByPaymentMethodCard.tsx
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { TotalByPaymentMethod } from '../../../api/services/sale.service';
import { PaymentMethod } from '../../../api/types/domain';
import Card from '../../common/ui/Card';
import { formatCurrency } from '../../../utils/formatters';
import Select from '../../common/ui/Select';

interface TotalByPaymentMethodCardProps {
  totals: TotalByPaymentMethod[];
  isLoading?: boolean;
}

const TotalByPaymentMethodCard: React.FC<TotalByPaymentMethodCardProps> = ({ totals, isLoading = false }) => {
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | ''>('');

  const displayedValue = useMemo(() => {
    if (selectedMethod === '') {
      // Se "All Methods" for selecionado, soma todos os totais
      return totals.reduce((sum, item) => sum + item.total, 0);
    }
    const found = totals.find(t => t.paymentMethod === selectedMethod);
    return found?.total ?? 0;
  }, [selectedMethod, totals]);
  
  const title = selectedMethod === '' 
    ? t('sale.totalByAllMethods', 'Total (All Methods)')
    : t(`paymentMethods.${selectedMethod.toLowerCase()}`, selectedMethod.replace('_', ' '));

  return (
    <Card className="flex-1">
      <div className="flex flex-col text-center">
        <Select
          value={selectedMethod}
          onChange={(e) => setSelectedMethod(e.target.value as PaymentMethod | '')}
          disabled={isLoading}
          className="mb-2"
        >
          <option value="">{t('sale.allMethods', 'All Methods')}</option>
          {Object.values(PaymentMethod).map(pm => (
            <option key={pm} value={pm}>
              {t(`paymentMethods.${pm.toLowerCase()}`, pm.replace('_', ' '))}
            </option>
          ))}
        </Select>

        {isLoading ? (
          <div className="h-10 mt-1 flex items-center justify-center">
             <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
          </div>
        ) : (
          <p className="text-3xl font-bold text-brand-secondary-accent mt-1">
            {formatCurrency(displayedValue)}
          </p>
        )}
        
        <p className="text-xs text-text-secondary mt-1 h-4">
          {title}
        </p>
      </div>
    </Card>
  );
};

export default TotalByPaymentMethodCard;