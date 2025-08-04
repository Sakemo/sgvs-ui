import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../common/Modal";
import Button from "../../common/ui/Button";
import Select from "../../common/ui/Select";
import { PaymentMethod, type SaleResponse } from "../../../api/types/domain";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import { DetailRow } from "../../common/DetailRow";

interface PaySaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: SaleResponse;
  onConfirm: (
    saleId: number,
    customerId: number,
    amount: number,
    paymentMethod: PaymentMethod
  ) => void;
}

const PaySaleModal: React.FC<PaySaleModalProps> = ({
  isOpen,
  onClose,
  sale,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CASH
  );
  const [isLoading, setIsLoading] = useState(false);

  // Filtra para não incluir ON_CREDIT como opção de pagamento
  const paymentOptions = Object.values(PaymentMethod).filter(
    (pm) => pm !== PaymentMethod.ON_CREDIT
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onConfirm(
        sale.id,
        sale.customer!.id,
        sale.totalValue,
        paymentMethod
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("payment.settleTitle", "Settle Payment")}
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="space-y-2 p-4 border rounded-md bg-gray-50 dark:bg-gray-800/50">
          <DetailRow label={t("common.client")} value={sale.customer?.name} />
          <DetailRow
            label={t("common.date")}
            value={formatDate(sale.saleDate)}
          />
          <DetailRow
            label={t("common.value")}
            value={formatCurrency(sale.totalValue)}
            valueClassName="font-bold text-lg"
          />
        </div>

        <Select
          label={t("common.paymentMethod")}
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
          required
        >
          {paymentOptions.map((pm) => (
            <option key={pm} value={pm}>
              {t(`paymentMethods.${pm.toLowerCase()}`, pm)}
            </option>
          ))}
        </Select>

        <div className="flex justify-end gap-2 pt-4 border-t border-border-light dark:border-border-dark">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            {t("actions.cancel")}
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {t("actions.confirmPayment", "Confirm Payment")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PaySaleModal;
