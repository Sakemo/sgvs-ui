import type React from "react";
import type { SaleResponse } from "../../../api/types/domain";
import { useTranslation } from "react-i18next";
import Table, { type TableColumn } from "../../common/Table";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import Badge from "../../common/ui/Badge";
import Button from "../../common/ui/Button";
import { LuEye, LuTrash2 } from "react-icons/lu";

interface SalesTableProps {
    sales: SaleResponse[],
    isLoading?: boolean;
    onViewDetails: (sale: SaleResponse) => void;
    onDelete: (id: number) => void;
}

const SalesTable: React.FC<SalesTableProps> = ({
    sales, isLoading, onViewDetails, onDelete
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
            header: t('common.actions'),
            accessor: (row) => (
                <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" title={t('common.details')} onClick={() => onViewDetails(row)} iconLeft={<LuEye />} />
                    <Button variant="ghost" size="icon" title={t('actions.delete')} className="text-red-600 hover:text-red-700" onClick={() => onDelete(row.id)} iconLeft={<LuTrash2 />} />
                </div>
            ),
            className: 'text-right',
        },
    ];

    return <Table<SaleResponse> columns={columns} data={sales} isLoading={isLoading} emptyMessage={t('sale.noSalesFound')} onRowClick={onViewDetails} />;
};
export default SalesTable;