import { useTranslation } from "react-i18next";
import type { ExpenseResponse } from "../../../api/types/domain";
import type { TableColumn } from "../../common/Table";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import Badge from "../../common/ui/Badge";
import Button from "../../common/ui/Button";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import Table from "../../common/Table";
import clsx from "clsx";

interface ExpensesTableProps {
    expenses: ExpenseResponse[];
    isLoading?: boolean;
    onEdit: (expense: ExpenseResponse) => void;
    onDelete: (id: number) => void;
    onRowClick: (expense: ExpenseResponse) => void;
    selectedRowId?: number | null;
}

const ExpensesTable: React.FC<ExpensesTableProps> = ({
    expenses, isLoading, onEdit, onDelete, onRowClick, selectedRowId
}) => {
    const { t } = useTranslation();
    const columns: TableColumn<ExpenseResponse>[] = [
        { header: t('common.name', 'Name'), accessor: 'name', headerClassName: 'w-2/5' },
        { header: t('common.value', 'Value'), accessor: (row) => formatCurrency(row.value), className: 'text-right font-medium', headerClassName: 'text-right' },
        { header: t('common.category', 'Category'), 
        accessor: (row) => (<Badge variant="subtle" colorScheme="blue">
            {t(`expenseCategories.${row.expenseType}`, row.expenseType)}
        </Badge>),
        },
        {
            header: t('expense.expenseDate', 'Date'),
            accessor: (row) => formatDate(row.expenseDate, { showTime: false })
        },
        {
            header: t('common.paymentMethod'),
            accessor: (row) => (
                <Badge variant="subtle" colorScheme="gray">
                    {t(`paymentMethods.${row.paymentMethod.toLowerCase()}`, row.paymentMethod)}
                </Badge>
            )
        },
        {
            header: t('common.actions', 'Actions'),
            accessor: (row) => (
                <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={(e) => {
                        e.stopPropagation(); onEdit(row); 
                    }} title={t('actions.edit')} iconLeft={<LuPencil />} 
                    />
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onDelete(row.id); }}
                    title={t('actions.delete')}
                    className="text-red-600 hover:text-red-700"
                    iconLeft={<LuTrash2 />}
                    />
                </div>
            ),
            className: 'text-right',
        }
    ];

    return (
        <Table<ExpenseResponse>
                columns = {columns}
                data={expenses}
                keyExtractor={(expense) => expense.id}
                isLoading={isLoading}
                emptyMessage={t('expense.noExpenseFound')}
            >
                {(expense) => (
                    <tr key={expense.id}
                        onClick={() => onRowClick(expense)}
                        className={clsx('transition-colors duration-150 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5', selectedRowId === expense.id && '!bg-brand-primary/10 dark:!bg-brand-accent/10')}>
                        {columns.map((col, index) => (
                            <td key={`${expense.id}-${index}`} className={clsx('px-4 py-3 whitespace-nowrap text-sm', col.className)}>
                                {typeof col.accessor === 'function' ? col.accessor(expense) : String(expense[col.accessor as keyof ExpenseResponse] ?? '-')}
                            </td>
                        ))}
                    </tr>
                )}
            </Table>

    );
};
export default ExpensesTable;