import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  createProduct,
  updateProduct,
  calculateSuggestedPrice,
} from "../../../api/services/product.service";
import type {
  ProductRequest,
  ProductResponse,
  EntitySummary,
  CategoryResponse,
  ProviderResponse,
} from "../../../api/types/domain";
import { StockControlType, UnitOfSale } from "../../../api/types/domain";

import Modal from "../../common/Modal";
import Button from "../../common/ui/Button";
import Input from "../../common/ui/Input";
import Select from "../../common/ui/Select";
import Textarea from "../../common/ui/Textarea";
import { AxiosError } from "axios";
import { LuPencil, LuPlus, LuTrash, LuCalculator } from "react-icons/lu";
import ProviderAddModal from "../providers/ProviderAddModal";
import AdvancedOptions from "../../common/AdvancedOptions";
import { useSettings } from "../../../contexts/utils/UseSettings";
import ToggleSwitch from "../../common/ui/ToggleSwitch";
import { notificationService } from "../../../lib/notification.service";
import AutocompleteInput from "../../common/AutoCompleteInput";
import { useConfirmation } from "../../../contexts/utils/UseConfirmation";
import { deleteCategory } from "../../../api/services/category.service";
import CategoryFormModal from "../categories/CategoryFormModal";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
  productToEdit?: ProductResponse | null;
  categories: EntitySummary[];
  providers: EntitySummary[];
  onDataRefresh: () => void;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSaveSuccess,
  productToEdit,
  categories,
  providers,
  onDataRefresh,
}) => {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const showConfirmation = useConfirmation();
  const isEditMode = !!productToEdit;

  const [categoryQuery, setCategoryQuery] = useState("");
  const [isSearchingCategories, setIsSearchingCategories] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<EntitySummary | null>(null);
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [keepAdding, setKeepAdding] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [isCalculating, setIsCalculating] = useState(false);
  // Estado do Switch
  const [isSmartPricing, setIsSmartPricing] = useState(true);

  // --- Handlers Auxiliares ---
  const handleDeleteCategory = (categoryId: number) => {
    showConfirmation({
      title: "Delete Category?",
      description: "Are you sure? This will affect all products in this category.",
      onConfirm: async () => {
        try {
          await deleteCategory(categoryId);
          notificationService.success(t("category.deleteSucess"));
          onDataRefresh();
        } catch (err) {
          notificationService.error(t("errors.deleteCategory" + err));
        }
      },
    });
  };

  const openCategoryModalForEdit = (category: EntitySummary) => {
    setCategoryToEdit(category);
    setIsCategoryModalOpen(true);
  };

  const openCategoryModalForAdd = () => {
    setCategoryToEdit(null);
    setIsCategoryModalOpen(true);
  };

  const handleCategorySaveSuccess = (savedCategory: CategoryResponse) => {
    setIsCategoryModalOpen(false);
    onDataRefresh();
    if (!categoryToEdit) {
      setFormData((prev) => ({ ...prev, categoryId: savedCategory.id }));
    }
  };

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setCategoryToEdit(null);
  };

  const handleNewProvider = (newProvider: ProviderResponse) => {
    setIsProviderModalOpen(false);
    onDataRefresh();
    setFormData((prev) => ({ ...prev, providerId: newProvider.id }));
  };

  // --- Inicialização ---
  const getInitialFormData = useCallback((): ProductRequest => {
    if (isEditMode && productToEdit) {
      return {
        name: productToEdit.name,
        description: productToEdit.description,
        barcode: productToEdit.barcode,
        stockQuantity: productToEdit.stockQuantity,
        salePrice: productToEdit.salePrice,
        costPrice: productToEdit.costPrice,
        desiredProfitMargin: productToEdit.desiredProfitMargin ?? 30,
        minimumStock: productToEdit.minimumStock ?? 0,
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
      minimumStock: 0,
      salePrice: undefined,
      costPrice: undefined,
      desiredProfitMargin: 30,
      unitOfSale: UnitOfSale.UNIT,
      active: true,
      managesStock: false,
      categoryId: categories[0]?.id,
      providerId: undefined,
    };
  }, [isEditMode, productToEdit, categories]);

  const [formData, setFormData] = useState<Partial<ProductRequest>>(getInitialFormData());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setKeepAdding(false);
      setFormData(getInitialFormData());

      // Lógica para decidir se o switch começa ligado ou desligado
      if (isEditMode && productToEdit) {
        setIsSmartPricing(
          productToEdit.desiredProfitMargin !== null &&
          productToEdit.desiredProfitMargin !== undefined
        );
      } else {
        setIsSmartPricing(true);
      }

      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isOpen, getInitialFormData, productToEdit, isEditMode]);

  // Fallback para categoria padrão
  useEffect(() => {
    if (
      isOpen &&
      !isEditMode &&
      categories.length > 0 &&
      (formData.categoryId === undefined || formData.categoryId === null)
    ) {
      setFormData((prev) => ({
        ...prev,
        categoryId: categories[0].id,
      }));
    }
  }, [isOpen, isEditMode, categories, formData.categoryId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    const isNumber = type === "number";

    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox
        ? (e.target as HTMLInputElement).checked
        : isNumber
          ? value === ""
            ? undefined
            : parseFloat(value)
          : value,
    }));
  };

  // --- Cálculo de Preço ---
  const handleCalculatePrice = async () => {
    if (isSmartPricing && formData.costPrice && formData.desiredProfitMargin) {
      setIsCalculating(true);
      try {
        const suggestedPrice = await calculateSuggestedPrice(
          formData.costPrice,
          formData.desiredProfitMargin
        );
        setFormData((prev) => ({ ...prev, salePrice: suggestedPrice }));
      } catch (error) {
        notificationService.error(t("errors.calculatePrice", "Error calculating price"));
        console.error(error);
      } finally {
        setIsCalculating(false);
      }
    }
  };

  useEffect(() => {
    if (isSmartPricing && formData.costPrice && formData.desiredProfitMargin) {
      const timer = setTimeout(() => {
        handleCalculatePrice();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isSmartPricing, formData.costPrice, formData.desiredProfitMargin]);

  // --- Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newErrors: Record<string, string> = {};
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = t("validation.nameRequired", "Name is required (min 2 char)");
    }

    if (Object.keys(newErrors).length > 0) {
      notificationService.error(`${newErrors}`);
      setIsLoading(false);
      return;
    }

    try {
      const payload: ProductRequest = {
        name: formData.name!,
        salePrice: formData.salePrice!,
        categoryId: formData.categoryId!,
        description: formData.description || null,
        barcode: formData.barcode || null,
        stockQuantity: formData.stockQuantity ?? 0,
        minimumStock: formData.minimumStock ?? 0,
        costPrice: formData.costPrice ?? null,
        desiredProfitMargin: isSmartPricing ? (formData.desiredProfitMargin ?? null) : null,
        unitOfSale: formData.unitOfSale ?? UnitOfSale.UNIT,
        active: formData.active ?? true,
        managesStock: formData.managesStock!,
        providerId: formData.providerId ?? null,
      };

      if (isEditMode && productToEdit) {
        await updateProduct(productToEdit.id, payload);
      } else {
        await createProduct(payload);
      }

      if (keepAdding && !isEditMode) {
        setFormData(getInitialFormData());
        setIsSmartPricing(true);
        onDataRefresh();
      } else {
        onSaveSuccess();
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string; errors?: Record<string, string> }>;
      const apiErrors = axiosError.response?.data?.errors;
      if (apiErrors) {
        notificationService.error(`${apiErrors}`);
      } else {
        notificationService.error(t("errors.genericSave", "An unexpected error occurred."));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={isEditMode ? t("product.editTitle") : t("product.addTitle", "Add Product")}
      >
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* BLOCO 1: NOME E CATEGORIA */}
          <div className="grid grid-cols-1 md:grid-cols-2 md:[&>*:nth-child(1)]:col-span-2 gap-4">
            <Input
              ref={nameInputRef}
              label={t("product.form.name", "Product Name") + " *"}
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              required
            />

            <div className="flex items-end gap-2 md:col-span-2">
              <AutocompleteInput
                label={t("common.category" + " *")}
                placeholder={t("actions.searchByName")}
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
                selected={
                  formData.categoryId
                    ? {
                        value: formData.categoryId,
                        label: categories.find((c) => c.id === formData.categoryId)?.name || "",
                      }
                    : null
                }
                onSelect={(option) =>
                  setFormData((prev) => ({
                    ...prev,
                    categoryId: option ? Number(option.value) : undefined,
                  }))
                }
                onQueryChange={setCategoryQuery}
                isLoading={isSearchingCategories}
                renderOption={(option) => (
                  <div className="flex items-center justify-between w-full">
                    <span className="block truncate">{option.label}</span>
                    <div className="flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          const categorySummary: EntitySummary = { id: Number(option.value), name: option.label };
                          openCategoryModalForEdit(categorySummary);
                        }}
                        iconLeft={<LuPencil />}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(Number(option.value));
                        }}
                        iconLeft={<LuTrash />}
                      />
                    </div>
                  </div>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={openCategoryModalForAdd}
                title={t("category.addTitle")}
                iconLeft={<LuPlus />}
              />
            </div>
          </div>

          {/* BLOCO 2: CHECKBOXES */}
          <div className="flex flex-col sm:flex-row gap-4 py-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={formData.active ?? true}
                onChange={handleChange}
                className="h-4 w-4 rounded"
              />
              <label htmlFor="active">
                {t("product.form.activeProduct", "Active Product")}
              </label>
            </div>

            {settings?.stockControlType === StockControlType.PER_ITEM && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="managesStock"
                  name="managesStock"
                  checked={formData.managesStock ?? true}
                  onChange={handleChange}
                  className="h-4 w-4 rounded"
                />
                <label htmlFor="managesStock">
                  {t("products.form.managesStock", "Manage Stock")}
                </label>
              </div>
            )}
          </div>

          {/* BLOCO 3: PRECIFICAÇÃO INTELIGENTE (COM SWITCH) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-border-light dark:border-border-dark">

            {/* Header da Seção com Toggle */}
            <div className="sm:col-span-3 flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700 mb-2">
                <h4 className="text-sm font-semibold text-text-primary dark:text-gray-200 flex items-center gap-2">
                    <LuCalculator className="h-4 w-4 text-brand-primary"/>
                    {t("product.smartPricing", "Smart Pricing")}
                </h4>
                <ToggleSwitch
                    enabled={isSmartPricing}
                    onChange={setIsSmartPricing}
                    label={isSmartPricing ? t('common.on', 'On') : t('common.off', 'Off')}
                />
            </div>

            {/* Inputs de Preço */}
            <Input
              label={t("product.costPrice", "Cost Price")}
              name="costPrice"
              type="number"
              step="0.01"
              value={formData.costPrice ?? ""}
              onChange={handleChange}
              // Custo sempre editável
            />

            <Input
              label={t("product.desiredMargin", "Margin (%)")}
              name="desiredProfitMargin"
              type="number"
              step="0.01"
              value={formData.desiredProfitMargin ?? 30}
              onChange={handleChange}
              iconLeft={<LuCalculator className="text-gray-400 h-4 w-4" />}
              // Desativa se Smart Pricing OFF
              disabled={!isSmartPricing}
              className={!isSmartPricing ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700" : ""}
            />

            <div className="relative">
                <Input
                    label={t("product.salePrice", "Sale Price") + " *"}
                    name="salePrice"
                    type="number"
                    step="0.01"
                    value={formData.salePrice ?? ""}
                    onChange={handleChange}
                    required
                    // Se Smart Pricing ON -> ReadOnly (calculado)
                    // Se Smart Pricing OFF -> Editável
                    readOnly={isSmartPricing}
                    className={isSmartPricing ? "bg-gray-100 dark:bg-gray-700 focus:ring-0 cursor-default" : ""}
                />
                {isCalculating && (
                    <div className="absolute right-3 top-9">
                        <div className="animate-spin h-4 w-4 border-2 border-brand-primary border-t-transparent rounded-full"></div>
                    </div>
                )}
            </div>
          </div>

          {/* BLOCO 4: OPÇÕES AVANÇADAS (Estoque, Provider, Unidade) */}
          <AdvancedOptions className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <div className="sm:col-span-3 grid grid-cols-2 gap-4">
              <Input
                label={t("common.stock", "Stock Quantity")}
                name="stockQuantity"
                type="number"
                step="1"
                value={formData.stockQuantity ?? ""}
                onChange={handleChange}
              />
              <Input
                label={t("product.minimumStock", "Minimum Stock")}
                name="minimumStock"
                type="number"
                step="1"
                value={formData.minimumStock ?? ""}
                onChange={handleChange}
              />
            </div>

            <div className="sm:col-span-3 flex items-end gap-2">
              <Select
                label={t("product.provider", "Provider")}
                name="providerId"
                value={formData.providerId ?? ""}
                onChange={handleChange}
              >
                <option value="">{t("common.none", "None")}</option>
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsProviderModalOpen(true)}
                title={t("provider.addTitle")}
                iconLeft={<LuPlus />}
              />
            </div>

            <div className="sm:col-span-3 grid grid-cols-2 gap-4">
              <Input
                label={t("product.barcode", "Barcode")}
                name="barcode"
                value={formData.barcode || ""}
                onChange={handleChange}
              />

              <Select
                label={t("product.unitOfSale", "Unit of Sale")}
                name="unitOfSale"
                value={formData.unitOfSale}
                onChange={handleChange}
              >
                {Object.values(UnitOfSale).map((unit) => (
                  <option key={unit} value={unit}>
                    {t(`unitOfSale.${unit.toLowerCase()}`, unit)}
                  </option>
                ))}
              </Select>
            </div>

            <div className="sm:col-span-3">
              <Textarea
                label={t("common.description", "Description")}
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </AdvancedOptions>

          <footer className="grid grid-cols-4 [&>*:nth-child(1)]:col-span-2 gap-2 pt-4 border-t border-border-light dark:border-border-dark">
            {!isEditMode && (
              <ToggleSwitch
                enabled={keepAdding}
                onChange={setKeepAdding}
                label={t("actions.keepAdding", "Keep adding")}
              />
            )}
            {isEditMode && <div></div>}
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              {t("actions.cancel", "Cancel")}
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {isEditMode
                ? t("actions.saveChanges", "Save Changes")
                : t("actions.create", "Create")}
            </Button>
          </footer>
        </form>
      </Modal>

      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        onClose={handleCloseCategoryModal}
        onSaveSuccess={handleCategorySaveSuccess}
        categoryToEdit={categoryToEdit}
      />
      <ProviderAddModal
        isOpen={isProviderModalOpen}
        onClose={() => setIsProviderModalOpen(false)}
        onProviderAdded={handleNewProvider}
      />
    </>
  );
};

export default ProductFormModal;
