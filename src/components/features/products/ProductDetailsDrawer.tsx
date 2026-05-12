import type React from "react";
import { StockControlType, type ProductResponse } from "../../../api/types/domain";
import { useTranslation } from "react-i18next";
import Button from "../../common/ui/Button";
import { LuCheck, LuPencil, LuX } from "react-icons/lu";
import Badge from "../../common/ui/Badge";
import { calculateProfitMargin, formatCurrency, formatDate } from "../../../utils/formatters";
import { marginBadgeColors } from "./utils/MarginBadgeColors";
import PricingAssistant from "./utils/PricingAssistant";
import { useSettings } from "../../../contexts/utils/UseSettings";

interface ProductDetailsDrawerProps {
  product: ProductResponse;
  onClose: () => void;
  onEdit: (product: ProductResponse) => void;
}

const DetailRow: React.FC<{ label: string; value?: React.ReactNode }> = ({
  label, value
}) => (
  <div className="flex justify-between dark:text-gray-300 py-3 sm:flex-row sm:items-start">
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
  const { settings } = useSettings();
  const showPerItemStockIndicator =
    settings?.stockControlType !== undefined &&
    settings.stockControlType !== StockControlType.GLOBAL;

  const margin = calculateProfitMargin(product.salePrice, product.costPrice);
  const profitValue = product.costPrice !== null ? product.salePrice - product.costPrice : null;

  return (
    <aside className="dark:text-gray-300 h-full flex flex-col rounded-card border border-border-light bg-card-light shadow-soft dark:border-border-dark dark:bg-card-dark !bg-brand-primary/10 dark:!bg-brand-accent/10">
      <header className="flex items-center justify-between p-1 border-b border-border-light dark:border-border-dark">
        <div>
          <PricingAssistant status={margin.status} />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="subtle" colorScheme={marginBadgeColors[margin.status]}>
            {margin.formatted}
          </Badge>
          <Button variant="ghost" size="icon" onClick={() => onEdit(product)} title={t('actions.edit')}>
            <LuPencil className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} title={t('actions.close')}>
            <LuX className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex-grow overflow-y-auto p-4">
        <div className="grid col-2 row-2 gap-6">
          <section>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-3xl font-semibold text-text-primary dark:text-gray-100">
                  {product.name}<span className="px-2 italic text-xs text-text-secondary dark:text-gray-400">
                    {product.category.name}
                  </span>
                </h3>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-text-secondary dark:text-gray-400">
                    {t('product.details.providedBy', 'Fornecido por')}
                    <span className="px-1 text-sm italic text-text-secondary dark:text-gray-400">
                      {product.provider?.name ?? t('product.details.noProvider', 'Sem fornecedor')}
                    </span>
                  </p>

                  <p className="font-semibold text-justify mt-4 text-sm leading-6 text-text-secondary dark:text-gray-400">
                    {product.description || t('product.details.noDescription', 'Nenhuma descrição disponível')}
                  </p>
                    <p className="flex justify-between mt-4 text-sm font-medium text-text-secondary dark:text-gray-400">
                      {product.barcode || t('product.details.noBarcode', 'Sem código de barras')}
                      <Badge variant="outline" colorScheme={product.active ? 'green' : 'gray'}>
                        {product.active ? t('common.active') : t('common.inactive')}
                      </Badge>
                    </p>
                </div>
              </div>
              <div className="rounded-full px-4 py-2 text-lg font-semibold">
                {product.stockQuantity}<span className="font-semibold text-justify text-sm leading-6 text-text-secondary dark:text-gray-400">/{product.minimumStock}</span>
                <div className="mt-6 space-y-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-text-secondary dark:text-gray-400">
                      {t('product.salePrice')}
                    </p>
                    <p className="mt-2 text-xl font-semibold text-text-primary dark:text-gray-100">
                      {formatCurrency(product.salePrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-text-secondary dark:text-gray-400">
                      {t('product.costPrice')}
                    </p>
                    <p className="font-semibold text-justify text-sm leading-6 text-text-secondary dark:text-gray-400">
                      {product.costPrice !== null ? formatCurrency(product.costPrice) : t('common.notAvailable', 'Indisponível')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-text-secondary dark:text-gray-400">
                      {t('product.profit')}
                    </p>
                    <p className="font-semibold text-justify text-sm leading-6 text-text-secondary dark:text-gray-400">
                      {profitValue !== null ? formatCurrency(profitValue) : t('common.na', 'N/A')}
                    </p>
                  </div>

                </div>
              </div>
            </div>


          </section>

            <section className="mt-1 flex flex-row justify-end gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-text-secondary dark:text-gray-400">
                      {t('common.createdAt')}
                    </p>
                    <p className="font-semibold text-justify text-sm leading-6 text-text-secondary dark:text-gray-400">
                      {formatDate(product.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-text-secondary dark:text-gray-400">
                      {t('common.updatedAt')}
                    </p>
                    <p className="font-semibold text-justify text-sm leading-6 text-text-secondary dark:text-gray-400">
                      {formatDate(product.updatedAt)}
                    </p>
                  </div>
            </section>
        </div>
      </div>
    </aside>
  );
};

export default ProductDetailsDrawer;
