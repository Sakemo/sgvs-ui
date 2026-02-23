import type React from "react";
import type { ProductResponse } from "../../../api/types/domain";
import { useTranslation } from "react-i18next";
import Button from "../../common/ui/Button";
import { LuPencil, LuX } from "react-icons/lu";
import Badge from "../../common/ui/Badge";
import { calculateProfitMargin, formatCurrency, formatDate } from "../../../utils/formatters";
import { marginBadgeColors } from "./utils/MarginBadgeColors";
import PricingAssistant from "./utils/PricingAssistant";

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

    const margin = calculateProfitMargin(product.salePrice, product.costPrice);

    return (
    <aside className="dark:text-gray-300 h-full flex flex-col rounded-card border border-border-light bg-card-light shadow-soft dark:border-border-dark dark:bg-card-dark !bg-brand-primary/10 dark:!bg-brand-accent/10">
      
      {/* Cabeçalho do Drawer */}
      <header className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
        <h2 className="text-lg font-semibold">{t('product.details.title')}</h2>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => onEdit(product)} title={t('actions.edit')}>
            <LuPencil className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} title={t('actions.close')}>
            <LuX className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Corpo do Drawer com scroll */}
      <div className="flex-grow overflow-y-auto p-4">
        <PricingAssistant status={margin.status} />
        <dl className="divide-y divide-border-light dark:divide-border-dark">
          <DetailRow label={t('common.status')} value={
              <Badge variant="outline" colorScheme={product.active ? 'green' : 'gray'}>
                {product.active ? t('common.active') : t('common.inactive')}
              </Badge>
            } 
          />
          <DetailRow label={t('common.name')} value={product.name} />
          <DetailRow label={t('common.category')} value={product.category.name} />
          <DetailRow label={t('product.margin')} value={     <Badge variant="subtle" colorScheme={marginBadgeColors[margin.status]}>
              {margin.formatted}
            </Badge>} />
          <DetailRow label={t('product.salePrice')} value={
            formatCurrency(product.salePrice)
          } />
          <DetailRow label={t('product.costPrice')} value={product.costPrice ? formatCurrency(product.costPrice) : undefined} />
          <DetailRow label={t('common.stock')} value={`${product.stockQuantity} ${t(`unitOfSale.${product.unitOfSale.toLowerCase()}`)}`} />
          <DetailRow label={t('product.unitOfSale')} value={
              <span className="capitalize">{t(`unitOfSale.${product.unitOfSale.toLowerCase()}`)}</span>
            }
          />
          <DetailRow label={t('product.barcode')} value={product.barcode} />
          <DetailRow label={t('product.provider')} value={product.provider?.name} />
          <DetailRow label={t('common.description')} value={product.description} />
          <DetailRow label={t('common.createdAt')} value={formatDate(product.createdAt)} />
          <DetailRow label={t('common.updatedAt')} value={formatDate(product.updatedAt)} />
        </dl>
      </div>
    </aside>
  );
};

export default ProductDetailsDrawer;
