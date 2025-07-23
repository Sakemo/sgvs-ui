import React from 'react';
import { useTranslation } from 'react-i18next';
import { type ProductResponse, UnitOfSale } from '../../../api/types/domain';
import Table, { type TableColumn } from '../../common/Table';
import Button from '../../common/ui/Button';
import Badge from '../../common/ui/Badge';
import { formatCurrency } from '../../../utils/formatters';
import { LuCopy, LuPencil, LuPower, LuPowerOff, LuTrash2 } from 'react-icons/lu';

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
    {
      header: t('product.table.name', 'Name'),
      accessor: 'name',
      headerClassName: 'w-1/3',
    },
    {
      header: t('product.table.category', 'Category'),
      accessor: (row) => row.category?.name || '—',
    },
    {
      header: t('product.table.salePrice', 'Price'),
      accessor: (row) => formatCurrency(row.salePrice),
      className: 'text-right font-medium',
      headerClassName: 'text-right',
    },
    {
      header: t('product.table.stock', 'Stock'),
      accessor: (row) => `${row.stockQuantity} ${row.unitOfSale === UnitOfSale.UNIT ? 'un' : 'kg/L'}`,
      className: 'text-center',
      headerClassName: 'text-center',
    },
    {
      header: t('product.table.status', 'Status'),
      accessor: (row) => (
        <Badge variant="subtle" colorScheme={row.active ? 'blue' : 'gray'}>
          {row.active ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
        </Badge>
      ),
      className: 'text-center',
      headerClassName: 'text-center',
    },
    {
      header: t('common.actions', 'Actions'),
      accessor: (row) => (
        <div className="flex justify-end items-center gap-1">
          <Button variant="ghost" size="icon" title={t('actions.copy', 'Copy')} onClick={(e) => { e.stopPropagation(); onCopy(row.id); }}>
            <LuCopy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title={t('actions.edit', 'Edit')} onClick={(e) => { e.stopPropagation(); onEdit(row); }}>
            <LuPencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost" size="icon"
            title={row.active ? t('actions.deactivate', 'Deactivate') : t('actions.activate', 'Activate')}
            onClick={(e) => { e.stopPropagation(); onToggleStatus(row.id, row.active); }}
            className={row.active ? "text-orange-600 dark:text-orange-300 hover:text-orange-700 dark:hover:text-orange-400" : "text-green-600 dark:text-green-300 hover:text-green-700 dark:hover:text-green-700"}
            iconLeft={row.active ? <LuPowerOff /> : <LuPower />}
          >
          </Button>
          <Button variant="ghost" size="icon" title={t('actions.delete', 'Delete')} className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500" onClick={(e) => { e.stopPropagation(); onDelete(row.id); }}>
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
      isLoading={isLoading}
      emptyMessage={t('product.table.empty', 'No products found.')}
      onRowClick={onRowClick}
      selectedRowId={selectedProductId}
    />
  );
};

export default ProductsTable;