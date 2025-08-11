// src/pages/ReportsPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { startOfMonth, endOfMonth, startOfYear, endOfYear, subDays } from 'date-fns';

// API & Types
import { getAbcAnalysisReport, getFinancialSummaryReport } from '../api/services/report.service';
import { type FinancialSummaryResponse, type AbcAnalysisRow } from '../api/types/domain';

// Components
import Card from '../components/common/ui/Card';
import AbcAnalysisTable from '../components/features/reports/AbcAnalysisTable';
import DateFilterDropdown, { type DateFilterOption } from '../components/common/DateFilterDropdown';
import { notificationService } from '../lib/notification.service';
import FinancialSummaryCard from '../components/features/reports/FinancialSummaryCard';
import AbcAnalysisSummary from '../components/features/reports/AbcAnalysisSummary';

const ReportsPage: React.FC = () => {
  const { t } = useTranslation();
  
  const [abcData, setAbcData] = useState<AbcAnalysisRow[]>([]);
  const [summaryData, setSummaryData] = useState<FinancialSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filtros de data
  const [dateFilterOption, setDateFilterOption] = useState<DateFilterOption>('this_month');
  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(endOfMonth(new Date()));

  const dateFilterOptions = [
    { key: 'this_week' as DateFilterOption, label: t('filter.thisWeek', 'This Week') },
    { key: 'this_month' as DateFilterOption, label: t('filter.thisMonth', 'This Month') },
    { key: 'this_year' as DateFilterOption, label: t('filter.thisYear', 'This Year') },
  ];

  const handleDateFilterSelect = (option: DateFilterOption) => {
    setDateFilterOption(option);
    const now = new Date();
    let start: Date = startOfMonth(now);
    let end: Date = endOfMonth(now);

    switch(option) {
      case 'this_week':
        start = subDays(now, 6);
        end = now;
        break;
      case 'this_month':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case 'this_year':
        start = startOfYear(now);
        end = endOfYear(now);
        break;
    }
    setStartDate(start);
    setEndDate(end);
  };

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        startDate: new Date(startDate.setHours(0, 0, 0, 0)).toISOString(),
        endDate: new Date(endDate.setHours(23, 59, 59, 999)).toISOString()
      };
      
      // --- Lógica de Fetch Atualizada ---
      const [abcReport, summaryReport] = await Promise.all([
        getAbcAnalysisReport(params),
        getFinancialSummaryReport(params)
      ]);
      
      setAbcData(abcReport);
      setSummaryData(summaryReport);
    } catch (error) {
      notificationService.error(t('errors.fetchReport' + error, 'Failed to generate reports.'));
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate, t]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold dark:text-gray-200">{t('reports.pageTitle', 'Reports')}</h1>
      </header>

      <FinancialSummaryCard data={summaryData} isLoading={isLoading} />

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-grow">
                <h2 className="text-lg font-semibold">{t('report.abc.title', 'ABC Analysis of Products')}</h2>
                <p className="text-sm text-text-secondary">{t('report.abc.description', 'Classify products based on their revenue contribution.')}</p>
            </div>
            <div className="w-full sm:w-56">
                <DateFilterDropdown
                    selectedOption={dateFilterOption}
                    onSelect={handleDateFilterSelect}
                    options={dateFilterOptions}
                />
            </div>
        </div>
        <div className='mt-6'>
          <AbcAnalysisSummary data={abcData} isLoading={isLoading} />
        </div>

        <div className="mt-6">
            <AbcAnalysisTable data={abcData} isLoading={isLoading} />
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage;