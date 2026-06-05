import type { ReactNode } from 'react';

import styles from './styles.module.css';

export interface TableColumn<TData> {
  key: string;
  header: string;
  align?: 'left' | 'center' | 'right';
  render: (row: TData) => ReactNode;
}

export interface TableProps<TData extends { id: string }> {
  columns: TableColumn<TData>[];
  data: TData[];
  emptyMessage?: string;
}

const alignmentClassName = {
  left: styles.alignLeft,
  center: styles.alignCenter,
  right: styles.alignRight,
} as const;

export default function Table<TData extends { id: string }>({
  columns,
  data,
  emptyMessage = 'No rows available.',
}: TableProps<TData>) {
  if (data.length === 0) {
    return <p className={styles.empty}>{emptyMessage}</p>;
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                className={alignmentClassName[column.align ?? 'left']}
                key={column.key}
                scope="col"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td
                  className={alignmentClassName[column.align ?? 'left']}
                  key={`${row.id}-${column.key}`}
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
