import type React from "react";
import type { ProductResponse } from "../../../api/types/domain";
import { useTranslation } from "react-i18next";
import Button from "../../common/ui/Button";
import { LuPencil, LuX } from "react-icons/lu";
import Badge from "../../common/ui/Badge";
import { formatCurrency, formatDate } from "../../../utils/formatters";

interface ProductDetailsDrawerProps {
    product: ProductResponse;
    onClose: () => void;
    onEdit: (product: ProductResponse) => void;
}

const DetailRow: React.FC<{ label: string; value?: React.ReactNode }> = ({
    label, value
}) => (
    <div className="dark:text-gray-300 flex flex-col py-3 sm:flex-row sm:items-start">
        <dt className="dark:text-gray-500 w-1/3 text-sm font-medium text-text-secondary">
            {label}
        </dt>
        <dd className="mt-1 text-sm text-text-primary dark:text-gray-100 sm:mt-0 sm:w-2/3">
            {value ?? <span className="text-text-secondary/70">
            _
            </span>}
        </dd>
    </div>
);

const ProductDetailsDrawer: React.FC<ProductDetailsDrawerProps> = ({
    product, onClose, onEdit
}) => {
    const { t } = useTranslation();

    return (
    <aside className="dark:text-gray-300 h-full flex flex-col rounded-card border border-border-light bg-card-light shadow-soft dark:border-border-dark dark:bg-card-dark !bg-brand-primary/10 dark:!bg-brand-accent/10">
      
      {/* Cabeçalho do Drawer */}
      <header className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
        <h2 className="text-lg font-semibold">{t('product.details.title', 'Product Details')}</h2>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => onEdit(product)} title={t('actions.edit', 'Edit')}>
            <LuPencil className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} title={t('actions.close', 'Close')}>
            <LuX className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Corpo do Drawer com scroll */}
      <div className="flex-grow overflow-y-auto p-4">
        <dl className="divide-y divide-border-light dark:divide-border-dark">
          <DetailRow label={t('common.name', 'Name')} value={product.name} />
          <DetailRow label={t('common.category', 'Category')} value={product.category.name} />
          <DetailRow label={t('common.description', 'Description')} value={product.description} />
          <DetailRow label={t('product.barcode', 'Barcode')} value={product.barcode} />
          <DetailRow label={t('product.salePrice', 'Sale Price')} value={formatCurrency(product.salePrice)} />
          <DetailRow label={t('product.costPrice', 'Cost Price')} value={product.costPrice ? formatCurrency(product.costPrice) : undefined} />
          <DetailRow label={t('product.unitOfSale', 'Unit of Sale')} value={
              <span className="capitalize">{product.unitOfSale.toLowerCase()}</span>
            } 
          />
          <DetailRow label={t('common.status', 'Status')} value={
              <Badge variant="outline" colorScheme={product.active ? 'green' : 'gray'}>
                {product.active ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
              </Badge>
            } 
          />
          <DetailRow label={t('common.stock', 'Stock')} value={`${product.stockQuantity} ${product.unitOfSale.toLowerCase()}`} />
          <DetailRow label={t('product.provider', 'Provider')} value={product.provider?.name} />
          <DetailRow label={t('common.createdAt', 'Created At')} value={formatDate(product.createdAt)} />
          <DetailRow label={t('common.updatedAt', 'Last Updated')} value={formatDate(product.updatedAt)} />
        </dl>
      </div>
    </aside>
  );
};

export default ProductDetailsDrawer;