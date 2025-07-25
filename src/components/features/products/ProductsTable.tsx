// src/components/features/products/ProductsTable.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { type ProductResponse, UnitOfSale } from '../../../api/types/domain';

import Table, { type TableColumn } from '../../common/Table';
import Button from '../../common/ui/Button';
import Badge from '../../common/ui/Badge';
import { calculateProfitMargin, formatCurrency, formatTimeAgo } from '../../../utils/formatters';
import { LuCopy, LuPencil, LuPower, LuPowerOff, LuTrash2 } from 'react-icons/lu';
import { marginBadgeColors } from './utils/MarginBadgeColors';

interface ProductsTableProps {
  products: ProductResponse[];
  isLoading?: boolean;
  onEdit: (product: ProductResponse) => void;
  onToggleStatus: (id: number, currentStatus: boolean) => void;
  onDelete: (id: number) => void;
  onCopy: (id: number) => void;
  onRowClick: (product: ProductResponse) => void;
  selectedProductId?: number | null;
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  isLoading,
  onEdit,
  onToggleStatus,
  onDelete,
  onCopy,
  onRowClick,
  selectedProductId,
}) => {
  const { t } = useTranslation();

  const columns: TableColumn<ProductResponse>[] = [
    { header: t('product.table.name'), accessor: 'name', headerClassName: 'w-1/3' },
    { header: t('product.table.category'), accessor: (row) => row.category?.name || '—' },
    { header: t('product.table.salePrice'), accessor: (row) => formatCurrency(row.salePrice), className: 'text-right font-medium' },
    { header: t('product.table.margin', 'Profit Margin'), accessor: (row) => {
      const margin = calculateProfitMargin(row.salePrice, row.costPrice);
      return (
        <Badge variant="subtle" colorScheme={marginBadgeColors[margin.status]}>
          {margin.formatted}
        </Badge>
      )
    }, className: 'text-center',
    headerClassName: 'text-center', },
    { header: t('product.table.stock'), accessor: (row) => `${row.stockQuantity} ${row.unitOfSale === UnitOfSale.UNIT ? 'un' : 'kg/L'}`, className: 'text-center' },
    { header: t('product.table.status'), accessor: (row) => ( <Badge variant="outline" colorScheme={row.active ? 'green' : 'gray'}>{row.active ? t('common.active') : t('common.inactive')}</Badge> ), className: 'text-center' },
    { header: t('product.table.lastUpdated'), accessor: (row) => formatTimeAgo(row.updatedAt) },
    {
      header: t('common.actions'),
      accessor: (row) => (
        <div className="flex justify-end items-center gap-1">
          <Button variant="ghost" size="icon" title={t('actions.copy')} onClick={(e) => { e.stopPropagation(); onCopy(row.id); }}>
            <LuCopy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title={t('actions.edit')} onClick={(e) => { e.stopPropagation(); onEdit(row); }}>
            <LuPencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title={row.active ? t('actions.deactivate') : t('actions.activate')} onClick={(e) => { e.stopPropagation(); onToggleStatus(row.id, row.active); }} className={row.active ? "text-yellow-600 hover:text-yellow-700" : "text-green-600 hover:text-green-700"}>
            {row.active ? <LuPowerOff className="h-4 w-4" /> : <LuPower className="h-4 w-4" />}
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
    <Table<ProductResponse>
      columns={columns}
      data={products}
      keyExtractor={(product) => product.id}
      isLoading={isLoading}
      emptyMessage={t('product.table.empty')}
    >
      {(product) => (
        <tr
          key={product.id}
          onClick={() => onRowClick(product)}
          className={clsx('transition-colors duration-150 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5', selectedProductId === product.id && '!bg-brand-primary/10 dark:!bg-brand-accent/10')}
        >
          {columns.map((col) => (
            <td key={`${product.id}-${col.header}`} className={clsx('px-4 py-3 whitespace-nowrap text-sm', col.className)}>
              {typeof col.accessor === 'function' ? col.accessor(product) : String(product[col.accessor as keyof ProductResponse] ?? '—')}
            </td>
          ))}
        </tr>
      )}
    </Table>
  );
};

export default ProductsTable;