// src/components/features/sales/SalesTable.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import type { SaleResponse } from '../../../api/types/domain';
import { formatCurrency, formatDate } from '../../../utils/formatters';

import Table, { type TableColumn } from '../../common/Table';
import Badge from '../../common/ui/Badge';
import Button from '../../common/ui/Button';
import { LuEye, LuTrash2 } from 'react-icons/lu';

export interface GroupHeader {
  isGroupHeader: true;
  groupKey: string;
  title: string;
  value: number;
}
export type SaleTableRow = SaleResponse | GroupHeader;

interface SalesTableProps {
    sales: SaleTableRow[];
    isLoading?: boolean;
    onViewDetails: (sale: SaleResponse) => void;
    onDelete: (id: number) => void;
    selectedRowId?: number | null;
}

const SalesTable: React.FC<SalesTableProps> = ({
    sales, isLoading, onViewDetails, onDelete, selectedRowId
}) => {
    const { t } = useTranslation();

    const columns: TableColumn<SaleResponse>[] = [
        { header: t('common.date'), accessor: (row) => formatDate(row.saleDate) },
        { header: t('common.items', "Items"), accessor: (row) => row.items.length, className: 'text-center' },
        { header: t('common.client'), accessor: (row) => row.customer?.name || t('sale.anonymous', 'Anonymous') },
        { header: t('common.paymentMethod'), accessor: (row) => (
            <Badge variant="subtle" colorScheme="gray">
                {t(`paymentMethods.${row.paymentMethod.toLowerCase()}`, row.paymentMethod.replace('_', ' '))}
            </Badge>
        ) }, 
        {
            header: t('sale.totalValue', 'Total'),
            accessor: (row) => formatCurrency(row.totalValue),
            className: 'text-right font-semibold'
        },
        {
            header: t('common.actions', 'Actions'),
            accessor: (row) => (
                <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" title={t('common.details')} onClick={(e) => { e.stopPropagation(); onViewDetails(row); }}>
                        <LuEye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title={t('actions.delete')} className="text-red-600 hover:text-red-700" onClick={(e) => { e.stopPropagation(); onDelete(row.id); }}>
                        <LuTrash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
            className: 'text-right',
        },
    ];
    
    return (
        <Table<SaleTableRow>
            columns={columns as TableColumn<SaleTableRow>[]}
            data={sales}
            keyExtractor={(row) => ('isGroupHeader' in row ? row.groupKey : row.id)}
            isLoading={isLoading}
            emptyMessage={t('sale.noSalesFound')}
        >
            {(row) => { // Usando a função "render prop"
                if ('isGroupHeader' in row) {
                    return (
                        <tr key={row.groupKey} className="bg-gray-100 dark:bg-gray-800/60 sticky top-0 z-10">
                            <td colSpan={columns.length} className="px-4 py-2 font-semibold">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-text-secondary">{row.title}</span>
                                    <span className="text-base text-brand-primary dark:text-brand-accent">{formatCurrency(row.value)}</span>
                                </div>
                            </td>
                        </tr>
                    );
                }

                const sale = row;
                return (
                    <tr
                        key={sale.id}
                        onClick={() => onViewDetails(sale)}
                        className={clsx('transition-colors duration-150 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5', selectedRowId === sale.id && '!bg-brand-primary/10 dark:!bg-brand-accent/10')}
                    >
                        {columns.map((col, index) => (
                            <td key={`${sale.id}-${index}`} className={clsx('px-4 py-3 whitespace-nowrap text-sm', col.className)}>
                                {typeof col.accessor === 'function' ? col.accessor(sale) : String(sale[col.accessor as keyof SaleResponse] ?? '—')}
                            </td>
                        ))}
                    </tr>
                );
            }}
        </Table>
    );
};

export default SalesTable;