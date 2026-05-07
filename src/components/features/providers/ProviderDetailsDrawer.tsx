import type React from "react";
import { useTranslation } from "react-i18next";
import { LuPackage, LuPencil, LuX } from "react-icons/lu";

import type { Page, ProductResponse, ProviderResponse } from "../../../api/types/domain";
import { formatCurrency } from "../../../utils/formatters";
import { DetailRow } from "../../common/DetailRow";
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
    <aside className="flex h-full flex-col rounded-card border border-border-light bg-card-light shadow-soft dark:border-border-dark dark:bg-card-dark dark:text-gray-300">
      <header className="flex items-center justify-between border-b border-border-light p-4 dark:border-border-dark">
        <h2 className="text-lg font-semibold">{t("provider.details.title")}</h2>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(provider)}
            title={t("actions.edit")}
          >
            <LuPencil className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            title={t("actions.close")}
          >
            <LuX className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex-grow space-y-6 overflow-y-auto p-4">
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-secondary dark:text-gray-400">
            {t("provider.details.infoTitle")}
          </h3>
          <dl className="divide-y divide-border-light dark:divide-border-dark">
            <DetailRow label={t("common.name")} value={provider.name} />
            <DetailRow label={t("provider.cnpj")} value={provider.cnpj} />
            <DetailRow label={t("provider.phone")} value={provider.phone} />
            <DetailRow label={t("provider.email")} value={provider.email} />
            <DetailRow label={t("provider.address")} value={provider.address} />
            <DetailRow label={t("provider.notes")} value={provider.notes} />
          </dl>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-text-secondary dark:text-gray-400">
              <LuPackage className="h-4 w-4" />
              {t("provider.suppliedProducts")}
            </h3>
            {productsPage && (
              <span className="text-xs text-text-secondary dark:text-gray-400">
                {productsPage.totalElements} {t("common.items")}
              </span>
            )}
          </div>

          <div className="overflow-hidden rounded-card border border-border-light dark:border-border-dark">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
                <thead className="bg-card-light/60 dark:bg-card-dark/60">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      {t("product.table.name")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      {t("product.table.category")}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      {t("product.table.salePrice")}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      {t("product.table.stock")}
                    </th>
                  </tr>
                </thead>
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
                        <td className="px-4 py-3 text-sm">{product.category.name}</td>
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
      </div>
    </aside>
  );
};

export default ProviderDetailsDrawer;
