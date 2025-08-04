// src/components/features/customers/CustomerPaymentModal.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getPendingSalesByCustomer } from '../../../api/services/sale.service';
import { recordPayment } from '../../../api/services/payment.service';
import { type CustomerResponse, type SaleResponse, PaymentMethod } from '../../../api/types/domain';

import Modal from '../../common/Modal';
import Button from '../../common/ui/Button';
import Select from '../../common/ui/Select';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { notificationService } from '../../../lib/notification.service';
import { LuLoader } from 'react-icons/lu';

interface CustomerPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  customer: CustomerResponse;
}

const CustomerPaymentModal: React.FC<CustomerPaymentModalProps> = ({ isOpen, onClose, onPaymentSuccess, customer }) => {
  const { t } = useTranslation();

  // Estados
  const [pendingSales, setPendingSales] = useState<SaleResponse[]>([]);
  const [selectedSaleIds, setSelectedSaleIds] = useState<Set<number>>(new Set());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Busca as vendas pendentes quando o modal abre
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      getPendingSalesByCustomer(customer.id)
        .then(setPendingSales)
        .catch(() => notificationService.error(t('errors.fetchPendingSales', 'Failed to load pending sales.')))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, customer.id, t]);

  // Lógica para seleção de vendas
  const handleSelectSale = (saleId: number) => {
    setSelectedSaleIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(saleId)) {
        newSet.delete(saleId);
      } else {
        newSet.add(saleId);
      }
      return newSet;
    });
  };

  // Calcula o total a pagar com base na seleção
  const totalToPay = useMemo(() => {
    return pendingSales
      .filter(sale => selectedSaleIds.has(sale.id))
      .reduce((total, sale) => total + sale.totalValue, 0);
  }, [pendingSales, selectedSaleIds]);

  // Opções de pagamento (sem ON_CREDIT)
  const paymentOptions = Object.values(PaymentMethod).filter(pm => pm !== PaymentMethod.ON_CREDIT);

  // Handler para submeter o pagamento
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSaleIds.size === 0) {
      notificationService.warning(t('payment.noSalesSelected', 'Please select at least one sale to pay.'));
      return;
    }
    setIsSubmitting(true);
    try {
      await recordPayment({
        customerId: customer.id,
        saleIds: Array.from(selectedSaleIds),
        amountPaid: totalToPay,
        paymentMethod: paymentMethod,
      });
      onPaymentSuccess();
    } catch (err) {
      notificationService.error(t('errors.recordPayment' + err, 'Failed to record payment.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${t('payment.settleDebtFor', 'Settle Debt for')} ${customer.name}`}>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <LuLoader className="animate-spin h-8 w-8 text-text-secondary" />
          </div>
        ) : pendingSales.length === 0 ? (
          <p className="text-center text-text-secondary py-10">{t('payment.noPendingSales', 'This customer has no pending sales.')}</p>
        ) : (
          <>
            <div className="max-h-60 overflow-y-auto border rounded-md p-2 space-y-2 bg-gray-50 dark:bg-gray-800/50">
              {pendingSales.map(sale => (
                <div key={sale.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50">
                  <input
                    type="checkbox"
                    checked={selectedSaleIds.has(sale.id)}
                    onChange={() => handleSelectSale(sale.id)}
                    className="h-5 w-5 rounded text-brand-primary focus:ring-brand-primary"
                  />
                  <div className="flex-grow flex justify-between items-center text-sm">
                    <div>
                      <p><strong>ID:</strong> {sale.id} - {formatDate(sale.saleDate)}</p>
                      <p className="text-xs text-text-secondary">{sale.items.length} {t('common.items')}</p>
                    </div>
                    <p className="font-semibold">{formatCurrency(sale.totalValue)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border-light dark:border-border-dark space-y-3">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>{t('payment.totalToPay', 'Total to Pay')}:</span>
                <span className="text-brand-primary dark:text-brand-accent">{formatCurrency(totalToPay)}</span>
              </div>
              <Select
                label={t('common.paymentMethod')}
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                required
              >
                {paymentOptions.map((pm) => (
                  <option key={pm} value={pm}>{t(`paymentMethods.${pm.toLowerCase()}`, pm)}</option>
                ))}
              </Select>
            </div>
          </>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            {t('actions.cancel')}
          </Button>
          <Button type="submit" isLoading={isSubmitting} disabled={isLoading || pendingSales.length === 0}>
            {t('actions.confirmPayment', 'Confirm Payment')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CustomerPaymentModal;