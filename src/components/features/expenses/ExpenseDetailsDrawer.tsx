import type React from "react";
import type { ExpenseResponse } from "../../../api/types/domain";
import { useTranslation } from "react-i18next";
import Button from "../../common/ui/Button";
import { LuPencil, LuX } from "react-icons/lu";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import Badge from "../../common/ui/Badge";

interface ExpenseDetailsDrawerProps {
    expense: ExpenseResponse;
    onClose: () => void;
    onEdit: (expense: ExpenseResponse) => void;
}

const DetailRow: React.FC<{ label: string; value?: React.ReactNode }> = ({
    label, value
}) => (
    <div className="flex justify-between dark:text-gray-300 py-3 sm:flex-row sm:items-start">
        <dt className="dark:text-gray-500 w-1/3 text-sm font-medium text-text-secondary">
            {label}
        </dt>
        <dd className="mt-1 text-sm text-text-primary dark:text-gray-100 sm:mt-0 sm:w-2/3">
            {value ?? <span className="text-text-secondary/70">_</span>}
        </dd>
    </div>
);

const ExpenseDetailsDrawer: React.FC<ExpenseDetailsDrawerProps> = ({
    expense, onClose, onEdit
}) => {
    const { t } = useTranslation();

    return (
        <aside className="dark:text-gray-300 pb-2 flex flex-col rounded-card border border-border-light bg-card-light shadow-soft dark:border-border-dark dark:bg-card-dark !bg-brand-primary/10 dark:!bg-brand-accent/10">
            <header className="flex items-center justify-between p-1 border-b border-border-light dark:border-border-dark">
                <div className="space-y-1 p-4">
                    <h2 className="text-xl font-semibold text-text-primary dark:text-gray-100">
                        {expense.name}
                    </h2>
                    <p className="text-sm text-text-secondary dark:text-gray-400">
                        {t('expense.detailsTitle')} · {t(`expenseCategories.${expense.expenseType.toLowerCase()}`)}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(expense)} title={t('actions.edit')}>
                        <LuPencil className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onClose} title={t('actions.close')}>
                        <LuX className="h-5 w-5" />
                    </Button>
                </div>
            </header>

            <div className="flex-grow overflow-y-auto p-4">
                <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
                    <section>
                        <div className="space-y-4">
                            <p className="text-sm leading-6 text-justify text-text-secondary dark:text-gray-400">
                                {expense.description || t('expense.details.noDescription', 'No description provided')}
                            </p>
                            <div className="flex flex-wrap justify-between items-center gap-2">
                                <Badge variant="subtle" colorScheme="blue">
                                    {t(`expenseCategories.${expense.expenseType.toLowerCase()}`)}
                                </Badge>
                                <Badge variant="outline" colorScheme="gray">
                                    {t(`paymentMethods.${expense.paymentMethod.toLowerCase()}`)}
                                </Badge>
                            </div>
                        </div>
                    </section>

                    <section>
                        <p className="text-xs uppercase tracking-[0.24em] text-text-secondary dark:text-gray-400">
                            {t('common.value')}
                        </p>
                        <p className="mt-1 text-3xl font-semibold text-text-primary dark:text-gray-100">
                            {formatCurrency(expense.value)}
                        </p>

                        <div className="mt-4 space-y-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.24em] text-text-secondary dark:text-gray-400">
                                    {t('expense.expenseDate')}
                                </p>
                                <p className="font-semibold text-justify text-sm leading-6 text-text-secondary dark:text-gray-400">
                                    {formatDate(expense.expenseDate, { showTime: true })}
                                </p>
                            </div>
                                                    <div>
                                <p className="text-xs uppercase tracking-[0.24em] text-text-secondary dark:text-gray-400">
                                    {t('common.updatedAt')}
                                </p>
                                <p className="font-semibold text-justify text-sm leading-6 text-text-secondary dark:text-gray-400">
                                    {formatDate(expense.updatedAt)}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </aside>
    );
};
export default ExpenseDetailsDrawer;
