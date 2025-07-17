import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { type CustomerResponse } from "../api/types/domain";
import useDebounce from "../hooks/useDebounce";
import { deleteCustomerPermanently, getCustomers, toggleCustomerStatus, type GetCustomersParams } from "../api/services/customer.service";
import Button from "../components/common/ui/Button";
import { LuPlus, LuSearch } from "react-icons/lu";
import Card from "../components/common/ui/Card";
import Input from "../components/common/ui/Input";
import Select from "../components/common/ui/Select";
import CustomerCard from "../components/features/customers/CustomerCard";
import CustomerFormModal from "../components/features/customers/CustomerFormModal";
import CustomerDetailsModal from "../components/features/customers/CustomerDetailsModal";

type ActivityFilter = 'all' | 'active' | 'inactive';
type DebtFilter = 'all' | 'debtors' | 'non_debtors';

const CustomerPage: React.FC = () => {
    const { t } = useTranslation();

    const [customers, setCustomers] = useState<CustomerResponse[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customerToEdit, setCustomerToEdit] = useState<CustomerResponse | null>(null);
        const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [customerToView, setCustomerToView] = useState<CustomerResponse | null>(null);
    
    const [filters, setFilters] = useState({
        name: '',
        activity: 'active' as ActivityFilter,
        debt: 'all' as DebtFilter,
        orderBy: 'name_asc'
    });
    const debouncedNameFilter = useDebounce(filters.name, 400);

    const orderOptions = [
        { value: 'name_asc', label: t('customer.sort.az', 'Name (A-Z)') },
        { value: 'name_desc', label: t('customer.sort.za', 'Name (Z-A)') },
        { value: 'debt_desc', label: t('customer.sort.highestDebt', 'Highest Debt') },
        { value: 'debt_asc', label: t('customer.sort.lowestDebt', 'Lowest Debt') },
        { value: 'recent', label: t('filter.mostRecent', 'Most Recent') },
        { value: 'oldest', label: t('filter.oldest', 'Oldest') },
    ];

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params: GetCustomersParams = {
                name: debouncedNameFilter.trim() || undefined,
                orderBy: filters.orderBy,
                isActive: filters.activity === 'all' ? undefined : filters.activity === 'active',
                hasDebt: filters.debt === 'all' ? undefined : filters.debt === 'debtors',
            };
            const data = await getCustomers(params);
            setCustomers(data);
        } catch (err) {
            setError(t('errors.fetchCustomers' + err,'Failed to load customers'));
        } finally {
            setLoading(false);
        }
    }, [filters, debouncedNameFilter, t]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const handleFilterChange = (field: keyof typeof filters, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleOpenModal = (customer: CustomerResponse | null) => {
        setCustomerToEdit(customer);
        setIsModalOpen(true);
    }

    const handleSaveSucess = () => {
        setIsModalOpen(false);
        fetchCustomers();
    };

    const handleToggleStatus = async (id: number, currentStatus: boolean) => {
        if (window.confirm(t('customer.confirmToggle', 'Are you sure?'))) {
            try {
                await toggleCustomerStatus(id, !currentStatus);
                fetchCustomers();
            } catch {
                setError(t('errors.toggleStatus'));
            }
        }
    };

    const handleViewDetails = (customer: CustomerResponse) => {
        setCustomerToView(customer);
        setIsDetailsModalOpen(true);
    }

    const handleDelete = async (id: number) => {
        if (window.confirm(t('actions.confirmDeletePermanent'))) {
            try {
                await deleteCustomerPermanently(id);
                fetchCustomers();
            } catch {
                setError(t('error.deleteCustomer'));
            }
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-2xl font-semibold">
                    {t('customer.pageTitle', 'Customer')}
                </h1>
                <Button onClick={() => handleOpenModal(null)} iconLeft={<LuPlus />}>
                    {t('customer.addCustomer', 'Add Customer')}
                </Button>
            </header>

            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Input
                        placeholder={t('actions.searchByName')}
                        value={filters.name}
                        onChange={(e) => handleFilterChange('name', e.target.value)}
                        iconLeft={<LuSearch className="h-4 w-4 text-text-secondary" />}
                    />
                    <Select value={filters.activity} onChange={(e) => handleFilterChange('activity', e.target.value)}>
                        <option value="active">
                            {t('common.active', 'Active')}
                        </option>
                        <option value="inactive">
                            {t('common.inactive')}
                        </option>
                        <option value="all">
                            {t('common.all', 'All')}
                        </option>
                    </Select>
                    <Select value={filters.debt} onChange={(e) => handleFilterChange('debt', e.target.value)}>
                        <option value="all">
                            {t('common.all,', 'All')}
                        </option>
                        <option value="debtors">
                            {t('customers.debtors', 'With Debt')}
                        </option>
                        <option value="non_debtors">
                            {t('custormer.noDebt', 'No debt')}
                        </option>
                    </Select>
                    <Select value={filters.orderBy} onChange={(e) => handleFilterChange('orderBy', e.target.value)}>
                        {orderOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </Select>
                </div>
            </Card>

            {loading && <p className="p-6 text-center">{t('common.loading')}</p>}
            {error && <p className="p-6 text-center text-red-500">{error}</p>}

            {!loading && !error && (
                customers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {customers.map(customer => (
                            <CustomerCard
                                key={customer.id}
                                customer={customer}
                                onEdit={handleOpenModal}
                                onToggleStatus={handleToggleStatus}
                                onViewDetails={handleViewDetails}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <Card className="text-center p-8 text-text-secondary">
                        {t('customer.noCustomerFound', 'No customers found matching your criteria')}
                    </Card>
                )
            )}

            {isModalOpen && (
                <CustomerFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSaveSucess={handleSaveSucess}
                    customerToEdit={customerToEdit}
                />
            )}

            {isDetailsModalOpen && (
                <CustomerDetailsModal
                    isOpen={isDetailsModalOpen}
                    onClose={() => setIsDetailsModalOpen(false)}
                    customer={customerToView}
                />
            )}
        </div>
    )
}
export default CustomerPage;