import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LuPlus, LuSearch } from "react-icons/lu";
import clsx from "clsx";
import type { AxiosError } from "axios";

import type { Page, ProductResponse, ProviderResponse } from "../api/types/domain";
import { getProducts } from "../api/services/product.service";
import {
  copyProvider,
  deleteProvider,
  getProviders,
  type GetProvidersParams,
} from "../api/services/provider.service";
import useDebounce from "../hooks/useDebounce";
import ProvidersTable from "../components/features/providers/ProvidersTable";
import ProviderDetailsDrawer from "../components/features/providers/ProviderDetailsDrawer";
import ProviderAddModal from "../components/features/providers/ProviderAddModal";
import Button from "../components/common/ui/Button";
import Card from "../components/common/ui/Card";
import Input from "../components/common/ui/Input";
import Select from "../components/common/ui/Select";
import { useConfirmation } from "../contexts/utils/UseConfirmation";
import { notificationService } from "../lib/notification.service";

const ProvidersPage: React.FC = () => {
  const { t } = useTranslation();
  const showConfirmation = useConfirmation();

  const [providers, setProviders] = useState<ProviderResponse[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<ProviderResponse | null>(
    null
  );
  const [productsPage, setProductsPage] = useState<Page<ProductResponse> | null>(
    null
  );

  const [isLoadingProviders, setIsLoadingProviders] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [providerToEdit, setProviderToEdit] = useState<ProviderResponse | null>(
    null
  );
  const [currentProductsPage, setCurrentProductsPage] = useState(0);

  const [filters, setFilters] = useState<GetProvidersParams>({
    name: "",
    orderBy: "name_asc",
  });
  const debouncedNameFilter = useDebounce(filters.name ?? "", 400);

  const orderOptions = [
    { value: "name_asc", label: t("provider.sort.az") },
    { value: "name_desc", label: t("provider.sort.za") },
  ];

  const fetchProviders = useCallback(async () => {
    setIsLoadingProviders(true);
    try {
      const data = await getProviders({
        name: debouncedNameFilter.trim() || undefined,
        orderBy: filters.orderBy,
      });
      setProviders(data);
      setSelectedProvider((current) =>
        current ? data.find((provider) => provider.id === current.id) ?? null : null
      );
    } catch {
      notificationService.error(t("errors.fetchProviders"));
    } finally {
      setIsLoadingProviders(false);
    }
  }, [debouncedNameFilter, filters.orderBy, t]);

  const fetchProviderProducts = useCallback(async () => {
    if (!selectedProvider) {
      setProductsPage(null);
      return;
    }

    setIsLoadingProducts(true);
    try {
      const data = await getProducts({
        providerId: selectedProvider.id,
        orderBy: "name_asc",
        page: currentProductsPage,
        size: 5,
      });
      setProductsPage(data);
    } catch {
      notificationService.error(t("errors.fetchProducts"));
    } finally {
      setIsLoadingProducts(false);
    }
  }, [currentProductsPage, selectedProvider, t]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  useEffect(() => {
    fetchProviderProducts();
  }, [fetchProviderProducts]);

  const handleFilterChange = (
    field: keyof GetProvidersParams,
    value: string | undefined
  ) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpenModal = (provider: ProviderResponse | null) => {
    setProviderToEdit(provider);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProviderToEdit(null);
  };

  const handleSaveSuccess = (savedProvider: ProviderResponse) => {
    handleCloseModal();
    if (selectedProvider?.id === savedProvider.id) {
      setSelectedProvider(savedProvider);
    }
    fetchProviders();
    notificationService.success(t("provider.saveSuccess"));
  };

  const handleRowClick = (provider: ProviderResponse) => {
    setCurrentProductsPage(0);
    if (selectedProvider?.id === provider.id) {
      setSelectedProvider(null);
      setProductsPage(null);
      setIsLoadingProducts(false);
      return;
    }

    setProductsPage(null);
    setIsLoadingProducts(true);
    setSelectedProvider(provider);
  };

  const handleCopy = async (id: number) => {
    showConfirmation({
      title: t("provider.confirmCopyTitle"),
      description: t("provider.confirmCopyDesc"),
      confirmText: t("actions.copy"),
      onConfirm: async () => {
        try {
          await copyProvider(id);
          fetchProviders();
          notificationService.success(t("provider.copySuccess"));
        } catch {
          notificationService.error(t("errors.copyProvider"));
        }
      },
    });
  };

  const handleDelete = async (id: number) => {
    showConfirmation({
      title: t("provider.confirmDeleteTitle"),
      description: t("actions.confirmDeletePermanent"),
      confirmText: t("actions.delete"),
      onConfirm: async () => {
        try {
          await deleteProvider(id);
          if (selectedProvider?.id === id) {
            setSelectedProvider(null);
            setProductsPage(null);
          }
          fetchProviders();
          notificationService.success(t("provider.deleteSuccess"));
        } catch (error) {
          const axiosError = error as AxiosError<{ message?: string }>;
          notificationService.error(
            axiosError.response?.data?.message || t("errors.deleteProvider")
          );
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-text-primary dark:text-gray-200">
          {t("provider.pageTitle")}
        </h1>
        <Button onClick={() => handleOpenModal(null)} iconLeft={<LuPlus />}>
          {t("provider.addProvider")}
        </Button>
      </header>

      <Card>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            placeholder={t("actions.searchByName")}
            value={filters.name ?? ""}
            onChange={(e) => handleFilterChange("name", e.target.value)}
            iconLeft={<LuSearch className="h-4 w-4 text-text-secondary" />}
          />
          <Select
            value={filters.orderBy ?? "name_asc"}
            onChange={(e) => handleFilterChange("orderBy", e.target.value)}
          >
            {orderOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      <div
        className={clsx(
          "flex flex-col lg:flex-row",
          selectedProvider ? "gap-6" : "gap-0"
        )}
      >
        <div
          className={clsx(
            "transition-all duration-300 ease-in-out",
            selectedProvider ? "lg:w-2/3" : "w-full"
          )}
        >
          <ProvidersTable
            providers={providers}
            isLoading={isLoadingProviders}
            selectedProviderId={selectedProvider?.id}
            onRowClick={handleRowClick}
            onEdit={handleOpenModal}
            onCopy={handleCopy}
            onDelete={handleDelete}
          />
        </div>

        <div
          className={clsx(
            "transition-all duration-300 ease-in-out",
            selectedProvider
              ? "opacity-100 lg:w-1/3"
              : "pointer-events-none w-0 opacity-0"
          )}
        >
          {selectedProvider && (
            <ProviderDetailsDrawer
              provider={selectedProvider}
              productsPage={productsPage}
              isLoadingProducts={isLoadingProducts}
              onClose={() => setSelectedProvider(null)}
              onEdit={handleOpenModal}
              onProductsPageChange={setCurrentProductsPage}
            />
          )}
        </div>
      </div>

      {isModalOpen && (
        <ProviderAddModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSaveSuccess={handleSaveSuccess}
          providerToEdit={providerToEdit}
        />
      )}
    </div>
  );
};

export default ProvidersPage;
