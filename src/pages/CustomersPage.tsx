import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { type CustomerResponse } from "../api/types/domain";
import useDebounce from "../hooks/useDebounce";
import {
  deleteCustomerPermanently,
  getCustomers,
  toggleCustomerStatus,
  type GetCustomersParams,
} from "../api/services/customer.service";
import Button from "../components/common/ui/Button";
import { LuPlus, LuSearch } from "react-icons/lu";
import Input from "../components/common/ui/Input";
import Select from "../components/common/ui/Select";
import CustomersTable from "../components/features/customers/CustomersTable";
import CustomerFormModal from "../components/features/customers/CustomerFormModal";
import CustomerDetailsDrawer from "../components/features/customers/CustomerDetailsDrawer";
import { useConfirmation } from "../contexts/utils/UseConfirmation";
import { notificationService } from "../lib/notification.service";
import CustomerPaymentModal from "../components/features/customers/CustomerPaymentModal";
import clsx from "clsx";
import useArrowTableNavigation from "../hooks/useArrowTableNavigation";
import useShortcutAction from "../hooks/useShortcutAction";
import { useSettings } from "../contexts/utils/UseSettings";
import { formatShortcutBinding } from "../lib/keyboardShortcuts";

type ActivityFilter = "all" | "active" | "inactive";
type DebtFilter = "all" | "debtors" | "non_debtors";

interface CustomerFilters {
    name: string;
    activity: ActivityFilter;
    debt: DebtFilter;
    orderBy: string;
}

const CustomersPage: React.FC = () => {
  const { t } = useTranslation();
  const showConfirmation = useConfirmation();
  const { shortcutPreferences } = useSettings();

  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [customerToPay, setCustomerToPay] = useState<CustomerResponse | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<CustomerResponse | null>(
    null
  );
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerResponse | null>(null);

  const [filters, setFilters] = useState<CustomerFilters>({
    name: "",
    activity: "active" as ActivityFilter,
    debt: "all" as DebtFilter,
    orderBy: "name_asc",
  });
  const debouncedNameFilter = useDebounce(filters.name, 400);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const orderOptions = [
    { value: "name_asc", label: t("customer.sort.az") },
    { value: "name_desc", label: t("customer.sort.za") },
    {
      value: "debt_desc",
      label: t("customer.sort.highestDebt"),
    },
    { value: "debt_asc", label: t("customer.sort.lowestDebt") },
    { value: "recent", label: t("filter.mostRecent") },
    { value: "oldest", label: t("filter.oldest") },
  ];

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const params: GetCustomersParams = {
        name: debouncedNameFilter?.trim() || undefined,
        orderBy: filters.orderBy,
        isActive:
          filters.activity === "all"
            ? undefined
            : filters.activity === "active",
        hasDebt:
          filters.debt === "all" ? undefined : filters.debt === "debtors",
      };
      const data = await getCustomers(params);
      setCustomers(data);
      setSelectedCustomer((current) =>
        current ? data.find((customer) => customer.id === current.id) ?? null : null
      );
    } catch {
      notificationService.error(
        t("errors.fetchCustomers")
      );
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedNameFilter, t]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleFilterChange = (field: keyof CustomerFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpenModal = (customer: CustomerResponse | null) => {
    setCustomerToEdit(customer);
    setIsModalOpen(true);
  };

  const handleSaveSucess = () => {
    setIsModalOpen(false);
    fetchCustomers();
    notificationService.success(
      t("customer.saveSuccess")
    );
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    const actionText = currentStatus
      ? t("actions.deactivate")
      : t("actions.activate");
    showConfirmation({
      title: t("customer.confirmToggleTitle", { action: actionText }),
      description: t(
        "customer.confirmToggleDesc"
      ),
      confirmText: actionText,
      onConfirm: async () => {
        try {
          await toggleCustomerStatus(id, !currentStatus);
          fetchCustomers();
          notificationService.success(
            t(
              "customer.statusUpdated",
              { action: actionText }
            )
          );
        } catch {
          notificationService.error(t("errors.toggleStatus"));
        }
      },
    });
  };

  const selectCustomer = useCallback((customer: CustomerResponse) => {
    setSelectedCustomer(customer);
  }, []);

  const handleViewDetails = (customer: CustomerResponse) => {
    setSelectedCustomer((prev) => (prev?.id === customer.id ? null : customer));
  };

  const handleSettleDebt = (customer: CustomerResponse) => {
    setCustomerToPay(customer);
  };

  const handlePaymentSuccess = () => {
    setCustomerToPay(null);
    fetchCustomers();
    notificationService.success(
      t("payment.success")
    );
  };

  const handleDelete = async (id: number) => {
    showConfirmation({
      title: t("customer.confirmDeleteTitle"),
      description: t("actions.confirmDeletePermanent"),
      confirmText: t("actions.delete"),
      onConfirm: async () => {
        try {
          await deleteCustomerPermanently(id);
          if (selectedCustomer?.id === id) setSelectedCustomer(null);
          fetchCustomers();
          notificationService.success(
            t("customer.deleteSuccess")
          );
        } catch {
          notificationService.error(t("errors.deleteCustomer"));
        }
      },
    });
  };
  const createShortcutLabel = formatShortcutBinding(shortcutPreferences.bindings["page.createNew"]);
  const searchShortcutLabel = formatShortcutBinding(shortcutPreferences.bindings["page.focusPrimarySearch"]);

  useShortcutAction("page.focusPrimarySearch", () => {
    searchInputRef.current?.focus();
  }, {
    enabled: !isModalOpen && !customerToPay,
  });

  useShortcutAction("page.createNew", () => {
    handleOpenModal(null);
  }, {
    enabled: !isModalOpen && !customerToPay,
  });

  useArrowTableNavigation({
    items: customers,
    selectedId: selectedCustomer?.id,
    getId: (customer) => customer.id,
    onSelect: selectCustomer,
    enabled: Boolean(selectedCustomer) && !isModalOpen && !customerToPay,
    rowGroup: "customers",
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-semibold dark:text-gray-200">
          {t("customer.pageTitle")}
        </h1>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              ref={searchInputRef}
              placeholder={t("actions.searchByName")}
              value={filters.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
              iconLeft={<LuSearch className="h-4 w-4 text-text-secondary" />}
              title={searchShortcutLabel ? `${t("settings.keyboard.actions.focusPrimarySearch.label")} (${searchShortcutLabel})` : undefined}
            />
            <Select
              value={filters.activity}
              onChange={(e) => handleFilterChange("activity", e.target.value)}
            >
              <option value="active">{t("common.active")}</option>
              <option value="inactive">{t("common.inactive")}</option>
              <option value="all">{t("common.all")}</option>
            </Select>
            <Select
              value={filters.debt}
              onChange={(e) => handleFilterChange("debt", e.target.value)}
            >
              <option value="all">{t("common.all")}</option>
              <option value="debtors">
                {t("customer.debtors")}
              </option>
              <option value="non_debtors">
                {t("customer.noDebt")}
              </option>
            </Select>
            <Select
              value={filters.orderBy}
              onChange={(e) => handleFilterChange("orderBy", e.target.value)}
            >
              {orderOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <Button onClick={() => handleOpenModal(null)} iconLeft={<LuPlus />} title={createShortcutLabel ? `${t("customer.addCustomer")} (${createShortcutLabel})` : undefined}>
          {t("customer.addCustomer")}
        </Button>
      </header>
      <div className={clsx("flex flex-col lg:flex-row", selectedCustomer ? "gap-6" : "gap-0")}>
        <div className={clsx("transition-all duration-300 ease-in-out", selectedCustomer ? "lg:w-2/3" : "w-full")}>
          <CustomersTable
            customers={customers}
            isLoading={loading}
            onEdit={handleOpenModal}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
            onSettleDebt={handleSettleDebt}
            onRowClick={handleViewDetails}
            selectedRowId={selectedCustomer?.id}
          />
        </div>
        <div className={clsx("transition-all duration-300 ease-in-out", selectedCustomer ? "lg:w-1/3 opacity-100" : "w-0 opacity-0 pointer-events-none")}>
          {selectedCustomer && (
            <CustomerDetailsDrawer customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} onEdit={handleOpenModal} />
          )}
        </div>
      </div>

      {isModalOpen && (
        <CustomerFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSaveSucess={handleSaveSucess}
          customerToEdit={customerToEdit}
        />
      )}

      {customerToPay && (
        <CustomerPaymentModal
          isOpen={!!customerToPay}
          onClose={() => setCustomerToPay(null)}
          onPaymentSuccess={handlePaymentSuccess}
          customer={customerToPay}
        />
      )}
    </div>
  );
};
export default CustomersPage;
