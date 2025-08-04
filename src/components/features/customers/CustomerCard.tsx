import { useTranslation } from "react-i18next";
import type { CustomerResponse } from "../../../api/types/domain";
import Card from "../../common/ui/Card";
import Badge from "../../common/ui/Badge";
import clsx from "clsx";
import { formatCurrency } from "../../../utils/formatters";
import Button from "../../common/ui/Button";
import { LuCircleDollarSign, LuEye, LuPencil, LuPower, LuPowerOff, LuTrash2 } from "react-icons/lu";

interface CustomerCardProps {
    customer: CustomerResponse;
    onEdit: (customer: CustomerResponse) => void;
    onToggleStatus: (id: number, currentStatus: boolean) => void;
    onViewDetails: (customer: CustomerResponse) => void;
    onDelete: (id: number) => void;
    onSettleDebt: (customer: CustomerResponse) => void;
}

const CustomerCard: React.FC<CustomerCardProps> = ({
    customer, onEdit, onToggleStatus, onDelete, onViewDetails, onSettleDebt
}) => {
    const { t } = useTranslation();
    const hasDebt = customer.debtBalance > 0;

    return (
        <Card className="flex flex-col h-full">
            <div className="flex-grow">
                <header className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-text-primary dark:text-white mr-2 truncate" title={customer.name}>
                        {customer.name}
                    </h3>
                    <Badge variant="outline" colorScheme={customer.active ? 'green' : 'gray'}>
                        {customer.active ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
                    </Badge>
                </header>
 
                <div className="space-y-1 text-sm text-text-secondary ">
                    <p><strong>{t('customer.taxId', 'Tax ID')}:   </strong>
                    {customer.taxId ? customer.taxId : t('common.notApplicable')}
                    </p>
                    <p><strong>{t('customer.phone', 'Phone')}:  </strong>
                        {customer.phone ? customer.phone : t('common.notApplicable')}
                    </p>
                </div>

                {customer.creditEnabled &&
                    (<div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark space-y-1">
                        <p className="text-sm font-semibold">
                            {t('customer.creditInfo', 'Credit Info')}
                        </p>
                        <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">
                                {t('customer.debtBalance', 'Debt Balance')}: 
                            </span>
                            <span className={clsx('font-medium', hasDebt ? 'text-red-500' : 'text-green-600')}>
                                {formatCurrency(customer.debtBalance)}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs text-text-secondary">
                            <span>{t('customer.creditLimit', 'Limit')}: </span>
                            <span>{
                                customer.creditLimit ? formatCurrency(customer.creditLimit) : t('common.notApplicable')
                                }</span>
                        </div>
                    </div>
                )}
            </div>

            <footer className="mt-4 pt-4 border-t border-border-light dark:border-border-dark flex justify-end items-center gap-1">
                <Button variant="ghost" size="icon" title={t('common.details', 'Details')} onClick={() => onViewDetails(customer)} iconLeft={<LuEye/>}/>
                {hasDebt && (
                    <Button variant="ghost" size="icon" title={t('actions.settleDebt', 'Settle Debt')} onClick={() => onSettleDebt(customer)}
                    className="text-green-600 hover:text-green-700" iconLeft={<LuCircleDollarSign />}>
                        
                    </Button>
                )}
                <Button variant="ghost" size="icon" title={t('actions.edit')} onClick={() => onEdit(customer)} iconLeft={<LuPencil />} /> 
                <Button variant="ghost" size="icon" title={customer.active ? t('actions.deactivate') : t('actions.activate')} onClick={() => onToggleStatus(customer.id, customer.active)} className={customer.active ? "text-yellow-600 hover:text-yellow-700" : "text-green-600 hover:text-green-700"} disabled={hasDebt && customer.active} iconLeft={customer.active ? <LuPowerOff /> : <LuPower />} />
                <Button variant="ghost" size="icon" title={t('actions.delete')} className="text-red-600 hover:text-red-700" onClick={() => onDelete(customer.id)} iconLeft={<LuTrash2 />} />
            </footer>
        </Card>
    )
}
export default CustomerCard;