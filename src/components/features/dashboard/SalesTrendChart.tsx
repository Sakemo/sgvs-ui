import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { type TimeSeriesDataPoint } from '../../../api/types/domain';
import Card from '../../common/ui/Card';
import { formatCurrency, formatDate } from '../../../utils/formatters';

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
    const formattedLabel = label ? formatDate(label, { showTime: false }) : label;
    return (
      <div className="rounded-card border border-border-light bg-card-light/90 p-3 shadow-lg backdrop-blur-sm dark:border-border-dark dark:bg-card-dark/90">
        <p className="font-semibold text-text-primary dark:text-[#F7F1ED]">{formattedLabel}</p>
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

  const formatDateTick = (dateString: string): string => {
    return formatDate(dateString, { showTime: false });
  };

  return (
    <Card className="h-full p-3">
      <div className="h-[320px] -m-3 p-3">
        {isLoading ? (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
              barCategoryGap="16%"
              barGap={2}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
              <XAxis dataKey="date" tickFormatter={formatDateTick} tick={{ fontSize: 11 }} stroke="rgba(128, 128, 128, 0.5)" />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} align="right" />
              <Bar
                dataKey="revenue"
                name={t('dashboard.revenue')}
                fill="#53B154"
                maxBarSize={28}
              />
              <Bar
                dataKey="profit"
                name={t('dashboard.profit')}
                fill="#84C97F"
                maxBarSize={28}
              />
              <Bar
                dataKey="receivables"
                name={t('dashboard.receivables')}
                fill="#1E1E1E"
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export default SalesTrendChart;
