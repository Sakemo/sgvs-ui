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
  [PaymentMethod.CASH]: '#53B154',
  [PaymentMethod.DEBIT]: '#84C97F',
  [PaymentMethod.CREDIT]: '#418C46',
  [PaymentMethod.BANK_TRANSFER]: '#012F22',
  [PaymentMethod.ON_CREDIT]: '#1E1E1E',
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
      <div className="rounded-card border border-border-light bg-card-light/90 p-2 shadow-lg backdrop-blur-sm dark:border-border-dark dark:bg-card-dark/90">
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
    label: t(`paymentMethods.${entry.label.toLowerCase()}`),
    percent: totalValue > 0 ? ((entry.value / totalValue) * 100).toFixed(1) : 0,
  }));

  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };

  const getColor = (originalLabel: string) => {
    return COLORS[originalLabel.toUpperCase().replace(' ', '_')] ?? '#A3A3A3';
  };

  return (
    <Card className="flex h-full min-h-[320px] flex-col p-3">
      <h2 className="mb-2.5 text-lg font-semibold">{t('dashboard.salesByPaymentMethod')}</h2>
      <div className="flex flex-grow flex-col gap-3 sm:flex-row sm:items-center">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-44 w-44 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
        ) : data.length > 0 ? (
          <>
            <div className="h-[220px] w-full sm:h-full sm:flex-1">
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
                        fill={getColor(entry.originalLabel)}
                        opacity={index === activeIndex ? 1 : 0.7}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="grid gap-2 sm:w-[180px] sm:flex-shrink-0">
              {chartData.map((entry, index) => (
                <li
                  key={entry.originalLabel}
                  className="flex items-start justify-between gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-brand-primary/8 dark:hover:bg-brand-primary/12"
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: getColor(entry.originalLabel) }}
                    />
                    <span className="truncate text-sm text-text-primary dark:text-[#F7F1ED]">
                      {entry.label}
                    </span>
                  </div>
                  <div className="text-right text-xs text-text-secondary">
                    <div>{formatCurrency(entry.value)}</div>
                    <div>{entry.percent}%</div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-text-secondary">
            {t('dashboard.noSalesData')}
          </div>
        )}
      </div>
    </Card>
  );
};

export default PaymentMethodDonut;
