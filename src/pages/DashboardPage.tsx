// src/pages/DashboardPage.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";

// API & Types
import { getDashboardSummary } from "../api/services/dashboard.service";
import { getLowStockProducts } from "../api/services/product.service";
import type { DashboardResponse } from "../api/types/domain";
import type { LowStockProduct } from "../api/types/domain";

// Components
import DateFilterDropdown, {
  type DateFilterOption,
} from "../components/common/DateFilterDropdown";
import MetricCard from "../components/features/dashboard/MetricCard";
import SalesTrendChart from "../components/features/dashboard/SalesTrendChart";
import TopProductsList from "../components/features/dashboard/TopProductsList";
import PaymentMethodDonut from "../components/features/dashboard/PaymentMethodDonut";
import LowStockAlert from "../components/features/dashboard/LowStockAlert";
import { notificationService } from "../lib/notification.service";

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();

  // Data State
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(
    null,
  );
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>(
    [],
  );

  // UI State
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingLowStock, setIsLoadingLowStock] = useState(true);

  // Filters State
  const [dateFilter, setDateFilter] = useState<DateFilterOption>("this_month");

  const dateFilterOptions = [
    { key: "today" as DateFilterOption, label: t("filter.today") },
    { key: "this_month" as DateFilterOption, label: t("filter.thisMonth") },
    { key: "this_year" as DateFilterOption, label: t("filter.thisYear") },
  ];

  const fetchData = useCallback(
    async (option: DateFilterOption) => {
      setIsLoading(true);
      const now = new Date();
      let startDate: Date = startOfMonth(now);
      let endDate: Date = endOfMonth(now);

      switch (option) {
        case "today":
          startDate = now;
          endDate = now;
          break;
        case "this_month":
          startDate = startOfMonth(now);
          endDate = endOfMonth(now);
          break;
        case "this_year":
          startDate = startOfYear(now);
          endDate = endOfYear(now);
          break;
      }

      try {
        const params = {
          startDate: new Date(startDate.setHours(0, 0, 0, 0)).toISOString(),
          endDate: new Date(endDate.setHours(23, 59, 59, 999)).toISOString(),
        };
        const data = await getDashboardSummary(params);
        setDashboardData(data);
      } catch {
        notificationService.error(t("errors.fetchDashboardData"));
      } finally {
        setIsLoading(false);
      }
    },
    [t],
  );

  const fetchLowStockProducts = useCallback(async () => {
    setIsLoadingLowStock(true);
    try {
      const products = await getLowStockProducts();
      setLowStockProducts(products);
    } catch {
      notificationService.error(t("errors.fetchLowStockProducts"));
    } finally {
      setIsLoadingLowStock(false);
    }
  }, [t]);

  useEffect(() => {
    fetchData(dateFilter);
    fetchLowStockProducts();
  }, [dateFilter, fetchData, fetchLowStockProducts]);

  return (
    <div className="space-y-4 dark:text-[#F7F1ED]">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="w-90">
          <LowStockAlert
            products={lowStockProducts}
            isLoading={isLoadingLowStock}
          />
        </div>
        <div className="w-full sm:w-auto">
          <DateFilterDropdown
            selectedOption={dateFilter}
            onSelect={setDateFilter}
            options={dateFilterOptions}
          />
        </div>
      </header>

      <main className="space-y-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SalesTrendChart
              data={dashboardData?.revenueAndProfitTrend ?? []}
              isLoading={isLoading}
            />
          </div>

          <div className="lg:col-span-5">
            <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2">
              <MetricCard
                title={t("dashboard.grossRevenue")}
                value={dashboardData?.grossRevenue.value ?? 0}
                percentageChange={dashboardData?.grossRevenue.percentageChange ?? 0}
                sparklineData={dashboardData?.grossRevenue.sparklineData ?? []}
                isLoading={isLoading}
                className="min-h-[152px] p-3"
                changeColorVariant="blue"
              />
              <MetricCard
                title={t("dashboard.netProfit")}
                value={dashboardData?.netProfit.value ?? 0}
                percentageChange={dashboardData?.netProfit.percentageChange ?? 0}
                sparklineData={dashboardData?.netProfit.sparklineData ?? []}
                isLoading={isLoading}
                className="min-h-[152px] p-3"
                changeColorVariant="profit"
              />
              <MetricCard
                title={t("dashboard.totalExpenses")}
                value={-Math.abs(dashboardData?.totalExpense.value ?? 0)}
                percentageChange={dashboardData?.totalExpense.percentageChange ?? 0}
                sparklineData={dashboardData?.totalExpense.sparklineData ?? []}
                isLoading={isLoading}
                className="min-h-[152px] p-3"
                changeColorVariant="expense"
              />
              <MetricCard
                title={t("dashboard.totalReceivables")}
                value={dashboardData?.totalReceivables.value ?? 0}
                percentageChange={
                  dashboardData?.totalReceivables.percentageChange ?? 0
                }
                sparklineData={dashboardData?.totalReceivables.sparklineData ?? []}
                isLoading={isLoading}
                className="min-h-[152px] p-3"
                changeColorVariant="yellow"
              />
            </div>
          </div>

          <div className="lg:col-span-7 lg:min-h-[320px]">
            <TopProductsList
              data={dashboardData?.topSellingProducts ?? []}
              averageTicket={dashboardData?.averageTicket}
              isLoading={isLoading}
            />
          </div>

          <div className="lg:col-span-5 lg:min-h-[320px]">
            <PaymentMethodDonut
              data={dashboardData?.salesByPaymentMethod ?? []}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
