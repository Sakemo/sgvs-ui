import type React from "react";
import { useCallback, useEffect, useState } from "react";
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
import Card from "../components/common/ui/Card";
import Input from "../components/common/ui/Input";
import Select from "../components/common/ui/Select";
import CustomerCard from "../components/features/customers/CustomerCard";
import CustomerFormModal from "../components/features/customers/CustomerFormModal";
import CustomerDetailsModal from "../components/features/customers/CustomerDetailsModal";
import { useConfirmation } from "../contexts/utils/UseConfirmation";
import { notificationService } from "../lib/notification.service";
import CustomerPaymentModal from "../components/features/customers/CustomerPaymentModal";

type ActivityFilter = "all" | "active" | "inactive";
type DebtFilter = "all" | "debtors" | "non_debtors";

const CustomerPage: React.FC = () => {
  const { t } = useTranslation();
  const showConfirmation = useConfirmation();

  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [customerToPay, setCustomerToPay] = useState<CustomerResponse | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<CustomerResponse | null>(
    null
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [customerToView, setCustomerToView] = useState<CustomerResponse | null>(
    null
  );

  const [filters, setFilters] = useState({
    name: "",
    activity: "active" as ActivityFilter,
    debt: "all" as DebtFilter,
    orderBy: "name_asc",
  });
  const debouncedNameFilter = useDebounce(filters.name, 400);

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
        name: debouncedNameFilter.trim() || undefined,
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
    } catch (err) {
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

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
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

  const handleViewDetails = (customer: CustomerResponse) => {
    setCustomerToView(customer);
    setIsDetailsModalOpen(true);
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

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-semibold dark:text-gray-200">
          {t("customer.pageTitle")}
        </h1>
        <Button onClick={() => handleOpenModal(null)} iconLeft={<LuPlus />}>
          {t("customer.addCustomer")}
        </Button>
      </header>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder={t("actions.searchByName")}
            value={filters.name}
            onChange={(e) => handleFilterChange("name", e.target.value)}
            iconLeft={<LuSearch className="h-4 w-4 text-text-secondary" />}
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
      </Card>

      {loading && <p className="p-6 text-center">{t("common.loading")}</p>}

      {!loading &&
        (customers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {customers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onEdit={handleOpenModal}
                onToggleStatus={handleToggleStatus}
                onViewDetails={handleViewDetails}
                onDelete={handleDelete}
                onSettleDebt={handleSettleDebt}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center p-8 text-text-secondary">
            {t(
              "customer.noCustomersFound"
            )}
          </Card>
        ))}

      {isModalOpen && (
        <CustomerFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSaveSucess={handleSaveSucess}
          customerToEdit={customerToEdit}
        />
      )}

      {isDetailsModalOpen && (
        <CustomerDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          customer={customerToView}
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
export default CustomerPage;
