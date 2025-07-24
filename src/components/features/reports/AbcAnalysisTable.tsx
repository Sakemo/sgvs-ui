// src/components/features/reports/AbcAnalysisTable.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import type { AbcAnalysisRow } from '../../../api/types/domain';

import Table, { type TableColumn } from '../../common/Table';
import Badge from '../../common/ui/Badge';
import { formatCurrency } from '../../../utils/formatters';

interface AbcAnalysisTableProps {
  data: AbcAnalysisRow[];
  isLoading?: boolean;
}

const AbcAnalysisTable: React.FC<AbcAnalysisTableProps> = ({ data, isLoading }) => {
  const { t } = useTranslation();

  const columns: TableColumn<AbcAnalysisRow>[] = [
    {
      header: t('report.abc.class', 'Class'),
      accessor: (row) => (
        <Badge
          colorScheme={row.abcClass === 'A' ? 'green' : row.abcClass === 'B' ? 'yellow' : 'gray'}
          className="font-bold text-base"
        >
          {row.abcClass}
        </Badge>
      ),
      className: 'text-center',
      width: 'w-24',
    },
    {
      header: t('product.objectName', 'Product'),
      accessor: 'productName',
      headerClassName: 'w-2/5',
    },
    {
      header: t('sale.grossRevenue', 'Revenue'),
      accessor: (row) => formatCurrency(row.totalRevenue),
      className: 'text-right font-medium',
    },
    {
      header: t('report.abc.contribution', 'Contribution'),
      accessor: (row) => `${row.percentageOfTotalRevenue.toFixed(2)}%`,
      className: 'text-right',
    },
    {
      header: t('report.abc.cumulative', 'Cumulative'),
      accessor: (row) => `${row.cumulativePercentage.toFixed(2)}%`,
      className: 'text-right font-semibold',
    },
  ];

  return (
    <Table<AbcAnalysisRow>
      columns={columns}
      data={data}
      keyExtractor={(row) => row.productId}
      isLoading={isLoading}
      emptyMessage={t('report.abc.noData', 'No data available for the selected period.')}
    >
      {(row) => (
        <tr key={row.productId} className="hover:bg-gray-50 dark:hover:bg-white/5">
          {columns.map((col) => (
            <td key={`${row.productId}-${col.header}`} className={clsx('px-4 py-3 whitespace-nowrap text-sm', col.className)}>
              {typeof col.accessor === 'function' ? col.accessor(row) : String(row[col.accessor as keyof AbcAnalysisRow] ?? '—')}
            </td>
          ))}
        </tr>
      )}
    </Table>
  );
};

export default AbcAnalysisTable;