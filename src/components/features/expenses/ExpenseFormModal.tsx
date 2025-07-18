import type React from "react";
import { ExpenseType, PaymentMethod, type ExpenseRequest, type ExpenseResponse } from "../../../api/types/domain";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { createExpense, updateExpense } from "../../../api/services/expense.service";
import type { AxiosError } from "axios";
import Modal from "../../common/Modal";
import Input from "../../common/ui/Input";
import Select from "../../common/ui/Select";
import Textarea from "../../common/ui/Textarea";
import Button from "../../common/ui/Button";

interface ExpenseFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveSuccess: () => void;
    expenseToEdit?: ExpenseResponse | null;
}

const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
    isOpen, onClose, onSaveSuccess, expenseToEdit
}) => {
    const { t } = useTranslation();
    const isEditMode = !!expenseToEdit;

  const getInitialFormData = useCallback((): Partial<ExpenseRequest> => {
    if (isEditMode && expenseToEdit) {
      return {
        name: expenseToEdit.name,
        value: expenseToEdit.value,
        expenseDate: format(new Date(expenseToEdit.expenseDate), "yyyy-MM-dd'T'HH:mm"),
        expenseType: expenseToEdit.expenseType,
        paymentMethod: expenseToEdit.paymentMethod,
        description: expenseToEdit.description,
      };
    }
    return {
      name: '',
      value: undefined,
      expenseDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      expenseType: ExpenseType.OTHERS,
      paymentMethod: PaymentMethod.CASH,
      description: '',
    };
  }, [isEditMode, expenseToEdit]);

  const [formData, setFormData] = useState<Partial<ExpenseRequest>>(getInitialFormData());
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
        setFormData(getInitialFormData());
        setErrors({});
    }
  }, [isOpen, getInitialFormData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? (value === '' ? undefined : parseFloat(value)) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
        const payload: ExpenseRequest = {
            ...formData,
            expenseDate: new Date(formData.expenseDate!).toISOString(),
        } as ExpenseRequest;

        if (isEditMode && expenseToEdit) {
            await updateExpense(expenseToEdit.id, payload);
        } else {
            await createExpense(payload);
        }
        onSaveSuccess();
    } catch (error) {
        const axiosError = error as AxiosError<{ message?:string, errors?:Record<string, string> }>;
        setErrors(axiosError.response?.data?.errors ?? { form: t('errors.genericSave') });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? t('expense.editTitle') : t('expense.addTitle')}>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <Input label={t('common.name') + ' *'} name="name" value={formData.name || ''} onChange={handleChange} error={errors.name} required />
            <Input label={t('common.value') + ' *'} name="value" type="number" step="0.01" value={formData.value  ?? ''} onChange={handleChange} error={errors.value} required />
            <Select label={('common.paymentMethod') + ' *'} name="paymentMethod" value={formData.paymentMethod || ''} onChange={handleChange} error={errors.paymentMethod} required>
              {Object.values(PaymentMethod).map(type => (
                <option key={type} value={type}>
                  {t(`paymentMethods.${type.toLowerCase()}`, type)}
                </option>
              ))}
            </Select>
            <Input label={t('expense.expenseDate')} name="expenseDate" type="datetime-local" value={formData.expenseDate} required />
            <Select label={t('expense.expenseType' + ' *')} name="expenseType" value={formData.expenseType || ''} onChange={handleChange} error={errors.expenseType || ''} required>
                {Object.values(ExpenseType).map(type => (
                    <option key={type} value={type}>
                        {t(`expenseCategories.${type.toLowerCase()}`, type)}
                    </option>
                ))}
            </Select>
            <Textarea label={t('common.description')} name="description" value={formData.description || ''} onChange={handleChange} rows={3} />

            {errors.form && <p className="text-sm text-red-500">{errors.form}</p>}

            <div className="flex justify-end gap-2 pt-4 border-t border-border-light dark:border-border-dark">
                <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
                    {t('actions.cancel')}
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    {isEditMode ? t('actions.saveChanges') : t('actions.create')}
                </Button>
            </div>
        </form>
    </Modal>
  );
};
export default ExpenseFormModal;