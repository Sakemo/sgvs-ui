import React from 'react';
import clsx from 'clsx';
import { LuLoader } from 'react-icons/lu';

type DataObject = { id: string | number };

export interface TableColumn<T extends DataObject> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
  headerClassName?: string;
  width?: string;
}

interface TableProps<T extends DataObject> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  selectedRowId?: string | number | null;
}

function Table<T extends DataObject>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No items found',
  onRowClick,
  selectedRowId,
}: TableProps<T>) {
  const renderCellContent = (row: T, column: TableColumn<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return String(row[column.accessor] ?? '—');
  };

  return (
    <div className="overflow-hidden rounded-card border border-border-light dark:border-border-dark shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
          <thead className="bg-gray-50 dark:bg-card-dark/50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.header}
                  scope="col"
                  className={clsx(
                    'px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider',
                    col.headerClassName,
                    col.width
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light dark:divide-border-dark bg-card-light dark:bg-card-dark">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-text-secondary">
                  <div className="flex items-center justify-center gap-2">
                    <LuLoader className="h-5 w-5 animate-spin" />
                    <span>Loading...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-text-secondary">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  className={clsx(
                    'transition-colors duration-150',
                    onRowClick && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5',
                    selectedRowId === row.id && '!bg-brand-primary/10 dark:!bg-brand-accent/10'
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col, index) => (
                    <td
                      key={`${row.id}-${index}`}
                      className={clsx('px-4 py-3 whitespace-nowrap text-sm', col.className)}
                    >
                      {renderCellContent(row, col)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;