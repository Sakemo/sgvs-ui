import type React from "react";
import type { CustomerResponse } from "../../../api/types/domain";
import { useTranslation } from "react-i18next";
import Modal from "../../common/Modal";
import Badge from "../../common/ui/Badge";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import Button from "../../common/ui/Button";
import { DetailRow } from "../../common/DetailRow";

interface CustomerDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    customer: CustomerResponse | null;
}

const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
    isOpen, onClose, customer
}) => {
    const { t } = useTranslation();

    if(!customer) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('customer.details.title', 'Customer Details')}>
            <div className="p-6">
                <div className="border-b border-border-light dark:border-border-dark pb-4 mb-4">
                    <h3 className="text-lg font-semibold leading-6 text-text-primary dark:text-white">
                        {customer.name}
                    </h3>
            </div>
                <dl className="divide-y divide-border-light dark:divider-border-dark">
                    <DetailRow label={t('customer.taxId')} value={customer.taxId} />
                    <DetailRow label={t('common.status', 'Status')} value={
                        <Badge variant="outline" colorScheme={customer.active ? 'green' : 'gray'}>
                            {customer.active ? t('common.active') : t('common.inactive')}
                        </Badge>
                    } />
                    <DetailRow label={t('customer.phone', 'Phone')} value={customer.phone}/>
                    <DetailRow label={t('customer.address', 'Address')} value={customer.address}/>
                    <DetailRow label={t('customer.creditEnabled', 'Credit Enabled')} value={
                        <span className={customer.creditEnabled ? 'text-green-600' : 'text-red-600'}>
                            {customer.creditEnabled ? t('common.yes', 'Yes') : t('common.no', 'No')}
                        </span>
                    }/>

                    {customer.creditEnabled && (
                        <>
                            <DetailRow label={t('customer.creditLimit', 'Credit Limit')} value={formatCurrency(customer.creditLimit)} />
                            <DetailRow label={t('customer.debtBalance', 'Debt Balance')} value={formatCurrency(customer.debtBalance)} />
                            <DetailRow label={t('customer.lastCreditPurchase', 'Last Credit Purchase')} value={customer.lastCreditPurchaseAt ? formatDate(customer.lastCreditPurchaseAt) : undefined} />
                        </>
                    )}
                    <DetailRow label={t('common.createdAt', 'Member Since')} value={formatDate(customer.createdAt, { showTime: false })} />
                    <DetailRow label={t('common.updatedAt', 'Last Updated')} value={formatDate(customer.updatedAt)} />
                </dl>
            </div>
            <div className="bg-gray-50 dark:bg-card-dark/50 px-6 py-3 flex justify-end">
                    <Button variant="secondary" onClick={onClose}>
                        {t('actions.close', 'Close')}
                    </Button>
            </div>
        </Modal>
    )
}
export default CustomerDetailsModal;