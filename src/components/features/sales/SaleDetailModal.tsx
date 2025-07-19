import type React from "react";
import type { SaleResponse } from "../../../api/types/domain";
import { useTranslation } from "react-i18next";
import Modal from "../../common/Modal";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import Badge from "../../common/ui/Badge";
import Button from "../../common/ui/Button";

interface SaleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: SaleResponse | null;
}

const SaleDetailsModal: React.FC<SaleDetailsModalProps> = ({
  isOpen,
  onClose,
  sale,
}) => {
  const { t } = useTranslation();

  if (!sale) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${t("sale.details.title", "Sale Details")} #${sale.id}`}
      className="sm:max-w-2xl"
    >
      <div className="p-6 space-y-6">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
          <div>
            <dt className="text-sm font-medium text-text-secondary">
              {t("common.client", "Client")}
            </dt>
            <dd className="mt-1 text-base text-text-primary dark:text-white">
              {sale.customer?.name || t("sale.anonymous", "Anonymous")}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-text-secondary">
              {t("sale.saleDate", "Sale Date")}
            </dt>
            <dd className="mt-1 text-base text-text-primary dark:text-white">
              {formatDate(sale.saleDate)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-text-secondary">
              {t("common.paymentMethod", "Payment Method")}
            </dt>
            <dd className="mt-1">
              <Badge variant="subtle" colorScheme="blue">
                {t(
                  `paymentMethods.${sale.paymentMethod.toLowerCase()}`,
                  sale.paymentMethod.replace("_", " ")
                )}
              </Badge>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-text-secondary">
              {t("sale.totalValue", "Total Value")}
            </dt>
            <dd className="mt-1 text-xl font-bold text-brand-primary">
              {formatCurrency(sale.totalValue)}
            </dd>
          </div>
        </dl>

        <div>
          <h4 className="text-md font-semibold text-text-primary dark:text-white mb-2">
            {t("sale.items", "Items")} ({sale.items.length})
          </h4>
          <ul className="max-h-60 overflow-auto border border-border-light dark:border-border-dark rounded-md divide-y divide-border-light dark:divide-border-dark">
            {sale.items.map((item) => (
              <li
                key={item.id}
                className="p-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-white/5
                                    "
              >
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-xs text-text-secondary">
                    {item.quantity} x {formatCurrency(item.unitPrice)}
                  </p>
                </div>
                <p className="font-semibold">
                  {formatCurrency(item.totalValue)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {sale.description && (
          <div>
            <h4 className="text-sm font-medium text-text-secondary">
              {t("common.description", "Description")}
            </h4>
            <p className="mt-1 p-3 text-sm bg-gray-50 dark:bg-card-dark/50 rounded-m whitespace-pre-wrap">
              {sale.description}
            </p>
          </div>
        )}
      </div>

        <footer className="bg-gray-50 dark:bg-card-dark/50 px-6 py-4 flex justify-end">
            <Button variant="secondary" onClick={onClose}>
                {t('actions.close', 'Close')}
            </Button>
        </footer>
    </Modal>
  );
};
export default SaleDetailsModal;