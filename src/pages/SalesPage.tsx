// src/pages/SalesPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { LuPlus } from 'react-icons/lu';

// API & Types
import { getSales, deleteSalePermanently, getSalesGrossTotal, getSalesTotalByPaymentMethod, getSalesSummary, type GetSalesParams, type GroupSummary, type TotalByPaymentMethod } from '../api/services/sale.service';
import { getTotalExpenses } from '../api/services/expense.service';
import { getProducts } from '../api/services/product.service';
import { getCustomers } from '../api/services/customer.service';
import { type SaleResponse, type EntitySummary, type Page, PaymentMethod } from '../api/types/domain';

// Components
import SalesTable from '../components/features/sales/SalesTable';
import SaleFormModal from '../components/features/sales/SaleFormModal';
import SaleDetailsModal from '../components/features/sales/SaleDetailModal';
import Button from '../components/common/ui/Button';
import Card from '../components/common/ui/Card';
import Select from '../components/common/ui/Select';
import Pagination from '../components/common/Pagination';
import ValueTotalCard from '../components/features/sales/ValueTotalCard';
import TotalByPaymentMethodCard from '../components/features/sales/TotalByPaymentMethodCard';
import DateFilterDropdown, { type DateFilterOption } from '../components/common/DateFilterDropdown';

const SalesPage: React.FC = () => {
  const { t } = useTranslation();
  
  // Data State
  const [salesPage, setSalesPage] = useState<Page<SaleResponse> | null>(null);
  const [grossTotal, setGrossTotal] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const [totalsByPaymentMethod, setTotalsByPaymentMethod] = useState<TotalByPaymentMethod[]>([]);
  const [groupSummaries, setGroupSummaries] = useState<Record<string, GroupSummary>>({});
  const [customers, setCustomers] = useState<EntitySummary[]>([]);
  const [products, setProducts] = useState<EntitySummary[]>([]);
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [saleToView, setSaleToView] = useState<SaleResponse | null>(null);
  
  // Filters State
  const [dateFilterOption, setDateFilterOption] = useState<DateFilterOption>('this_month');
  const [filters, setFilters] = useState<Omit<GetSalesParams, 'page' | 'size'>>({
    startDate: new Date(startOfMonth(new Date()).setHours(0,0,0,0)).toISOString(),
    endDate: new Date(endOfMonth(new Date()).setHours(23,59,59,999)).toISOString(),
    orderBy: 'saleDate,desc',
  });
  const [currentPage, setCurrentPage] = useState(0);

  // --- Data Fetching ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: GetSalesParams = { ...filters, page: currentPage, size: 10 };
      
      const [salesData, grossTotalData, expensesData, paymentTotalsData, customersData, productsData] = await Promise.all([
        getSales(params),
        getSalesGrossTotal(params),
        getTotalExpenses({ startDate: params.startDate, endDate: params.endDate }),
        getSalesTotalByPaymentMethod({ startDate: params.startDate, endDate: params.endDate }),
        getCustomers({ isActive: true }),
        getProducts({ size: 1000 })
      ]);
      
      setSalesPage(salesData);
      setGrossTotal(grossTotalData);
      setNetProfit(grossTotalData - expensesData);
      setTotalsByPaymentMethod(paymentTotalsData);
      setCustomers(customersData);
      setProducts(productsData.content.map(p => ({ id: p.id, name: p.name })));

      const orderProperty = params.orderBy?.split(',')[0];
      if (orderProperty === "saleDate" || orderProperty === 'customer.name') {
        const summaryData = await getSalesSummary(params);
        const summaryMap = summaryData.reduce((acc, summary) => {
          acc[summary.groupKey] = summary; return acc;
        }, {} as Record<string, GroupSummary>);
        setGroupSummaries(summaryMap);
      } else {
        setGroupSummaries({});
      }
    } catch (err) {
      setError(t('errors.fetchSales' + err, `Failed to load sales data: ${err}`));
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Handlers ---
  const handleFilterChange = (field: keyof typeof filters, value: string | number | undefined) => {
    setCurrentPage(0);
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleDateFilterSelect = (option: DateFilterOption) => {
    setDateFilterOption(option);
    const now = new Date();
    let startDate: Date | null = startOfMonth(now);
    let endDate: Date | null = endOfMonth(now);

    switch(option) {
      case 'today': startDate = now; endDate = now; break;
      case 'this_month': startDate = startOfMonth(now); endDate = endOfMonth(now); break;
      case 'this_year': startDate = startOfYear(now); endDate = endOfYear(now); break;
      case 'all': startDate = null; endDate = null; break;
    }

    setCurrentPage(0);
    setFilters(prev => ({
      ...prev,
      startDate: startDate ? new Date(startDate.setHours(0, 0, 0, 0)).toISOString() : undefined,
      endDate: endDate ? new Date(endDate.setHours(23, 59, 59, 999)).toISOString() : undefined
    }));
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(t('actions.confirmDeletePermanent'))) {
      try {
        await deleteSalePermanently(id);
        fetchData(); // Recarrega todos os dados para refletir as mudanças nos totais
      } catch { setError(t('errors.deleteSale')); }
    }
  };

    const orderOptions = [
        { value: 'saleDate,desc', label: t('filter.mostRecent') },
        { value: 'saleDate,asc', label: t('filter.oldest') },
        { value: 'totalValue,desc', label: t('filter.highestValue') },
        { value: 'totalValue,asc', label: t('filter.lowestValue') },
        { value: 'customer.name,asc', label: t('customer.sort.az') },
        { value: 'customer.name,desc', label: t('customer.sort.za') },
    ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-semibold">{t('sale.pageTitle', 'Sales')}</h1>
        <Button onClick={() => setIsFormModalOpen(true)} iconLeft={<LuPlus />}>
          {t('sale.addSale', 'Register Sale')}
        </Button>
      </header>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <DateFilterDropdown selectedOption={dateFilterOption} onSelect={handleDateFilterSelect} options={[
              { key: 'today', label: t('filter.today') },
              { key: 'this_month', label: t('filter.thisMonth') },
              { key: 'this_year', label: t('filter.thisYear') },
              { key: 'all', label: t('filter.allTime') }
          ]} />
          <Select value={filters.customerId ?? ''} onChange={(e) => handleFilterChange('customerId', e.target.value ? Number(e.target.value) : undefined)}>
            <option value="">{t('common.allClients')}</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Select value={filters.productId ?? ''} onChange={(e) => handleFilterChange('productId', e.target.value ? Number(e.target.value) : undefined)}>
            <option value="">{t('common.allProducts')}</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </Select>
          <Select value={filters.paymentMethod ?? ''} onChange={(e) => handleFilterChange('paymentMethod', e.target.value || undefined)}>
            <option value="">{t('common.allPaymentMethods')}</option>
            {Object.values(PaymentMethod).map(pm => <option key={pm} value={pm}>{t(`paymentMethods.${pm.toLowerCase()}`)}</option>)}
          </Select>
        <Select value={filters.orderBy} onChange={(e) => handleFilterChange('orderBy', e.target.value)}>
            {orderOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </Select>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ValueTotalCard isLoading={loading} value={grossTotal} title={t('sale.grossTotal')} />
        <ValueTotalCard isLoading={loading} value={netProfit} title={t('sale.netProfit')} color={netProfit >= 0 ? 'green' : 'red'} />
        <TotalByPaymentMethodCard isLoading={loading} totals={totalsByPaymentMethod} />
      </div>

      <SalesTable
        sales={salesPage?.content ?? []}
        isLoading={loading}
        onViewDetails={setSaleToView}
        onDelete={handleDelete}
      />

      {salesPage && salesPage.totalPages > 1 && (
        <Pagination currentPage={salesPage.number} totalPages={salesPage.totalPages} onPageChange={setCurrentPage} />
      )}

      <SaleFormModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} onSaveSuccess={fetchData} />
      <SaleDetailsModal isOpen={!!saleToView} onClose={() => setSaleToView(null)} sale={saleToView} />
    </div>
  );
};

export default SalesPage;