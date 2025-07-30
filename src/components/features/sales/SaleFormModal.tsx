import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LuPlus, LuTrash2 } from "react-icons/lu";

import { getProducts, getProductSuggestions } from "../../../api/services/product.service";
import { getCustomers, getCustomerSuggestions } from "../../../api/services/customer.service";
import { registerSale } from "../../../api/services/sale.service";
import { type SaleItemRequest, PaymentMethod, UnitOfSale, type ProductResponse } from "../../../api/types/domain";

import Modal from "../../common/Modal";
import Button from "../../common/ui/Button";
import Input from "../../common/ui/Input";
import Select from "../../common/ui/Select";
import Textarea from "../../common/ui/Textarea";
import Card from "../../common/ui/Card";
import AutocompleteInput, { type AutocompleteOption } from "../../common/AutoCompleteInput";
import ToggleSwitch from "../../common/ui/ToggleSwitch";
import { notificationService } from "../../../lib/notification.service";
import { formatCurrency } from "../../../utils/formatters";
import useDebounce from "../../../hooks/useDebounce";

interface SaleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormSaleItem extends SaleItemRequest {
  name: string;
  salePrice: number;
  totalValue: number;
}

const SaleFormModal: React.FC<SaleFormModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [keepCreatingSales, setKeepCreatingSales] = useState(false);
  const [items, setItems] = useState<FormSaleItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [customerQuery, setCustomerQuery] = useState("");
  const [productQuery, setProductQuery] = useState("");
  const [selectedCustomerOption, setSelectedCustomerOption] = useState<AutocompleteOption | null>(null);
  const [selectedProductOption, setSelectedProductOption] = useState<AutocompleteOption | null>(null);
  const [productDetailsCache, setProductDetailsCache] = useState<Record<number, ProductResponse>>({});
  const debouncedProductQuery = useDebounce(productQuery, 300);
  const debouncedCustomerQuery = useDebounce(customerQuery, 300);

  const { data: suggestionData, isLoading: isLoadingSuggestions } = useQuery({
    queryKey: ['saleFormSuggestions'],
    queryFn: () => Promise.all([getProductSuggestions(), getCustomerSuggestions()]),
    enabled: isOpen,
    staleTime: 5 * 60 * 1000,
  });

  const { data: searchedProductsPage, isLoading: isSearchingProducts } = useQuery({
    queryKey: ['products', { name: debouncedProductQuery, context: 'sale-modal' }],
    queryFn: () => getProducts({ name: debouncedProductQuery, size: 10 }),
    enabled: !!debouncedProductQuery,
  });

  const { data: searchedCustomers = [], isLoading: isSearchingCustomers } = useQuery({
    queryKey: ['customers', { name: debouncedCustomerQuery, context: 'sale-modal' }],
    queryFn: () => getCustomers({ name: debouncedCustomerQuery, isActive: true }),
    enabled: !!debouncedCustomerQuery,
  });

  const saleMutation = useMutation({
    mutationFn: registerSale,
    onSuccess: () => {
      notificationService.success(t('sale.saveSuccess', "Sale registered successfully!"));
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ['salesGrossTotal'] });

      if (keepCreatingSales) {
        resetForm();
      } else {
        onClose();
      }
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ message?: string; }>;
      notificationService.error(axiosError.response?.data?.message || t('errors.genericSave'));
    },
  });

  const initialProductOptions = useMemo(() => suggestionData?.[0]?.map(p => ({ value: p.id, label: `${p.name} (${formatCurrency(p.salePrice)})` })) ?? [], [suggestionData]);
  const initialCustomerOptions = useMemo(() => suggestionData?.[1]?.map(c => ({ value: c.id, label: c.name })) ?? [], [suggestionData]);
  const searchedProductOptions = useMemo(() => searchedProductsPage?.content.map(p => ({ value: p.id, label: `${p.name} (${formatCurrency(p.salePrice)})` })) ?? [], [searchedProductsPage]);
  const productAutocompleteOptions = productQuery ? searchedProductOptions : initialProductOptions;
  const customerAutocompleteOptions = customerQuery ? searchedCustomers.map(c => ({ value: c.id, label: c.name })) : initialCustomerOptions;
  const selectedProductDetails = useMemo(() => productDetailsCache[Number(selectedProductOption?.value)], [selectedProductOption, productDetailsCache]);
  const totalSaleValue = useMemo(() => items.reduce((sum, item) => sum + item.totalValue, 0), [items]);

  const resetForm = useCallback(() => {
    setItems([]);
    setPaymentMethod(PaymentMethod.CASH);
    setDescription("");
    setSelectedProductOption(null);
    setProductQuery("");
    setSelectedCustomerOption(null);
    setCustomerQuery("");
    setQuantity("1");
  }, []);

  useEffect(() => { if (isOpen) resetForm() }, [isOpen, resetForm]);

  useEffect(() => {
    const allProducts = [...(suggestionData?.[0] ?? []), ...(searchedProductsPage?.content ?? [])];
    if (allProducts.length > 0) {
      const newCache = allProducts.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
      setProductDetailsCache(prev => ({ ...prev, ...newCache }));
    }
  }, [suggestionData, searchedProductsPage]);

  const handleAddItem = () => {
    const numQuantity = parseFloat(quantity);
    if (!selectedProductOption || !selectedProductDetails || isNaN(numQuantity) || numQuantity <= 0) {
      notificationService.warning(t("validation.invalidQuantity"));
      return;
    }
    if (selectedProductDetails.managesStock && selectedProductDetails.stockQuantity < numQuantity) {
      notificationService.warning(t("validation.insufficientStock", { available: selectedProductDetails.stockQuantity }));
      return;
    }
    if (selectedProductDetails.unitOfSale === UnitOfSale.UNIT && !Number.isInteger(numQuantity)) {
      notificationService.error(t("validation.integerQuantityRequired"));
      return;
    }

    const existingItemIndex = items.findIndex(item => item.productId === selectedProductDetails.id);
    if (existingItemIndex > -1) {
      const newItems = [...items];
      newItems[existingItemIndex].quantity += numQuantity;
      newItems[existingItemIndex].totalValue = newItems[existingItemIndex].quantity * newItems[existingItemIndex].salePrice;
      setItems(newItems);
    } else {
      setItems(prev => [...prev, {
        productId: selectedProductDetails.id,
        quantity: numQuantity,
        name: selectedProductDetails.name,
        salePrice: selectedProductDetails.salePrice,
        totalValue: numQuantity * selectedProductDetails.salePrice,
      }]);
    }
    setSelectedProductOption(null);
    setProductQuery("");
    setQuantity("1");
  };

  const handleRemoveItem = (productId: number) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customerId = selectedCustomerOption ? Number(selectedCustomerOption.value) : undefined;
    if (items.length === 0 || (paymentMethod === PaymentMethod.ON_CREDIT && !customerId)) {
      notificationService.error(t("validation.saleItemsRequired", "A sale must have items, and a customer if on credit."));
      return;
    }
    saleMutation.mutate({
      customerId,
      paymentMethod,
      description: description || undefined,
      items: items.map(({ productId, quantity }) => ({ productId, quantity })),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("sale.addSale", "Register Sale")} className="sm:max-w-4xl">
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
              isLoading={isLoadingSuggestions || isSearchingCustomers}
            />
            <Select
              label={t("common.paymentMethod")}
              name="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            >
              {Object.values(PaymentMethod).map((pm) => (
                <option key={pm} value={pm}>{t(`paymentMethods.${pm.toLowerCase()}`, pm.replace("_", " "))}</option>
              ))}
            </Select>
          </div>

          <Card>
            <h3 className="text-lg font-semibold mb-4">{t("sale.addItem", "Add Item")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-4 items-end">
              <AutocompleteInput
                label={t("product.objectName", "Product")}
                placeholder={t("actions.searchByName")}
                options={productAutocompleteOptions}
                selected={selectedProductOption}
                onSelect={setSelectedProductOption}
                onQueryChange={setProductQuery}
                isLoading={isLoadingSuggestions || isSearchingProducts}
              />
              <Input
                label={t("sale.quantity", "Quantity")}
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                step={selectedProductDetails?.unitOfSale === UnitOfSale.UNIT ? "1" : "0.01"}
                min={selectedProductDetails?.unitOfSale === UnitOfSale.UNIT ? "1" : "0.01"}
                disabled={!selectedProductOption}
              />
              <Button type="button" onClick={handleAddItem} disabled={!selectedProductOption} iconLeft={<LuPlus />}>
                {t("actions.add", "Add")}
              </Button>
            </div>
          </Card>

          {items.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">{t("sale.itemsInSale", "Items in Sale")}</h3>
              <ul className="max-h-48 overflow-y-auto border border-border-light dark:border-border-dark rounded-md divide-y divide-border-light dark:divide-border-dark">
                {items.map((item) => (
                  <li key={item.productId} className="p-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-text-secondary">{`${item.quantity} x ${formatCurrency(item.salePrice)}`}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-semibold">{formatCurrency(item.totalValue)}</p>
                      <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveItem(item.productId)}>
                        <LuTrash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-right">
                <span className="text-text-secondary">{t("sale.totalValue", "Total")}: </span>
                <span className="text-xl font-bold">{formatCurrency(totalSaleValue)}</span>
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

        <footer className="bg-gray-50 dark:bg-card-dark/50 px-6 py-4 flex justify-end items-center gap-4">
          <div className="flex-grow">
            <ToggleSwitch enabled={keepCreatingSales} onChange={setKeepCreatingSales} label={t("actions.keepCreatingSales", "Register and start new sale")}/>
          </div>
          <Button type="button" variant="secondary" onClick={onClose} disabled={saleMutation.isPending}>
            {t("actions.cancel")}
          </Button>
          <Button type="submit" isLoading={saleMutation.isPending} disabled={items.length === 0 || saleMutation.isPending}>
            {t("sale.registerSale", "Register Sale")}
          </Button>
        </footer>
      </form>
    </Modal>
  );
};

export default SaleFormModal;