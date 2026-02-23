// src/components/features/reports/FinancialSummaryCard.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { LuTrendingUp, LuDollarSign, LuShieldCheck, LuBriefcase } from 'react-icons/lu';
import { type FinancialSummaryResponse } from '../../../api/types/domain';
import { formatCurrency } from '../../../utils/formatters';
import Card from '../../common/ui/Card';
import clsx from 'clsx';

interface FinancialSummaryCardProps {
  data: FinancialSummaryResponse | null;
  isLoading: boolean;
}

// Componente interno para cada item do sumário
const SummaryItem: React.FC<{ icon: React.ElementType; title: string; value: number; isCurrency: boolean; colorClass: string }> = 
({ icon: Icon, title, value, isCurrency, colorClass }) => {
  const formattedValue = isCurrency ? formatCurrency(value) : `${value.toFixed(2)}%`;
  return (
    <div className="flex-1 p-4 flex flex-col items-center justify-center text-center">
      <div className={`mb-2 p-3 rounded-full bg-opacity-10 ${colorClass.replace('text-', 'bg-')}`}>
        <Icon className={`h-6 w-6 ${colorClass}`} />
      </div>
      <p className="text-sm text-text-secondary">{title}</p>
      <p className={clsx("text-xl font-bold", value < 0 ? 'text-red-500' : 'text-text-primary dark:text-gray-200')}>
        {formattedValue}
      </p>
    </div>
  );
};

const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({ data, isLoading }) => {
  const { t } = useTranslation();

  if (isLoading) {
    return <Card className="p-6 text-center">{t('common.loading')}</Card>;
  }
  if (!data) {
    return <Card className="p-6 text-center">{t('reports.noData')}</Card>;
  }

  return (
    <Card>
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border-light dark:divide-border-dark">
        <div className="flex-1 flex flex-col p-4">
          <h3 className="font-semibold text-lg mb-2">{t('reports.summary.grossProfit')}</h3>
          <div className="flex divide-x divide-border-light dark:divide-border-dark rounded-lg border border-border-light dark:border-border-dark overflow-hidden">
            <SummaryItem icon={LuDollarSign} title={t('reports.summary.profitValue')} value={data.grossProfit} isCurrency colorClass="text-green-500" />
            <SummaryItem icon={LuTrendingUp} title={t('reports.summary.margin')} value={data.grossMargin} isCurrency={false} colorClass="text-green-500" />
          </div>
        </div>

        <div className="flex-1 flex flex-col p-4">
          <h3 className="font-semibold text-lg mb-2">{t('reports.summary.netProfit')}</h3>
          <div className="flex divide-x divide-border-light dark:divide-border-dark rounded-lg border border-border-light dark:border-border-dark overflow-hidden">
            <SummaryItem icon={LuShieldCheck} title={t('reports.summary.profitValue')} value={data.netProfit} isCurrency colorClass="text-blue-500" />
            <SummaryItem icon={LuTrendingUp} title={t('reports.summary.margin')} value={data.netMargin} isCurrency={false} colorClass="text-blue-500" />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col p-4">
          <h3 className="font-semibold text-lg mb-2">{t('reports.summary.operatingProfit')}</h3>
          <div className="flex divide-x divide-border-light dark:divide-border-dark rounded-lg border border-border-light dark:border-border-dark overflow-hidden">
            <SummaryItem icon={LuBriefcase} title={t('reports.summary.profitValue')} value={data.operatingProfit} isCurrency colorClass="text-purple-500" />
            <SummaryItem icon={LuTrendingUp} title={t('reports.summary.margin')} value={data.operatingMargin} isCurrency={false} colorClass="text-purple-500" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FinancialSummaryCard;