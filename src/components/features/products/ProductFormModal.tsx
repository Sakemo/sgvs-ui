import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LuPencil, LuPlus, LuTrash } from "react-icons/lu";

import { createProduct, updateProduct } from "../../../api/services/product.service";
import { deleteCategory } from "../../../api/services/category.service";
import { type ProductRequest, type ProductResponse, type EntitySummary, type CategoryResponse, type ProviderResponse, StockControlType, UnitOfSale } from "../../../api/types/domain";

import Modal from "../../common/Modal";
import Button from "../../common/ui/Button";
import Input from "../../common/ui/Input";
import Select from "../../common/ui/Select";
import Textarea from "../../common/ui/Textarea";
import ProviderAddModal from "../providers/ProviderAddModal";
import AdvancedOptions from "../../common/AdvancedOptions";
import ToggleSwitch from "../../common/ui/ToggleSwitch";
import AutocompleteInput from "../../common/AutoCompleteInput";
import CategoryFormModal from "../categories/CategoryFormModal";

import { useSettings } from "../../../contexts/utils/UseSettings";
import { useConfirmation } from "../../../contexts/utils/UseConfirmation";
import { notificationService } from "../../../lib/notification.service";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
  productToEdit?: ProductResponse | null;
  categories: EntitySummary[];
  providers: EntitySummary[];
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, onSaveSuccess, productToEdit, categories, providers }) => {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const showConfirmation = useConfirmation();
  const queryClient = useQueryClient();
  const isEditMode = !!productToEdit;

  const [categoryQuery, setCategoryQuery] = useState("");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<EntitySummary | null>(null);
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [keepAdding, setKeepAdding] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

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
        managesStock: productToEdit.managesStock,
        categoryId: productToEdit.category.id,
        providerId: productToEdit.provider?.id,
      };
    }
    return {
      name: "",
      description: "",
      barcode: "",
      stockQuantity: 0,
      salePrice: undefined,
      costPrice: undefined,
      unitOfSale: UnitOfSale.UNIT,
      active: true,
      managesStock: settings?.stockControlType === StockControlType.PER_ITEM,
      categoryId: categories[0]?.id,
      providerId: undefined,
    };
  }, [isEditMode, productToEdit, categories, settings]);

  const [formData, setFormData] = useState<Partial<ProductRequest>>(getInitialFormData());

  const productMutation = useMutation({
    mutationFn: (productData: ProductRequest) => {
      if (isEditMode && productToEdit) {
        return updateProduct(productToEdit.id, productData);
      }
      return createProduct(productData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      if (keepAdding && !isEditMode) {
        setFormData(getInitialFormData());
        nameInputRef.current?.focus();
        notificationService.success(t('product.saveSuccess'));
      } else {
        onSaveSuccess();
      }
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ message?: string; }>;
      notificationService.error(axiosError.response?.data?.message || t('errors.genericSave'));
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      notificationService.success(t("category.deleteSuccess"));
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ message?: string; }>;
      notificationService.error(axiosError.response?.data?.message || t('errors.deleteCategory'));
    }
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData());
      setKeepAdding(false);
      const timer = setTimeout(() => nameInputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, getInitialFormData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const isNumber = type === 'number';
    setFormData(prev => ({ ...prev, [name]: isCheckbox ? (e.target as HTMLInputElement).checked : isNumber ? (value === '' ? undefined : parseFloat(value)) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.name.trim().length < 2) {
      notificationService.error(t("validation.nameRequired"));
      return;
    }
    const payload = { ...getInitialFormData(), ...formData } as ProductRequest;
    productMutation.mutate(payload);
  };

  const handleCloseCategoryModal = () => setIsCategoryModalOpen(false);
  const handleCategorySaveSuccess = (savedCategory: CategoryResponse) => {
    queryClient.invalidateQueries({ queryKey: ['categories'] });
    handleCloseCategoryModal();
    if (!categoryToEdit) {
      setFormData((prev) => ({ ...prev, categoryId: savedCategory.id }));
    }
  };
  
  const handleNewProvider = (newProvider: ProviderResponse) => {
    queryClient.invalidateQueries({ queryKey: ['providers'] });
    setIsProviderModalOpen(false);
    setFormData(prev => ({ ...prev, providerId: newProvider.id }));
  };

  const handleDeleteCategory = (id: number) => {
    showConfirmation({
        title: t('category.confirmDeleteTitle'),
        description: t('category.confirmDeleteDesc'),
        onConfirm: () => deleteCategoryMutation.mutate(id),
    });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? t("product.editTitle") : t("product.addTitle", "Add Product")}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 md:[&>*:nth-child(1)]:col-span-2 gap-4">
            <Input ref={nameInputRef} label={`${t("product.form.name")} *`} name="name" value={formData.name || ""} onChange={handleChange} required/>
            <Input label={`${t("product.salePrice")} *`} name="salePrice" type="number" step="0.01" value={formData.salePrice ?? ''} onChange={handleChange} required />
            <div className="flex items-end gap-2">
              <AutocompleteInput
                label={`${t("common.category")} *`}
                placeholder={t("actions.searchByName")}
                options={categories.map(c => ({ value: c.id, label: c.name }))}
                selected={formData.categoryId ? { value: formData.categoryId, label: categories.find(c => c.id === formData.categoryId)?.name || '' } : null}
                onSelect={option => setFormData(prev => ({ ...prev, categoryId: option ? Number(option.value) : undefined }))}
                onQueryChange={setCategoryQuery}
                renderOption={(option) => (
                  <div className="flex items-center justify-between w-full">
                    <span>{option.label}</span>
                    <div className="flex-shrink-0">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); setCategoryToEdit({ id: Number(option.value), name: option.label }); setIsCategoryModalOpen(true); }} iconLeft={<LuPencil />}/>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={(e) => { e.stopPropagation(); handleDeleteCategory(Number(option.value)); }} iconLeft={<LuTrash />}/>
                    </div>
                  </div>
                )}
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => { setCategoryToEdit(null); setIsCategoryModalOpen(true); }} title={t('category.addTitle')} iconLeft={<LuPlus />}/>
            </div>
          </div>

          <div className="grid grid-cols-2">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="active" name="active" checked={formData.active ?? true} onChange={handleChange} className="h-4 w-4 rounded"/>
              <label htmlFor="active">{t("product.form.activeProduct")}</label>
            </div>
            {settings?.stockControlType === StockControlType.PER_ITEM && (
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="managesStock" name="managesStock" checked={formData.managesStock ?? false} onChange={handleChange} className="h-4 w-4 rounded"/>
                <label htmlFor="managesStock">{t("products.form.managesStock")}</label>
              </div>
            )}
          </div>

          <AdvancedOptions className="grid grid-cols-3 [&>*:nth-child(1)]:col-span-2 [&>*:nth-child(6)]:col-span-3 gap-4">
            <Input label={t("product.costPrice")} name="costPrice" type="number" step="0.01" value={formData.costPrice ?? ''} onChange={handleChange}/>
            <Input label={t("common.stock")} name="stockQuantity" type="number" step="1" value={formData.stockQuantity ?? ''} onChange={handleChange}/>
            <div className="flex items-end gap-2">
              <Select label={t("product.provider")} name="providerId" value={formData.providerId ?? ''} onChange={handleChange}>
                <option value="">{t('common.none')}</option>
                {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </Select>
              <Button type="button" variant="ghost" size="icon" onClick={() => setIsProviderModalOpen(true)} title={t('provider.addTitle')} iconLeft={<LuPlus />}/>
            </div>
            <Input label={t("product.barcode")} name="barcode" value={formData.barcode || ""} onChange={handleChange}/>
            <Select label={t("product.unitOfSale")} name="unitOfSale" value={formData.unitOfSale} onChange={handleChange}>
              {Object.values(UnitOfSale).map(unit => <option key={unit} value={unit}>{t(`unitOfSale.${unit.toLowerCase()}`, unit)}</option>)}
            </Select>
            <Textarea label={t("common.description")} name="description" value={formData.description || ""} onChange={handleChange} rows={3}/>
          </AdvancedOptions>

          <footer className="flex justify-end items-center gap-4 pt-4 border-t border-border-light dark:border-border-dark">
            {!isEditMode && (
              <div className="flex-grow">
                <ToggleSwitch enabled={keepAdding} onChange={setKeepAdding} label={t("actions.keepAdding")}/>
              </div>
            )}
            <Button type="button" variant="secondary" onClick={onClose} disabled={productMutation.isPending}>
              {t("actions.cancel")}
            </Button>
            <Button type="submit" isLoading={productMutation.isPending}>
              {isEditMode ? t("actions.saveChanges") : t("actions.create")}
            </Button>
          </footer>
        </form>
      </Modal>

      <CategoryFormModal isOpen={isCategoryModalOpen} onClose={handleCloseCategoryModal} onSaveSuccess={handleCategorySaveSuccess} categoryToEdit={categoryToEdit}/>
      <ProviderAddModal isOpen={isProviderModalOpen} onClose={() => setIsProviderModalOpen(false)} onProviderAdded={handleNewProvider}/>
    </>
  );
};

export default ProductFormModal;