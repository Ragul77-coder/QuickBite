import React from 'react';

interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function Table<T>({
  data,
  columns,
  keyExtractor,
  emptyMessage = 'No data available',
  onRowClick,
}: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800/80">
      <table className="w-full border-collapse text-left text-sm text-slate-500 dark:text-slate-400">
        <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800">
          <tr>
            {columns.map((column, i) => (
              <th
                key={i}
                scope="col"
                className={`px-6 py-4 font-medium ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-950/20">
          {data.length > 0 ? (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick?.(row)}
                className={`
                  transition-colors
                  ${onRowClick ? 'cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-900/20' : ''}
                `}
              >
                {columns.map((column, j) => {
                  const cellContent =
                    typeof column.accessor === 'function'
                      ? column.accessor(row)
                      : (row[column.accessor] as React.ReactNode);

                  return (
                    <td
                      key={j}
                      className={`px-6 py-4 text-slate-900 dark:text-slate-200 ${column.className || ''}`}
                    >
                      {cellContent}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-10 text-center text-slate-400 dark:text-slate-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
