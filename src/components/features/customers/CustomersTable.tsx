import { useTranslation } from "react-i18next";
import type { CustomerResponse } from "../../../api/types/domain";
import type { TableColumn } from "../../common/Table";
import { formatCurrency } from "../../../utils/formatters";
import Badge from "../../common/ui/Badge";
import Button from "../../common/ui/Button";
import { LuPencil, LuTrash2, LuPower, LuPowerOff, LuEye, LuCircleDollarSign } from "react-icons/lu";
import Table from "../../common/Table";
import clsx from "clsx";

interface CustomersTableProps {
    customers: CustomerResponse[];
    isLoading?: boolean;
    onEdit: (customer: CustomerResponse) => void;
    onToggleStatus: (id: number, currentStatus: boolean) => void;
    onDelete: (id: number) => void;
    onViewDetails: (customer: CustomerResponse) => void;
    onSettleDebt: (customer: CustomerResponse) => void;
    onRowClick: (customer: CustomerResponse) => void;
    selectedRowId?: number | null;
}

const CustomersTable: React.FC<CustomersTableProps> = ({
    customers, isLoading, onEdit, onToggleStatus, onDelete, onViewDetails, onSettleDebt, onRowClick, selectedRowId
}) => {
    const { t } = useTranslation();
    const columns: TableColumn<CustomerResponse>[] = [
        { header: t('common.name'), accessor: 'name', headerClassName: 'w-2/5' },
        { header: t('customer.taxId'), accessor: 'taxId', className: 'text-center' },
        { header: t('customer.phone'), accessor: 'phone', className: 'text-center' },
        {
            header: t('common.status'),
            accessor: (row) => (
                <Badge variant="outline" colorScheme={row.active ? 'green' : 'gray'}>
                    {row.active ? t('common.active') : t('common.inactive')}
                </Badge>
            ),
            className: 'text-center'
        },
        {
            header: t('customer.debtBalance'),
            accessor: (row) => formatCurrency(row.debtBalance),
            className: 'text-right font-medium'
        },
        {
            header: t('common.actions'),
            accessor: (row) => (
                <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={(e) => {
                        e.stopPropagation(); onViewDetails(row);
                    }} title={t('common.details')} iconLeft={<LuEye />}
                    />
                    {row.debtBalance > 0 && (
                        <Button variant="ghost" size="icon" onClick={(e) => {
                            e.stopPropagation(); onSettleDebt(row);
                        }} title={t('actions.settleDebt')}
                        className="text-green-600 hover:text-green-700"
                        iconLeft={<LuCircleDollarSign />}
                        />
                    )}
                    <Button variant="ghost" size="icon" onClick={(e) => {
                        e.stopPropagation(); onEdit(row);
                    }} title={t('actions.edit')} iconLeft={<LuPencil />}
                    />
                    <Button variant="ghost" size="icon" onClick={(e) => {
                        e.stopPropagation(); onToggleStatus(row.id, row.active);
                    }} title={row.active ? t('actions.deactivate') : t('actions.activate')}
                    className={row.active ? "text-yellow-600 hover:text-yellow-700" : "text-green-600 hover:text-green-700"}
                    disabled={row.debtBalance > 0 && row.active}
                    iconLeft={row.active ? <LuPowerOff /> : <LuPower />}
                    />
                    <Button variant="ghost" size="icon" onClick={(e) => {
                        e.stopPropagation(); onDelete(row.id);
                    }}
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
        <Table<CustomerResponse>
                columns={columns}
                data={customers}
                keyExtractor={(customer) => customer.id}
                isLoading={isLoading}
                emptyMessage={t('customer.noCustomersFound')}
            >
                {(customer) => (
                    <tr key={customer.id}
                        onClick={() => onRowClick(customer)}
                        data-row-id={customer.id}
                        data-row-group="customers"
                        aria-selected={selectedRowId === customer.id}
                        className={clsx('transition-colors duration-150 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5', selectedRowId === customer.id && '!bg-brand-primary/10 dark:!bg-brand-accent/10')}>
                        {columns.map((col, index) => (
                            <td key={`${customer.id}-${index}`} className={clsx('px-4 py-3 whitespace-nowrap text-sm', col.className)}>
                                {typeof col.accessor === 'function' ? col.accessor(customer) : String(customer[col.accessor as keyof CustomerResponse] ?? '-')}
                            </td>
                        ))}
                    </tr>
                )}
            </Table>

    );
};
export default CustomersTable;
