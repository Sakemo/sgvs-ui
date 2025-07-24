import React from 'react';
import clsx from 'clsx';

// [DESUSED ]type DataObject = { id: string | number };

export interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
  headerClassName?: string;
  width?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number; 
  children: (item: T) => React.ReactNode;
  isLoading?: boolean;
  emptyMessage?: string;
}

function Table<T>({
  columns,
  data,
  keyExtractor,
  children,
  isLoading = false,
  emptyMessage = 'No items found',
}: TableProps<T>) {
  /*[DESUSED]
  const renderCellContent = (row: T, column: TableColumn<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return String(row[column.accessor] ?? '—');
  };
  */

  return (
    <div className="overflow-hidden rounded-card border border-border-light dark:border-border-dark shadow-soft dark:text-gray-200">
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
            <tbody>
              {isLoading ? (
                <tr><td colSpan={columns.length} className="p-8 text-center">...Loading...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={columns.length} className="p-8 text-center">{emptyMessage}</td></tr>
              ) : (
                // Mapeia os dados aqui e chama a função children para renderizar cada linha
                data.map((item) => (
                  <React.Fragment key={keyExtractor(item)}>
                    {children(item)}
                  </React.Fragment>
                ))
              )}
            </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;