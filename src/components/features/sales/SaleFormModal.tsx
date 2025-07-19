// src/components/features/sales/SaleFormModal.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';

// API & Types
import { getProducts } from '../../../api/services/product.service';
import { getCustomers } from '../../../api/services/customer.service';
import { registerSale } from '../../../api/services/sale.service';
import { type EntitySummary, type SaleItemRequest, type SaleRequest, PaymentMethod, UnitOfSale, type ProductResponse } from '../../../api/types/domain';

// Components
import Modal from '../../common/Modal';
import Button from '../../common/ui/Button';
import Input from '../../common/ui/Input';
import Select from '../../common/ui/Select';
import Textarea from '../../common/ui/Textarea';
import Card from '../../common/ui/Card';
import { LuPlus, LuTrash2 } from 'react-icons/lu';
import { formatCurrency } from '../../../utils/formatters';

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

const SaleFormModal: React.FC<SaleFormModalProps> = ({ isOpen, onClose, onSaveSuccess }) => {
  const { t } = useTranslation();

  // State for dropdowns
  const [allProducts, setAllProducts] = useState<ProductResponse[]>([]);
  const [allCustomers, setAllCustomers] = useState<EntitySummary[]>([]);
  
  // State for the main form
  const [items, setItems] = useState<FormSaleItem[]>([]);
  const [customerId, setCustomerId] = useState<number | undefined>();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [description, setDescription] = useState('');
  
  // State for the item entry section
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState('1');

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const selectedProduct = useMemo(() => allProducts.find(p => p.id === Number(selectedProductId)), [allProducts, selectedProductId]);

  const resetForm = useCallback(() => {
    setItems([]);
    setCustomerId(undefined);
    setPaymentMethod(PaymentMethod.CASH);
    setDescription('');
    setSelectedProductId('');
    setQuantity('1');
    setErrors({});
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      Promise.all([
        getProducts({ size: 1000 }), // Fetch a large number of products for the dropdown
        getCustomers({ isActive: true })
      ]).then(([productsPage, customersData]) => {
        setAllProducts(productsPage.content);
        setAllCustomers(customersData);
      }).catch(() => {
        setErrors({ form: t('errors.fetchInitialData') });
      }).finally(() => {
        setIsLoading(false);
      });
      resetForm();
    }
  }, [isOpen, resetForm, t]);

  const handleAddItem = () => {
    const numQuantity = parseFloat(quantity);
    if (!selectedProduct || isNaN(numQuantity) || numQuantity <= 0) return;
    
    if (selectedProduct.unitOfSale === UnitOfSale.UNIT && !Number.isInteger(numQuantity)) {
        setErrors({ item: t('validation.integerQuantityRequired') });
        return;
    }

    const existingItemIndex = items.findIndex(item => item.productId === selectedProduct.id);
    if (existingItemIndex > -1) {
      const newItems = [...items];
      newItems[existingItemIndex].quantity += numQuantity;
      newItems[existingItemIndex].totalValue = newItems[existingItemIndex].quantity * newItems[existingItemIndex].salePrice;
      setItems(newItems);
    } else {
      setItems(prev => [...prev, {
        productId: selectedProduct.id,
        quantity: numQuantity,
        name: selectedProduct.name,
        salePrice: selectedProduct.salePrice,
        totalValue: numQuantity * selectedProduct.salePrice,
      }]);
    }
    setSelectedProductId('');
    setQuantity('1');
    setErrors({});
  };

  const handleRemoveItem = (productId: number) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };
  
  const totalSaleValue = useMemo(() => items.reduce((sum, item) => sum + item.totalValue, 0), [items]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (items.length === 0) {
      setErrors({ form: t('validation.saleItemsRequired', `At least one item is required for the sale.`) })
      return;
    }
    if (paymentMethod === PaymentMethod.ON_CREDIT && !customerId) {
        setErrors({ form: t('validation.customerRequiredForCredit', 'A customer is required for ON_CREDIT sales.') });
        return;
    }
    
    setIsLoading(true);
    
    try {
      const payload: SaleRequest = {
        customerId: customerId || undefined,
        paymentMethod,
        description: description || undefined,
        items: items.map(({ productId, quantity }) => ({ productId, quantity })),
      };
      
      await registerSale(payload);
      onSaveSuccess();
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string, errors?: Record<string, string> }>;
      const apiErrors = axiosError.response?.data?.errors;
      if (apiErrors) {
        setErrors(apiErrors);
      } else {
        setErrors({ form: axiosError.response?.data?.message || t('errors.genericSave') });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isUnitProduct = selectedProduct?.unitOfSale === UnitOfSale.UNIT;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('sale.addSale', 'Register Sale')} className="sm:max-w-4xl">
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label={t('common.client')} name="customerId" value={customerId ?? ''} onChange={(e) => setCustomerId(Number(e.target.value) || undefined)}>
                <option value="">{t('sale.anonymous', 'Anonymous')}</option>
                {allCustomers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
            <Select label={t('common.paymentMethod')} name="paymentMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}>
                {Object.values(PaymentMethod).map(pm => <option key={pm} value={pm}>{t(`paymentMethods.${pm.toLowerCase()}`, pm.replace('_', ' '))}</option>)}
            </Select>
          </div>
          
          <Card>
            <h3 className="text-lg font-semibold mb-4">{t('sale.addItem', 'Add Item')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-4 items-end">
                <Select label={t('product.objectName', 'Product')} value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)}>
                    <option value="">{t('common.select', 'Select...')}</option>
                    {allProducts.map(p => <option key={p.id} value={p.id}>{`${p.name} (${formatCurrency(p.salePrice)})`}</option>)}
                </Select>
                <Input label={t('sale.quantity', 'Quantity')} type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} step={isUnitProduct ? "1" : "0.01"} min={isUnitProduct ? "1" : "0.01"}/>
                <Button type="button" onClick={handleAddItem} disabled={!selectedProduct}>
                    <LuPlus className="mr-2 h-4 w-4" />{t('actions.add', 'Add')}
                </Button>
            </div>
            {errors.item && <p className="text-xs text-red-500 mt-1">{errors.item}</p>}
          </Card>

          {items.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">{t('sale.itemsInSale', 'Items in Sale')}</h3>
              <ul className="max-h-48 overflow-y-auto border border-border-light dark:border-border-dark rounded-md divide-y divide-border-light dark:divide-border-dark">
                {items.map(item => (
                    <li key={item.productId} className="p-3 flex justify-between items-center">
                        <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-text-secondary">{`${item.quantity} x ${formatCurrency(item.salePrice)}`}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <p className="font-semibold">{formatCurrency(item.totalValue)}</p>
                            <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveItem(item.productId)}>
                                <LuTrash2 className="h-4 w-4 text-red-500"/>
                            </Button>
                        </div>
                    </li>
                ))}
              </ul>
              <div className="mt-4 text-right">
                <span className="text-text-secondary">{t('sale.totalValue', 'Total')}: </span>
                <span className="text-xl font-bold">{formatCurrency(totalSaleValue)}</span>
              </div>
            </div>
          )}
          
          <Textarea label={t('common.description')} name="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
        </div>
        
        <footer className="bg-gray-50 dark:bg-card-dark/50 px-6 py-4 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>{t('actions.cancel')}</Button>
          <Button type="submit" isLoading={isLoading} disabled={items.length === 0}>{t('sale.registerSale', 'Register Sale')}</Button>
        </footer>
      </form>
    </Modal>
  );
};

export default SaleFormModal;