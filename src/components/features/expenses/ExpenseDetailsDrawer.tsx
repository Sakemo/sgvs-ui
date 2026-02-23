import type React from "react";
import type { ExpenseResponse } from "../../../api/types/domain";
import { useTranslation } from "react-i18next";
import Button from "../../common/ui/Button";
import { LuPencil, LuX } from "react-icons/lu";
import { DetailRow } from "../../common/DetailRow";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import Badge from "../../common/ui/Badge";

interface ExpenseDetailsDrawerProps  {
    expense: ExpenseResponse;
    onClose: () => void;
    onEdit: (expense: ExpenseResponse) => void;
}

const ExpenseDetailsDrawer: React.FC<ExpenseDetailsDrawerProps> = ({
    expense, onClose, onEdit
}) => {
    const { t } = useTranslation();

    return (
        <aside className="h-full flex flex-col rounded-card border border-border-light bg-brand-primary/10 dark:!bg-brand-accent/10 dark:text-white">
            <header className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark ">
                <h2 className="text-lg font-semibold">
                    {t('expense.detailsTitle')} - {expense.name}
                </h2>
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(expense)} title={t('actions.edit')} iconLeft={<LuPencil />} />

                    <Button variant="ghost" size="icon" onClick={onClose} title={t('actions.close')} iconLeft={<LuX />} />
                </div>
            </header>

            <div className="flex-grow overflow-y-auto p-4">
                <dl className="divide-y divide-border-light dark:divide-border-dark">
                    <DetailRow label={t('common.name')} value={expense.name} />
                    <DetailRow label={t('common.value')} value={formatCurrency(expense.value)} />
                    <DetailRow label={t('common.category')} value={
                        <Badge variant="subtle" colorScheme="blue">
                            {t(`expenseCategories.${expense.expenseType.toLowerCase()}`)}
                        </Badge>
                    } />
                    <DetailRow label={t('expense.expenseDate')} value={formatDate(expense.expenseDate, { showTime: true })} />
                    <DetailRow label={t('common.paymentMethod')} value={
                        <Badge variant="outline" colorScheme="gray">
                            {t(`paymentMethods.${expense.paymentMethod.toLowerCase()}`)}
                        </Badge>
                    } />
                    <DetailRow label={t('common.createdAt')} value={formatDate(expense.updatedAt)} />
                </dl>
            </div>
        </aside>
    );
};
export default ExpenseDetailsDrawer;
