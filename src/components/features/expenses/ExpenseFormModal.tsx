import type React from "react";
import {
  ExpenseType,
  PaymentMethod,
  type EntitySummary,
  type ExpenseRequest,
  type ExpenseResponse,
  type RestockItemRequest,
} from "../../../api/types/domain";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import {
  createExpense,
  updateExpense,
} from "../../../api/services/expense.service";
import type { AxiosError } from "axios";
import Modal from "../../common/Modal";
import Input from "../../common/ui/Input";
import Select from "../../common/ui/Select";
import Textarea from "../../common/ui/Textarea";
import Button from "../../common/ui/Button";
import AdvancedOptions from "../../common/AdvancedOptions";
import { notificationService } from "../../../lib/notification.service";
import useDebounce from "../../../hooks/useDebounce";
import type { AutocompleteOption } from "../../common/AutoCompleteInput";
import { getProducts } from "../../../api/services/product.service";
import AutocompleteInput from "../../common/AutoCompleteInput";
import Card from "../../common/ui/Card";
import { LuTrash2 } from "react-icons/lu";
import { formatCurrency } from "../../../utils/formatters";

interface FormRestockItem extends RestockItemRequest {
  name: string;
}

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
  expenseToEdit?: ExpenseResponse | null;
}

const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
  isOpen,
  onClose,
  onSaveSuccess,
  expenseToEdit,
}) => {
  const { t } = useTranslation();
  const isEditMode = !!expenseToEdit;

  // -- form states --
  const [formData, setFormData] = useState<Partial<ExpenseRequest>>({});
  const [restockItems, setRestockItems] = useState<FormRestockItem[]>([]);

  // -- ui states --
  const [isLoading, setIsLoading] = useState(false);

  // -- add items states --
  const [productQuery, setProductQuery] = useState("");
  const [productOptions, setProductOptions] = useState<EntitySummary[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<AutocompleteOption | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [unitCostPrice, setUnitCostPrice] = useState("");
  const [isSearchingProducts, setIsSearchingProducts] = useState(false);
  const debouncedProductQuery = useDebounce(productQuery, 400);

  // -- check if isRestocking
  const isRestocking = formData.expenseType === ExpenseType.RESTOCKING;

  // -- data get & reset --
  const getInitialFormData = useCallback((): Partial<ExpenseRequest> => {
    if (isEditMode && expenseToEdit) {
      return {
        name: expenseToEdit.name,
        value: expenseToEdit.value,
        expenseDate: format(
          new Date(expenseToEdit.expenseDate),
          "yyyy-MM-dd'T'HH:mm"
        ),
        expenseType: expenseToEdit.expenseType,
        paymentMethod: expenseToEdit.paymentMethod,
        description: expenseToEdit.description,
      };
    }
    return {
      name: "",
      value: undefined,
      expenseDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      expenseType: ExpenseType.OTHERS,
      paymentMethod: PaymentMethod.CASH,
      description: "",
    };
  }, [isEditMode, expenseToEdit]);

  const resetForm = useCallback(() => {
    setFormData(getInitialFormData());
    setRestockItems([]);
    setProductQuery("");
    setSelectedProduct(null);
    setQuantity("1");
    setUnitCostPrice("");
  }, [getInitialFormData]);

  // -- effects --
  useEffect(() => {
    if (debouncedProductQuery.length < 1) {
      setProductOptions([]);
      return;
    }
    setIsSearchingProducts(true);
    getProducts({ name: debouncedProductQuery, size: 10 })
      .then((page) =>
        setProductOptions(page.content.map((p) => ({ id: p.id, name: p.name })))
      )
      .finally(() => setIsSearchingProducts(false));
  }, [debouncedProductQuery]);

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [resetForm, isOpen]);

  // -- action handlers --
  const handleAddItem = () => {
    if (!selectedProduct || !quantity || !unitCostPrice) return;
    const newRestockItem: FormRestockItem = {
      productId: Number(selectedProduct.value),
      name: selectedProduct.label,
      quantity: parseFloat(quantity),
      unitCostPrice: parseFloat(unitCostPrice),
    };
    setRestockItems((prev) => [...prev, newRestockItem]);
    setSelectedProduct(null);
    setProductQuery("");
    setQuantity("1");
    setUnitCostPrice("");
  };

  const handleRemoveItem = (productId: number) => {
    setRestockItems((prev) =>
      prev.filter((item) => item.productId !== productId)
    );
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? value === ""
            ? undefined
            : parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload: ExpenseRequest = {
        name: formData.name || "",
        value: isRestocking ? 0 : formData.value,
        expenseDate: new Date(formData.expenseDate!).toISOString(),
        expenseType: formData.expenseType!,
        paymentMethod: formData.paymentMethod!,
        description: formData.description || null,
        restockItems: isRestocking
          ? restockItems.map(({ productId, quantity, unitCostPrice }) => ({
              productId,
              quantity,
              unitCostPrice,
            }))
          : [],
      };
      console.info(`${formData.value}`);

      if (isEditMode && expenseToEdit) {
        await updateExpense(expenseToEdit.id, payload);
      } else {
        await createExpense(payload);
      }
      onSaveSuccess();
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string;
        errors?: Record<string, string>;
      }>;
      if (axiosError.response?.data?.errors) {
        notificationService.error(t("errors.genericSave"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? t("expense.editTitle") : t("expense.addTitle")}
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <Select
          label={t("expense.expenseType" + " *")}
          name="expenseType"
          value={formData.expenseType || ""}
          onChange={handleChange}
          required
        >
          {Object.values(ExpenseType).map((type) => (
            <option key={type} value={type}>
              {t(`expenseCategories.${type.toLowerCase()}`, type)}
            </option>
          ))}
        </Select>

        <Input
          label={t("common.name") + " *"}
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          required
        />

        {isRestocking ? (
          <Card>
            <h3 className="text-md font-semibold mb-3">
              {t("expense.addRestockItems", "Add Restock Items")}
            </h3>
            <div className="space-y-3">
              <AutocompleteInput
                label={t("product.objectName")}
                options={productOptions.map((p) => ({
                  value: p.id,
                  label: p.name,
                }))}
                selected={selectedProduct}
                onSelect={setSelectedProduct}
                onQueryChange={setProductQuery}
                isLoading={isSearchingProducts}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label={t("sale.quantity")}
                  name="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <Input
                  label={t("product.costPrice")}
                  name="unitCostPrice"
                  type="number"
                  step="0.01"
                  value={unitCostPrice}
                  onChange={(e) => setUnitCostPrice(e.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddItem}
                disabled={!selectedProduct || !quantity || !unitCostPrice}
              >
                {t("actions.add")}
              </Button>
            </div>
            {restockItems.length > 0 && (
              <ul className="mt-4 space-y-2">
                {restockItems.map((item) => (
                  <li
                    key={item.productId}
                    className="flex justify-between items-center text-sm p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-text-secondary">
                        {item.quantity} x {formatCurrency(item.unitCostPrice)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">
                        {formatCurrency(item.quantity * item.unitCostPrice)}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.productId)}
                        iconLeft={<LuTrash2/>}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ) : (
          <Input
            label={t("common.value") + " *"}
            name="value"
            type="number"
            step="0.01"
            value={formData.value ?? ""}
            onChange={handleChange}
            required
          />
        )}

        <Select
          label={"common.paymentMethod" + " *"}
          name="paymentMethod"
          value={formData.paymentMethod || ""}
          onChange={handleChange}
          required
        >
          {Object.values(PaymentMethod).map((type) => (
            <option key={type} value={type}>
              {t(
                `paymentMethods.${type.toLowerCase().replace("_", " ")}`,
                type.replace(/_/g, " ")
              )}
            </option>
          ))}
        </Select>

        <AdvancedOptions className="grid grid-cols-2 auto-rows-auto gap-4 [&>*:nth-child(3)]:col-span-2">
          <Input
            label={t("expense.expenseDate")}
            name="expenseDate"
            type="datetime-local"
            value={formData.expenseDate}
            required
          />

          <Textarea
            label={t("common.description")}
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            rows={3}
          />
        </AdvancedOptions>

        <div className="flex justify-end gap-2 pt-4 border-t border-border-light dark:border-border-dark">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            {t("actions.cancel")}
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isEditMode ? t("actions.saveChanges") : t("actions.create")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
export default ExpenseFormModal;
