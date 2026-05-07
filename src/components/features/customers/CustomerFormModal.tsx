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
import { notificationService } from "../../../lib/notification.service";
import { sanitizePhoneInput, validatePhone, formatPhoneAutomatically } from "../../../utils/formatters";

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
    const [phoneError, setPhoneError] = useState<string | null>(null);

    useEffect(() => {
        if(isOpen) {
            setFormData(getInitalFormData());
            setPhoneError(null);
        }
    }, [isOpen, getInitalFormData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === "checkbox";
        const isNumber = type === "number";
        
        let sanitizedValue = value;
        
        if (name === "taxId") {
            sanitizedValue = value.replace(/[^0-9.\-/\s]/g, "");
        } else if (name === "phone") {
            sanitizedValue = sanitizePhoneInput(value);
            const formatted = formatPhoneAutomatically(sanitizedValue);
            
            // Validate phone as user types
            if (sanitizedValue.trim() !== '') {
                const validation = validatePhone(sanitizedValue);
                setPhoneError(validation.error || null);
            } else {
                setPhoneError(null);
            }
            
            // Use formatted value for display
            sanitizedValue = formatted;
        }

        setFormData(prev => ({
            ...prev,
            [name]: isCheckbox
                ? (e.target as HTMLInputElement).checked
                : isNumber
                  ? (sanitizedValue === '' ? undefined : parseFloat(sanitizedValue))
                  : sanitizedValue
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate phone before submission
        const phoneValidation = validatePhone(formData.phone || '');
        if (!phoneValidation.isValid) {
            setPhoneError(phoneValidation.error || null);
            return;
        }

        setIsLoading(true);
        try {
            const payload = formData as CustomerRequest;
            if(isEditMode && customerToEdit) {
                await updateCustomer(customerToEdit.id, payload);
            } else {
                await createCustomer(payload);
            }
            onSaveSucess();
        } catch (error) {
            const axiosError = error as AxiosError<{ message?: string, errors?: Record<string, string> }>;
            const status = axiosError.response?.status;
            const apiMessage = axiosError.response?.data?.message;

            if (status === 409) {
                notificationService.error(t('errors.duplicateCustomerTaxId'));
                return;
            }

            notificationService.error(apiMessage || t('errors.genericSave'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? t('customer.editTitle') : t('customer.addTitle')} className="sm:max-w-3xl" >
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 p-6">
                
                {/* COLUNA ESQUERDA - CAMPOS PRINCIPAIS */}
                <div className="space-y-4">
                    <Input label={t('common.name') + ' *'} name="name" value={formData.name || ''} onChange={handleChange} />

                    <div className="pt-4 border-t border-border-light dark:border-border-dark space-y-3">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="creditEnabled" name="creditEnabled" checked={formData.creditEnabled} onChange={handleChange} className="h-4 w-4 rounded" />
                            <label htmlFor="creditEnabled">
                                {t('customer.allowCredit')}
                            </label>
                        </div>
                        {formData.creditEnabled && (
                            <Input label={t('customer.creditLimit')} name="creditLimit" type="number" step="0.01" value={formData.creditLimit ?? ''} onChange={handleChange} />
                        )}
                    </div>
                </div>

                {/* COLUNA DIREITA - OPÇÕES AVANÇADAS */}
                <AdvancedOptions className="space-y-4">
                    <Input
                        label={t('customer.taxId')}
                        name="taxId"
                        value={formData.taxId || ''}
                        onChange={handleChange}
                        inputMode="numeric"
                    />
                    <Input
                        label={t('customer.phone')}
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleChange}
                        inputMode="tel"
                        error={phoneError}
                    />
                    <Textarea label={t('customer.address')} name="address" value={formData.address || ''} onChange={handleChange} rows={2} />
                </AdvancedOptions>

                <div className="lg:col-span-2 flex justify-end gap-2 pt-4 border-t border-border-light dark:border-border-dark">
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
