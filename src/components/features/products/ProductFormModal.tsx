import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { createProduct, updateProduct } from '../../../api/services/product.service';
import type { ProductRequest, ProductResponse, EntitySummary } from '../../../api/types/domain';
import { UnitOfSale } from '../../../api/types/domain';

import Modal from '../../common/Modal';
import Button from '../../common/ui/Button';
import Input from '../../common/ui/Input';
import Select from '../../common/ui/Select';
import Textarea from '../../common/ui/Textarea';
import { AxiosError } from 'axios';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
  productToEdit?: ProductResponse | null;
  categories: EntitySummary[];
  providers: EntitySummary[];
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSaveSuccess,
  productToEdit,
  categories,
  providers,
}) => {
  const { t } = useTranslation();
  const isEditMode = !!productToEdit;

  const getInitialFormData = useCallback((): ProductRequest => {
    if (isEditMode && productToEdit) {
      return {
        name: productToEdit.name,
        description: productToEdit.description,
        barcode: productToEdit.barcode,
        stockQuantity: productToEdit.stockQuantity,
        salePrice: productToEdit.salePrice,
        costPrice: productToEdit.costPrice,
        unitOfSale: productToEdit.unitOfSale,
        active: productToEdit.active,
        categoryId: productToEdit.category.id,
        providerId: productToEdit.provider?.id,
      };
    }
    return {
      name: '',
      description: '',
      barcode: '',
      stockQuantity: 0,
      salePrice: 0,
      costPrice: 0,
      unitOfSale: UnitOfSale.UNIT,
      active: true,
      categoryId: categories[0]?.id,
      providerId: undefined,
    };
  }, [isEditMode, productToEdit, categories]);
  
  const [formData, setFormData] = useState<Partial<ProductRequest>>(getInitialFormData());
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
    const isCheckbox = type === 'checkbox';
    const isNumber = type === 'number';

    setFormData(prev => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked
             : isNumber ? (value === '' ? undefined : parseFloat(value))
             : value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const payload = formData as ProductRequest;
      if (!payload.name || !payload.salePrice || !payload.categoryId) {
        throw new Error("Validation failed client-side");
      }
      if (isEditMode && productToEdit) {
        await updateProduct(productToEdit.id, payload);
      } else {
        await createProduct(payload);
      }
      onSaveSuccess();
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string; errors?: Record<string, string> }>;
      const apiErrors = axiosError.response?.data?.errors;
      if (apiErrors) {
        setErrors(apiErrors);
      } else {
        setErrors({ form: t('errors.genericSave', 'An unexpected error occurred.') });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? t('product.editTitle') : t('product.addTitle', 'Add Title')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label={t('product.form.name', 'Product Name') + ' *'} name="name" value={formData.name || ''} onChange={handleChange} error={errors.name} required />
          <Select label={t('common.category', 'Category') + ' *'} name="categoryId" value={formData.categoryId ?? ''} onChange={handleChange} error={errors.categoryId} required>
            <option value="" disabled>{t('common.select', 'Select...')}</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </Select>
          <Input label={t('product.salePrice', 'Sale Price') + ' *'} name="salePrice" type="number" step="0.01" value={formData.salePrice ?? ''} onChange={handleChange} error={errors.salePrice} required />
          <Input label={t('product.costPrice', 'Cost Price')} name="costPrice" type="number" step="0.01" value={formData.costPrice ?? ''} onChange={handleChange} error={errors.costPrice} />
          <Input label={t('common.stock', 'Stock Quantity')} name="stockQuantity" type="number" step="1" value={formData.stockQuantity ?? ''} onChange={handleChange} error={errors.stockQuantity} />
          <Select label={t('product.unitOfSale', 'Unit of Sale')} name="unitOfSale" value={formData.unitOfSale} onChange={handleChange}>
            {Object.values(UnitOfSale).map(unit => <option key={unit} value={unit}>{t(`unitOfSale.${unit.toLowerCase()}`, unit)}</option>)}
          </Select>
          <Select label={t('product.provider', 'Provider')} name="providerId" value={formData.providerId ?? ''} onChange={handleChange}>
            <option value="">{t('common.none', 'None')}</option>
            {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </Select>
          <Input label={t('product.barcode', 'Barcode')} name="barcode" value={formData.barcode || ''} onChange={handleChange} />
        </div>
        <Textarea label={t('common.description', 'Description')} name="description" value={formData.description || ''} onChange={handleChange} rows={3} />
        <div className="flex items-center space-x-2">
            <input type="checkbox" id="active" name="active" checked={formData.active ?? true} onChange={handleChange} className="h-4 w-4 rounded" />
            <label htmlFor="active">{t('product.form.activeProduct', 'Active Product')}</label>
        </div>
        {errors.form && <p className="text-sm text-red-500">{errors.form}</p>}
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>{t('actions.cancel', 'Cancel')}</Button>
            <Button type="submit" isLoading={isLoading}>{isEditMode ? t('actions.saveChanges', 'Save Changes') : t('actions.create', 'Create')}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductFormModal;