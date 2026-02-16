// src/pages/DashboardPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

// API & Types
import { getDashboardSummary } from '../api/services/dashboard.service';
import { getLowStockProducts } from '../api/services/product.service';
import type { DashboardResponse } from '../api/types/domain';
import type { LowStockProduct } from '../api/types/domain';

// Components
import DateFilterDropdown, { type DateFilterOption } from '../components/common/DateFilterDropdown';
import MetricCard from '../components/features/dashboard/MetricCard';
import SalesTrendChart from '../components/features/dashboard/SalesTrendChart';
import TopProductsList from '../components/features/dashboard/TopProductsList';
import PaymentMethodDonut from '../components/features/dashboard/PaymentMethodDonut';
import LowStockAlert from '../components/features/dashboard/LowStockAlert';
import { notificationService } from '../lib/notification.service';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  
  // Data State
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  
  // UI State
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingLowStock, setIsLoadingLowStock] = useState(true);
  
  // Filters State
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('this_month');
  
  const dateFilterOptions = [
    { key: 'today' as DateFilterOption, label: t('filter.today', 'Today') },
    { key: 'this_month' as DateFilterOption, label: t('filter.thisMonth', 'This Month') },
    { key: 'this_year' as DateFilterOption, label: t('filter.thisYear', 'This Year') },
  ];

  const fetchData = useCallback(async (option: DateFilterOption) => {
    setIsLoading(true);
    const now = new Date();
    let startDate: Date = startOfMonth(now);
    let endDate: Date = endOfMonth(now);

    switch(option) {
      case 'today':
        startDate = now;
        endDate = now;
        break;
      case 'this_month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case 'this_year':
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        break;
    }
    
    try {
      const params = {
        startDate: new Date(startDate.setHours(0, 0, 0, 0)).toISOString(),
        endDate: new Date(endDate.setHours(23, 59, 59, 999)).toISOString()
      };
      const data = await getDashboardSummary(params);
      setDashboardData(data);
    } catch (error) {
      notificationService.error(`Failed to fetch dashboard data: ${error}`)
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  const fetchLowStockProducts = useCallback(async () => {
    setIsLoadingLowStock(true);
    try {
      const products = await getLowStockProducts();
      setLowStockProducts(products);
    } catch (error) {
      notificationService.error(`Failed to fetch low stock products: ${error}`);
    } finally {
      setIsLoadingLowStock(false);
    }
  }, []);


  useEffect(() => {
    fetchData(dateFilter);
    fetchLowStockProducts();
  }, [dateFilter, fetchData]);

  return (
    <div className="space-y-6 dark:text-gray-200">
      <header className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-semibold">{t('dashboard.title', 'Dashboard')}</h1>
        <div className="w-full sm:w-auto">
          <DateFilterDropdown
            selectedOption={dateFilter}
            onSelect={setDateFilter}
            options={dateFilterOptions}
          />
        </div>
      </header>

      <LowStockAlert 
        products={lowStockProducts} 
        isLoading={isLoadingLowStock}
      />

      <main className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            title={t('dashboard.grossRevenue', 'Gross Revenue')}
            value={dashboardData?.grossRevenue.value ?? 0}
            percentageChange={dashboardData?.grossRevenue.percentageChange ?? 0}
            sparklineData={dashboardData?.grossRevenue.sparklineData ?? []}
            isLoading={isLoading}
          />
          <MetricCard
            title={t('dashboard.netProfit', 'Net Profit')}
            value={dashboardData?.netProfit.value ?? 0}
            percentageChange={dashboardData?.netProfit.percentageChange ?? 0}
            sparklineData={dashboardData?.netProfit.sparklineData ?? []}
            isLoading={isLoading}
          />
            <TopProductsList
              data={dashboardData?.topSellingProducts ?? []}
              isLoading={isLoading}
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <SalesTrendChart 
              data={dashboardData?.revenueAndProfitTrend ?? []} 
              isLoading={isLoading}
            />
          </div>
          
          <div className="flex flex-col gap-6">
            <PaymentMethodDonut
              data={dashboardData?.salesByPaymentMethod ?? []}
              isLoading={isLoading}
            />
          </div>
          </div>

        <div className="grid grid-cols-3 gap-4">
          <MetricCard
            title={t('dashboard.totalExpenses', 'Total Expenses')}
            value={dashboardData?.totalExpense.value ?? 0}
            percentageChange={dashboardData?.totalExpense.percentageChange ?? 0}
            sparklineData={dashboardData?.totalExpense.sparklineData ?? []}
            isLoading={isLoading}
          />
          <MetricCard
              title={t('dashboard.totalReceivables', 'Total Receivables')}
              value={dashboardData?.totalReceivables.value ?? 0}
              percentageChange={dashboardData?.totalReceivables.percentageChange ?? 0}
              sparklineData={dashboardData?.totalReceivables.sparklineData ?? []}
              isLoading={isLoading}
          />
          <MetricCard
            title={t('dashboard.averageTicket', 'Average Ticket')}
            value={dashboardData?.averageTicket.value ?? 0}
            percentageChange={dashboardData?.averageTicket.percentageChange ?? 0}
            sparklineData={dashboardData?.averageTicket.sparklineData ?? []}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
