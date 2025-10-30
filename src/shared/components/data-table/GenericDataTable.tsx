import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'shared/ui';

export interface ColumnConfig<T> {
  key: string;
  label: string;
  width?: string;
  minWidth?: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface GenericDataTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  getRowKey: (item: T) => string | number;
}

export function GenericDataTable<T>({
  data,
  columns,
  onRowClick,
  emptyMessage = 'Данные не найдены',
  getRowKey,
}: GenericDataTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-md border">
      <Table className="min-w-[900px]">
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={column.className}
                style={{
                  width: column.width,
                  minWidth: column.minWidth,
                }}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow
                key={getRowKey(item)}
                className={onRowClick ? 'cursor-pointer' : ''}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.className}>
                    {column.render ? column.render(item) : null}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

