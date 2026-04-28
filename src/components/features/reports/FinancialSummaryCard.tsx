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

interface SummaryItemProps {
  icon: React.ElementType;
  title: string;
  value: number;
  isCurrency: boolean;
  iconClass: string;
  surfaceClass: string;
}

const SummaryItem: React.FC<SummaryItemProps> = ({
  icon: Icon,
  title,
  value,
  isCurrency,
  iconClass,
  surfaceClass,
}) => {
  const formattedValue = isCurrency ? formatCurrency(value) : `${value.toFixed(2)}%`;

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
      <div className={clsx('mb-2 rounded-full p-3', surfaceClass)}>
        <Icon className={clsx('h-6 w-6', iconClass)} />
      </div>
      <p className="text-sm text-text-secondary">{title}</p>
      <p className={clsx('text-xl font-bold', value < 0 ? 'text-red-500' : 'text-text-primary dark:text-[#F7F1ED]')}>
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
      <div className="flex flex-col divide-y divide-border-light dark:divide-border-dark md:flex-row md:divide-x md:divide-y-0">
        <div className="flex flex-1 flex-col p-4">
          <h3 className="mb-2 text-lg font-semibold">{t('reports.summary.grossProfit')}</h3>
          <div className="flex overflow-hidden rounded-lg border border-border-light divide-x divide-border-light dark:border-border-dark dark:divide-border-dark">
            <SummaryItem
              icon={LuDollarSign}
              title={t('reports.summary.profitValue')}
              value={data.grossProfit}
              isCurrency
              iconClass="text-brand-primary"
              surfaceClass="bg-brand-primary/14 dark:bg-brand-primary/18"
            />
            <SummaryItem
              icon={LuTrendingUp}
              title={t('reports.summary.margin')}
              value={data.grossMargin}
              isCurrency={false}
              iconClass="text-brand-primary"
              surfaceClass="bg-brand-primary/14 dark:bg-brand-primary/18"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="mb-2 text-lg font-semibold">{t('reports.summary.netProfit')}</h3>
          <div className="flex overflow-hidden rounded-lg border border-border-light divide-x divide-border-light dark:border-border-dark dark:divide-border-dark">
            <SummaryItem
              icon={LuShieldCheck}
              title={t('reports.summary.profitValue')}
              value={data.netProfit}
              isCurrency
              iconClass="text-brand-accent dark:text-brand-secondary-accent"
              surfaceClass="bg-brand-accent/12 dark:bg-brand-accent/20"
            />
            <SummaryItem
              icon={LuTrendingUp}
              title={t('reports.summary.margin')}
              value={data.netMargin}
              isCurrency={false}
              iconClass="text-brand-accent dark:text-brand-secondary-accent"
              surfaceClass="bg-brand-accent/12 dark:bg-brand-accent/20"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="mb-2 text-lg font-semibold">{t('reports.summary.operatingProfit')}</h3>
          <div className="flex overflow-hidden rounded-lg border border-border-light divide-x divide-border-light dark:border-border-dark dark:divide-border-dark">
            <SummaryItem
              icon={LuBriefcase}
              title={t('reports.summary.profitValue')}
              value={data.operatingProfit}
              isCurrency
              iconClass="text-[#012F22] dark:text-[#DCE8D4]"
              surfaceClass="bg-[#012F22]/10 dark:bg-[#012F22]/40"
            />
            <SummaryItem
              icon={LuTrendingUp}
              title={t('reports.summary.margin')}
              value={data.operatingMargin}
              isCurrency={false}
              iconClass="text-[#012F22] dark:text-[#DCE8D4]"
              surfaceClass="bg-[#012F22]/10 dark:bg-[#012F22]/40"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FinancialSummaryCard;
