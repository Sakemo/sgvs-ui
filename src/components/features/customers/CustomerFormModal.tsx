import type React from "react";
import type { CustomerRequest, CustomerResponse } from "../../../api/types/domain";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { createCustomer, updateCustomer } from "../../../api/services/customer.service";
import type { AxiosError } from "axios";
import Modal from "../../common/Modal";
import Input from "../../common/ui/Input";
import Textarea from "../../common/ui/Textarea";
import Button from "../../common/ui/Button";
import AdvancedOptions from "../../common/AdvancedOptions";

interface CustomerFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveSucess:() => void;
    customerToEdit?: CustomerResponse | null;
}

const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
    isOpen, onClose, onSaveSucess, customerToEdit
}) => {
    const { t } = useTranslation();
    const isEditMode = !!customerToEdit;

    const getInitalFormData = useCallback((): CustomerRequest => {
        if(isEditMode && customerToEdit) {
            return {
                name: customerToEdit.name,
                taxId: customerToEdit.taxId,
                phone: customerToEdit.phone,
                address: customerToEdit.address,
                creditEnabled: customerToEdit.creditEnabled,
                creditLimit: customerToEdit.creditLimit,
                active: customerToEdit.active
            };
        }
        return { name: '', creditEnabled: false, active: true };
    }, [isEditMode, customerToEdit]);

    const [formData, setFormData] = useState<Partial<CustomerRequest>>(getInitalFormData());
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if(isOpen) {
            setFormData(getInitalFormData());
            setErrors({});
        }
    }, [isOpen, getInitalFormData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === "checkbox";
        const isNumber = type === "number";

        setFormData(prev => ({ ...prev, [name]: isCheckbox ? (e.target as HTMLInputElement).checked : isNumber ? (value === '' ? undefined : parseFloat(value)) : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            const payload = formData as CustomerRequest;
            console.log(payload);
            if(isEditMode && customerToEdit) {
                await updateCustomer(customerToEdit.id, payload);
            } else {
                await createCustomer(payload);
            }
            onSaveSucess();
        } catch (error) {
            const axiosError = error as AxiosError<{ message?: string, errors?: Record<string, string> }>;
            setErrors(axiosError.response?.data?.errors ?? { form: t('errors.genericSave') })
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? t('customer.editTitle') : t('customer.addTitle')} >
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <Input label={t('common.name') + ' *'} name="name" value={formData.name || ''} onChange={handleChange} error={errors.name} />

                <div className="pt-4 border-t border-border-light dark:border-border-dark space-y-3">
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="creditEnabled" name="creditEnabled" checked={formData.creditEnabled} onChange={handleChange} className="h-4 w-4 rounded" />
                        <label htmlFor="creditEnabled">
                            {t('customer.allowCredit')}
                        </label>
                    </div>
                    {formData.creditEnabled && (
                        <Input label={t('customer.creditLimit')} name="creditLimit" type="number" step="0.01" value={formData.creditLimit ?? ''} onChange={handleChange} error={errors.creditLimit} />
                    )}
                </div>

                <AdvancedOptions className="grid grid-cols-2 [&>*:nth-child(3)]:col-span-2 gap-4">
                    <Input label={t('customer.taxId')} name="taxId" value={formData.taxId || ''} onChange={handleChange} error={errors.taxId} />
                    <Input label={t('customer.phone')} name="phone" value={formData.phone || ''} onChange={handleChange} error={errors.phone} />
                    <Textarea label={t('customer.address')} name="address" value={formData.address || ''} onChange={handleChange} error={errors.address} rows={2} />
                </AdvancedOptions>

                {errors.form && 
                <p className="text-sm text-red-500">
                    {errors.form}
                </p>}

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
                        {t('actions.cancel')}
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        {isEditMode ? t('actions.saveChanges') : t('actions.create')}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
export default CustomerFormModal;