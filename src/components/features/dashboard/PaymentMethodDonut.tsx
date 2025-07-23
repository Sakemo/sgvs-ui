// src/components/features/dashboard/PaymentMethodDonut.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { type ChartDataPoint } from '../../../api/types/domain';
import Card from '../../common/ui/Card';
import { formatCurrency } from '../../../utils/formatters';
import { PaymentMethod } from '../../../api/types/domain';

interface PaymentMethodDonutProps {
  data: ChartDataPoint[];
  isLoading?: boolean;
}

const COLORS: Record<string, string> = {
  [PaymentMethod.CASH]: '#22C55E',
  [PaymentMethod.DEBIT]: '#3B82F6',
  [PaymentMethod.CREDIT]: '#8B5CF6',
  [PaymentMethod.BANK_TRANSFER]: '#0EA5E9',
  [PaymentMethod.ON_CREDIT]: '#F59E0B',
}

interface TooltipPayloadContent {
    name: string;
    value: number;
    payload: {
        label: string;
        value: number;
        percent: string;
    };
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipPayloadContent[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-card border border-border-light dark:border-border-dark bg-card-light/80 p-2 shadow-lg backdrop-blur-sm dark:bg-card-dark/80">
        <p className="text-sm font-semibold">{data.label}</p>
        <p className="text-sm text-text-secondary">{`${formatCurrency(data.value)} (${data.percent}%)`}</p>
      </div>
    );
  }
  return null;
};

const PaymentMethodDonut: React.FC<PaymentMethodDonutProps> = ({ data, isLoading }) => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const totalValue = data.reduce((sum, entry) => sum + entry.value, 0);

  const chartData = data.map(entry => ({
    ...entry,
    originalLabel: entry.label,
    label: t(`paymentMethods.${entry.label.toLowerCase()}`, entry.label),
    percent: totalValue > 0 ? ((entry.value / totalValue) * 100).toFixed(1) : 0,
  }));

  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };

  return (
    <Card className="h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4">{t('dashboard.salesByPaymentMethod', 'Sales by Payment Method')}</h2>
      <div className="flex-grow h-64">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          </div>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                nameKey="label"
                onMouseEnter={onPieEnter}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[entry.originalLabel.toUpperCase().replace(' ', '_')] ?? '#A3A3A3'}
                    opacity={index === activeIndex ? 1 : 0.7}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-text-secondary">
            {t('dashboard.noSalesData', 'No sales data for this period.')}
          </div>
        )}
      </div>
    </Card>
  );
};

export default PaymentMethodDonut;