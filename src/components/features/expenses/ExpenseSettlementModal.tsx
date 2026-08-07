import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PaymentMethod } from "../../../api/types/domain";
import type { ExpenseResponse } from "../../../api/types/domain";
import { settleExpense } from "../../../api/services/expense.service";
import { notificationService } from "../../../lib/notification.service";
import Modal from "../../common/Modal";
import Button from "../../common/ui/Button";
import Select from "../../common/ui/Select";
import Input from "../../common/ui/Input";
import { DetailRow } from "../../common/DetailRow";
import { formatCurrency, formatDate } from "../../../utils/formatters";

interface ExpenseSettlementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSettleSuccess: () => void;
    expense: ExpenseResponse;
}

const paymentOptions = Object.values(PaymentMethod).filter(
    (paymentMethod) => paymentMethod !== PaymentMethod.ON_CREDIT,
);

const ExpenseSettlementModal: React.FC<ExpenseSettlementModalProps> = ({
    isOpen,
    onClose,
    onSettleSuccess,
    expense,
}) => {
    const { t } = useTranslation();
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
    const [cashReferenceNumber, setCashReferenceNumber] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            await settleExpense(expense.id, {
                paymentMethod,
                cashReferenceNumber: paymentMethod === PaymentMethod.CASH ? cashReferenceNumber : null,
            });
            notificationService.success(t("expense.settleSuccess", "Expense settled successfully."));
            onSettleSuccess();
        } catch (error) {
            notificationService.error(t("errors.settleExpense", "Failed to settle expense. Please try again."));
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t("expense.settleExpenseTitle", "Settle Expense")}> 
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-3 p-4 rounded-md bg-gray-50 dark:bg-gray-800/50 border border-border-light dark:border-border-dark">
                    <DetailRow label={t("common.name")} value={expense.name} />
                    <DetailRow label={t("common.value")} value={formatCurrency(expense.value)} />
                    <DetailRow label={t("expense.expenseDate")} value={formatDate(expense.expenseDate)} />
                </div>

                <Select
                    label={t("common.paymentMethod")}
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    required
                >
                    {paymentOptions.map((method) => (
                        <option key={method} value={method}>
                            {t(`paymentMethods.${method.toLowerCase()}`)}
                        </option>
                    ))}
                </Select>

                {paymentMethod === PaymentMethod.CASH && (
                    <Input
                        label={t("expense.settlementCashReference")}
                        placeholder={t("expense.settlementCashReferenceOptional", "Optional reference")}
                        value={cashReferenceNumber}
                        onChange={(e) => setCashReferenceNumber(e.target.value)}
                    />
                )}

                <div className="flex justify-end gap-2 pt-4 border-t border-border-light dark:border-border-dark">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                        {t("actions.cancel")}
                    </Button>
                    <Button type="submit" isLoading={isSubmitting}>
                        {t("actions.confirmPayment")}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default ExpenseSettlementModal;
