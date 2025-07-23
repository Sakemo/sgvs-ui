import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { type ExpenseResponse, ExpenseType, type Page } from "../api/types/domain";
import { deleteExpense, getExpenses, type GetExpensesParams } from "../api/services/expense.service";
import useDebounce from "../hooks/useDebounce";
import Button from "../components/common/ui/Button";
import { LuPlus, LuSearch } from "react-icons/lu";
import Card from "../components/common/ui/Card";
import Input from "../components/common/ui/Input";
import Select from "../components/common/ui/Select";
import clsx from "clsx";
import ExpensesTable from "../components/features/expenses/ExpensesTable";
import Pagination from "../components/common/Pagination";
import ExpenseDetailsDrawer from "../components/features/expenses/ExpenseDetailsDrawer";
import ExpenseFormModal from "../components/features/expenses/ExpenseFormModal";

import { useConfirmation } from "../contexts/utils/UseConfirmation";
import { notificationService } from "../lib/notification.service";

const ExpensesPage: React.FC = () => {
    const { t } = useTranslation();
    const [expensesPage, setExpensesPage] = useState<Page<ExpenseResponse> | null>(null);
    const showConfirmation = useConfirmation();

    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expenseToEdit, setExpenseToEdit] = useState<ExpenseResponse | null>(null);
    const [selectedExpense, setSelectedExpense] = useState<ExpenseResponse | null>(null);

    const [filters, setFilters] = useState<Omit<GetExpensesParams, 'page' | 'size'>>({
        name: '',
        expenseType: undefined,
        startDate: undefined,
        endDate: undefined,
    });
    const [currentPage, setCurrentPage] = useState(0);
    const debouncedNameFilter = useDebounce(filters.name, 400);
    const fetchExpenses = useCallback(async () => {
        setLoading(true);
        try {
            const params: GetExpensesParams = {
                ...filters,
                name: debouncedNameFilter?.trim(),
                page:currentPage,
                size:10,
            };
            const data = await getExpenses(params);
            setExpensesPage(data);
        } catch(err) {
            notificationService.error(t('errors.fetchExpenses' + err, 'Failed to load expenses'));
        } finally {
            setLoading(false);
        }
    }, [filters, currentPage, debouncedNameFilter, t])

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    const handleFilterChange = (field: keyof typeof filters, value: string | undefined) => {
        setCurrentPage(0);
        setFilters(prev => ({ ...prev, [field]: value }))
    };

    const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
        if(value) {
            const date = new Date(value);
            const isoString = field === 'startDate'
                ? new Date(date.setHours(0,0,0,0)).toISOString()
                : new Date(date.setHours(23,59,59,999)).toISOString();
            handleFilterChange(field, isoString);
        } else {
            handleFilterChange(field, undefined);
        }
    };

    const handleOpenModal = (expense: ExpenseResponse | null) => {
        setExpenseToEdit(expense);
        setIsModalOpen(true);
    };

    const handleSaveSuccess = () => {
        setIsModalOpen(false);
        fetchExpenses();
        notificationService.success(t('expense.saveSucess', 'Product saved successfully!'))
    };

    const handleDelete = async (id: number) => {
        showConfirmation({
            title: t('expense.confirmDeleteTitle', 'Delete expense?'),
            description: t('actions.confirmDeletePermanent', 'Permanently delete This action cannot be undone.'),
            confirmText: t('actions.delete', 'Delete'),
            onConfirm: async () => {
                try {
                    await deleteExpense(id);
                    if (selectedExpense?.id === id) setSelectedExpense(null);
                    fetchExpenses();
                    notificationService.success(t('expense.deleteSuccess', 'Expense deleted'))
                } catch {
                    notificationService.error(t('errors.deleteExpense', 'Failed to delete expense.'))
                }
            }
        });
    };

    const handleRowClick = (expense: ExpenseResponse) => {
        setSelectedExpense(prev => (prev?.id === expense.id ? null : expense));
    }

    const startDateValue = filters.startDate ? filters.startDate.split('T')[0] : '';
    const endDateValue = filters.endDate ? filters.endDate.split('T')[0] : '';

    return (
        <div className="space-y-6">
            <header className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-2xl font-semibold dark:text-gray-200">
                    {t('expense.pageTitle', 'Expenses')}
                </h1>
                <Button onClick={() => handleOpenModal(null)} iconLeft={<LuPlus />}>
                    {t('expenses.addTitle', "Add Expense")}
                </Button>
            </header>

            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Input placeholder={t('actions.searchByName')} value={filters.name} onChange={(e) => handleFilterChange('name',e.target.value)} iconLeft={<LuSearch className="text-text-secondary" />} />
                    <Input type="date" value={startDateValue} onChange={(e) => handleDateChange('startDate', e.target.value)} />
                    <Input type="date" value={endDateValue} onChange={(e) => handleDateChange('endDate', e.target.value)} />
                    <Select value={filters.expenseType ?? ''} onChange={(e) => handleFilterChange('expenseType', e.target.value || undefined)}>
                        <option value="">
                            {t('common.allCategories', 'All Categories')}
                        </option>
                        {Object.values(ExpenseType).map(type => (
                            <option key={type} value={type}>
                                {t(`expenseCategories.${type}`, type)}
                            </option>
                        ))}
                    </Select>
                </div>
            </Card>

            <div className={clsx("flex flex-col lg:flex-row", selectedExpense ? "gap-6" : "gap-0")}>
                <div className={clsx("transition-all duration-300 ease-in-out", selectedExpense ? "lg:w-2/3" : "w-full")}>
                <ExpensesTable
                    expenses={expensesPage?.content ?? []}
                    isLoading={loading}
                    onEdit={handleOpenModal}
                    onDelete={handleDelete}
                    onRowClick={handleRowClick}
                    selectedRowId={selectedExpense?.id}
                />
                {expensesPage && expensesPage.totalPages > 1 && (
                    <div className="mt-6">
                        <Pagination 
                            currentPage={expensesPage.number}
                            totalPages={expensesPage.totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
                </div>
                <div className={clsx("transition-all duration-300 ease-in-out", selectedExpense ? "lg:w-1/3 opacity-100" : "w-0 opacity-0 pointer-events-none")}>
                    {selectedExpense && (
                        <ExpenseDetailsDrawer expense={selectedExpense} onClose={() => setSelectedExpense(null)} onEdit={handleOpenModal} />
                    )}
                </div>
            </div>

            {isModalOpen && (
                <ExpenseFormModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSaveSuccess={handleSaveSuccess}
                    expenseToEdit={expenseToEdit}
                />
            )}
        </div>
    )
}
export default ExpensesPage;