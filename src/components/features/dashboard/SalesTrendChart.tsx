// src/components/features/dashboard/SalesTrendChart.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { type TimeSeriesDataPoint } from '../../../api/types/domain';
import Card from '../../common/ui/Card';
import { formatCurrency } from '../../../utils/formatters';

interface TooltipPayload {
    name: string;
    value: number;
    color: string;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
}

interface SalesTrendChartProps {
  data: TimeSeriesDataPoint[];
  isLoading?: boolean;
}
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-card border border-border-light bg-card-light/80 dark:bg-card-dark/80 p-3 shadow-lg backdrop-blur-sm">
        <p className="font-semibold text-text-primary dark:text-white">{label}</p>
        {payload.map((p, index: number) => (
          <p key={index} style={{ color: p.color }} className="text-sm">
            {`${p.name}: ${formatCurrency(p.value)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const SalesTrendChart: React.FC<SalesTrendChartProps> = ({ data, isLoading }) => {
  const { t } = useTranslation();

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">{t('dashboard.revenueProfitTrend', 'Revenue & Profit Trend')}</h2>
      <div className="h-80">
        {isLoading ? (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00BFFF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00BFFF" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="rgba(128, 128, 128, 0.5)" />
              <YAxis tickFormatter={(value) => formatCurrency(value as number)} tick={{ fontSize: 12 }} stroke="rgba(128, 128, 128, 0.5)" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                name={t('dashboard.revenue', 'Revenue')}
                stroke="#00BFFF"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
              <Area
                type="monotone"
                dataKey="profit"
                name={t('dashboard.profit', 'Profit')}
                stroke="#22C55E"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorProfit)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export default SalesTrendChart;