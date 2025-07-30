import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { LuPlus } from 'react-icons/lu';

import { getSales, deleteSalePermanently, getSalesGrossTotal, getSalesSummary, type GetSalesParams, type GroupSummary } from '../api/services/sale.service';
import { getTotalExpenses } from '../api/services/expense.service';
import { getCustomers } from '../api/services/customer.service';
import { getProducts } from '../api/services/product.service';
import { type SaleResponse, PaymentMethod } from '../api/types/domain';

import SalesTable, { type SaleTableRow } from '../components/features/sales/SalesTable';
import SaleFormModal from '../components/features/sales/SaleFormModal';
import SaleDetailsModal from '../components/features/sales/SaleDetailModal';
import Button from '../components/common/ui/Button';
import Card from '../components/common/ui/Card';
import Select from '../components/common/ui/Select';
import Pagination from '../components/common/Pagination';
import ValueTotalCard from '../components/features/sales/ValueTotalCard';
import DateFilterDropdown, { type DateFilterOption } from '../components/common/DateFilterDropdown';
import AutocompleteInput from '../components/common/AutoCompleteInput';
import { notificationService } from '../lib/notification.service';
import { formatDate } from '../utils/formatters';
import useDebounce from '../hooks/useDebounce';

const SalesPage: React.FC = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [saleToView, setSaleToView] = useState<SaleResponse | null>(null);
    const [dateFilterOption, setDateFilterOption] = useState<DateFilterOption>('this_month');
    const [filters, setFilters] = useState<Omit<GetSalesParams, 'page' | 'size'>>({
        startDate: new Date(startOfMonth(new Date()).setHours(0, 0, 0, 0)).toISOString(),
        endDate: new Date(endOfMonth(new Date()).setHours(23, 59, 59, 999)).toISOString(),
        orderBy: 'saleDate,desc',
    });
    const [currentPage, setCurrentPage] = useState(0);

    const [customerQuery, setCustomerQuery] = useState('');
    const [productQuery, setProductQuery] = useState('');
    const debouncedCustomerQuery = useDebounce(customerQuery, 400);
    const debouncedProductQuery = useDebounce(productQuery, 400);

    const queryParams: GetSalesParams = { ...filters, page: currentPage, size: 10 };

    const { data: salesPage, isLoading: isLoadingSales } = useQuery({
        queryKey: ['sales', queryParams],
        queryFn: () => getSales(queryParams),
        placeholderData: keepPreviousData,
    });

    const { data: grossTotal = 0 } = useQuery({
        queryKey: ['salesGrossTotal', filters],
        queryFn: () => getSalesGrossTotal(filters),
    });

    const { data: totalExpenses = 0 } = useQuery({
        queryKey: ['expensesTotal', { startDate: filters.startDate, endDate: filters.endDate }],
        queryFn: () => getTotalExpenses({ startDate: filters.startDate, endDate: filters.endDate }),
    });
    
    const { data: groupSummaries = [] } = useQuery({
        queryKey: ['salesSummary', queryParams],
        queryFn: () => getSalesSummary(queryParams),
        enabled: !!filters.orderBy && ['saleDate', 'customer.name'].includes(filters.orderBy.split(',')[0]),
    });
    
    const { data: customerOptions = [], isLoading: isSearchingCustomers } = useQuery({
        queryKey: ['customers', { name: debouncedCustomerQuery, context: 'sales-filter' }],
        queryFn: () => getCustomers({ name: debouncedCustomerQuery, isActive: true }),
        enabled: !!debouncedCustomerQuery,
    });
    
    const { data: productOptionsPage, isLoading: isSearchingProducts } = useQuery({
        queryKey: ['products', { name: debouncedProductQuery, context: 'sales-filter' }],
        queryFn: () => getProducts({ name: debouncedProductQuery, size: 10 }),
        enabled: !!debouncedProductQuery,
    });

    const productOptions = useMemo(() => productOptionsPage?.content ?? [], [productOptionsPage]);
    const netProfit = useMemo(() => grossTotal - totalExpenses, [grossTotal, totalExpenses]);
    
    const processedSales: SaleTableRow[] = useMemo(() => {
        const sales = salesPage?.content ?? [];
        const orderProperty = filters.orderBy?.split(',')[0];
        
        if (!orderProperty || !['saleDate', 'customer.name'].includes(orderProperty) || groupSummaries.length === 0) {
            return sales;
        }

        const summaryMap = groupSummaries.reduce((acc, summary) => {
            acc[summary.groupKey] = summary;
            return acc;
        }, {} as Record<string, GroupSummary>);

        const newRows: SaleTableRow[] = [];
        const addedHeaders = new Set<string>();

        for (const sale of sales) {
            const itemGroupKey = orderProperty === 'saleDate'
                ? sale.saleDate.split('T')[0]
                : sale.customer?.id.toString() || 'anonymous';
                
            if (itemGroupKey && !addedHeaders.has(itemGroupKey)) {
                const summary = summaryMap[itemGroupKey];
                if (summary) {
                    newRows.push({
                        isGroupHeader: true,
                        groupKey: summary.groupKey,
                        title: orderProperty === 'saleDate' ? formatDate(summary.groupTitle, { showTime: false }) : `Total for ${summary.groupTitle}`,
                        value: summary.totalValue,
                    });
                    addedHeaders.add(itemGroupKey);
                }
            }
            newRows.push(sale);
        }
        return newRows;
    }, [salesPage, filters.orderBy, groupSummaries]);

    const deleteSaleMutation = useMutation({
        mutationFn: deleteSalePermanently,
        onSuccess: () => {
            notificationService.success(t('sale.deleteSuccess', 'Sale deleted successfully.'));
            queryClient.invalidateQueries({ queryKey: ['sales'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            queryClient.invalidateQueries({ queryKey: ['salesGrossTotal'] });
            queryClient.invalidateQueries({ queryKey: ['expensesTotal'] });
        },
        onError: () => {
            notificationService.error(t('errors.deleteSale', 'Failed to delete sale.'));
        },
    });

    const handleFilterChange = (field: keyof typeof filters, value: string | number | undefined) => {
        setCurrentPage(0);
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleDateFilterSelect = (option: DateFilterOption) => {
        setDateFilterOption(option);
        const now = new Date();
        let startDate: Date | null = startOfMonth(now);
        let endDate: Date | null = endOfMonth(now);

        switch (option) {
            case 'today': startDate = now; endDate = now; break;
            case 'this_month': break;
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

    const handleDelete = (id: number) => {
        if (window.confirm(t('actions.confirmDeletePermanent', 'Are you sure you want to permanently delete this sale?'))) {
            deleteSaleMutation.mutate(id);
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
                <h1 className="text-2xl font-semibold dark:text-gray-200">{t('sale.pageTitle', 'Sales')}</h1>
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
                    <AutocompleteInput
                        placeholder={t('actions.searchByClient', 'Search by client...')}
                        options={customerOptions.map(c => ({ value: c.id, label: c.name }))}
                        selected={filters.customerId ? { value: filters.customerId, label: customerOptions.find(c => c.id === filters.customerId)?.name || '' } : null}
                        onSelect={(option) => handleFilterChange('customerId', option ? Number(option.value) : undefined)}
                        onQueryChange={setCustomerQuery}
                        isLoading={isSearchingCustomers}
                        label={''}
                    />
                    <AutocompleteInput
                        placeholder={t('actions.searchByProduct', 'Search by product...')}
                        options={productOptions.map(p => ({ value: p.id, label: p.name }))}
                        selected={filters.productId ? { value: filters.productId, label: productOptions.find(p => p.id === filters.productId)?.name || '' } : null}
                        onSelect={(option) => handleFilterChange('productId', option ? Number(option.value) : undefined)}
                        onQueryChange={setProductQuery}
                        isLoading={isSearchingProducts}
                        label={''}
                    />
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <ValueTotalCard isLoading={isLoadingSales} value={grossTotal} title={t('sale.grossTotal')} />
                <ValueTotalCard isLoading={isLoadingSales} value={netProfit} title={t('sale.netProfit')} color={netProfit >= 0 ? 'green' : 'red'} />
            </div>

            <SalesTable
                sales={processedSales}
                isLoading={isLoadingSales || deleteSaleMutation.isPending}
                onViewDetails={setSaleToView}
                onDelete={handleDelete}
            />

            {salesPage && salesPage.totalPages > 1 && (
                <Pagination currentPage={salesPage.number} totalPages={salesPage.totalPages} onPageChange={setCurrentPage} />
            )}
            
            <SaleFormModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} />
            <SaleDetailsModal isOpen={!!saleToView} onClose={() => setSaleToView(null)} sale={saleToView} />
        </div>
    );
};

export default SalesPage;