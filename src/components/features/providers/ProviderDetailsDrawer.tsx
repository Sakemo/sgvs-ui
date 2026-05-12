import type React from "react";
import { useTranslation } from "react-i18next";
import { LuPackage, LuPencil, LuX } from "react-icons/lu";

import type { Page, ProductResponse, ProviderResponse } from "../../../api/types/domain";
import { formatCurrency } from "../../../utils/formatters";
import Pagination from "../../common/Pagination";
import Button from "../../common/ui/Button";

interface ProviderDetailsDrawerProps {
  provider: ProviderResponse;
  productsPage: Page<ProductResponse> | null;
  isLoadingProducts: boolean;
  onClose: () => void;
  onEdit: (provider: ProviderResponse) => void;
  onProductsPageChange: (page: number) => void;
}

const ProviderDetailsDrawer: React.FC<ProviderDetailsDrawerProps> = ({
  provider,
  productsPage,
  isLoadingProducts,
  onClose,
  onEdit,
  onProductsPageChange,
}) => {
  const { t } = useTranslation();

  return (
    <aside className="dark:text-gray-300 pb-2 flex flex-col rounded-card border border-border-light bg-card-light shadow-soft dark:border-border-dark dark:bg-card-dark !bg-brand-primary/10 dark:!bg-brand-accent/10">
      <header className="flex items-center justify-between p-1 border-b border-border-light dark:border-border-dark">
        <div className="space-y-1 p-4">
          <h2 className="text-xl font-semibold text-text-primary dark:text-gray-100">
            {provider.name}
          </h2>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-text-secondary dark:text-gray-400">
              <LuPackage className="h-4 w-4" />
            </span>
            {productsPage && (
              <span className="text-xs text-text-secondary dark:text-gray-400">
                {productsPage.totalElements} {t("common.items")}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(provider)} title={t('actions.edit')}>
            <LuPencil className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} title={t('actions.close')}>
            <LuX className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex-grow overflow-y-auto p-4">
        <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">

        <section className="mt-2 space-y-3">
          <div className="rounded-md border border-border-light dark:border-border-dark">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
                <tbody>
                  {isLoadingProducts ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-sm text-text-secondary">
                        {t("common.loading")}
                      </td>
                    </tr>
                  ) : productsPage && productsPage.content.length > 0 ? (
                    productsPage.content.map((product) => (
                      <tr key={product.id} className="border-t border-border-light dark:border-border-dark">
                        <td className="px-4 py-3 text-sm">{product.name}</td>
                        <td className="px-4 py-3 text-right text-sm font-medium">
                          {formatCurrency(product.salePrice)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm">
                          {product.stockQuantity}{" "}
                          {t(`unitOfSale.${product.unitOfSale.toLowerCase()}`)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-sm text-text-secondary">
                        {t("provider.noProductsFound")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {productsPage && productsPage.totalPages > 1 && (
            <Pagination
              currentPage={productsPage.number}
              totalPages={productsPage.totalPages}
              onPageChange={onProductsPageChange}
            />
          )}
        </section>

          <section>
            <div className="mt-1 space-y-1">
            <p className="text-xs uppercase tracking-[0.24em] text-text-secondary dark:text-gray-400">
              {t('provider.address')}
            </p>
            <div className="space-y-4 flex flex-wrap justify-between items-center gap-2">
              <p className="font-semibold text-justify text-sm leading-6 text-text-secondary dark:text-gray-400">
                {provider.address || t('product.details.noDescription', 'No address available')}
              </p>
            </div>
            </div>
            <div className="mt-3 space-y-1">
              <p className="text-xs uppercase tracking-[0.24em] text-text-secondary dark:text-gray-400">
                {t('provider.cnpj')}
              </p>
              <p className="font-semibold text-justify text-sm leading-6 text-text-secondary dark:text-gray-400">
                {provider.cnpj || t('common.notApplicable')}
              </p>
            </div>

            <div className="mt-3 space-y-1">
              <p className="text-xs uppercase tracking-[0.24em] text-text-secondary dark:text-gray-400">
                {t('provider.phone')}
              </p>
              <p className="font-semibold text-justify text-sm leading-6 text-text-secondary dark:text-gray-400">
                {provider.phone || t('common.notApplicable')}
              </p>
            </div>

            <div className="mt-3 space-y-1">
              <p className="text-xs uppercase tracking-[0.24em] text-text-secondary dark:text-gray-400">
                {t('provider.email')}
              </p>
              <p className="font-semibold text-justify text-sm leading-6 text-text-secondary dark:text-gray-400">
                {provider.email || t('common.notApplicable')}
              </p>
            </div>

            {provider.notes && (
              <div className="mt-3 space-y-1">
                <p className="text-xs uppercase tracking-[0.24em] text-text-secondary dark:text-gray-400">
                  {t('provider.notes')}
                </p>
                <p className="text-sm text-text-primary dark:text-gray-400">
                  {provider.notes}
                </p>
              </div>
            )}
          </section>
        </div>

      </div>
    </aside>
  );
};

export default ProviderDetailsDrawer;
