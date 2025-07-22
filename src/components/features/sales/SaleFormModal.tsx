// src/components/features/sales/SaleFormModal.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";

// API & Types
import { getProducts, getProductSuggestions } from "../../../api/services/product.service";
import { getCustomers, getCustomerSuggestions } from "../../../api/services/customer.service";
import { registerSale } from "../../../api/services/sale.service";
import {
  type SaleItemRequest,
  type SaleRequest,
  PaymentMethod,
  UnitOfSale,
  type ProductResponse,
} from "../../../api/types/domain";

// Components
import Modal from "../../common/Modal";
import Button from "../../common/ui/Button";
import Input from "../../common/ui/Input";
import Select from "../../common/ui/Select";
import Textarea from "../../common/ui/Textarea";
import Card from "../../common/ui/Card";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { formatCurrency } from "../../../utils/formatters";
import AutocompleteInput, {
  type AutocompleteOption,
} from "../../common/AutoCompleteInput";

interface SaleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
}

interface FormSaleItem extends SaleItemRequest {
  name: string;
  salePrice: number;
  totalValue: number;
}

const SaleFormModal: React.FC<SaleFormModalProps> = ({
  isOpen,
  onClose,
  onSaveSuccess,
}) => {
  const { t } = useTranslation();

  // State
  const [items, setItems] = useState<FormSaleItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CASH
  );
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState("1");

  // --- Autocomplete States ---
  const [customerQuery, setCustomerQuery] = useState('');
  const [productQuery, setProductQuery] = useState('');
  
  const [initialCustomerOptions, setInitialCustomerOptions] = useState<AutocompleteOption[]>([]);
  const [initialProductOptions, setInitialProductOptions] = useState<AutocompleteOption[]>([]);
  
  const [searchedCustomerOptions, setSearchedCustomerOptions] = useState<AutocompleteOption[]>([]);
  const [searchedProductOptions, setSearchedProductOptions] = useState<AutocompleteOption[]>([]);
  
  const [selectedCustomerOption, setSelectedCustomerOption] = useState<AutocompleteOption | null>(null);
  const [selectedProductOption, setSelectedProductOption] = useState<AutocompleteOption | null>(null);
  
  const [isSearching, setIsSearching] = useState({ customers: false, products: false });
  const [productDetailsCache, setProductDetailsCache] = useState<Record<number, ProductResponse>>({});

  const selectedProductDetails = useMemo(() => {
    if (!selectedProductOption) return null;
    return productDetailsCache[Number(selectedProductOption.value)];
  }, [selectedProductOption, productDetailsCache]);

  const resetForm = useCallback(() => {
    setItems([]);
    setPaymentMethod(PaymentMethod.CASH);
    setDescription("");
    setSelectedProductOption(null);
    setProductQuery("");
    setSelectedCustomerOption(null);
    setCustomerQuery("");
    setQuantity("1");
    setErrors({});
  }, [setCustomerQuery, setProductQuery]);

  useEffect(() => {
      if (isOpen) {
          setIsLoading(true);
          resetForm();
          
          Promise.all([
              getProductSuggestions(),
              getCustomerSuggestions()
          ]).then(([productSuggestions, customerSuggestions]) => {
              setInitialProductOptions(productSuggestions.map(p => ({ value: p.id, label: `${p.name} (${formatCurrency(p.salePrice)})` })));
              setInitialCustomerOptions(customerSuggestions.map(c => ({ value: c.id, label: c.name })));
              const initialProductCache = productSuggestions.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
              setProductDetailsCache(initialProductCache);
          }).catch(() => {
              setErrors({ form: t('errors.fetchInitialData') });
          }).finally(() => {
              setIsLoading(false);
          });
      }
  }, [isOpen, resetForm, t]);

  // fetch customers
  useEffect(() => {
      if (customerQuery.length < 1) {
          setSearchedCustomerOptions([]);
          return;
      }
      setIsSearching(prev => ({ ...prev, customers: true }));
      getCustomers({ name: customerQuery, isActive: true })
          .then(customers => setSearchedCustomerOptions(customers.map(c => ({ value: c.id, label: c.name }))))
          .finally(() => setIsSearching(prev => ({ ...prev, customers: false })));
  }, [customerQuery]);
  
  // fetch products
    useEffect(() => {
        if (productQuery.length < 1) {
            setSearchedProductOptions([]);
            return;
        }
        setIsSearching(prev => ({ ...prev, products: true }));
        getProducts({ name: productQuery, size: 10 })
            .then(page => {
                setSearchedProductOptions(page.content.map(p => ({ value: p.id, label: `${p.name} (${formatCurrency(p.salePrice)})` })));
                const newProductCache = page.content.reduce((acc, p) => ({
                  ...acc, [p.id]: p
                }), {});
                setProductDetailsCache(prev => ({ ...prev, ...newProductCache }));
              })
            .finally(() => setIsSearching(prev => ({ ...prev, products: false })));
    }, [productQuery]);

  // validation for options
  const customerAutocompleteOptions = customerQuery ? searchedCustomerOptions : initialCustomerOptions;
  const productAutocompleteOptions = productQuery ? searchedProductOptions : initialProductOptions;


  const handleAddItem = () => {
    const numQuantity = parseFloat(quantity);
    if (!selectedProductOption || isNaN(numQuantity) || numQuantity <= 0) {
      setErrors({ item: t("validation.invalidQuantity") });
      return;
    }

    if (!selectedProductDetails) {
      setErrors({ item: t("validation.details") });
      return;
    }

    if (
      selectedProductDetails.managesStock &&
      selectedProductDetails.stockQuantity < numQuantity
    ) {
      setErrors({
        item: t("validation.insufficientStock", {
          available: selectedProductDetails?.stockQuantity,
        }),
      });
      return;
    }

    if (
      selectedProductDetails?.unitOfSale === UnitOfSale.UNIT &&
      !Number.isInteger(numQuantity)
    ) {
      setErrors({ item: t("validation.integerQuantityRequired") });
      return;
    }

    const existingItemIndex = items.findIndex(
      (item) => item.productId === selectedProductDetails.id
    );
    if (existingItemIndex > -1) {
      const newItems = [...items];
      newItems[existingItemIndex].quantity += numQuantity;
      newItems[existingItemIndex].totalValue =
        newItems[existingItemIndex].quantity *
        newItems[existingItemIndex].salePrice;
      setItems(newItems);
    } else {
      setItems((prev) => [
        ...prev,
        {
          productId: selectedProductDetails.id,
          quantity: numQuantity,
          name: selectedProductDetails.name,
          salePrice: selectedProductDetails.salePrice,
          totalValue: numQuantity * selectedProductDetails.salePrice,
          unitOfSale: selectedProductDetails.unitOfSale,
          stockQuantity: selectedProductDetails.stockQuantity,
        },
      ]);
    }
    setSelectedProductOption(null);
    setProductQuery("");
    setQuantity("1");
    setErrors({});
  };

  const handleRemoveItem = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const totalSaleValue = useMemo(
    () => items.reduce((sum, item) => sum + item.totalValue, 0),
    [items]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const customerId = selectedCustomerOption
      ? Number(selectedCustomerOption.value)
      : undefined;

    if (items.length === 0) {
      setErrors({
        form: t(
          "validation.saleItemsRequired",
          `At least one item is required for the sale.`
        ),
      });
      return;
    }
    if (paymentMethod === PaymentMethod.ON_CREDIT && !customerId) {
      setErrors({
        form: t(
          "validation.customerRequiredForCredit",
          "A customer is required for ON_CREDIT sales."
        ),
      });
      return;
    }

    setIsLoading(true);

    try {
      const payload: SaleRequest = {
        customerId,
        paymentMethod,
        description: description || undefined,
        items: items.map(({ productId, quantity }) => ({
          productId,
          quantity,
        })),
      };

      await registerSale(payload);
      onSaveSuccess();
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string;
        errors?: Record<string, string>;
      }>;
      const apiErrors = axiosError.response?.data?.errors;
      if (apiErrors) {
        setErrors(apiErrors);
      } else {
        setErrors({
          form: axiosError.response?.data?.message || t("errors.genericSave"),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("sale.addSale", "Register Sale")}
      className="sm:max-w-4xl"
    >
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AutocompleteInput
              label={t("common.client")}
              placeholder={t("actions.searchByName")}
              options={customerAutocompleteOptions}
              selected={selectedCustomerOption}
              onSelect={setSelectedCustomerOption}
              onQueryChange={setCustomerQuery}
              isLoading={isSearching.customers}
            />
            <Select
              label={t("common.paymentMethod")}
              name="paymentMethod"
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value as PaymentMethod)
              }
            >
              {Object.values(PaymentMethod).map((pm) => (
                <option key={pm} value={pm}>
                  {t(
                    `paymentMethods.${pm.toLowerCase()}`,
                    pm.replace("_", " ")
                  )}
                </option>
              ))}
            </Select>
          </div>

          <Card>
            <h3 className="text-lg font-semibold mb-4">
              {t("sale.addItem", "Add Item")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-4 items-end">
              <AutocompleteInput
                label={t("product.objectName", "Product")}
                placeholder={t("actions.searchByName")}
                options={productAutocompleteOptions}
                selected={selectedProductOption}
                onSelect={setSelectedProductOption}
                onQueryChange={setProductQuery}
                isLoading={isSearching.products}
              />
              <Input
                label={t("sale.quantity", "Quantity")}
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                step={
                  selectedProductDetails?.unitOfSale === UnitOfSale.UNIT
                    ? "1"
                    : "0.01"
                }
                min={
                  selectedProductDetails?.unitOfSale === UnitOfSale.UNIT
                    ? "1"
                    : "0.01"
                }
                disabled={!selectedProductOption}
              />
              <Button
                type="button"
                onClick={handleAddItem}
                disabled={!selectedProductOption}
                iconLeft={<LuPlus />}
              >
                {t("actions.add", "Add")}
              </Button>
            </div>
            {errors.item && (
              <p className="text-xs text-red-500 mt-1">{errors.item}</p>
            )}
          </Card>

          {items.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {t("sale.itemsInSale", "Items in Sale")}
              </h3>
              <ul className="max-h-48 overflow-y-auto border border-border-light dark:border-border-dark rounded-md divide-y divide-border-light dark:divide-border-dark">
                {items.map((item) => (
                  <li
                    key={item.productId}
                    className="p-3 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-text-secondary">{`${item.quantity} x ${formatCurrency(item.salePrice)}`}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-semibold">
                        {formatCurrency(item.totalValue)}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.productId)}
                      >
                        <LuTrash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-right">
                <span className="text-text-secondary">
                  {t("sale.totalValue", "Total")}:{" "}
                </span>
                <span className="text-xl font-bold">
                  {formatCurrency(totalSaleValue)}
                </span>
              </div>
            </div>
          )}

          <Textarea
            label={t("common.description")}
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>

        <footer className="bg-gray-50 dark:bg-card-dark/50 px-6 py-4 flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            {t("actions.cancel")}
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={items.length === 0}
          >
            {t("sale.registerSale", "Register Sale")}
          </Button>
        </footer>
      </form>
    </Modal>
  );
};

export default SaleFormModal;
