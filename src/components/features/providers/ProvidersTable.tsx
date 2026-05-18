import React from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { LuCopy, LuPencil, LuTrash2 } from "react-icons/lu";

import type { ProviderResponse } from "../../../api/types/domain";
import Table, { type TableColumn } from "../../common/Table";
import Button from "../../common/ui/Button";

interface ProvidersTableProps {
  providers: ProviderResponse[];
  isLoading?: boolean;
  selectedProviderId?: number | null;
  onRowClick: (provider: ProviderResponse) => void;
  onEdit: (provider: ProviderResponse) => void;
  onCopy: (id: number) => void;
  onDelete: (id: number) => void;
}

const ProvidersTable: React.FC<ProvidersTableProps> = ({
  providers,
  isLoading,
  selectedProviderId,
  onRowClick,
  onEdit,
  onCopy,
  onDelete,
}) => {
  const { t } = useTranslation();

  const columns: TableColumn<ProviderResponse>[] = [
    {
      header: t("provider.table.name"),
      accessor: "name",
      headerClassName: "w-[26%]",
    },
    {
      header: t("provider.table.cnpj"),
      accessor: (provider) => provider.cnpj || "—",
    },
    {
      header: t("provider.table.phone"),
      accessor: (provider) => provider.phone || "—",
    },
    {
      header: t("provider.table.email"),
      accessor: (provider) => provider.email || "—",
    },
    {
      header: t("common.actions"),
      accessor: (provider) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            title={t("actions.copy")}
            onClick={(e) => {
              e.stopPropagation();
              onCopy(provider.id);
            }}
          >
            <LuCopy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title={t("actions.edit")}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(provider);
            }}
          >
            <LuPencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title={t("actions.delete")}
            className="text-red-600 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(provider.id);
            }}
          >
            <LuTrash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: "text-right",
    },
  ];

  return (
    <Table<ProviderResponse>
      columns={columns}
      data={providers}
      keyExtractor={(provider) => provider.id}
      isLoading={isLoading}
      emptyMessage={t("provider.table.empty")}
    >
      {(provider) => (
        <tr
          key={provider.id}
          onClick={() => onRowClick(provider)}
          data-row-id={provider.id}
          data-row-group="providers"
          aria-selected={selectedProviderId === provider.id}
          className={clsx(
            "cursor-pointer transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-white/5",
            selectedProviderId === provider.id &&
              "!bg-brand-primary/10 dark:!bg-brand-accent/10"
          )}
        >
          {columns.map((column) => (
            <td
              key={`${provider.id}-${column.header}`}
              className={clsx("whitespace-nowrap px-4 py-3 text-sm", column.className)}
            >
              {typeof column.accessor === "function"
                ? column.accessor(provider)
                : String(provider[column.accessor as keyof ProviderResponse] ?? "—")}
            </td>
          ))}
        </tr>
      )}
    </Table>
  );
};

export default ProvidersTable;
